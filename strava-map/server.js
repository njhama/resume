require('dotenv').config();
const express = require('express');
const session = require('express-session');
const axios = require('axios');
const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const app = express();
const db = new DatabaseSync(path.join(__dirname, 'strava.db'));

// ─── Database setup ───────────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS tokens (
    athlete_id   INTEGER PRIMARY KEY,
    access_token  TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    expires_at    INTEGER NOT NULL,
    athlete_name  TEXT,
    athlete_profile TEXT,
    last_synced   INTEGER
  );

  CREATE TABLE IF NOT EXISTS activities (
    id                   INTEGER PRIMARY KEY,
    athlete_id           INTEGER NOT NULL,
    name                 TEXT,
    type                 TEXT,
    sport_type           TEXT,
    start_date           TEXT,
    distance             REAL,
    moving_time          INTEGER,
    total_elevation_gain REAL,
    summary_polyline     TEXT,
    start_lat            REAL,
    start_lng            REAL,
    FOREIGN KEY (athlete_id) REFERENCES tokens(athlete_id)
  );
`);

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'strava-map-dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
}));

// ─── /map serves the strava map UI ───────────────────────────────────────────
app.get('/map', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Strava map assets (CSS, JS, etc.) — index: false so index.html is only served at /map
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

// Portfolio static files served at root
app.use(express.static(path.join(__dirname, '..')));

// ─── Token helpers ────────────────────────────────────────────────────────────
async function getValidToken(athleteId) {
  const row = db.prepare('SELECT * FROM tokens WHERE athlete_id = ?').get(athleteId);
  if (!row) return null;

  // Refresh if expiring within 5 minutes
  if (Date.now() / 1000 > row.expires_at - 300) {
    try {
      const { data } = await axios.post('https://www.strava.com/oauth/token', {
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        refresh_token: row.refresh_token,
        grant_type: 'refresh_token'
      });
      db.prepare(
        'UPDATE tokens SET access_token = ?, refresh_token = ?, expires_at = ? WHERE athlete_id = ?'
      ).run(data.access_token, data.refresh_token, data.expires_at, athleteId);
      return data.access_token;
    } catch (err) {
      console.error('Token refresh failed:', err.response?.data || err.message);
      return null;
    }
  }

  return row.access_token;
}

function requireAuth(req, res, next) {
  if (!req.session.athleteId) return res.status(401).json({ error: 'Not authenticated' });
  next();
}

// ─── Auth routes ──────────────────────────────────────────────────────────────
app.get('/auth/strava', (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.STRAVA_CLIENT_ID,
    redirect_uri: `${process.env.BASE_URL}/auth/callback`,
    response_type: 'code',
    approval_prompt: 'auto',
    scope: 'activity:read_all'
  });
  res.redirect(`https://www.strava.com/oauth/authorize?${params}`);
});

app.get('/auth/callback', async (req, res) => {
  const { code, error } = req.query;
  if (error || !code) return res.redirect('/?error=denied');

  try {
    const { data } = await axios.post('https://www.strava.com/oauth/token', {
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code'
    });

    const { access_token, refresh_token, expires_at, athlete } = data;
    db.prepare(`
      INSERT OR REPLACE INTO tokens
        (athlete_id, access_token, refresh_token, expires_at, athlete_name, athlete_profile)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      athlete.id, access_token, refresh_token, expires_at,
      `${athlete.firstname} ${athlete.lastname}`,
      athlete.profile_medium || athlete.profile
    );

    req.session.athleteId = athlete.id;
    res.redirect('/');
  } catch (err) {
    console.error('OAuth error:', err.response?.data || err.message);
    res.redirect('/?error=auth_failed');
  }
});

app.get('/auth/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

// ─── API: status ──────────────────────────────────────────────────────────────
app.get('/api/status', (req, res) => {
  if (!req.session.athleteId) return res.json({ authenticated: false });

  const athlete = db.prepare(
    'SELECT athlete_name, athlete_profile, last_synced FROM tokens WHERE athlete_id = ?'
  ).get(req.session.athleteId);

  const stats = db.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN type IN ('Run','VirtualRun','TrailRun') THEN 1 ELSE 0 END) as runs,
      SUM(CASE WHEN type IN ('Ride','VirtualRide','MountainBikeRide','GravelRide','EBikeRide') THEN 1 ELSE 0 END) as rides,
      SUM(CASE WHEN type = 'Walk' OR type = 'Hike' THEN 1 ELSE 0 END) as walks,
      ROUND(SUM(distance)/1000, 1) as total_km
    FROM activities WHERE athlete_id = ?
  `).get(req.session.athleteId);

  res.json({ authenticated: true, athlete, stats });
});

// ─── API: activities (from cache) ─────────────────────────────────────────────
app.get('/api/activities', requireAuth, (req, res) => {
  const { types } = req.query; // comma-separated type filter
  let sql = `
    SELECT id, name, type, sport_type, start_date, distance, moving_time,
           total_elevation_gain, summary_polyline, start_lat, start_lng
    FROM activities
    WHERE athlete_id = ? AND summary_polyline IS NOT NULL AND summary_polyline != ''
  `;
  const params = [req.session.athleteId];

  if (types) {
    const list = types.split(',').map(t => `'${t.replace(/'/g, "''")}'`).join(',');
    sql += ` AND type IN (${list})`;
  }

  sql += ' ORDER BY start_date DESC';
  res.json(db.prepare(sql).all(...params));
});

// ─── API: sync from Strava ────────────────────────────────────────────────────
app.get('/api/sync', requireAuth, async (req, res) => {
  // Set longer timeout for large syncs
  req.socket.setTimeout(5 * 60 * 1000);

  try {
    const token = await getValidToken(req.session.athleteId);
    if (!token) return res.status(401).json({ error: 'Could not refresh token. Please reconnect.' });

    const insertActivity = db.prepare(`
      INSERT OR REPLACE INTO activities
        (id, athlete_id, name, type, sport_type, start_date, distance,
         moving_time, total_elevation_gain, summary_polyline, start_lat, start_lng)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let page = 1;
    let totalFetched = 0;

    while (true) {
      const { data: activities } = await axios.get(
        'https://www.strava.com/api/v3/athlete/activities',
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { per_page: 200, page }
        }
      );

      if (!activities.length) break;

      db.exec('BEGIN');
      for (const a of activities) {
        insertActivity.run(
          a.id, req.session.athleteId, a.name, a.type, a.sport_type,
          a.start_date, a.distance, a.moving_time, a.total_elevation_gain,
          a.map?.summary_polyline || '',
          a.start_latlng?.[0] ?? null,
          a.start_latlng?.[1] ?? null
        );
      }
      db.exec('COMMIT');

      totalFetched += activities.length;
      if (activities.length < 200) break;
      page++;
    }

    db.prepare('UPDATE tokens SET last_synced = ? WHERE athlete_id = ?')
      .run(Math.floor(Date.now() / 1000), req.session.athleteId);

    res.json({ success: true, synced: totalFetched });
  } catch (err) {
    console.error('Sync error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Sync failed', detail: err.message });
  }
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Strava Map running at http://localhost:${PORT}`);
});

# Main Ideas
- Parenthesis Type
- Tree
    - Vertical Traversal
# LeetCode Solutions

### 1249. Minimum Remove to Make Valid Parentheses
```python
# Optimal Solution
    def minRemoveToMakeValid(self, s):
        """
        :type s: str
        :rtype: str
        """
        s = list(s)
        stack = []

        # First pass: Identify invalid parentheses
        for i, char in enumerate(s):
            if char == '(':
                stack.append(i)
            elif char == ')':
                if stack:
                    stack.pop()
                else:
                    s[i] = ""  # Mark invalid closing parenthesis

        # Second pass: Remove unmatched opening parentheses
        while stack:
            s[stack.pop()] = ""  # Mark invalid opening parenthesis

        return "".join(s)
```
les optimal
```python
    def minRemoveToMakeValid(self, s):
        """
        :type s: str
        :rtype: str
        """
        
        s = list(s)
        open_count = 0  # Track unmatched opening parentheses

        # First pass: remove extra closing parentheses
        for i in range(len(s)):
            if s[i] == '(':
                open_count += 1
            elif s[i] == ')':
                if open_count > 0:
                    open_count -= 1
                else:
                    s[i] = ""  # Mark extra closing parenthesis for removal

        # Second pass: remove extra opening parentheses from right to left
        open_count = 0  # Reuse open_count for unmatched openings in reverse pass
        for i in range(len(s) - 1, -1, -1):
            if s[i] == ')':
                open_count += 1
            elif s[i] == '(':
                if open_count > 0:
                    open_count -= 1
                else:
                    s[i] = ""  # Mark extra opening parenthesis for removal

        return "".join(s)  # Join the list into a final valid string


```
possible alternatives
- Minimum Add to Make Parentheses Valid
- Count Valid Parentheses Substrings
---
### Valid Word Abbreviation
```python
# Optimal Solution
```

### Valid Palindrome II
```python
# Optimal Solution
```

### Random Pick with Weight
```python
# Optimal Solution
```

### Lowest Common Ancestor of a Binary Tree III
```python
# Optimal Solution
```

### Binary Tree Vertical Order Traversal
```python
# Optimal Solution
```

### Basic Calculator II
```python
# Optimal Solution
```

### Nested List Weight Sum
```python
# Optimal Solution
```

### Dot Product of Two Sparse Vectors
```python
# Optimal Solution
```

### Kth Largest Element in an Array
```python
# Optimal Solution
```

### Find Peak Element
```python
# Optimal Solution
```

### Lowest Common Ancestor of a Binary Tree
```python
# Optimal Solution
```

### Subarray Sum Equals K
```python
# Optimal Solution
```

### Simplify Path
```python
# Optimal Solution
```

### Pow(x, n)
```python
# Optimal Solution
```

### Move Zeroes
```python
# Optimal Solution
```

### Merge Sorted Array
```python
# Optimal Solution
```

### Shortest Path in Binary Matrix
```python
# Optimal Solution
```

### Copy List with Random Pointer
```python
# Optimal Solution
```

### Diameter of Binary Tree
```python
# Optimal Solution
```

### Buildings With an Ocean View
```python
# Optimal Solution
```

### Merge Intervals
```python
# Optimal Solution
```

### Valid Palindrome
```python
# Optimal Solution
```

### Minimum Add to Make Parentheses Valid
```python
# Optimal Solution
```

### Next Permutation
```python
# Optimal Solution
```

### LRU Cache
```python
# Optimal Solution
```

### Number of Islands
```python
# Optimal Solution
```

### Top K Frequent Elements
```python
# Optimal Solution
```

### Maximum Swap
```python
# Optimal Solution
```

### 3Sum
```python
# Optimal Solution
```

### Merge k Sorted Lists
```python
# Optimal Solution
```

### Binary Tree Right Side View
```python
# Optimal Solution
```

### K Closest Points to Origin
```python
# Optimal Solution
```

### Interval List Intersections
```python
# Optimal Solution
```

### Vertical Order Traversal of a Binary Tree
```python
# Optimal Solution
```

### Max Consecutive Ones III
```python
# Optimal Solution
```

### Kth Missing Positive Number
```python
# Optimal Solution
```

### Find First and Last Position of Element in Sorted Array
```python
# Optimal Solution
```

### Sum Root to Leaf Numbers
```python
# Optimal Solution
```

### Group Shifted Strings
```python
# Optimal Solution
```

### Sliding Window Median
```python
# Optimal Solution
```

### Minimum Time Difference
```python
# Optimal Solution
```

### Custom Sort String
```python
# Optimal Solution
```

### Range Sum of BST
```python
# Optimal Solution
```

### Two Sum
```python
# Optimal Solution
```

### Valid Parentheses
```python
# Optimal Solution
```

### Best Time to Buy and Sell Stock
```python
# Optimal Solution
```

### Moving Average from Data Stream
```python
# Optimal Solution
```

### Exclusive Time of Functions
```python
# Optimal Solution
```

### Convert Binary Search Tree to Sorted Doubly Linked List
```python
# Optimal Solution
```

### Insert into a Sorted Circular Linked List
```python
# Optimal Solution
```

### Remove All Adjacent Duplicates In String
```python
# Optimal Solution
```

### Longest Common Prefix
```python
# Optimal Solution
```

### Letter Combinations of a Phone Number
```python
# Optimal Solution
```

### Minimum Window Substring
```python
# Optimal Solution
```

### Largest Number
```python
# Optimal Solution
```

### House Robber
```python
# Optimal Solution
```

### Is Subsequence
```python
# Optimal Solution
```

### Random Pick Index
```python
# Optimal Solution
```

### Diagonal Traverse
```python
# Optimal Solution
```

### Accounts Merge
```python
# Optimal Solution
```

### Making A Large Island
```python
# Optimal Solution
```

### Koko Eating Bananas
```python
# Optimal Solution
```

### Find the Longest Substring Containing Vowels in Even Counts
```python
# Optimal Solution
```

### Median of Two Sorted Arrays
```python
# Optimal Solution
```

### Longest Palindromic Substring
```python
# Optimal Solution
```

### Reverse Integer
```python
# Optimal Solution
```

### String to Integer (atoi)
```python
# Optimal Solution
```

### Wildcard Matching
```python
# Optimal Solution
```

### Longest Consecutive Sequence
```python
# Optimal Solution
```

### Employees Earning More Than Their Managers
```python
# Optimal Solution
```

### Course Schedule
```python
# Optimal Solution
```

### Closest Binary Search Tree Value
```python
# Optimal Solution
```

### First Bad Version
```python
# Optimal Solution
```

### Expression Add Operators
```python
# Optimal Solution
```

### Design Tic-Tac-Toe
```python
# Optimal Solution
```

### Intersection of Two Arrays II
```python
# Optimal Solution
```

### Continuous Subarray Sum
```python
# Optimal Solution
```

### Stickers to Spell Word
```python
# Optimal Solution
```

### Goat Latin
```python
# Optimal Solution
```

### Shortest Bridge
```python
# Optimal Solution
```

### Linked List in Binary Tree
```python
# Optimal Solution
```

### Make Sum Divisible by P
```python
# Optimal Solution
```

### Create Hello World Function
```python
# Optimal Solution
```

### Find the Length of the Longest Common Prefix
```python
# Optimal Solution
```

### Longest Substring Without Repeating Characters
```python
# Optimal Solution
```

### Palindrome Number
```python
# Optimal Solution
```

### 3Sum Closest
```python
# Optimal Solution
```

### Generate Parentheses
```python
# Optimal Solution
```

### Remove Element
```python
# Optimal Solution
```

### Sudoku Solver
```python
# Optimal Solution
```

### Multiply Strings
```python
# Optimal Solution
```

### Spiral Matrix
```python
# Optimal Solution
```

### Unique Paths II
```python
# Optimal Solution
```

### Search a 2D Matrix
```python
# Optimal Solution
```

### Sort Colors
```python
# Optimal Solution
```

### Decode Ways
```python
# Optimal Solution
```

### Populating Next Right Pointers in Each Node
```python
# Optimal Solution
```

### Binary Tree Maximum Path Sum
```python
# Optimal Solution
```

### Clone Graph
```python
# Optimal Solution
```

### Word Break II
```python
# Optimal Solution
```

### Missing Ranges
```python
# Optimal Solution
```

### Strobogrammatic Number
```python
# Optimal Solution
```

### Alien Dictionary
```python
# Optimal Solution
```

### Integer to English Words
```python
# Optimal Solution
```

### Odd Even Linked List
```python
# Optimal Solution
```

### Largest BST Subtree
```python
# Optimal Solution
```

### Kth Smallest Element in a Sorted Matrix
```python
# Optimal Solution
```

### Lexicographical Numbers
```python
# Optimal Solution
```

### Add Strings
```python
# Optimal Solution
```

### Partition Equal Subset Sum
```python
# Optimal Solution
```

### String Compression
```python
# Optimal Solution
```

### Reverse Pairs
```python
# Optimal Solution
```

### Triangle Judgement
```python
# Optimal Solution
```

### Daily Temperatures
```python
# Optimal Solution
```

### Toeplitz Matrix
```python
# Optimal Solution
```

### Search in a Binary Search Tree
```python
# Optimal Solution
```

### All Nodes Distance K in Binary Tree
```python
# Optimal Solution
```

### Verifying an Alien Dictionary
```python
# Optimal Solution
```

### Capacity To Ship Packages Within D Days
```python
# Optimal Solution
```

### Valid Palindrome III
```python
# Optimal Solution
```

### IDK
```python
# Optimal Solution
```

### Remove All Adjacent Duplicates in String II
```python
# Optimal Solution
```

### Longest Subarray With Maximum Bitwise AND
```python
# Optimal Solution
```

### Insert Greatest Common Divisors in Linked List
```python
# Optimal Solution
```

---

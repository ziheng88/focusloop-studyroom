export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export type PracticeQuestion = {
  id: string
  title: string
  topic: string
  difficulty: Difficulty
  prompt: string
}

export const questionCategories = [
  { id: 'arrays_hashing', label: 'Arrays & Hashing' },
  { id: 'pointers_windows', label: 'Pointers & Windows' },
  { id: 'linear_structures', label: 'Linked Lists, Stacks & Queues' },
  { id: 'trees', label: 'Trees' },
  { id: 'graphs', label: 'Graphs & Union Find' },
  { id: 'dynamic_programming', label: 'Dynamic Programming' },
  { id: 'backtracking', label: 'Backtracking' },
  { id: 'search_heaps', label: 'Binary Search & Heaps' },
  { id: 'strings_design', label: 'Strings & Design' },
] as const

export type QuestionCategory = (typeof questionCategories)[number]['id']

export function questionCategory(topic: string): QuestionCategory {
  if (topic === 'Arrays & Hashing') return 'arrays_hashing'
  if (['Two Pointers', 'Sliding Window', 'Greedy'].includes(topic)) return 'pointers_windows'
  if (['Linked Lists', 'Stacks & Queues', 'Monotonic Stack', 'Deque'].includes(topic)) return 'linear_structures'
  if (topic === 'Trees') return 'trees'
  if (['Graphs', 'Union Find'].includes(topic)) return 'graphs'
  if (topic === 'Dynamic Programming') return 'dynamic_programming'
  if (topic === 'Backtracking') return 'backtracking'
  if (['Binary Search', 'Heap'].includes(topic)) return 'search_heaps'
  return 'strings_design'
}

// Original, short interview-practice prompts. Keeping this library in the app
// makes the demo reliable offline and avoids reproducing a third-party question bank.
export const practiceQuestions: PracticeQuestion[] = [
  { id: 'array-01', title: 'Duplicate detector', topic: 'Arrays & Hashing', difficulty: 'Easy', prompt: 'Return whether any value appears more than once in an integer list.' },
  { id: 'array-02', title: 'Missing badge number', topic: 'Arrays & Hashing', difficulty: 'Easy', prompt: 'A list contains distinct numbers from 0 through n with one missing. Find it.' },
  { id: 'array-03', title: 'First unique ticket', topic: 'Arrays & Hashing', difficulty: 'Easy', prompt: 'Find the first character in a string whose frequency is exactly one.' },
  { id: 'array-04', title: 'Anagram grouping desk', topic: 'Arrays & Hashing', difficulty: 'Medium', prompt: 'Group words that contain the same letters in a different order.' },
  { id: 'array-05', title: 'Product except position', topic: 'Arrays & Hashing', difficulty: 'Medium', prompt: 'For every position, compute the product of all other values without division.' },
  { id: 'array-06', title: 'Longest consecutive run', topic: 'Arrays & Hashing', difficulty: 'Medium', prompt: 'Find the length of the longest sequence of consecutive integers in an unsorted list.' },
  { id: 'array-07', title: 'Zero-sum triplets', topic: 'Arrays & Hashing', difficulty: 'Medium', prompt: 'List unique triples whose values add to zero.' },
  { id: 'array-08', title: 'Top frequent labels', topic: 'Arrays & Hashing', difficulty: 'Medium', prompt: 'Return the k values that occur most often in a collection.' },
  { id: 'array-09', title: 'Calendar collision', topic: 'Arrays & Hashing', difficulty: 'Medium', prompt: 'Given meeting intervals, report whether any two overlap.' },
  { id: 'array-10', title: 'Sparse matrix overlap', topic: 'Arrays & Hashing', difficulty: 'Hard', prompt: 'Multiply two sparse matrices while avoiding work on zero entries.' },

  { id: 'window-01', title: 'Palindrome sentence', topic: 'Two Pointers', difficulty: 'Easy', prompt: 'Ignore punctuation and case, then decide whether a phrase reads the same backwards.' },
  { id: 'window-02', title: 'Sorted pair target', topic: 'Two Pointers', difficulty: 'Easy', prompt: 'Find two values in a sorted list that add to a target using constant extra space.' },
  { id: 'window-03', title: 'Rain between bars', topic: 'Two Pointers', difficulty: 'Hard', prompt: 'Given wall heights, calculate the units of rainwater held after a storm.' },
  { id: 'window-04', title: 'Longest distinct window', topic: 'Sliding Window', difficulty: 'Medium', prompt: 'Find the longest substring that contains no repeated character.' },
  { id: 'window-05', title: 'Budgeted replacement', topic: 'Sliding Window', difficulty: 'Medium', prompt: 'With at most k replacements, make the longest substring containing one repeated letter.' },
  { id: 'window-06', title: 'Smallest covering window', topic: 'Sliding Window', difficulty: 'Hard', prompt: 'Find the shortest substring that contains all required characters with multiplicity.' },
  { id: 'window-07', title: 'Fixed average threshold', topic: 'Sliding Window', difficulty: 'Easy', prompt: 'Count fixed-size subarrays whose average reaches a threshold.' },
  { id: 'window-08', title: 'Fruit basket limit', topic: 'Sliding Window', difficulty: 'Medium', prompt: 'Find the longest segment containing values from at most two categories.' },
  { id: 'window-09', title: 'Circular fuel route', topic: 'Greedy', difficulty: 'Medium', prompt: 'Choose a starting station that can complete a circular route, or report none.' },
  { id: 'window-10', title: 'Container capacity', topic: 'Two Pointers', difficulty: 'Medium', prompt: 'Choose two vertical lines that hold the maximum area of water.' },

  { id: 'list-01', title: 'Reverse a chain', topic: 'Linked Lists', difficulty: 'Easy', prompt: 'Reverse a singly linked list iteratively.' },
  { id: 'list-02', title: 'Middle station', topic: 'Linked Lists', difficulty: 'Easy', prompt: 'Return the middle node of a singly linked list in one pass.' },
  { id: 'list-03', title: 'Cycle entrance', topic: 'Linked Lists', difficulty: 'Medium', prompt: 'Detect a cycle and return the first node that belongs to it.' },
  { id: 'list-04', title: 'Merge sorted chains', topic: 'Linked Lists', difficulty: 'Easy', prompt: 'Merge two sorted linked lists into one sorted chain.' },
  { id: 'list-05', title: 'Remove kth from end', topic: 'Linked Lists', difficulty: 'Medium', prompt: 'Delete the kth node from the end with one traversal.' },
  { id: 'list-06', title: 'Copy random pointers', topic: 'Linked Lists', difficulty: 'Medium', prompt: 'Deep-copy a linked list whose nodes also have arbitrary random pointers.' },
  { id: 'list-07', title: 'Reorder zipper', topic: 'Linked Lists', difficulty: 'Medium', prompt: 'Reorder a list by alternating nodes from its front and reversed second half.' },
  { id: 'list-08', title: 'Sorted list rotations', topic: 'Linked Lists', difficulty: 'Medium', prompt: 'Rotate a linked list right by k positions.' },
  { id: 'list-09', title: 'Flatten multilevel list', topic: 'Linked Lists', difficulty: 'Medium', prompt: 'Flatten a doubly linked structure that may include child lists.' },
  { id: 'list-10', title: 'Reverse in groups', topic: 'Linked Lists', difficulty: 'Hard', prompt: 'Reverse nodes in consecutive groups of size k.' },

  { id: 'stack-01', title: 'Balanced delimiters', topic: 'Stacks & Queues', difficulty: 'Easy', prompt: 'Validate that brackets in a string close in the correct order.' },
  { id: 'stack-02', title: 'Minimum stack', topic: 'Stacks & Queues', difficulty: 'Medium', prompt: 'Design a stack that returns its minimum value in constant time.' },
  { id: 'stack-03', title: 'Daily warmer day', topic: 'Monotonic Stack', difficulty: 'Medium', prompt: 'For each temperature, find how many days until a warmer one appears.' },
  { id: 'stack-04', title: 'Histogram skyline', topic: 'Monotonic Stack', difficulty: 'Hard', prompt: 'Find the largest rectangle that fits under a histogram.' },
  { id: 'stack-05', title: 'Simplify directory path', topic: 'Stacks & Queues', difficulty: 'Medium', prompt: 'Normalize an absolute file path containing dot and parent segments.' },
  { id: 'stack-06', title: 'Evaluate postfix formula', topic: 'Stacks & Queues', difficulty: 'Medium', prompt: 'Evaluate an arithmetic expression written in reverse Polish notation.' },
  { id: 'stack-07', title: 'Queue from stacks', topic: 'Stacks & Queues', difficulty: 'Easy', prompt: 'Implement FIFO behavior using only stack operations.' },
  { id: 'stack-08', title: 'Sliding maximum', topic: 'Deque', difficulty: 'Hard', prompt: 'Return the maximum value in every fixed-size sliding window.' },
  { id: 'stack-09', title: 'Decode repeat notation', topic: 'Stacks & Queues', difficulty: 'Medium', prompt: 'Expand nested expressions such as 3[a2[c]].' },
  { id: 'stack-10', title: 'Collision lane', topic: 'Stacks & Queues', difficulty: 'Medium', prompt: 'Simulate moving objects that collide while travelling in a line.' },

  { id: 'tree-01', title: 'Tree height', topic: 'Trees', difficulty: 'Easy', prompt: 'Find the maximum depth of a binary tree.' },
  { id: 'tree-02', title: 'Mirror tree', topic: 'Trees', difficulty: 'Easy', prompt: 'Decide whether a binary tree is symmetric around its center.' },
  { id: 'tree-03', title: 'Level traversal', topic: 'Trees', difficulty: 'Medium', prompt: 'Return a binary tree level by level from left to right.' },
  { id: 'tree-04', title: 'Lowest shared ancestor', topic: 'Trees', difficulty: 'Medium', prompt: 'Find the lowest common ancestor of two nodes in a binary tree.' },
  { id: 'tree-05', title: 'Validate search tree', topic: 'Trees', difficulty: 'Medium', prompt: 'Verify that every node obeys binary-search-tree ordering rules.' },
  { id: 'tree-06', title: 'Kth smallest node', topic: 'Trees', difficulty: 'Medium', prompt: 'Return the kth smallest value stored in a binary search tree.' },
  { id: 'tree-07', title: 'Tree diameter', topic: 'Trees', difficulty: 'Medium', prompt: 'Find the number of edges on the longest path between two tree nodes.' },
  { id: 'tree-08', title: 'Serialize a tree', topic: 'Trees', difficulty: 'Hard', prompt: 'Encode and decode a binary tree without losing shape or values.' },
  { id: 'tree-09', title: 'Right-side silhouette', topic: 'Trees', difficulty: 'Medium', prompt: 'Return the node values visible when looking at a binary tree from the right.' },
  { id: 'tree-10', title: 'Build from traversals', topic: 'Trees', difficulty: 'Medium', prompt: 'Reconstruct a binary tree from preorder and inorder traversals.' },

  { id: 'graph-01', title: 'Island counter', topic: 'Graphs', difficulty: 'Medium', prompt: 'Count connected groups of land cells in a rectangular map.' },
  { id: 'graph-02', title: 'Clone a network', topic: 'Graphs', difficulty: 'Medium', prompt: 'Deep-copy an undirected graph from a starting node.' },
  { id: 'graph-03', title: 'Course ordering', topic: 'Graphs', difficulty: 'Medium', prompt: 'Return a valid order for courses with prerequisite edges, if one exists.' },
  { id: 'graph-04', title: 'Word ladder steps', topic: 'Graphs', difficulty: 'Hard', prompt: 'Transform one word to another by changing one letter at a time with a valid dictionary.' },
  { id: 'graph-05', title: 'Signal propagation', topic: 'Graphs', difficulty: 'Medium', prompt: 'Find how long a signal needs to reach every node in a weighted directed graph.' },
  { id: 'graph-06', title: 'Shortest maze exit', topic: 'Graphs', difficulty: 'Medium', prompt: 'Find the fewest moves from an entrance to any maze boundary exit.' },
  { id: 'graph-07', title: 'Bipartite festival', topic: 'Graphs', difficulty: 'Medium', prompt: 'Determine whether guests connected by conflict edges can be split into two groups.' },
  { id: 'graph-08', title: 'Union find accounts', topic: 'Union Find', difficulty: 'Medium', prompt: 'Merge account records that share an email address.' },
  { id: 'graph-09', title: 'Minimum cable plan', topic: 'Graphs', difficulty: 'Medium', prompt: 'Connect all points with the minimum total Manhattan-distance cable.' },
  { id: 'graph-10', title: 'Alien alphabet', topic: 'Graphs', difficulty: 'Hard', prompt: 'Infer a valid character ordering from a sorted alien dictionary.' },

  { id: 'dp-01', title: 'Staircase ways', topic: 'Dynamic Programming', difficulty: 'Easy', prompt: 'Count ways to reach the top when each move climbs one or two steps.' },
  { id: 'dp-02', title: 'Robbing spaced homes', topic: 'Dynamic Programming', difficulty: 'Medium', prompt: 'Maximize non-adjacent values in a row of houses.' },
  { id: 'dp-03', title: 'Coin total', topic: 'Dynamic Programming', difficulty: 'Medium', prompt: 'Find the fewest coins needed to reach a target sum.' },
  { id: 'dp-04', title: 'Increasing sequence', topic: 'Dynamic Programming', difficulty: 'Medium', prompt: 'Find the length of the longest strictly increasing subsequence.' },
  { id: 'dp-05', title: 'Grid route count', topic: 'Dynamic Programming', difficulty: 'Medium', prompt: 'Count paths from the top-left to bottom-right of a grid with obstacles.' },
  { id: 'dp-06', title: 'Edit distance', topic: 'Dynamic Programming', difficulty: 'Hard', prompt: 'Find the fewest insertions, removals, or substitutions to transform one word into another.' },
  { id: 'dp-07', title: 'Split equal subsets', topic: 'Dynamic Programming', difficulty: 'Medium', prompt: 'Decide whether a list can be split into two groups with equal sum.' },
  { id: 'dp-08', title: 'Decode digit message', topic: 'Dynamic Programming', difficulty: 'Medium', prompt: 'Count valid alphabet decodings of a digit string where 1 through 26 map to letters.' },
  { id: 'dp-09', title: 'Longest common subsequence', topic: 'Dynamic Programming', difficulty: 'Medium', prompt: 'Find the length of the longest sequence shared by two strings in order.' },
  { id: 'dp-10', title: 'Burst balloons', topic: 'Dynamic Programming', difficulty: 'Hard', prompt: 'Choose removal order to maximize the coins earned from neighboring values.' },

  { id: 'backtrack-01', title: 'Phone letter paths', topic: 'Backtracking', difficulty: 'Medium', prompt: 'Return all letter combinations represented by a phone keypad digit string.' },
  { id: 'backtrack-02', title: 'Subset catalogue', topic: 'Backtracking', difficulty: 'Medium', prompt: 'Return every subset of a list of unique integers.' },
  { id: 'backtrack-03', title: 'Permutation planner', topic: 'Backtracking', difficulty: 'Medium', prompt: 'Return every ordering of a list of distinct values.' },
  { id: 'backtrack-04', title: 'Target combinations', topic: 'Backtracking', difficulty: 'Medium', prompt: 'Find combinations of candidate values that sum to a target and may be reused.' },
  { id: 'backtrack-05', title: 'Board word trace', topic: 'Backtracking', difficulty: 'Medium', prompt: 'Determine whether a word can be traced through adjacent cells without reusing a cell.' },
  { id: 'backtrack-06', title: 'N queens board', topic: 'Backtracking', difficulty: 'Hard', prompt: 'Place n queens on a board so that none attack another.' },
  { id: 'backtrack-07', title: 'Restore addresses', topic: 'Backtracking', difficulty: 'Medium', prompt: 'Split a digit string into every valid four-part network address.' },
  { id: 'backtrack-08', title: 'Partition palindromes', topic: 'Backtracking', difficulty: 'Medium', prompt: 'Split a string so every segment is a palindrome.' },
  { id: 'backtrack-09', title: 'Sudoku fill', topic: 'Backtracking', difficulty: 'Hard', prompt: 'Fill a partially completed Sudoku board while respecting all constraints.' },
  { id: 'backtrack-10', title: 'Letter tile count', topic: 'Backtracking', difficulty: 'Medium', prompt: 'Count distinct non-empty strings that can be formed from letter tiles.' },

  { id: 'search-01', title: 'Classic binary lookup', topic: 'Binary Search', difficulty: 'Easy', prompt: 'Return the index of a target in a sorted list, or -1 if it is absent.' },
  { id: 'search-02', title: 'Rotated lookup', topic: 'Binary Search', difficulty: 'Medium', prompt: 'Find a target in a sorted array that has been rotated at an unknown pivot.' },
  { id: 'search-03', title: 'First bad build', topic: 'Binary Search', difficulty: 'Easy', prompt: 'Given a monotonic quality API, find the first failing version.' },
  { id: 'search-04', title: 'Median of two streams', topic: 'Binary Search', difficulty: 'Hard', prompt: 'Find the median of two sorted arrays in logarithmic time.' },
  { id: 'search-05', title: 'Meeting room planner', topic: 'Heap', difficulty: 'Medium', prompt: 'Return the minimum number of rooms needed for a set of meeting intervals.' },
  { id: 'search-06', title: 'K closest points', topic: 'Heap', difficulty: 'Medium', prompt: 'Return the k points nearest to the origin.' },
  { id: 'search-07', title: 'Median tracker', topic: 'Heap', difficulty: 'Hard', prompt: 'Design a structure that adds numbers and returns the median efficiently.' },
  { id: 'search-08', title: 'Banana eating speed', topic: 'Binary Search', difficulty: 'Medium', prompt: 'Choose the minimum integer speed that finishes all piles before a deadline.' },
  { id: 'search-09', title: 'Task cooldown order', topic: 'Heap', difficulty: 'Medium', prompt: 'Schedule repeated tasks with a cooldown using the fewest intervals.' },
  { id: 'search-10', title: 'Merge sorted feeds', topic: 'Heap', difficulty: 'Hard', prompt: 'Merge k sorted linked lists into one sorted list.' },

  { id: 'string-01', title: 'Ransom note letters', topic: 'Strings', difficulty: 'Easy', prompt: 'Decide whether one string can be built from the characters of another.' },
  { id: 'string-02', title: 'Longest palindrome center', topic: 'Strings', difficulty: 'Medium', prompt: 'Find the longest palindromic substring by expanding around possible centers.' },
  { id: 'string-03', title: 'Compression counter', topic: 'Strings', difficulty: 'Medium', prompt: 'Compress consecutive repeated characters in place and return the new length.' },
  { id: 'string-04', title: 'Version comparer', topic: 'Strings', difficulty: 'Medium', prompt: 'Compare two dotted version strings without converting the entire values to integers.' },
  { id: 'string-05', title: 'Decode bracketed text', topic: 'Strings', difficulty: 'Medium', prompt: 'Expand nested count-and-bracket text expressions.' },
  { id: 'string-06', title: 'Minimum bracket additions', topic: 'Strings', difficulty: 'Medium', prompt: 'Find the fewest brackets to add to make a parenthesis string valid.' },
  { id: 'string-07', title: 'Custom sort alphabet', topic: 'Strings', difficulty: 'Medium', prompt: 'Sort the characters in a string according to a supplied custom alphabet order.' },
  { id: 'string-08', title: 'Read stream chunks', topic: 'Design', difficulty: 'Easy', prompt: 'Implement a reader that returns n characters while a source only returns four at a time.' },
  { id: 'string-09', title: 'Time-keyed store', topic: 'Design', difficulty: 'Medium', prompt: 'Store values by key and timestamp, then return the newest value at or before a time.' },
  { id: 'string-10', title: 'Rate limiter window', topic: 'Design', difficulty: 'Medium', prompt: 'Design a fixed-window limiter that accepts or rejects requests per user.' },
]

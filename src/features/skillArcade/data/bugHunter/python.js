export const pythonQuestions = [
  {
    "id": "bh-py-001",
    "language": "Python",
    "difficulty": "Easy",
    "difficultyMetadata": {
      "characteristics": [
        "Single obvious concept"
      ]
    },
    "category": "Error Handling",
    "tags": [
      "Syntax Error"
    ],
    "primaryPattern": "Incorrect return",
    "code": "def greet(name):\nprint(f\"Hello, {name}\")",
    "question": "What is wrong with this code?",
    "options": [
      "print is not a function",
      "Missing return statement",
      "IndentationError: expected an indented block",
      "f-strings require Python 4.0"
    ],
    "answer": "IndentationError: expected an indented block",
    "explanation": "The code attempts to define a function. The bug is that Python relies strictly on indentation (whitespace) to define code blocks, not curly braces. The 'print' statement must be indented to be part of the 'greet' function. f-strings are perfectly valid in Python 3.6+.",
    "affectedLine": 2,
    "expectedBehavior": "Parses function and prints greeting.",
    "actualBehavior": "Throws IndentationError.",
    "takeaway": "Always review the exact syntax and logic constraints of the language.",
    "incorrectExplanations": {}
  },
  {
    "id": "bh-py-002",
    "language": "Python",
    "difficulty": "Easy",
    "difficultyMetadata": {
      "characteristics": [
        "Single obvious concept"
      ]
    },
    "category": "Error Handling",
    "tags": [
      "Classes",
      "Methods"
    ],
    "primaryPattern": "Incorrect return",
    "code": "class Greeter:\n    def say_hello(name):\n        print(f\"Hello, {name}!\")\n\ngreeter = Greeter()\ngreeter.say_hello(\"Alice\")",
    "question": "What exception will this raise?",
    "options": [
      "NameError: name 'name' is not defined",
      "TypeError: say_hello() takes 1 positional argument but 2 were given",
      "SyntaxError: missing 'self'",
      "No exception, it prints 'Hello, Alice!'"
    ],
    "answer": "TypeError: say_hello() takes 1 positional argument but 2 were given",
    "explanation": "In Python, instance methods automatically receive the instance itself as the first argument (conventionally named 'self'). Because 'say_hello' only defines one parameter ('name'), Python throws a TypeError when it tries to pass both the 'greeter' instance and 'Alice'.",
    "affectedLine": 2,
    "expectedBehavior": "Calls the method and prints the greeting.",
    "actualBehavior": "Throws a TypeError because the implicit 'self' argument is missing from the method signature.",
    "takeaway": "Always review the exact syntax and logic constraints of the language.",
    "incorrectExplanations": {}
  },
  {
    "id": "bh-py-003",
    "language": "Python",
    "difficulty": "Medium",
    "difficultyMetadata": {
      "characteristics": [
        "Shared state / Memory",
        "Deep program flow"
      ]
    },
    "category": "Data Structures",
    "tags": [
      "Memory Management",
      "Pointers"
    ],
    "primaryPattern": "Incorrect return",
    "code": "def add_item(item, lst=[]):\n    lst.append(item)\n    return lst",
    "question": "What is the danger of this default argument?",
    "options": [
      "Lists cannot be used as default arguments",
      "The default list is instantiated once and shared across all calls that use the default",
      "append() modifies the item, not the list",
      "It throws a SyntaxError"
    ],
    "answer": "The default list is instantiated once and shared across all calls that use the default",
    "explanation": "The code intends to append an item to a new list if one isn't provided. The bug is that Python evaluates default arguments only once when the function is defined. Because the list is mutable, every subsequent call without the 'lst' argument will append to the exact same shared list in memory.",
    "affectedLine": 1,
    "expectedBehavior": "Creates a new list for each call.",
    "actualBehavior": "Shares the same list across all calls.",
    "takeaway": "Always review the exact syntax and logic constraints of the language.",
    "incorrectExplanations": {}
  },
  {
    "id": "bh-py-004",
    "language": "Python",
    "difficulty": "Easy",
    "difficultyMetadata": {
      "characteristics": [
        "Multiple lines of reasoning",
        "Language-specific behavior"
      ]
    },
    "category": "Data Structures",
    "tags": [
      "Type Error",
      "Variables"
    ],
    "primaryPattern": "Null value",
    "code": "word = \"hello\"\nword[0] = \"H\"\nprint(word)",
    "question": "Why will this code fail?",
    "options": [
      "Variables cannot be redefined",
      "Strings in Python are immutable and do not support item assignment",
      "The index should be 1, not 0",
      "print does not support strings"
    ],
    "answer": "Strings in Python are immutable and do not support item assignment",
    "explanation": "The code attempts to capitalize the first letter of a string. The bug is treating the string like a mutable array. In Python, strings are immutable; you cannot reassign specific indices. You must construct a new string entirely (e.g., word.capitalize() or 'H' + word[1:]).",
    "affectedLine": 2,
    "expectedBehavior": "Changes the first character to 'H'.",
    "actualBehavior": "Throws TypeError because strings are immutable.",
    "takeaway": "Always review the exact syntax and logic constraints of the language.",
    "incorrectExplanations": {}
  },
  {
    "id": "bh-py-005",
    "language": "Python",
    "difficulty": "Hard",
    "difficultyMetadata": {
      "characteristics": [
        "Deep program flow",
        "Memory management"
      ]
    },
    "category": "Data Structures",
    "tags": [
      "Type Error",
      "Variables"
    ],
    "primaryPattern": "Null value",
    "code": "squares = (x**2 for x in range(5))\nprint(len(squares))",
    "question": "What is the result of executing this code?",
    "options": [
      "5",
      "TypeError: object of type 'generator' has no len()",
      "0",
      "[0, 1, 4, 9, 16]"
    ],
    "answer": "TypeError: object of type 'generator' has no len()",
    "explanation": "The code tries to print the length of a sequence. The bug is that using parentheses '(x for x...)' creates a generator expression, not a list (which uses brackets '[x for x...]'). Generators lazily compute values on demand and have no predetermined length, so len() throws a TypeError.",
    "affectedLine": 2,
    "expectedBehavior": "Prints the length of the generator.",
    "actualBehavior": "Throws TypeError because generators do not have a length.",
    "takeaway": "Always review the exact syntax and logic constraints of the language.",
    "incorrectExplanations": {}
  },
  {
    "id": "bh-py-006",
    "language": "Python",
    "difficulty": "Hard",
    "difficultyMetadata": {
      "characteristics": [
        "Deep program flow",
        "Memory management"
      ]
    },
    "category": "Scope",
    "tags": [
      "Scope Issue",
      "Closures"
    ],
    "primaryPattern": "Scope issue",
    "code": "x = 10\ndef update_x():\n    x = x + 1\n    return x\nupdate_x()",
    "question": "What happens when update_x() is called?",
    "options": [
      "It returns 11",
      "UnboundLocalError: local variable 'x' referenced before assignment",
      "It returns 10",
      "NameError: name 'x' is not defined"
    ],
    "answer": "UnboundLocalError: local variable 'x' referenced before assignment",
    "explanation": "The code attempts to increment a global variable. The bug lies in Python's scoping rules: because there is an assignment ('x = ...') inside the function, Python treats 'x' entirely as a local variable. It attempts to evaluate 'x + 1' locally before 'x' is assigned, causing an UnboundLocalError. Use 'global x' to fix.",
    "affectedLine": 3,
    "expectedBehavior": "Increments the global 'x' variable.",
    "actualBehavior": "Throws UnboundLocalError.",
    "takeaway": "Always review the exact syntax and logic constraints of the language.",
    "incorrectExplanations": {}
  },
  {
    "id": "bh-py-007",
    "language": "Python",
    "difficulty": "Medium",
    "difficultyMetadata": {
      "characteristics": [
        "Multiple lines of reasoning",
        "Language-specific behavior"
      ]
    },
    "category": "Functions",
    "tags": [
      "Logic Error"
    ],
    "primaryPattern": "Incorrect condition",
    "code": "data = {\"a\": 1, \"b\": 2, \"c\": 3}\nfor key in data:\n    if data[key] == 2:\n        del data[key]",
    "question": "What exception will this loop raise?",
    "options": [
      "KeyError",
      "RuntimeError: dictionary changed size during iteration",
      "AttributeError",
      "SyntaxError"
    ],
    "answer": "RuntimeError: dictionary changed size during iteration",
    "explanation": "In Python, you cannot add or remove items from a dictionary while iterating over its keys. Attempting to do so raises a RuntimeError. A common fix is to iterate over a copy of the keys, e.g., 'for key in list(data.keys()):'.",
    "affectedLine": 4,
    "expectedBehavior": "Removes the key 'b' from the dictionary.",
    "actualBehavior": "Throws a RuntimeError because the dictionary size changed.",
    "takeaway": "Always review the exact syntax and logic constraints of the language.",
    "incorrectExplanations": {}
  },
  {
    "id": "bh-py-008",
    "language": "Python",
    "difficulty": "Medium",
    "difficultyMetadata": {
      "characteristics": [
        "Language-specific behavior",
        "Memory location"
      ]
    },
    "category": "Conditions",
    "tags": [
      "Equality"
    ],
    "primaryPattern": "Incorrect return",
    "code": "x = 1000\nif x is 1000:\n    print(\"Match\")",
    "question": "Why is using 'is' dangerous here?",
    "options": [
      "'is' only works for strings",
      "'is' checks identity (memory location), not equality",
      "'is' is a syntax error in Python 3",
      "'is' assigns 1000 to x"
    ],
    "answer": "'is' checks identity (memory location), not equality",
    "explanation": "The 'is' operator checks if two variables point to the exact same object in memory. While Python caches small integers (like 1 to 256), larger integers like 1000 may be created as distinct objects, causing 'is' to return false. Always use '==' to check for value equality.",
    "affectedLine": 2,
    "expectedBehavior": "Checks if the value of x equals 1000.",
    "actualBehavior": "Checks if x is the exact same memory object as the literal 1000.",
    "takeaway": "Always review the exact syntax and logic constraints of the language.",
    "incorrectExplanations": {}
  },
  {
    "id": "bh-py-009",
    "language": "Python",
    "difficulty": "Easy",
    "difficultyMetadata": {
      "characteristics": [
        "Single obvious concept"
      ]
    },
    "category": "Arrays",
    "tags": [
      "Arrays",
      "List Methods"
    ],
    "primaryPattern": "Wrong index",
    "code": "results = [1, 2, 3]\nnew_data = [4, 5]\nresults.append(new_data)\nprint(len(results))",
    "question": "What is the output of this code?",
    "options": [
      "4",
      "5",
      "2",
      "TypeError"
    ],
    "answer": "4",
    "explanation": "The 'append' method adds its argument as a single element to the end of the list. By passing a list, 'results' becomes [1, 2, 3, [4, 5]], which has a length of 4. To merge the elements flatly, you should use 'results.extend(new_data)' or the '+=' operator.",
    "affectedLine": 3,
    "takeaway": "Always review the exact syntax and logic constraints of the language.",
    "incorrectExplanations": {}  },
  {
    "id": "bh-py-010",
    "language": "Python",
    "difficulty": "Medium",
    "difficultyMetadata": {
      "characteristics": [
        "Language-specific behavior",
        "Execution Trace"
      ]
    },
    "category": "Loops",
    "questionType": "code-output",
    "tags": [
      "List Comprehensions",
      "Scope Issue"
    ],
    "primaryPattern": "Data transformation",
    "code": "funcs = [lambda: i for i in range(3)]\nfor f in funcs:\n    print(f())",
    "question": "What is the output of this code?",
    "options": [
      "0\\n1\\n2",
      "2\\n2\\n2",
      "1\\n2\\n3",
      "Error"
    ],
    "answer": "2\\n2\\n2",
    "explanation": "Python's closures are late-binding. This means that the lambda functions capture the variable 'i' by reference, not by value. When the lambdas are executed in the second loop, the first loop has already completed, and 'i' evaluates to its final value, which is 2.",
    "affectedLine": 3,
    "takeaway": "Variables in list comprehensions and closures bind by reference in Python.",
    "incorrectExplanations": {}
  },
  {
    "id": "bh-py-011",
    "language": "Python",
    "difficulty": "Hard",
    "difficultyMetadata": {
      "characteristics": [
        "Memory location",
        "Deep program flow"
      ]
    },
    "category": "Functions",
    "questionType": "behavior-prediction",
    "tags": [
      "Default Arguments"
    ],
    "primaryPattern": "Shared state",
    "code": "def process_data(data, cache={}):\n    cache[data] = True\n    return len(cache)",
    "question": "What happens when this function is called multiple times without providing a cache?",
    "options": [
      "It raises a KeyError",
      "The length of the cache remains 1 each time",
      "The cache persists and grows across sequential calls",
      "It raises a SyntaxError"
    ],
    "answer": "The cache persists and grows across sequential calls",
    "explanation": "Default arguments are evaluated once at function definition time. The dictionary provided as the default cache is instantiated once and shared across every invocation that doesn't supply its own dictionary.",
    "expectedBehavior": "It creates a fresh cache for each call.",
    "actualBehavior": "The dictionary is shared and grows continuously.",
    "affectedLine": 1,
    "takeaway": "Never use mutable structures like lists or dicts as default arguments in Python.",
    "incorrectExplanations": {}
  }
];

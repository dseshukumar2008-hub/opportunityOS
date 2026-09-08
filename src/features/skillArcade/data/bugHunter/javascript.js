export const javascriptQuestions = [
  {
    "id": "bh-js-001",
    "language": "JavaScript",
    "difficulty": "Easy",
    "difficultyMetadata": {
      "characteristics": [
        "Single obvious concept"
      ]
    },
    "category": "Data Structures",
    "tags": [
      "Type Coercion",
      "Logic Error"
    ],
    "primaryPattern": "Incorrect condition",
    "code": "function calculateTotal(price, quantity) {\n  return price + quantity;\n}\nconsole.log(calculateTotal(10, \"5\"));",
    "correctedCode": "function calculateTotal(price, quantity) {\n  return price + quantity;\n}\nconsole.log(calculateTotal(10, 5)); // Pass a number",
    "question": "What will this code print?",
    "options": [
      "15",
      "50",
      "\"105\"",
      "NaN"
    ],
    "answer": "\"105\"",
    "explanation": {
      "intent": "The code attempts to calculate the sum of two numbers.",
      "bug": "The 'quantity' variable is a string '\"5\"' instead of a number.",
      "reason": "In JavaScript, using the '+' operator with a string and a number causes type coercion. The number 10 is implicitly converted to a string, and they are concatenated together to form \"105\", rather than performing mathematical addition.",
      "fix": "Ensure both arguments are numbers, or convert the string using Number() or parseInt()."
    },
    "affectedLine": 2,
    "takeaway": "Always review the exact syntax and logic constraints of the language.",
    "incorrectExplanations": {}
  },
  {
    "id": "bh-js-002",
    "language": "JavaScript",
    "difficulty": "Easy",
    "difficultyMetadata": {
      "characteristics": [
        "Single obvious concept"
      ]
    },
    "category": "Data Structures",
    "tags": [
      "Type Error",
      "Variables"
    ],
    "primaryPattern": "Null value",
    "code": "const user = { name: \"Alice\", age: 25 };\nconsole.log(user.email.toLowerCase());",
    "correctedCode": "const user = { name: \"Alice\", age: 25 };\nconsole.log(user.email?.toLowerCase()); // Safe navigation",
    "question": "What is the likely runtime error here?",
    "options": [
      "SyntaxError: Missing semicolon",
      "TypeError: Cannot read properties of undefined (reading 'toLowerCase')",
      "ReferenceError: user is not defined",
      "No error, it prints undefined"
    ],
    "answer": "TypeError: Cannot read properties of undefined (reading 'toLowerCase')",
    "explanation": "The code attempts to read an 'email' property that doesn't exist on the 'user' object, which evaluates to 'undefined'. The actual bug occurs when calling .toLowerCase() on 'undefined', throwing a TypeError. It won't fail silently or throw a ReferenceError.",
    "affectedLine": 2,
    "expectedBehavior": "Safely read email or handle undefined.",
    "actualBehavior": "Throws TypeError when calling toLowerCase() on undefined.",
    "hint": "Does the user object have an email property?",
    "takeaway": "Always review the exact syntax and logic constraints of the language.",
    "incorrectExplanations": {}
  },

  {
    "id": "bh-js-003",
    "language": "JavaScript",
    "difficulty": "Hard",
    "difficultyMetadata": {
      "characteristics": [
        "Closures/Scope",
        "Deep program flow"
      ]
    },
    "category": "Scope",
    "tags": [
      "Scope Issue",
      "Closures"
    ],
    "primaryPattern": "Scope issue",
    "code": "for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100);\n}",
    "question": "What will this code print?",
    "options": [
      "0, 1, 2",
      "1, 2, 3",
      "3, 3, 3",
      "0, 0, 0"
    ],
    "answer": "3, 3, 3",
    "explanation": "The loop schedules three timeouts. The bug is using 'var', which creates a single function-scoped variable. By the time the timeouts execute, the loop has already completed and 'i' is 3, so all callbacks print 3. Using 'let' would create a new block-scoped 'i' for each iteration, correctly printing 0, 1, 2.",
    "affectedLine": 1,


    "takeaway": "Always review the exact syntax and logic constraints of the language.",
    "incorrectExplanations": {}
  },
  {
    "id": "bh-js-004",
    "language": "JavaScript",
    "difficulty": "Medium",
    "difficultyMetadata": {
      "characteristics": [
        "Multiple lines of reasoning",
        "Language-specific behavior"
      ]
    },
    "category": "Arrays",
    "tags": [
      "Reference Error",
      "Arrays"
    ],
    "primaryPattern": "Mutation",
    "code": "function removeLast(arr) {\n  const newArr = arr;\n  newArr.pop();\n  return newArr;\n}",
    "question": "What is the logical flaw in this code?",
    "options": [
      "pop() removes the first element, not the last",
      "arr is modified because newArr is just a reference to arr",
      "newArr needs to be declared with let",
      "It throws an error if arr is empty"
    ],
    "answer": "arr is modified because newArr is just a reference to arr",
    "explanation": "The function intends to return a new array without modifying the original. The bug is that objects and arrays in JS are assigned by reference. 'newArr = arr' creates a second pointer to the same array in memory, so 'pop()' mutates the original. Use 'const newArr = [...arr]' to create an actual copy.",
    "affectedLine": 2,
    "expectedBehavior": "Creates a copy of the array and pops.",
    "actualBehavior": "Mutates the original array because 'newArr' is a reference.",
    "takeaway": "Always review the exact syntax and logic constraints of the language.",
    "incorrectExplanations": {}
  },
  {
    "id": "bh-js-005",
    "language": "JavaScript",
    "difficulty": "Easy",
    "difficultyMetadata": {
      "characteristics": [
        "Multiple lines of reasoning",
        "Language-specific behavior"
      ]
    },
    "category": "Conditions",
    "tags": [
      "Logic Error"
    ],
    "primaryPattern": "Incorrect condition",
    "code": "const numbers = [10, 5, 20, 1];\nnumbers.sort();\nconsole.log(numbers);",
    "question": "What is the output of this array sort?",
    "options": [
      "[1, 5, 10, 20]",
      "[20, 10, 5, 1]",
      "[1, 10, 20, 5]",
      "[10, 5, 20, 1]"
    ],
    "answer": "[1, 10, 20, 5]",
    "explanation": "The code attempts to sort an array of numbers. The bug is that JavaScript's default Array.sort() converts elements to strings and compares their UTF-16 code values. Alphabetically, '10' comes before '5'. You must pass a comparator function (a, b) => a - b to sort numbers numerically.",
    "affectedLine": 2,


    "takeaway": "Always review the exact syntax and logic constraints of the language.",
    "incorrectExplanations": {}
  },
  {
    "id": "bh-js-006",
    "language": "JavaScript",
    "difficulty": "Hard",
    "difficultyMetadata": {
      "characteristics": [
        "Deep program flow",
        "Memory management"
      ]
    },
    "category": "Scope",
    "tags": [
      "Context Binding",
      "this"
    ],
    "primaryPattern": "Incorrect return",
    "code": "class Counter {\n  constructor() {\n    this.count = 0;,\n    takeaway: \"Always review the exact syntax and logic constraints of the language.\",\n    incorrectExplanations: {\n    }\n  }\n  start() {\n    setInterval(function() {\n      this.count++;\n      console.log(this.count);\n    }, 1000);\n  }\n}",
    "question": "Why will this counter fail to work as expected?",
    "options": [
      "setInterval is not supported in classes",
      "'this' inside the regular function refers to the global object, not the class instance",
      "this.count is a constant and cannot be incremented",
      "The setInterval requires a string argument"
    ],
    "answer": "'this' inside the regular function refers to the global object, not the class instance",
    "explanation": "The code tries to increment a class property on a timer. The bug is using a standard function inside 'setInterval'. Standard functions create their own 'this' context (usually the global object). The fix is to use an arrow function () => {}, which inherits 'this' from the surrounding class method.",
    "affectedLine": 6,
    "expectedBehavior": "Increments class instance this.count.",
    "actualBehavior": "Increments this.count on the global object (or undefined in strict mode)."
  },
  {
    "id": "bh-js-007",
    "language": "JavaScript",
    "difficulty": "Medium",
    "difficultyMetadata": {
      "characteristics": [
        "Deep program flow",
        "Memory management"
      ]
    },
    "category": "Functions",
    "tags": [
      "Async/Await Issue",
      "Promises"
    ],
    "primaryPattern": "Incorrect return",
    "code": "async function fetchData() {\n  const data = fetch('https://api.example.com/data');\n  const json = await data.json();\n  return json;\n}",
    "question": "What is wrong with this async function?",
    "options": [
      "fetchData is missing a return type",
      "fetch does not return a Promise",
      "Missing 'await' before the fetch call",
      "json() is not a function"
    ],
    "answer": "Missing 'await' before the fetch call",
    "explanation": "The code attempts to fetch and parse JSON data. The bug is missing 'await' on the fetch() call. 'fetch' immediately returns a Promise, not the Response object. Attempting to call .json() directly on the Promise throws an error. You must await the response first.",
    "affectedLine": 2,
    "expectedBehavior": "Awaits the Response object before calling .json().",
    "actualBehavior": "Calls .json() on a pending Promise, throwing an error.",
    "takeaway": "Always review the exact syntax and logic constraints of the language.",
    "incorrectExplanations": {}
  },
  {
    "id": "bh-js-008",
    "language": "JavaScript",
    "difficulty": "Easy",
    "difficultyMetadata": {
      "characteristics": [
        "Single obvious concept",
        "Basic reference equality"
      ]
    },
    "category": "Conditions",
    "tags": [
      "Equality"
    ],
    "primaryPattern": "Incorrect return",
    "code": "const arr1 = [1, 2, 3];\nconst arr2 = [1, 2, 3];\nconsole.log(arr1 == arr2);",
    "question": "What is the output of this equality check?",
    "options": [
      "true",
      "false",
      "TypeError",
      "undefined"
    ],
    "answer": "false",
    "explanation": "In JavaScript, arrays and objects are compared by reference, not by their internal values. Even though 'arr1' and 'arr2' contain the exact same elements, they point to different memory locations. Therefore, the equality check returns false.",
    "affectedLine": 3,


    "takeaway": "Always review the exact syntax and logic constraints of the language.",
    "incorrectExplanations": {}
  },
  {
    "id": "bh-js-009",
    "language": "JavaScript",
    "difficulty": "Easy",
    "difficultyMetadata": {
      "characteristics": [
        "Single obvious concept"
      ]
    },
    "category": "Objects",
    "tags": [
      "Null Handling"
    ],
    "primaryPattern": "Incorrect return",
    "code": "const user = null;\nif (user.isActive) {\n  console.log(\"Welcome back!\");\n}",
    "question": "What runtime error will occur here?",
    "options": [
      "SyntaxError: Invalid if condition",
      "ReferenceError: isActive is not defined",
      "TypeError: Cannot read properties of null",
      "No error, it gracefully skips the if block"
    ],
    "answer": "TypeError: Cannot read properties of null",
    "explanation": "Attempting to access a property on 'null' or 'undefined' throws a TypeError. The code assumes 'user' is an object. To fix this, you should use optional chaining (user?.isActive) or check if 'user' is truthy first.",
    "affectedLine": 2,
    "expectedBehavior": "Checks if the user object has an isActive property.",
    "actualBehavior": "Throws a TypeError when trying to access .isActive on null.",
    "takeaway": "Always review the exact syntax and logic constraints of the language.",
    "incorrectExplanations": {}
  },
  {
    "id": "bh-js-010",
    "language": "JavaScript",
    "difficulty": "Medium",
    "difficultyMetadata": {
      "characteristics": [
        "Deep program flow",
        "Language-specific behavior"
      ]
    },
    "category": "Arrays",
    "tags": [
      "Arrays",
      "Type Coercion"
    ],
    "primaryPattern": "Wrong index",
    "code": "const strings = [\"1\", \"7\", \"11\"];\nconst numbers = strings.map(parseInt);\nconsole.log(numbers);",
    "question": "What is the output of this mapping?",
    "options": [
      "[1, 7, 11]",
      "[1, NaN, 3]",
      "[1, 7, NaN]",
      "TypeError: parseInt is not a function"
    ],
    "answer": "[1, NaN, 3]",
    "explanation": "This is a notorious JS quirk. Array.map() passes three arguments to its callback: (currentValue, index, array). parseInt takes two arguments: (string, radix). So the calls are parseInt('1', 0), parseInt('7', 1), and parseInt('11', 2). This results in 1, NaN, and 3.",
    "affectedLine": 2,
    "takeaway": "Always review the exact syntax and logic constraints of the language.",
    "incorrectExplanations": {}
  },
  {
    "id": "bh-js-co-001",
    "language": "JavaScript",
    "difficulty": "Medium",
    "questionType": "code-output",
    "category": "Async",
    "code": "console.log(1);\nsetTimeout(() => console.log(2), 0);\nPromise.resolve().then(() => console.log(3));\nconsole.log(4);",
    "question": "What is the exact sequence of numbers logged to the console?",
    "options": [
      "1, 2, 3, 4",
      "1, 4, 3, 2",
      "1, 4, 2, 3",
      "1, 3, 4, 2"
    ],
    "answer": "1, 4, 3, 2",
    "explanation": "Synchronous code runs first (1, 4). Then microtasks like Promises (3) execute. Finally, macrotasks like setTimeout (2) execute.",
    "takeaway": "Understand the difference between the microtask queue and the macrotask queue in the JS event loop."
  },
  {
    "id": "bh-js-co-002",
    "language": "JavaScript",
    "difficulty": "Easy",
    "questionType": "code-output",
    "category": "Arrays",
    "tags": ["Arrays", "Mutation"],
    "code": "const arr1 = [1, 2, 3];\nconst arr2 = arr1;\narr2.push(4);\nconsole.log(arr1.length);",
    "question": "What does this code output?",
    "options": [
      "3",
      "4",
      "undefined",
      "Error"
    ],
    "answer": "4",
    "explanation": "Arrays in JavaScript are reference types. Both arr1 and arr2 point to the same array in memory, so mutating arr2 also mutates arr1.",
    "takeaway": "Assignment of objects and arrays copies the reference, not the underlying data."
  },
  {
    "id": "bh-js-bp-001",
    "language": "JavaScript",
    "difficulty": "Easy",
    "questionType": "behavior-prediction",
    "category": "Data Structures",
    "tags": ["Array Methods"],
    "code": "const numbers = [10, 5, 20, 1];\nnumbers.sort();\nconsole.log(numbers);",
    "question": "What happens when you run this code?",
    "options": [
      "It prints [1, 5, 10, 20]",
      "It prints [1, 10, 20, 5]",
      "It prints [20, 10, 5, 1]",
      "It throws an error because sort() requires a comparator function"
    ],
    "answer": "It prints [1, 10, 20, 5]",
    "explanation": "By default, the Array `sort()` method converts elements to strings and compares their UTF-16 code unit values. This results in '10' coming before '20', which comes before '5'.",
    "expectedBehavior": "The array should be sorted numerically: [1, 5, 10, 20]",
    "actualBehavior": "The array is sorted alphabetically: [1, 10, 20, 5]",
    "takeaway": "Always provide a comparator function (e.g., (a, b) => a - b) when sorting numbers in JavaScript."
  }
];

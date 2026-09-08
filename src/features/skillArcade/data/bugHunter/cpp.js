export const cppQuestions = [
  {
    "id": "bh-cpp-001",
    "language": "C++",
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
    "code": "#include <iostream>\nint main() {\n    std::cout << \"Hello World\"\n    return 0;\n}",
    "question": "What is wrong with this code?",
    "options": [
      "main() must return void",
      "Missing semicolon after the cout statement",
      "Missing using namespace std",
      "#include should have a semicolon"
    ],
    "answer": "Missing semicolon after the cout statement",
    "explanation": "The code attempts to print to stdout. The bug is a missing semicolon; C++ strictly requires semicolons to terminate statements. While 'using namespace std' is common, using explicit 'std::cout' is actually preferred practice.",
    "affectedLine": 3,
    "expectedBehavior": "Compiles and prints 'Hello World'.",
    "actualBehavior": "Fails to compile due to missing semicolon.",
    "takeaway": "Always review the exact syntax and logic constraints of the language.",
    "incorrectExplanations": {}
  },
  {
    "id": "bh-cpp-002",
    "language": "C++",
    "difficulty": "Medium",
    "difficultyMetadata": {
      "characteristics": [
        "Memory management",
        "Stack frames"
      ]
    },
    "category": "Scope",
    "tags": [
      "Memory Management",
      "Pointers"
    ],
    "primaryPattern": "Incorrect return",
    "code": "int* createArray() {\n    int arr[5] = {1, 2, 3, 4, 5};\n    return arr;\n}",
    "question": "Why is this function dangerous?",
    "options": [
      "Arrays cannot be returned in C++",
      "It returns a pointer to a local variable that goes out of scope",
      "Array must be dynamically sized",
      "Missing return type pointer asterisk"
    ],
    "answer": "It returns a pointer to a local variable that goes out of scope",
    "explanation": "The code attempts to build and return an array. The bug is that 'arr' is statically allocated on the stack. When the function exits, its stack frame is destroyed. The returned pointer now points to garbage memory (a dangling pointer). It must be dynamically allocated with 'new' or returned inside an object.",
    "affectedLine": 3,
    "expectedBehavior": "Returns an array pointer safely.",
    "actualBehavior": "Returns a dangling pointer to a destroyed stack frame.",
    "takeaway": "Always review the exact syntax and logic constraints of the language.",
    "incorrectExplanations": {}
  },
  {
    "id": "bh-cpp-003",
    "language": "C++",
    "difficulty": "Easy",
    "category": "Scope",
    "tags": [
      "Memory Management",
      "Pointers"
    ],
    "primaryPattern": "Incorrect return",
    "code": "int x = 10;\nint y = 20;\nint* ptr = &x;\n*ptr = y;",
    "question": "What is the value of x after this code runs?",
    "options": [
      "10",
      "20",
      "A memory address",
      "Undefined"
    ],
    "answer": "20",
    "explanation": "The code manipulates a pointer. 'ptr' holds the memory address of 'x'. The bug (or behavior) is that dereferencing the pointer '*ptr = y' writes the value of 'y' directly into the memory location of 'x'. The original value of 10 is overwritten, so 'x' becomes 20.",
    "affectedLine": 4,
    "expectedBehavior": "Ptr points to y.",
    "actualBehavior": "Writes y's value into x's memory location.",
    "takeaway": "Always review the exact syntax and logic constraints of the language.",
    "incorrectExplanations": {}
  },
  {
    "id": "bh-cpp-004",
    "language": "C++",
    "difficulty": "Medium",
    "difficultyMetadata": {
      "characteristics": [
        "Deep program flow",
        "Memory management"
      ]
    },
    "category": "Arrays",
    "tags": [
      "Memory Leak",
      "Pointers"
    ],
    "primaryPattern": "Incorrect return",
    "code": "char* str = new char[10];\nstrcpy(str, \"hello\");\ndelete str;",
    "question": "What is the issue with how memory is freed?",
    "options": [
      "delete should be delete[] for arrays",
      "Memory is automatically freed in C++",
      "delete requires a size parameter",
      "strcpy does not allocate memory"
    ],
    "answer": "delete should be delete[] for arrays",
    "explanation": "The code manages a dynamic C-string. The bug is using standard 'delete' on a memory block allocated with array syntax ('new char[10]'). This causes undefined behavior and memory leaks, as the compiler doesn't know to call destructors for the entire block. It must be paired with 'delete[]'.",
    "affectedLine": 3,
    "expectedBehavior": "Frees the entire char array.",
    "actualBehavior": "Frees only the first element, leaking memory.",
    "takeaway": "Always review the exact syntax and logic constraints of the language.",
    "incorrectExplanations": {}
  },
  {
    "id": "bh-cpp-005",
    "language": "C++",
    "difficulty": "Medium",
    "difficultyMetadata": {
      "characteristics": [
        "Reference vs Value",
        "Language-specific behavior"
      ]
    },
    "category": "Conditions",
    "tags": [
      "Logic Error"
    ],
    "primaryPattern": "Incorrect condition",
    "code": "void swap(int a, int b) {\n    int temp = a;\n    a = b;\n    b = temp;\n}",
    "question": "Why won't this function actually swap the variables provided by the caller?",
    "options": [
      "a and b are passed by value, meaning copies are modified, not the original variables",
      "temp must be a pointer",
      "The logic is incorrect",
      "It requires a return statement"
    ],
    "answer": "a and b are passed by value, meaning copies are modified, not the original variables",
    "explanation": "The code implements a classic swap algorithm. The bug is that C++ passes parameters by value by default. The function successfully swaps its local copies of 'a' and 'b', but the variables in the caller's scope remain untouched. You must pass by reference (int& a, int& b) to modify the caller's variables.",
    "affectedLine": 1,
    "expectedBehavior": "Swaps the caller's variables.",
    "actualBehavior": "Only swaps local copies; caller's variables are unchanged.",
    "takeaway": "Always review the exact syntax and logic constraints of the language.",
    "incorrectExplanations": {}
  },
  {
    "id": "bh-cpp-006",
    "language": "C++",
    "difficulty": "Medium",
    "category": "Arrays",
    "tags": [
      "Index Error"
    ],
    "primaryPattern": "Wrong index",
    "code": "int arr[3] = {1, 2, 3};\narr[3] = 4;",
    "question": "What is the consequence of this array assignment?",
    "options": [
      "The array is automatically resized to hold 4",
      "It throws an IndexOutOfBoundsException",
      "It causes Undefined Behavior by writing to unallocated memory",
      "A compiler error prevents it from running"
    ],
    "answer": "It causes Undefined Behavior by writing to unallocated memory",
    "explanation": "C-style arrays in C++ do not perform bounds checking. The valid indices for a 3-element array are 0, 1, and 2. Writing to index 3 writes to arbitrary memory past the end of the array, causing Undefined Behavior.",
    "affectedLine": 2,
    "expectedBehavior": "Adds a 4th element to the array.",
    "actualBehavior": "Writes past the array bounds, corrupting adjacent memory.",
    "takeaway": "Always review the exact syntax and logic constraints of the language.",
    "incorrectExplanations": {}
  },
  {
    "id": "bh-cpp-007",
    "language": "C++",
    "difficulty": "Hard",
    "difficultyMetadata": {
      "characteristics": [
        "Deep program flow",
        "Memory management"
      ]
    },
    "category": "Loops",
    "tags": [
      "Memory Management",
      "Pointers"
    ],
    "primaryPattern": "Incorrect return",
    "code": "std::vector<int> vec = {1, 2, 3};\nfor (auto it = vec.begin(); it != vec.end(); ++it) {\n    if (*it == 2) {\n        vec.erase(it);\n    }\n}",
    "question": "Why will this code likely crash?",
    "options": [
      "Vectors do not have an erase method",
      "Erasing an element invalidates the iterator, making the ++it operation dangerous",
      "Auto cannot be used for iterators",
      "Cannot dereference vector iterators"
    ],
    "answer": "Erasing an element invalidates the iterator, making the ++it operation dangerous",
    "explanation": "When you call erase() on a vector, all iterators at or after the point of erasure become invalidated. The loop then tries to increment the invalidated iterator (++it), leading to undefined behavior. The fix is to capture the return value of erase(): 'it = vec.erase(it);' and conditionally increment.",
    "affectedLine": 4,
    "expectedBehavior": "Removes the element '2' from the vector safely.",
    "actualBehavior": "Invalidates the iterator and causes undefined behavior upon incrementing.",
    "takeaway": "Always review the exact syntax and logic constraints of the language.",
    "incorrectExplanations": {}
  },

  {
    "id": "bh-cpp-008",
    "language": "C++",
    "difficulty": "Easy",
    "difficultyMetadata": {
      "characteristics": [
        "Language-specific behavior",
        "Execution Trace"
      ]
    },
    "category": "Loops",
    "questionType": "code-output",
    "tags": [
      "Increment"
    ],
    "primaryPattern": "Data transformation",
    "code": "int i = 0;\nwhile (i++ < 3) {\n    std::cout << i;\n}",
    "question": "What is the output of this loop?",
    "options": [
      "123",
      "012",
      "1234",
      "0123"
    ],
    "answer": "123",
    "explanation": "The post-increment operator (i++) evaluates to the current value of 'i', and then increments it. So on the first check, 0 < 3 is evaluated, but by the time the loop body executes and prints 'i', 'i' has already been incremented to 1.",
    "affectedLine": 2,
    "takeaway": "Post-increment increments the value after the entire condition expression is evaluated.",
    "incorrectExplanations": {}
  },
  {
    "id": "bh-cpp-009",
    "language": "C++",
    "difficulty": "Hard",
    "difficultyMetadata": {
      "characteristics": [
        "Memory location",
        "Stack frames"
      ]
    },
    "category": "Scope",
    "questionType": "behavior-prediction",
    "tags": [
      "Dangling Pointer"
    ],
    "primaryPattern": "Incorrect return",
    "code": "int* getNumber() {\n    int num = 42;\n    return &num;\n}\n\nint main() {\n    int* ptr = getNumber();\n    std::cout << *ptr;\n    return 0;\n}",
    "question": "What happens when this program runs?",
    "options": [
      "It reliably prints 42",
      "It causes Undefined Behavior (may print garbage, crash, or 42)",
      "It causes a compilation error because you cannot return pointers",
      "It prints the memory address of num"
    ],
    "answer": "It causes Undefined Behavior (may print garbage, crash, or 42)",
    "explanation": "'num' is allocated on the stack within 'getNumber()'. When the function returns, its stack frame is destroyed. Returning a pointer to 'num' results in a dangling pointer. Dereferencing it in 'main()' causes undefined behavior.",
    "expectedBehavior": "It reliably prints the number 42.",
    "actualBehavior": "It dereferences a dangling pointer, invoking undefined behavior.",
    "affectedLine": 3,
    "takeaway": "Never return pointers or references to local stack variables.",
    "incorrectExplanations": {}
  }
];

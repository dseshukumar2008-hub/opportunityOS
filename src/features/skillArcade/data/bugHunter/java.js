export const javaQuestions = [
  {
    "id": "bh-java-001",
    "language": "Java",
    "difficulty": "Easy",
    "difficultyMetadata": {
      "characteristics": [
        "Single obvious concept"
      ]
    },
    "category": "Error Handling",
    "tags": [
      "Static Context",
      "Methods"
    ],
    "primaryPattern": "Incorrect return",
    "code": "public class Main {\n    public void greet() {\n        System.out.println(\"Hello!\");\n    }\n    public static void main(String[] args) {\n        greet();\n    }\n}",
    "question": "What is the compiler error here?",
    "options": [
      "Non-static method greet() cannot be referenced from a static context",
      "Missing return statement in greet()",
      "System.out is invalid in static methods",
      "greet() requires String[] args"
    ],
    "answer": "Non-static method greet() cannot be referenced from a static context",
    "explanation": "The 'main' method in Java is static, meaning it belongs to the class itself rather than an instance. The 'greet' method is an instance method. You cannot call an instance method directly from a static context without first creating an instance of the class (e.g., 'new Main().greet()').",
    "affectedLine": 6,
    "expectedBehavior": "Compiles and prints 'Hello!'.",
    "actualBehavior": "Fails to compile due to calling a non-static method from a static context.",
    "takeaway": "Always review the exact syntax and logic constraints of the language.",
    "incorrectExplanations": {}
  },
  {
    "id": "bh-java-002",
    "language": "Java",
    "difficulty": "Medium",
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
    "code": "String a = new String(\"test\");\nString b = new String(\"test\");\nif (a == b) {\n    System.out.println(\"Equal\");\n}",
    "question": "Why will this condition evaluate to false?",
    "options": [
      "Strings cannot contain the word 'test'",
      "The == operator compares object references (memory addresses), not string contents",
      "String 'a' is automatically capitalized",
      "You cannot compare Strings in Java"
    ],
    "answer": "The == operator compares object references (memory addresses), not string contents",
    "explanation": "The code checks if two strings match. The bug is using '==' which, in Java, compares memory addresses, not the actual characters. Because 'new String()' forces the creation of two distinct objects in the heap, they don't match. Always use a.equals(b) to compare string content.",
    "affectedLine": 3,
    "expectedBehavior": "Prints 'Equal'.",
    "actualBehavior": "Fails the condition because '==' compares references.",
    "takeaway": "Always review the exact syntax and logic constraints of the language.",
    "incorrectExplanations": {}
  },
  {
    "id": "bh-java-003",
    "language": "Java",
    "difficulty": "Easy",
    "difficultyMetadata": {
      "characteristics": [
        "Single obvious concept",
        "Basic bounds checking"
      ]
    },
    "category": "Loops",
    "tags": [
      "Index Error"
    ],
    "primaryPattern": "Wrong index",
    "code": "int[] numbers = {1, 2, 3};\nfor (int i = 0; i <= numbers.length; i++) {\n    System.out.println(numbers[i]);\n}",
    "question": "What runtime exception will this loop throw?",
    "options": [
      "NullPointerException",
      "ArithmeticException",
      "ArrayIndexOutOfBoundsException",
      "IllegalArgumentException"
    ],
    "answer": "ArrayIndexOutOfBoundsException",
    "explanation": "The code tries to print every array element. The bug is an off-by-one condition: 'i <= length'. For an array of length 3, the indices are 0, 1, and 2. On the final iteration, 'i' equals 3, and numbers[3] is an out-of-bounds memory access, throwing the exception.",
    "affectedLine": 2,
    "expectedBehavior": "Loops over 0, 1, 2.",
    "actualBehavior": "Throws ArrayIndexOutOfBoundsException on i=3.",
    "takeaway": "Always review the exact syntax and logic constraints of the language.",
    "incorrectExplanations": {}
  },
  {
    "id": "bh-java-004",
    "language": "Java",
    "difficulty": "Hard",
    "difficultyMetadata": {
      "characteristics": [
        "Deep program flow",
        "Memory management"
      ]
    },
    "category": "Data Structures",
    "tags": [
      "Concurrency Error",
      "Iterators"
    ],
    "primaryPattern": "Incorrect return",
    "code": "List<Integer> list = new ArrayList<>(Arrays.asList(1, 2, 3));\nfor (Integer num : list) {\n    if (num == 2) {\n        list.remove(num);\n    }\n}",
    "question": "What happens when executing this code?",
    "options": [
      "The list becomes [1, 3]",
      "ConcurrentModificationException is thrown",
      "The loop skips the last element",
      "TypeMismatchException is thrown"
    ],
    "answer": "ConcurrentModificationException is thrown",
    "explanation": "The code tries to filter out the number 2. The bug is structurally altering a collection (removing an item) while actively iterating through it using an enhanced for-loop. Java iterators are 'fail-fast' and will immediately throw a ConcurrentModificationException. Use an explicit Iterator or removeIf() instead.",
    "affectedLine": 4,
    "expectedBehavior": "Removes '2' from the list.",
    "actualBehavior": "Throws ConcurrentModificationException.",
    "takeaway": "Always review the exact syntax and logic constraints of the language.",
    "incorrectExplanations": {}
  },
  {
    "id": "bh-java-005",
    "language": "Java",
    "difficulty": "Medium",
    "difficultyMetadata": {
      "characteristics": [
        "Multiple lines of reasoning",
        "Language-specific behavior"
      ]
    },
    "category": "Objects",
    "tags": [
      "Null Handling"
    ],
    "primaryPattern": "Incorrect return",
    "code": "String name = null;\nif (name.equals(\"Alice\")) {\n    System.out.println(\"Hello Alice!\");\n}",
    "question": "What runtime exception will occur?",
    "options": [
      "IllegalArgumentException",
      "NullPointerException",
      "ClassCastException",
      "No exception, evaluates to false"
    ],
    "answer": "NullPointerException",
    "explanation": "Calling any instance method (like .equals()) on a null reference throws a NullPointerException. To avoid this, call .equals() on the known non-null literal instead: '\"Alice\".equals(name)'.",
    "affectedLine": 2,
    "expectedBehavior": "Evaluates to false safely.",
    "actualBehavior": "Throws NullPointerException because 'name' is null.",
    "takeaway": "Always review the exact syntax and logic constraints of the language.",
    "incorrectExplanations": {}
  },
  {
    "id": "bh-java-006",
    "language": "Java",
    "difficulty": "Medium",
    "difficultyMetadata": {
      "characteristics": [
        "Multiple lines of reasoning",
        "Variable shadowing"
      ]
    },
    "category": "Scope",
    "tags": [
      "Scope Issue",
      "Closures"
    ],
    "primaryPattern": "Scope issue",
    "code": "public class User {\n    private String name;\n    public User(String name) {\n        name = name;\n    }\n}",
    "question": "What is the flaw in this constructor?",
    "options": [
      "The class lacks a return type",
      "Constructors cannot take arguments",
      "The parameter 'name' shadows the field, leaving the field uninitialized",
      "String cannot be used as a parameter name"
    ],
    "answer": "The parameter 'name' shadows the field, leaving the field uninitialized",
    "explanation": "Because the parameter name ('name') is identical to the class field, 'name = name;' simply assigns the parameter to itself. The class field remains null. To fix this, use the 'this' keyword: 'this.name = name;'.",
    "affectedLine": 4,
    "expectedBehavior": "Initializes the class field 'name'.",
    "actualBehavior": "Assigns the parameter to itself, leaving the field null.",
    "takeaway": "Always review the exact syntax and logic constraints of the language.",
    "incorrectExplanations": {}
  },
  {
    "id": "bh-java-007",
    "language": "Java",
    "difficulty": "Medium",
    "difficultyMetadata": {
      "characteristics": [
        "Language-specific behavior",
        "Memory location"
      ]
    },
    "category": "Functions",
    "tags": [
      "Equality",
      "Caching"
    ],
    "primaryPattern": "Incorrect return",
    "code": "Integer a = 128;\nInteger b = 128;\nif (a == b) {\n    System.out.println(\"Match\");\n} else {\n    System.out.println(\"No Match\");\n}",
    "question": "What is the output of this code?",
    "options": [
      "Match",
      "No Match",
      "Compiler Error",
      "NullPointerException"
    ],
    "answer": "No Match",
    "explanation": "This highlights Java's Integer cache pool. Java automatically caches Integer objects for values between -128 and 127. Since 128 is outside this range, 'a' and 'b' refer to two entirely different objects in the heap. The '==' operator compares object references, so it evaluates to false. You should use .equals().",
    "affectedLine": 3,
    "takeaway": "Always review the exact syntax and logic constraints of the language.",
    "incorrectExplanations": {}
  },
  {
    "id": "bh-java-008",
    "language": "Java",
    "difficulty": "Easy",
    "difficultyMetadata": {
      "characteristics": [
        "Language-specific behavior",
        "Execution Trace"
      ]
    },
    "category": "Objects",
    "questionType": "code-output",
    "tags": [
      "Strings",
      "Immutability"
    ],
    "primaryPattern": "Data transformation",
    "code": "String text = \"Hello\";\ntext.concat(\" World\");\nSystem.out.println(text);",
    "question": "What is the output of this code?",
    "options": [
      "Hello World",
      "Hello",
      "Compiler Error",
      "World"
    ],
    "answer": "Hello",
    "explanation": "Strings in Java are immutable. Calling `concat()` on a String does not modify the original String object; it creates and returns a completely new String object. Because the return value is not assigned back to `text`, the original string remains 'Hello'.",
    "affectedLine": 2,
    "takeaway": "Always reassign the result when working with immutable objects like Strings in Java.",
    "incorrectExplanations": {}
  },
  {
    "id": "bh-java-009",
    "language": "Java",
    "difficulty": "Medium",
    "difficultyMetadata": {
      "characteristics": [
        "Execution Trace",
        "Memory location"
      ]
    },
    "category": "Conditions",
    "questionType": "behavior-prediction",
    "tags": [
      "Equality",
      "References"
    ],
    "primaryPattern": "Incorrect condition",
    "code": "String s1 = new String(\"Hello\");\nString s2 = new String(\"Hello\");\nif (s1 == s2) {\n    System.out.print(\"True\");\n} else {\n    System.out.print(\"False\");\n}",
    "question": "What will this code output when run?",
    "options": [
      "True",
      "False",
      "Compiler Error",
      "Runtime Error"
    ],
    "answer": "False",
    "explanation": "'s1' and 's2' are created using the 'new' keyword, forcing Java to allocate two distinct objects in heap memory. The '==' operator checks reference equality, not content equality. Since they point to different memory addresses, it prints False.",
    "affectedLine": 3,
    "takeaway": "Use .equals() for string content comparison.",
    "incorrectExplanations": {}
  }
];

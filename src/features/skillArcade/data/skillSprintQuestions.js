// Large question bank for Skill Sprint
export const skillSprintQuestions = [
  // Web Development
  { id: 1, category: "Web Dev", difficulty: "Easy", question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "Hyperlinks and Text Markup Language", "Home Tool Markup Language", "Hyper Tool Markup Language"], answer: "Hyper Text Markup Language" },
  { id: 2, category: "Web Dev", difficulty: "Easy", question: "Which of the following is a CSS framework?", options: ["React", "Angular", "Tailwind", "Vue"], answer: "Tailwind" },
  { id: 3, category: "Web Dev", difficulty: "Medium", question: "Which HTTP method is used to update existing data?", options: ["GET", "POST", "PUT", "DELETE"], answer: "PUT" },
  { id: 4, category: "Web Dev", difficulty: "Medium", question: "What does API stand for?", options: ["Application Programming Interface", "Advanced Program Integration", "Application Process Integration", "Automated Programming Interface"], answer: "Application Programming Interface" },
  { id: 5, category: "Web Dev", difficulty: "Easy", question: "What does CSS stand for?", options: ["Cascading Style Sheets", "Computer Style Sheets", "Creative Style System", "Colorful Style Sheets"], answer: "Cascading Style Sheets" },
  { id: 6, category: "Web Dev", difficulty: "Medium", question: "Which HTML5 element is used to specify a footer for a document?", options: ["<bottom>", "<footer>", "<section>", "<nav>"], answer: "<footer>" },
  { id: 7, category: "Web Dev", difficulty: "Hard", question: "What is CORS?", options: ["Cross-Origin Resource Sharing", "Central Object Rendering System", "Cross-Object Routing Service", "Cascading Origin Resource System"], answer: "Cross-Origin Resource Sharing" },
  { id: 8, category: "Web Dev", difficulty: "Medium", question: "In CSS, which property is used to change the background color?", options: ["color", "bgcolor", "background-color", "bg-color"], answer: "background-color" },
  { id: 9, category: "Web Dev", difficulty: "Hard", question: "What is a Service Worker in web development?", options: ["A script that runs in the background for caching and offline features", "A server-side script", "An employee managing web services", "A CSS library"], answer: "A script that runs in the background for caching and offline features" },
  { id: 10, category: "Web Dev", difficulty: "Medium", question: "What does DOM stand for?", options: ["Document Object Model", "Data Object Model", "Dynamic Object Model", "Document Oriented Model"], answer: "Document Object Model" },

  // JavaScript
  { id: 11, category: "JavaScript", difficulty: "Medium", question: "In JavaScript, '===' is used for:", options: ["Assignment", "Loose equality comparison", "Strict equality comparison", "Logical AND"], answer: "Strict equality comparison" },
  { id: 12, category: "JavaScript", difficulty: "Medium", question: "What is a 'Promise' in JavaScript?", options: ["An object representing the eventual completion or failure of an async operation", "A synchronous loop", "A strictly typed variable", "A database query"], answer: "An object representing the eventual completion or failure of an async operation" },
  { id: 13, category: "JavaScript", difficulty: "Easy", question: "Which method adds an element to the end of an array in JS?", options: ["push()", "pop()", "shift()", "unshift()"], answer: "push()" },
  { id: 14, category: "JavaScript", difficulty: "Easy", question: "How do you declare a variable that cannot be reassigned in modern JavaScript?", options: ["let", "var", "const", "static"], answer: "const" },
  { id: 15, category: "JavaScript", difficulty: "Hard", question: "What is a closure in JavaScript?", options: ["A function bundled together with its lexical environment", "A closed browser window", "A private class method", "The end of an array"], answer: "A function bundled together with its lexical environment" },
  { id: 16, category: "JavaScript", difficulty: "Medium", question: "Which function is used to parse a JSON string into a JavaScript object?", options: ["JSON.parse()", "JSON.stringify()", "JSON.object()", "JSON.toObject()"], answer: "JSON.parse()" },
  { id: 17, category: "JavaScript", difficulty: "Medium", question: "What keyword is used to handle exceptions in JavaScript?", options: ["catch", "error", "throw", "handle"], answer: "catch" },
  { id: 18, category: "JavaScript", difficulty: "Hard", question: "Which method creates a new array populated with the results of calling a provided function on every element?", options: ["map()", "filter()", "reduce()", "forEach()"], answer: "map()" },
  { id: 19, category: "JavaScript", difficulty: "Easy", question: "How do you write a single-line comment in JavaScript?", options: ["<!-- comment -->", "// comment", "/* comment */", "# comment"], answer: "// comment" },
  { id: 20, category: "JavaScript", difficulty: "Hard", question: "What does 'this' refer to in an arrow function?", options: ["The global object", "The element that fired the event", "The lexical scope where the function was defined", "Undefined"], answer: "The lexical scope where the function was defined" },

  // React
  { id: 21, category: "React", difficulty: "Medium", question: "Which of these is NOT a standard React hook?", options: ["useState", "useEffect", "useFetch", "useContext"], answer: "useFetch" },
  { id: 22, category: "React", difficulty: "Easy", question: "What is JSX?", options: ["A syntax extension for JavaScript", "A new programming language", "A CSS framework", "A database query language"], answer: "A syntax extension for JavaScript" },
  { id: 23, category: "React", difficulty: "Medium", question: "In React, how do you pass data from a parent component to a child component?", options: ["Through state", "Through context", "Through props", "Through Redux"], answer: "Through props" },
  { id: 24, category: "React", difficulty: "Hard", question: "What is the Virtual DOM?", options: ["A lightweight JavaScript representation of the actual DOM", "A virtual reality environment", "A browser extension", "A 3D rendering engine"], answer: "A lightweight JavaScript representation of the actual DOM" },
  { id: 25, category: "React", difficulty: "Medium", question: "Which hook is used to perform side effects in functional components?", options: ["useMemo", "useRef", "useEffect", "useReducer"], answer: "useEffect" },
  
  // Software Engineering & DevOps
  { id: 26, category: "Software Engineering", difficulty: "Medium", question: "What is the primary function of a reverse proxy?", options: ["To encrypt database passwords", "To distribute client requests to backend servers", "To write frontend code", "To compile CSS"], answer: "To distribute client requests to backend servers" },
  { id: 27, category: "Software Engineering", difficulty: "Medium", question: "What does 'DRY' stand for in software engineering?", options: ["Do Repeat Yourself", "Don't Repeat Yourself", "Data Record Yield", "Distributed Routing Yield"], answer: "Don't Repeat Yourself" },
  { id: 28, category: "Software Engineering", difficulty: "Easy", question: "Which command is used to commit changes in Git?", options: ["git push", "git commit", "git save", "git add"], answer: "git commit" },
  { id: 29, category: "Software Engineering", difficulty: "Medium", question: "What is the main purpose of Docker?", options: ["To style web pages", "To containerize applications", "To manage project dependencies", "To edit code"], answer: "To containerize applications" },
  { id: 30, category: "Software Engineering", difficulty: "Hard", question: "What is Continuous Integration (CI)?", options: ["Merging all developer working copies to a shared mainline several times a day", "A type of UI design", "Writing continuous loops", "Deploying without testing"], answer: "Merging all developer working copies to a shared mainline several times a day" },
  { id: 31, category: "Software Engineering", difficulty: "Medium", question: "What does 'SOLID' stand for in object-oriented programming?", options: ["Five design principles for maintainable code", "A database management system", "A programming language paradigm", "A type of memory architecture"], answer: "Five design principles for maintainable code" },
  { id: 32, category: "Software Engineering", difficulty: "Hard", question: "In Git, what is a 'rebase'?", options: ["Rewriting the commit history by moving a branch to a new base commit", "Deleting a branch", "Merging two repositories", "Cloning a remote repository"], answer: "Rewriting the commit history by moving a branch to a new base commit" },

  // Databases
  { id: 33, category: "Databases", difficulty: "Easy", question: "What does SQL stand for?", options: ["Structured Query Language", "Strong Question Language", "Structured Query List", "Simple Query Language"], answer: "Structured Query Language" },
  { id: 34, category: "Databases", difficulty: "Medium", question: "Which of the following is a NoSQL database?", options: ["PostgreSQL", "MySQL", "MongoDB", "SQLite"], answer: "MongoDB" },
  { id: 35, category: "Databases", difficulty: "Hard", question: "What is the ACID property in databases?", options: ["Atomicity, Consistency, Isolation, Durability", "Accuracy, Control, Integrity, Data", "Automated, Computed, Indexed, Driven", "Array, Class, Interface, Delegation"], answer: "Atomicity, Consistency, Isolation, Durability" },
  { id: 36, category: "Databases", difficulty: "Medium", question: "What is a primary key?", options: ["A unique identifier for a database record", "A master password", "The first column in a table", "A foreign key constraint"], answer: "A unique identifier for a database record" },
  { id: 37, category: "Databases", difficulty: "Hard", question: "Which SQL clause is used to filter records?", options: ["ORDER BY", "GROUP BY", "WHERE", "SELECT"], answer: "WHERE" },

  // Computer Science & Algorithms
  { id: 38, category: "Computer Science", difficulty: "Medium", question: "What is the time complexity of binary search?", options: ["O(1)", "O(n)", "O(n log n)", "O(log n)"], answer: "O(log n)" },
  { id: 39, category: "Computer Science", difficulty: "Hard", question: "Which data structure uses LIFO (Last In, First Out)?", options: ["Queue", "Stack", "Tree", "Graph"], answer: "Stack" },
  { id: 40, category: "Computer Science", difficulty: "Medium", question: "What is Big O notation used for?", options: ["Describing algorithm performance and complexity", "Formatting code", "Naming variables", "Object-oriented programming"], answer: "Describing algorithm performance and complexity" },
  { id: 41, category: "Computer Science", difficulty: "Hard", question: "Which sorting algorithm has a worst-case time complexity of O(n^2)?", options: ["Merge Sort", "Heap Sort", "Bubble Sort", "Radix Sort"], answer: "Bubble Sort" },
  { id: 42, category: "Computer Science", difficulty: "Medium", question: "What is a Hash Table?", options: ["A data structure that implements an associative array abstract data type", "A type of relational database", "A CSS layout grid", "A hardware component"], answer: "A data structure that implements an associative array abstract data type" },

  // General Tech / Miscellaneous
  { id: 43, category: "General Tech", difficulty: "Medium", question: "What is the default port for HTTP?", options: ["443", "80", "22", "21"], answer: "80" },
  { id: 44, category: "General Tech", difficulty: "Easy", question: "Which company developed the TypeScript language?", options: ["Google", "Facebook", "Microsoft", "Apple"], answer: "Microsoft" },
  { id: 45, category: "General Tech", difficulty: "Medium", question: "What is JSON?", options: ["JavaScript Object Notation", "Java Syntax Output Network", "JavaScript Output Node", "Java Standard Object Naming"], answer: "JavaScript Object Notation" },
  { id: 46, category: "General Tech", difficulty: "Hard", question: "In networking, what does the 'IP' in IP address stand for?", options: ["Internet Provider", "Internal Process", "Internet Protocol", "Internal Protocol"], answer: "Internet Protocol" },
  { id: 47, category: "General Tech", difficulty: "Medium", question: "Which Linux command is used to list directory contents?", options: ["cd", "pwd", "ls", "rm"], answer: "ls" },
  { id: 48, category: "General Tech", difficulty: "Medium", question: "What does 'SaaS' stand for?", options: ["Software as a Service", "System as a Server", "Storage and Security", "Security as a System"], answer: "Software as a Service" },
  { id: 49, category: "General Tech", difficulty: "Hard", question: "What is a race condition?", options: ["When a system attempts to perform multiple operations at the same time and the sequence matters", "A type of loop", "A network routing protocol", "When the CPU overheats"], answer: "When a system attempts to perform multiple operations at the same time and the sequence matters" },
  { id: 50, category: "General Tech", difficulty: "Medium", question: "Which protocol is used to secure communication over a computer network?", options: ["HTTP", "FTP", "HTTPS", "SMTP"], answer: "HTTPS" }
];

// In-memory cache to prevent repeating questions
let usedQuestionIds = new Set();

export const getRandomSprintQuestions = (count = 15) => {
  let availableQuestions = skillSprintQuestions.filter(q => !usedQuestionIds.has(q.id));
  
  if (availableQuestions.length < count) {
    availableQuestions = [...skillSprintQuestions];
    usedQuestionIds.clear();
  }

  // Shuffle using Fisher-Yates
  const shuffled = [...availableQuestions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  const selectedQuestions = shuffled.slice(0, count);
  
  // Shuffle the options within each question
  const finalizedQuestions = selectedQuestions.map(q => {
    const shuffledOptions = [...q.options];
    for (let i = shuffledOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
    }
    return { ...q, options: shuffledOptions };
  });

  // Accumulate their IDs for the next sessions
  finalizedQuestions.forEach(q => usedQuestionIds.add(q.id));
  
  return finalizedQuestions;
};

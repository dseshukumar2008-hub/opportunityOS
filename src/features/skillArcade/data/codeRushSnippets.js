// Large code snippet bank for Code Rush
export const codeRushSnippets = [
  // JavaScript Basics
  { id: 'js_1', code: "const sum = (a, b) => a + b;\nconsole.log(sum(5, 10));" },
  { id: 'js_2', code: "function isEven(num) {\n  return num % 2 === 0;\n}" },
  { id: 'js_3', code: "const user = {\n  name: 'Alice',\n  role: 'Developer',\n  skills: ['JS', 'React']\n};" },
  { id: 'js_4', code: "const numbers = [1, 2, 3, 4];\nconst doubled = numbers.map(n => n * 2);" },
  { id: 'js_5', code: "setTimeout(() => {\n  console.log('Timer done!');\n}, 1000);" },
  { id: 'js_6', code: "try {\n  const data = JSON.parse(str);\n} catch (e) {\n  console.error(e);\n}" },

  // React & JSX
  { id: 'react_1', code: "import React, { useState } from 'react';\n\nexport default function App() {\n  const [count, setCount] = useState(0);\n}" },
  { id: 'react_2', code: "useEffect(() => {\n  document.title = `Clicked ${count} times`;\n}, [count]);" },
  { id: 'react_3', code: "const items = list.map(item => (\n  <li key={item.id}>{item.name}</li>\n));" },
  { id: 'react_4', code: "<Button onClick={() => alert('Hello!')}>\n  Click Me\n</Button>" },

  // HTML & DOM
  { id: 'dom_1', code: "document.getElementById('btn').addEventListener('click', () => {\n  alert('Clicked!');\n});" },
  { id: 'dom_2', code: "<div class=\"container\">\n  <header>Welcome</header>\n  <main>Content goes here</main>\n</div>" },
  { id: 'dom_3', code: "const el = document.createElement('div');\nel.textContent = 'Hello World';\ndocument.body.appendChild(el);" },

  // CSS
  { id: 'css_1', code: "body {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n}" },
  { id: 'css_2', code: ".grid-container {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 20px;\n}" },
  { id: 'css_3', code: "button:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 8px rgba(0,0,0,0.1);\n}" },

  // Python
  { id: 'py_1', code: "def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)" },
  { id: 'py_2', code: "class User:\n    def __init__(self, name):\n        self.name = name\n\n    def greet(self):\n        print(f'Hi, {self.name}')" },
  { id: 'py_3', code: "with open('data.json', 'r') as file:\n    data = json.load(file)" },

  // SQL
  { id: 'sql_1', code: "SELECT id, name, email\nFROM users\nWHERE active = true\nORDER BY created_at DESC;" },
  { id: 'sql_2', code: "INSERT INTO products (name, price)\nVALUES ('Laptop', 999.99);" },
  { id: 'sql_3', code: "UPDATE employees\nSET salary = salary * 1.1\nWHERE department = 'Engineering';" },

  // Java
  { id: 'java_1', code: "public class Main {\n  public static void main(String[] args) {\n    System.out.println(\"Hello World!\");\n  }\n}" },
  { id: 'java_2', code: "List<String> names = new ArrayList<>();\nnames.add(\"Alice\");\nnames.add(\"Bob\");" },

  // Node.js / Express
  { id: 'node_1', code: "app.get('/api/users', async (req, res) => {\n  const users = await User.find();\n  res.json(users);\n});" },
  { id: 'node_2', code: "const fs = require('fs');\nconst data = fs.readFileSync('input.txt', 'utf8');" },

  // Git
  { id: 'git_1', code: "git checkout -b feature/new-login\ngit commit -m \"Add login form\"\ngit push origin HEAD" },
  { id: 'git_2', code: "git rebase -i HEAD~3\n# Squash commits and rewrite history" },

  // JSON
  { id: 'json_1', code: "{\n  \"compilerOptions\": {\n    \"target\": \"es2022\",\n    \"module\": \"commonjs\",\n    \"strict\": true\n  }\n}" },
  { id: 'json_2', code: "{\n  \"name\": \"opportunity-os\",\n  \"version\": \"1.0.0\",\n  \"private\": true\n}" }
];

// In-memory cache to prevent back-to-back repeats
let usedSnippetIds = new Set();

export const getRandomSnippet = () => {
  let available = codeRushSnippets.filter(s => !usedSnippetIds.has(s.id));
  
  if (available.length === 0) {
    available = [...codeRushSnippets];
    usedSnippetIds.clear();
  }
  
  const selected = available[Math.floor(Math.random() * available.length)];
  usedSnippetIds.add(selected.id);
  
  return selected.code;
};

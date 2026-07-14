export const ROADMAP_TEMPLATES = {
  'frontend developer': {
    header: { careerTitle: 'Frontend Developer', estimatedDuration: '6-9 Months', nextMilestone: 'Master HTML/CSS & JS basics', overallRank: 'Beginner' },
    phases: [
      {
        id: 'phase_1', title: 'Web Fundamentals', description: 'Master the core building blocks of the web.', overview: 'Learn HTML, CSS, and basic JavaScript. Understand DOM manipulation.',
        tasks: [
          { id: 'p1_t1', title: 'Learn semantic HTML5', completed: false, status: 'Not Started' },
          { id: 'p1_t2', title: 'Master CSS Flexbox and Grid', completed: false, status: 'Not Started' },
          { id: 'p1_t3', title: 'Learn JavaScript ES6+ basics', completed: false, status: 'Not Started' },
          { id: 'p1_t4', title: 'Understand DOM manipulation', completed: false, status: 'Not Started' },
          { id: 'p1_t5', title: 'Learn basic Git & GitHub', completed: false, status: 'Not Started' }
        ],
        skills: ['HTML', 'CSS', 'JavaScript', 'Git'],
        projects: [{ title: 'Personal Portfolio Website', difficulty: 'Beginner', description: 'A responsive portfolio built with HTML and CSS.' }],
        resources: [{ title: 'MDN Web Docs', type: 'Documentation', provider: 'Mozilla', url: 'https://developer.mozilla.org/', rating: '4.9' }],
        certifications: ['freeCodeCamp Responsive Web Design'], milestones: ['Deploy first static website']
      },
      {
        id: 'phase_2', title: 'Frontend Frameworks', description: 'Learn a modern component-based framework.', overview: 'Focus on React.js or Vue.js, component architecture, and state management.',
        tasks: [
          { id: 'p2_t1', title: 'Learn React fundamentals', completed: false, status: 'Not Started' },
          { id: 'p2_t2', title: 'Master React Hooks', completed: false, status: 'Not Started' },
          { id: 'p2_t3', title: 'Learn React Router', completed: false, status: 'Not Started' },
          { id: 'p2_t4', title: 'Learn Tailwind CSS', completed: false, status: 'Not Started' },
          { id: 'p2_t5', title: 'Understand REST API integration', completed: false, status: 'Not Started' }
        ],
        skills: ['React', 'Tailwind CSS', 'API Integration'],
        projects: [{ title: 'Movie Search App', difficulty: 'Intermediate', description: 'React app fetching data from OMDB API.' }],
        resources: [{ title: 'React Documentation', type: 'Docs', provider: 'Meta', url: 'https://react.dev/', rating: '4.9' }],
        certifications: [], milestones: ['Build first React App']
      },
      {
        id: 'phase_3', title: 'Advanced State & Architecture', description: 'Manage complex frontend state.', overview: 'Learn Redux or Zustand, Next.js for SSR, and performance optimization.',
        tasks: [
          { id: 'p3_t1', title: 'Learn Redux Toolkit / Zustand', completed: false, status: 'Not Started' },
          { id: 'p3_t2', title: 'Learn Next.js basics (App Router)', completed: false, status: 'Not Started' },
          { id: 'p3_t3', title: 'Implement TypeScript in React', completed: false, status: 'Not Started' },
          { id: 'p3_t4', title: 'Learn web performance optimization', completed: false, status: 'Not Started' },
          { id: 'p3_t5', title: 'Write basic unit tests (Jest/Vitest)', completed: false, status: 'Not Started' }
        ],
        skills: ['Next.js', 'TypeScript', 'Redux', 'Testing'],
        projects: [{ title: 'E-commerce Dashboard', difficulty: 'Advanced', description: 'Dashboard using Next.js, TS, and Redux.' }],
        resources: [{ title: 'Next.js Docs', type: 'Docs', provider: 'Vercel', url: 'https://nextjs.org/docs', rating: '4.8' }],
        certifications: [], milestones: ['Deploy Next.js application']
      },
      {
        id: 'phase_4', title: 'Industry Readiness', description: 'Learn professional workflows.', overview: 'Focus on CI/CD, accessibility, and clean code practices.',
        tasks: [
          { id: 'p4_t1', title: 'Learn web accessibility (a11y)', completed: false, status: 'Not Started' },
          { id: 'p4_t2', title: 'Set up GitHub Actions for CI/CD', completed: false, status: 'Not Started' },
          { id: 'p4_t3', title: 'Learn clean code principles', completed: false, status: 'Not Started' },
          { id: 'p4_t4', title: 'Understand JWT and frontend Auth', completed: false, status: 'Not Started' },
          { id: 'p4_t5', title: 'Learn to use component libraries', completed: false, status: 'Not Started' }
        ],
        skills: ['CI/CD', 'Accessibility', 'Auth'],
        projects: [], resources: [], certifications: [], milestones: ['Configure a full CI/CD pipeline']
      },
      {
        id: 'phase_5', title: 'Placement & Career Launch', description: 'Prepare for frontend interviews.', overview: 'Build a standout resume, optimize LinkedIn, and practice frontend system design.',
        tasks: [
          { id: 'p5_t1', title: 'Optimize resume for ATS', completed: false, status: 'Not Started' },
          { id: 'p5_t2', title: 'Practice JS algorithmic rounds', completed: false, status: 'Not Started' },
          { id: 'p5_t3', title: 'Practice React machine coding', completed: false, status: 'Not Started' },
          { id: 'p5_t4', title: 'Learn basic Frontend System Design', completed: false, status: 'Not Started' },
          { id: 'p5_t5', title: 'Apply to 50 targeted roles', completed: false, status: 'Not Started' }
        ],
        skills: ['Interview Prep', 'Resume Building'],
        projects: [], resources: [], certifications: [], milestones: ['Start actively interviewing']
      }
    ],
    sidebar: { currentFocus: { title: 'HTML & CSS Basics', description: 'Start your journey by mastering the structural components of the web.' }, recommendedResource: { title: "MDN Web Docs", platform: "Mozilla", rating: "4.9 (10k)" } },
    qualityScores: { accuracy: 95, relevance: 95, personalization: 90, consistency: 95 }
  },
  'backend developer': {
    header: { careerTitle: 'Backend Developer', estimatedDuration: '6-9 Months', nextMilestone: 'Master Server-side Language', overallRank: 'Beginner' },
    phases: [
      {
        id: 'phase_1', title: 'Backend Fundamentals', description: 'Learn server-side programming and APIs.', overview: 'Master Node.js, Python, or Java. Understand HTTP, REST, and JSON.',
        tasks: [
          { id: 'p1_t1', title: 'Master a backend language (Node/Python)', completed: false, status: 'Not Started' },
          { id: 'p1_t2', title: 'Understand HTTP Methods & Status Codes', completed: false, status: 'Not Started' },
          { id: 'p1_t3', title: 'Build a basic RESTful API', completed: false, status: 'Not Started' },
          { id: 'p1_t4', title: 'Learn basic Git & terminal commands', completed: false, status: 'Not Started' },
          { id: 'p1_t5', title: 'Understand Postman for API testing', completed: false, status: 'Not Started' }
        ],
        skills: ['Node.js/Python', 'REST APIs', 'HTTP', 'Git'],
        projects: [{ title: 'Simple Task Manager API', difficulty: 'Beginner', description: 'A basic REST API for managing tasks.' }],
        resources: [], certifications: [], milestones: ['Deploy a basic REST API']
      },
      {
        id: 'phase_2', title: 'Databases & ORMs', description: 'Learn how to store and manage data securely.', overview: 'Master SQL (PostgreSQL/MySQL) and NoSQL (MongoDB). Learn ORMs like Prisma or Mongoose.',
        tasks: [
          { id: 'p2_t1', title: 'Learn SQL fundamentals', completed: false, status: 'Not Started' },
          { id: 'p2_t2', title: 'Design a relational database schema', completed: false, status: 'Not Started' },
          { id: 'p2_t3', title: 'Learn NoSQL basics (MongoDB)', completed: false, status: 'Not Started' },
          { id: 'p2_t4', title: 'Implement an ORM / ODM', completed: false, status: 'Not Started' },
          { id: 'p2_t5', title: 'Learn database indexing and optimization', completed: false, status: 'Not Started' }
        ],
        skills: ['SQL', 'NoSQL', 'Database Design', 'ORMs'],
        projects: [{ title: 'Blog Engine Database', difficulty: 'Intermediate', description: 'Design and query a complex database schema.' }],
        resources: [], certifications: [], milestones: ['Integrate a database with an API']
      },
      {
        id: 'phase_3', title: 'Authentication & Security', description: 'Secure your backend applications.', overview: 'Learn JWT, OAuth, hashing, and protection against common vulnerabilities (OWASP).',
        tasks: [
          { id: 'p3_t1', title: 'Implement JWT authentication', completed: false, status: 'Not Started' },
          { id: 'p3_t2', title: 'Implement OAuth (Google/GitHub Login)', completed: false, status: 'Not Started' },
          { id: 'p3_t3', title: 'Learn password hashing (Bcrypt)', completed: false, status: 'Not Started' },
          { id: 'p3_t4', title: 'Understand CORS, CSRF, and XSS', completed: false, status: 'Not Started' },
          { id: 'p3_t5', title: 'Implement Role-Based Access Control', completed: false, status: 'Not Started' }
        ],
        skills: ['Security', 'JWT', 'OAuth', 'RBAC'],
        projects: [{ title: 'Secure Authentication Service', difficulty: 'Advanced', description: 'A complete auth system with JWT and email verification.' }],
        resources: [], certifications: [], milestones: ['Build a secure login system']
      },
      {
        id: 'phase_4', title: 'Architecture & DevOps Basics', description: 'Scale and deploy your backend.', overview: 'Learn Docker, CI/CD, caching, and basic cloud deployment.',
        tasks: [
          { id: 'p4_t1', title: 'Learn Docker basics & containerization', completed: false, status: 'Not Started' },
          { id: 'p4_t2', title: 'Implement Redis caching', completed: false, status: 'Not Started' },
          { id: 'p4_t3', title: 'Set up GitHub Actions for CI/CD', completed: false, status: 'Not Started' },
          { id: 'p4_t4', title: 'Deploy to AWS EC2 or DigitalOcean', completed: false, status: 'Not Started' },
          { id: 'p4_t5', title: 'Learn Nginx basics / Reverse proxy', completed: false, status: 'Not Started' }
        ],
        skills: ['Docker', 'Redis', 'CI/CD', 'AWS'],
        projects: [], resources: [], certifications: [], milestones: ['Dockerize and deploy an API']
      },
      {
        id: 'phase_5', title: 'Placement & Career Launch', description: 'Prepare for backend interviews.', overview: 'Master System Design, LeetCode algorithms, and build your resume.',
        tasks: [
          { id: 'p5_t1', title: 'Master Data Structures and Algorithms', completed: false, status: 'Not Started' },
          { id: 'p5_t2', title: 'Learn basic System Design principles', completed: false, status: 'Not Started' },
          { id: 'p5_t3', title: 'Optimize resume for backend roles', completed: false, status: 'Not Started' },
          { id: 'p5_t4', title: 'Practice API and DB design interviews', completed: false, status: 'Not Started' },
          { id: 'p5_t5', title: 'Apply to targeted roles', completed: false, status: 'Not Started' }
        ],
        skills: ['System Design', 'Algorithms', 'Interviewing'],
        projects: [], resources: [], certifications: [], milestones: ['Ready for backend interviews']
      }
    ],
    sidebar: { currentFocus: { title: 'Backend Fundamentals', description: 'Start by building simple, reliable REST APIs.' }, recommendedResource: { title: "Node.js Docs", platform: "Node.js", rating: "4.8" } },
    qualityScores: { accuracy: 95, relevance: 95, personalization: 90, consistency: 95 }
  },
  'full stack developer': {
    header: { careerTitle: 'Full Stack Developer', estimatedDuration: '9-12 Months', nextMilestone: 'Master Web Foundations', overallRank: 'Beginner' },
    phases: [
      {
        id: 'phase_1', title: 'Frontend Basics', description: 'Learn to build user interfaces.', overview: 'Master HTML, CSS, JavaScript, and a framework like React.',
        tasks: [
          { id: 'p1_t1', title: 'Learn HTML & CSS fundamentals', completed: false, status: 'Not Started' },
          { id: 'p1_t2', title: 'Master JavaScript (ES6+)', completed: false, status: 'Not Started' },
          { id: 'p1_t3', title: 'Learn React.js component architecture', completed: false, status: 'Not Started' },
          { id: 'p1_t4', title: 'Manage state with Hooks', completed: false, status: 'Not Started' },
          { id: 'p1_t5', title: 'Learn Tailwind CSS', completed: false, status: 'Not Started' }
        ],
        skills: ['React', 'JavaScript', 'CSS'], projects: [{ title: 'Frontend Dashboard', difficulty: 'Beginner', description: 'A UI dashboard built in React.' }], resources: [], certifications: [], milestones: ['Build your first web app']
      },
      {
        id: 'phase_2', title: 'Backend Basics', description: 'Learn server-side programming.', overview: 'Master Node.js, Express, and REST APIs.',
        tasks: [
          { id: 'p2_t1', title: 'Learn Node.js fundamentals', completed: false, status: 'Not Started' },
          { id: 'p2_t2', title: 'Build REST APIs with Express', completed: false, status: 'Not Started' },
          { id: 'p2_t3', title: 'Understand HTTP methods and Postman', completed: false, status: 'Not Started' },
          { id: 'p2_t4', title: 'Implement middleware in Express', completed: false, status: 'Not Started' },
          { id: 'p2_t5', title: 'Handle API errors gracefully', completed: false, status: 'Not Started' }
        ],
        skills: ['Node.js', 'Express', 'APIs'], projects: [], resources: [], certifications: [], milestones: ['Build a basic API']
      },
      {
        id: 'phase_3', title: 'Databases & Integration', description: 'Connect frontend to backend.', overview: 'Learn MongoDB/PostgreSQL, ORMs, and how to connect React to Express.',
        tasks: [
          { id: 'p3_t1', title: 'Learn SQL or NoSQL (MongoDB)', completed: false, status: 'Not Started' },
          { id: 'p3_t2', title: 'Use an ORM/ODM (Prisma or Mongoose)', completed: false, status: 'Not Started' },
          { id: 'p3_t3', title: 'Fetch data in React using Axios', completed: false, status: 'Not Started' },
          { id: 'p3_t4', title: 'Manage CORS between frontend and backend', completed: false, status: 'Not Started' },
          { id: 'p3_t5', title: 'Implement basic authentication (JWT)', completed: false, status: 'Not Started' }
        ],
        skills: ['Databases', 'Integration', 'JWT'], projects: [{ title: 'Full Stack Todo App', difficulty: 'Intermediate', description: 'MERN stack application with authentication.' }], resources: [], certifications: [], milestones: ['Complete first full-stack app']
      },
      {
        id: 'phase_4', title: 'Advanced Full Stack & Deployment', description: 'Scale and deploy your apps.', overview: 'Learn Next.js, Docker, and AWS/Vercel deployment.',
        tasks: [
          { id: 'p4_t1', title: 'Learn Next.js for full-stack React', completed: false, status: 'Not Started' },
          { id: 'p4_t2', title: 'Learn basic Docker containerization', completed: false, status: 'Not Started' },
          { id: 'p4_t3', title: 'Deploy frontend to Vercel/Netlify', completed: false, status: 'Not Started' },
          { id: 'p4_t4', title: 'Deploy backend to Render/Railway', completed: false, status: 'Not Started' },
          { id: 'p4_t5', title: 'Set up a basic CI/CD pipeline', completed: false, status: 'Not Started' }
        ],
        skills: ['Next.js', 'Docker', 'Deployment'], projects: [], resources: [], certifications: [], milestones: ['Deploy a full-stack application']
      },
      {
        id: 'phase_5', title: 'Career Prep', description: 'Prepare for Full Stack interviews.', overview: 'Master Data Structures, System Design, and resume building.',
        tasks: [
          { id: 'p5_t1', title: 'Practice Data Structures and Algorithms', completed: false, status: 'Not Started' },
          { id: 'p5_t2', title: 'Learn Web Architecture / System Design', completed: false, status: 'Not Started' },
          { id: 'p5_t3', title: 'Build a polished full-stack portfolio', completed: false, status: 'Not Started' },
          { id: 'p5_t4', title: 'Optimize resume and LinkedIn', completed: false, status: 'Not Started' },
          { id: 'p5_t5', title: 'Apply to Full Stack roles', completed: false, status: 'Not Started' }
        ],
        skills: ['System Design', 'Algorithms', 'Interviews'], projects: [], resources: [], certifications: [], milestones: ['Ready for interviews']
      }
    ],
    sidebar: { currentFocus: { title: 'Frontend Basics', description: 'Mastering the UI layer is the first step.' }, recommendedResource: { title: "Full Stack Open", platform: "University of Helsinki", rating: "4.9 (50k)" } },
    qualityScores: { accuracy: 95, relevance: 95, personalization: 90, consistency: 95 }
  },
  'ai engineer': {
    header: { careerTitle: 'AI Engineer', estimatedDuration: '8-12 Months', nextMilestone: 'Master Python & ML Basics', overallRank: 'Beginner' },
    phases: [
      {
        id: 'phase_1', title: 'Python & Math Fundamentals', description: 'Master the prerequisites for AI.', overview: 'Learn Python, NumPy, Pandas, linear algebra, calculus, and statistics.',
        tasks: [
          { id: 'p1_t1', title: 'Master Python for data science', completed: false, status: 'Not Started' },
          { id: 'p1_t2', title: 'Learn Pandas & Data Manipulation', completed: false, status: 'Not Started' },
          { id: 'p1_t3', title: 'Review Linear Algebra & Matrices', completed: false, status: 'Not Started' },
          { id: 'p1_t4', title: 'Learn basic Probability & Statistics', completed: false, status: 'Not Started' },
          { id: 'p1_t5', title: 'Learn data visualization (Matplotlib)', completed: false, status: 'Not Started' }
        ],
        skills: ['Python', 'Math', 'Pandas', 'Data Viz'],
        projects: [{ title: 'Exploratory Data Analysis', difficulty: 'Beginner', description: 'Analyze and visualize a complex dataset.' }],
        resources: [], certifications: [], milestones: ['Master data manipulation']
      },
      {
        id: 'phase_2', title: 'Machine Learning Core', description: 'Learn traditional ML algorithms.', overview: 'Focus on regression, classification, clustering, and scikit-learn.',
        tasks: [
          { id: 'p2_t1', title: 'Learn Linear & Logistic Regression', completed: false, status: 'Not Started' },
          { id: 'p2_t2', title: 'Understand Decision Trees & Random Forests', completed: false, status: 'Not Started' },
          { id: 'p2_t3', title: 'Learn Clustering (K-Means)', completed: false, status: 'Not Started' },
          { id: 'p2_t4', title: 'Master Model Evaluation & Metrics', completed: false, status: 'Not Started' },
          { id: 'p2_t5', title: 'Build pipelines in Scikit-Learn', completed: false, status: 'Not Started' }
        ],
        skills: ['Scikit-Learn', 'ML Algorithms', 'Model Evaluation'],
        projects: [{ title: 'House Price Predictor', difficulty: 'Intermediate', description: 'End-to-end regression model deployment.' }],
        resources: [], certifications: [], milestones: ['Train your first ML model']
      },
      {
        id: 'phase_3', title: 'Deep Learning & Neural Networks', description: 'Dive into neural networks and PyTorch.', overview: 'Learn the architecture of neural networks, CNNs, and deep learning frameworks.',
        tasks: [
          { id: 'p3_t1', title: 'Learn Neural Network Architecture', completed: false, status: 'Not Started' },
          { id: 'p3_t2', title: 'Master PyTorch or TensorFlow', completed: false, status: 'Not Started' },
          { id: 'p3_t3', title: 'Learn CNNs for Computer Vision', completed: false, status: 'Not Started' },
          { id: 'p3_t4', title: 'Implement Model Training Loops', completed: false, status: 'Not Started' },
          { id: 'p3_t5', title: 'Learn Transfer Learning', completed: false, status: 'Not Started' }
        ],
        skills: ['Deep Learning', 'PyTorch', 'CNNs'],
        projects: [{ title: 'Image Classification Model', difficulty: 'Advanced', description: 'Train a CNN using PyTorch to classify images.' }],
        resources: [], certifications: [], milestones: ['Build a neural network from scratch']
      },
      {
        id: 'phase_4', title: 'LLMs, RAG & Generative AI', description: 'Master modern AI engineering.', overview: 'Learn about Transformers, fine-tuning, RAG, LangChain, and OpenAI APIs.',
        tasks: [
          { id: 'p4_t1', title: 'Understand Transformer Architecture', completed: false, status: 'Not Started' },
          { id: 'p4_t2', title: 'Learn LangChain & LlamaIndex', completed: false, status: 'Not Started' },
          { id: 'p4_t3', title: 'Build a RAG (Retrieval-Augmented Generation) pipeline', completed: false, status: 'Not Started' },
          { id: 'p4_t4', title: 'Learn Vector Databases (Pinecone/Weaviate)', completed: false, status: 'Not Started' },
          { id: 'p4_t5', title: 'Experiment with open-source LLMs (HuggingFace)', completed: false, status: 'Not Started' }
        ],
        skills: ['LLMs', 'RAG', 'LangChain', 'Vector DBs'],
        projects: [{ title: 'Custom AI Assistant', difficulty: 'Advanced', description: 'Build a RAG chatbot over private documents.' }],
        resources: [], certifications: [], milestones: ['Deploy a production RAG application']
      },
      {
        id: 'phase_5', title: 'MLOps & Career Launch', description: 'Deploy models and prep for interviews.', overview: 'Learn model deployment, FastAPI, Docker, and interview prep.',
        tasks: [
          { id: 'p5_t1', title: 'Wrap ML models in FastAPI', completed: false, status: 'Not Started' },
          { id: 'p5_t2', title: 'Dockerize AI applications', completed: false, status: 'Not Started' },
          { id: 'p5_t3', title: 'Deploy to AWS SageMaker or HuggingFace Spaces', completed: false, status: 'Not Started' },
          { id: 'p5_t4', title: 'Prepare for ML System Design interviews', completed: false, status: 'Not Started' },
          { id: 'p5_t5', title: 'Apply to AI/ML Engineer roles', completed: false, status: 'Not Started' }
        ],
        skills: ['MLOps', 'FastAPI', 'System Design'],
        projects: [], resources: [], certifications: [], milestones: ['Ready for AI engineering roles']
      }
    ],
    sidebar: { currentFocus: { title: 'Python & Math', description: 'A strong foundation in math and data manipulation is crucial for AI.' }, recommendedResource: { title: "DeepLearning.AI", platform: "Coursera", rating: "4.9 (100k)" } },
    qualityScores: { accuracy: 95, relevance: 95, personalization: 90, consistency: 95 }
  }
};

// Auto-generate generic templates for remaining roles to fulfill requirements
const generateGenericTemplate = (role) => {
  return {
    header: { careerTitle: role, estimatedDuration: '6-12 Months', nextMilestone: 'Complete Foundation Phase', overallRank: 'Beginner' },
    phases: [
      {
        id: 'phase_1', title: 'Foundation', description: 'Learn the core basics and prerequisites', overview: 'Focus on fundamental concepts necessary for your career goal.',
        tasks: [
          { id: 'p1_t1', title: 'Research core skills required for ' + role, completed: false, status: 'Not Started' },
          { id: 'p1_t2', title: 'Identify top learning resources', completed: false, status: 'Not Started' },
          { id: 'p1_t3', title: 'Complete introductory course', completed: false, status: 'Not Started' },
          { id: 'p1_t4', title: 'Join a relevant community', completed: false, status: 'Not Started' },
          { id: 'p1_t5', title: 'Set a daily learning schedule', completed: false, status: 'Not Started' }
        ],
        skills: ['Foundations', 'Research'], projects: [], resources: [], certifications: [], milestones: ['Understand core concepts']
      },
      {
        id: 'phase_2', title: 'Core Competencies', description: 'Master the primary tools of the trade', overview: 'Deep dive into the main technologies required.',
        tasks: [
          { id: 'p2_t1', title: 'Complete advanced coursework', completed: false, status: 'Not Started' },
          { id: 'p2_t2', title: 'Start building simple projects', completed: false, status: 'Not Started' },
          { id: 'p2_t3', title: 'Learn industry standard tools', completed: false, status: 'Not Started' },
          { id: 'p2_t4', title: 'Read documentation and case studies', completed: false, status: 'Not Started' },
          { id: 'p2_t5', title: 'Participate in discussions', completed: false, status: 'Not Started' }
        ],
        skills: ['Core Skills'], projects: [], resources: [], certifications: [], milestones: ['Master main tools']
      },
      {
        id: 'phase_3', title: 'Projects & Portfolio', description: 'Build real-world applications', overview: 'Apply your skills to build a strong portfolio.',
        tasks: [
          { id: 'p3_t1', title: 'Plan a capstone project', completed: false, status: 'Not Started' },
          { id: 'p3_t2', title: 'Execute project implementation', completed: false, status: 'Not Started' },
          { id: 'p3_t3', title: 'Refine and optimize project', completed: false, status: 'Not Started' },
          { id: 'p3_t4', title: 'Document project publicly', completed: false, status: 'Not Started' },
          { id: 'p3_t5', title: 'Seek feedback from peers', completed: false, status: 'Not Started' }
        ],
        skills: ['Portfolio Building'], projects: [], resources: [], certifications: [], milestones: ['Complete Capstone Project']
      },
      {
        id: 'phase_4', title: 'Industry Readiness', description: 'Prepare for professional environments', overview: 'Learn about best practices and professional workflows.',
        tasks: [
          { id: 'p4_t1', title: 'Learn professional communication', completed: false, status: 'Not Started' },
          { id: 'p4_t2', title: 'Understand agile workflows', completed: false, status: 'Not Started' },
          { id: 'p4_t3', title: 'Review open source or industry code', completed: false, status: 'Not Started' },
          { id: 'p4_t4', title: 'Build a strong online presence', completed: false, status: 'Not Started' },
          { id: 'p4_t5', title: 'Network with professionals', completed: false, status: 'Not Started' }
        ],
        skills: ['Soft Skills', 'Networking'], projects: [], resources: [], certifications: [], milestones: ['Industry Ready']
      },
      {
        id: 'phase_5', title: 'Placement / Career Launch', description: 'Prepare for interviews and job hunting', overview: 'Focus on resume building and interview prep.',
        tasks: [
          { id: 'p5_t1', title: 'Update resume with new skills', completed: false, status: 'Not Started' },
          { id: 'p5_t2', title: 'Optimize LinkedIn profile', completed: false, status: 'Not Started' },
          { id: 'p5_t3', title: 'Practice mock interviews', completed: false, status: 'Not Started' },
          { id: 'p5_t4', title: 'Tailor applications to companies', completed: false, status: 'Not Started' },
          { id: 'p5_t5', title: 'Start applying for roles', completed: false, status: 'Not Started' }
        ],
        skills: ['Interview Prep'], projects: [], resources: [], certifications: [], milestones: ['First Interview']
      }
    ],
    sidebar: { currentFocus: { title: 'Getting Started', description: 'Begin your journey by establishing strong foundations.' }, recommendedResource: { title: "Coursera", platform: "Coursera", rating: "4.8" } },
    qualityScores: { accuracy: 90, relevance: 90, personalization: 85, consistency: 90 }
  };
};

const ADDITIONAL_ROLES = [
  'Software Engineer',
  'Data Scientist',
  'Cloud Engineer',
  'Cybersecurity Analyst',
  'UI/UX Designer',
  'Product Manager'
];

ADDITIONAL_ROLES.forEach(role => {
  ROADMAP_TEMPLATES[role.toLowerCase()] = generateGenericTemplate(role);
});

export const getTemplateRoadmap = (role) => {
  const normalizedRole = (role || '').toLowerCase();
  return ROADMAP_TEMPLATES[normalizedRole] || generateGenericTemplate(role || 'Professional Career');
};

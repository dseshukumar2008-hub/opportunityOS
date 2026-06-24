export const careerPaths = [
  {
    id: "frontend-developer",
    title: "Frontend Developer",
    category: "Software Engineering",
    description: "Build user-facing interfaces and web applications with a focus on UX and performance.",
    baseMatchTags: ["coding", "ui/ux", "web development", "react", "javascript", "creativity"],
    skillsNeeded: ["React", "JavaScript/TypeScript", "CSS/Tailwind", "Responsive Design", "Web Performance"],
    recommendedProjects: [
      "E-commerce Dashboard Clone",
      "Interactive Portfolio Website",
      "Real-time Chat Application"
    ],
    timeline: "3-6 months",
    icon: "Code"
  },
  {
    id: "backend-developer",
    title: "Backend Developer",
    category: "Software Engineering",
    description: "Design and build server-side logic, databases, and APIs that power applications.",
    baseMatchTags: ["coding", "databases", "api design", "node.js", "python", "system architecture"],
    skillsNeeded: ["Node.js / Python", "RESTful APIs", "SQL / NoSQL", "System Architecture", "Security"],
    recommendedProjects: [
      "RESTful API for an E-commerce store",
      "Authentication & Authorization System",
      "Scalable Microservice"
    ],
    timeline: "4-8 months",
    icon: "Server"
  },
  {
    id: "fullstack-developer",
    title: "Full Stack Developer",
    category: "Software Engineering",
    description: "Handle both frontend and backend development to build complete end-to-end applications.",
    baseMatchTags: ["coding", "web development", "databases", "system architecture", "react", "node.js"],
    skillsNeeded: ["React & Node.js", "Database Design", "API Integration", "Deployment (AWS/Vercel)"],
    recommendedProjects: [
      "Full-stack Social Media App",
      "Task Management System (SaaS)",
      "Blog with CMS integration"
    ],
    timeline: "6-12 months",
    icon: "Layers"
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    category: "Data & AI",
    description: "Extract insights from complex data sets using statistical analysis and machine learning.",
    baseMatchTags: ["data analysis", "python", "statistics", "machine learning", "problem solving"],
    skillsNeeded: ["Python (Pandas, NumPy)", "SQL", "Machine Learning Algorithms", "Data Visualization", "Statistics"],
    recommendedProjects: [
      "Predictive Pricing Model",
      "Customer Segmentation Analysis",
      "Recommendation Engine"
    ],
    timeline: "6-12 months",
    icon: "BarChart3"
  },
  {
    id: "ai-engineer",
    title: "AI / ML Engineer",
    category: "Data & AI",
    description: "Build, train, and deploy machine learning models and AI systems into production.",
    baseMatchTags: ["coding", "machine learning", "python", "deep learning", "innovation"],
    skillsNeeded: ["Python", "TensorFlow / PyTorch", "Model Deployment (MLOps)", "Data Preprocessing", "GenAI / LLMs"],
    recommendedProjects: [
      "Custom LLM Wrapper / Chatbot",
      "Image Recognition System",
      "Sentiment Analysis API"
    ],
    timeline: "8-14 months",
    icon: "Bot"
  },
  {
    id: "ux-ui-designer",
    title: "UX/UI Designer",
    category: "Design",
    description: "Design intuitive and beautiful user interfaces, focusing on user experience and journey.",
    baseMatchTags: ["design", "ui/ux", "creativity", "user research", "figma"],
    skillsNeeded: ["Figma", "User Research", "Wireframing & Prototyping", "Visual Design", "Accessibility"],
    recommendedProjects: [
      "Mobile App Redesign",
      "Complete SaaS Dashboard Design",
      "Interactive High-Fidelity Prototype"
    ],
    timeline: "3-6 months",
    icon: "PenTool"
  },
  {
    id: "product-manager",
    title: "Product Manager",
    category: "Product & Business",
    description: "Lead cross-functional teams to deliver products that meet customer needs and business goals.",
    baseMatchTags: ["leadership", "strategy", "communication", "problem solving", "analytics"],
    skillsNeeded: ["Agile/Scrum", "Product Strategy", "User Stories", "Data Analysis", "Stakeholder Management"],
    recommendedProjects: [
      "Product Requirements Document (PRD)",
      "Market/Competitor Analysis Report",
      "Feature Prioritization Matrix"
    ],
    timeline: "4-8 months",
    icon: "Target"
  },
  {
    id: "marketing-manager",
    title: "Digital Marketing Manager",
    category: "Product & Business",
    description: "Drive growth through digital channels, content strategy, and campaign optimization.",
    baseMatchTags: ["marketing", "communication", "creativity", "analytics", "social media"],
    skillsNeeded: ["SEO/SEM", "Content Strategy", "Google Analytics", "Social Media Marketing", "Copywriting"],
    recommendedProjects: [
      "Go-to-Market Strategy for a New App",
      "Content Calendar & SEO Audit",
      "Ad Campaign Performance Analysis"
    ],
    timeline: "3-6 months",
    icon: "Megaphone"
  },
  {
    id: "devops-engineer",
    title: "DevOps Engineer",
    category: "Infrastructure",
    description: "Bridge the gap between development and operations to ensure smooth deployments and reliable systems.",
    baseMatchTags: ["coding", "infrastructure", "automation", "cloud computing", "problem solving"],
    skillsNeeded: ["AWS / Azure / GCP", "Docker & Kubernetes", "CI/CD Pipelines", "Linux Administration", "Infrastructure as Code"],
    recommendedProjects: [
      "Automated CI/CD Pipeline for a Web App",
      "Containerized Microservices Architecture",
      "Monitoring and Alerting Setup"
    ],
    timeline: "6-12 months",
    icon: "Terminal"
  },
  {
    id: "cybersecurity-analyst",
    title: "Cybersecurity Analyst",
    category: "Infrastructure",
    description: "Protect systems and networks from threats, vulnerabilities, and cyber attacks.",
    baseMatchTags: ["security", "networking", "problem solving", "infrastructure"],
    skillsNeeded: ["Network Security", "Vulnerability Assessment", "Incident Response", "Ethical Hacking", "Security Protocols"],
    recommendedProjects: [
      "Vulnerability Scan & Audit Report",
      "Network Traffic Analysis",
      "Simulated Phishing Campaign Defense"
    ],
    timeline: "6-10 months",
    icon: "ShieldAlert"
  }
];

export const onboardingOptions = {
  interests: [
    "Coding & Software", "UI/UX Design", "Data & Analytics", 
    "Artificial Intelligence", "Business Strategy", "Marketing & Growth", 
    "Cloud & Infrastructure", "Cybersecurity", "Product Management"
  ],
  strengths: [
    "Problem Solving", "Creativity", "Analytical Thinking", 
    "Communication", "Leadership", "Technical Aptitude", 
    "Attention to Detail", "Empathy & User Focus"
  ],
  workPreferences: [
    "Remote Work", "Office / Hybrid", "Fast-paced Startup", 
    "Stable Enterprise", "Independent Contributor", "Team Collaboration",
    "Client Facing", "Behind the Scenes"
  ]
};

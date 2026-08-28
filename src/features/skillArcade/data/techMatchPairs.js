// Large tech pairing bank for Tech Match
export const techMatchPairs = [
  // Frontend Frameworks & Libraries
  { id: 'tm_1', tech: "React", category: "Frontend Library" },
  { id: 'tm_2', tech: "Vue.js", category: "Frontend Framework" },
  { id: 'tm_3', tech: "Angular", category: "Frontend Framework" },
  { id: 'tm_4', tech: "Svelte", category: "Compiler-based Framework" },
  { id: 'tm_5', tech: "Next.js", category: "React Meta-Framework" },
  { id: 'tm_6', tech: "Nuxt.js", category: "Vue Meta-Framework" },

  // Backend Technologies
  { id: 'tm_7', tech: "Node.js", category: "JavaScript Runtime" },
  { id: 'tm_8', tech: "Django", category: "Python Web Framework" },
  { id: 'tm_9', tech: "Spring Boot", category: "Java Web Framework" },
  { id: 'tm_10', tech: "Express.js", category: "Node.js Web Framework" },
  { id: 'tm_11', tech: "Ruby on Rails", category: "Ruby Web Framework" },
  { id: 'tm_12', tech: "Laravel", category: "PHP Web Framework" },

  // Databases
  { id: 'tm_13', tech: "PostgreSQL", category: "Relational Database" },
  { id: 'tm_14', tech: "MongoDB", category: "NoSQL Document Database" },
  { id: 'tm_15', tech: "Redis", category: "In-Memory Data Store" },
  { id: 'tm_16', tech: "Cassandra", category: "Wide-Column Store" },
  { id: 'tm_17', tech: "Neo4j", category: "Graph Database" },
  { id: 'tm_18', tech: "SQLite", category: "Embedded Relational Database" },

  // DevOps & Cloud
  { id: 'tm_19', tech: "Docker", category: "Containerization" },
  { id: 'tm_20', tech: "Kubernetes", category: "Container Orchestration" },
  { id: 'tm_21', tech: "Jenkins", category: "CI/CD Tool" },
  { id: 'tm_22', tech: "AWS S3", category: "Cloud Object Storage" },
  { id: 'tm_23', tech: "Terraform", category: "Infrastructure as Code" },
  { id: 'tm_24', tech: "Ansible", category: "Configuration Management" },

  // Languages
  { id: 'tm_25', tech: "Python", category: "Interpreted Programming Language" },
  { id: 'tm_26', tech: "TypeScript", category: "Typed JavaScript Superset" },
  { id: 'tm_27', tech: "Rust", category: "Systems Programming Language" },
  { id: 'tm_28', tech: "Go", category: "Compiled Programming Language" },
  { id: 'tm_29', tech: "Java", category: "Object-Oriented Programming Language" },
  
  // Design & CSS
  { id: 'tm_30', tech: "Tailwind CSS", category: "Utility-First CSS Framework" },
  { id: 'tm_31', tech: "Sass", category: "CSS Preprocessor" },
  { id: 'tm_32', tech: "Figma", category: "UI/UX Design Tool" },
  { id: 'tm_33', tech: "Bootstrap", category: "Component-Based CSS Framework" },
  { id: 'tm_34', tech: "Framer Motion", category: "Animation Library" },

  // Tools & Version Control
  { id: 'tm_35', tech: "Git", category: "Version Control System" },
  { id: 'tm_36', tech: "Webpack", category: "Module Bundler" },
  { id: 'tm_37', tech: "Vite", category: "Frontend Build Tool" },
  { id: 'tm_38', tech: "Babel", category: "JavaScript Compiler" },
  
  // APIs & Testing
  { id: 'tm_39', tech: "GraphQL", category: "API Query Language" },
  { id: 'tm_40', tech: "Jest", category: "Testing Framework" },
  { id: 'tm_41', tech: "Cypress", category: "End-to-End Testing" },
  { id: 'tm_42', tech: "REST", category: "API Architectural Style" },
  { id: 'tm_43', tech: "Postman", category: "API Development Tool" },

  // Web Servers & Miscellaneous
  { id: 'tm_44', tech: "Nginx", category: "Web Server & Reverse Proxy" },
  { id: 'tm_45', tech: "Apache", category: "Web Server" },
  { id: 'tm_46', tech: "RabbitMQ", category: "Message Broker" },
  { id: 'tm_47', tech: "Kafka", category: "Event Streaming Platform" },
  { id: 'tm_48', tech: "Elasticsearch", category: "Search & Analytics Engine" }
];

// In-memory cache to prevent repeating them in back-to-back sessions
let usedPairIds = new Set();

export const getRandomTechPairs = (count = 6) => {
  // Filter out pairs used already to ensure variety
  let availablePairs = techMatchPairs.filter(p => !usedPairIds.has(p.id));
  
  // If we don't have enough unused pairs, fallback to the full bank
  if (availablePairs.length < count) {
    availablePairs = [...techMatchPairs];
    usedPairIds.clear();
  }

  // Shuffle using Fisher-Yates
  const shuffled = [...availablePairs];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const selected = shuffled.slice(0, count);

  // Store selected IDs for next time to accumulate
  selected.forEach(p => usedPairIds.add(p.id));

  return selected;
};

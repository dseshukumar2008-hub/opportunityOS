import { forwardRef } from 'react';
import { useResume } from '../../contexts/ResumeContext';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Globe,
  User,
  Code
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const formatUrl = (url) => {
  if (!url) return '';
  return String(url).replace(/^https?:\/\//, '').replace(/\/$/, '');
};

const ModernResume = ({ data, isPdfMode }) => {
  if (!data) return null;
  const { personalInfo = {}, education = [], skills = [], projects = [], experience = [], certifications = [], workshops = [] } = data;
  
  const textDarker = '#000000';
  const textMedium = '#111827';
  const textLight = '#374151';

  return (
    <div className="flex flex-col h-full font-sans leading-relaxed text-[12px]" style={{ color: textMedium }}>
      {/* HEADER */}
      <div className="mb-6 text-center">
        <h1 className="text-[36px] font-bold tracking-normal mb-2 leading-none" style={{ color: textDarker }}>
          {personalInfo?.fullName || 'Full Name'}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 text-[12px]" style={{ color: textLight }}>
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && <span>| {personalInfo.phone}</span>}
          {personalInfo?.location && <span>| {personalInfo.location}</span>}
          {personalInfo?.linkedin && <span>| {formatUrl(personalInfo.linkedin)}</span>}
          {personalInfo?.github && <span>| {formatUrl(personalInfo.github)}</span>}
          {personalInfo?.portfolio && <span>| {formatUrl(personalInfo.portfolio)}</span>}
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {/* 1. PROFESSIONAL SUMMARY */}
        {personalInfo?.summary && (
          <section>
            <h3 className="text-[13px] font-bold uppercase tracking-wider mb-2 border-b border-slate-300 pb-1" style={{ color: textDarker }}>Professional Summary</h3>
            <p className="leading-relaxed">{personalInfo.summary}</p>
          </section>
        )}

        {/* 2. EDUCATION */}
        {education?.length > 0 && (
          <section>
            <h3 className="text-[13px] font-bold uppercase tracking-wider mb-2 border-b border-slate-300 pb-1" style={{ color: textDarker }}>Education</h3>
            <div className="flex flex-col gap-3">
              {education.map((edu, idx) => (
                <div key={edu.id || idx}>
                  <div className="flex justify-between items-baseline font-bold" style={{ color: textDarker }}>
                    <span>{edu.school}</span>
                    <span className="font-normal">{edu.year}</span>
                  </div>
                  <div className="flex justify-between italic">
                    <span>{edu.degree}</span>
                    {edu.cgpa && <span>CGPA: {edu.cgpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. EXPERIENCE */}
        {experience?.length > 0 && (
          <section>
            <h3 className="text-[13px] font-bold uppercase tracking-wider mb-2 border-b border-slate-300 pb-1" style={{ color: textDarker }}>Experience</h3>
            <div className="flex flex-col gap-4">
              {experience.map((exp, idx) => (
                <div key={exp.id || idx}>
                  <div className="flex justify-between items-baseline font-bold" style={{ color: textDarker }}>
                    <span>{exp.role}</span>
                    <span className="font-normal">{exp.duration}</span>
                  </div>
                  <div className="italic mb-0.5">{exp.company}</div>
                  {exp.responsibilities && (
                    <ul className="list-disc pl-5 flex flex-col gap-1 mt-1">
                      {String(exp.responsibilities).split('\n').filter(Boolean).map((line, i) => (
                        <li key={i} className="pl-1 leading-relaxed">{line.replace(/^- /, '')}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. PROJECTS */}
        {projects?.length > 0 && (
          <section>
            <h3 className="text-[13px] font-bold uppercase tracking-wider mb-2 border-b border-slate-300 pb-1" style={{ color: textDarker }}>Projects</h3>
            <div className="flex flex-col gap-4">
              {projects.map((proj, idx) => (
                <div key={proj.id || idx}>
                  <div className="flex justify-between items-baseline font-bold" style={{ color: textDarker }}>
                    <span>
                      {proj.title} 
                      {proj.techStack && <span className="font-normal italic"> | {proj.techStack}</span>}
                    </span>
                    <span className="font-normal">{formatUrl(proj.link)}</span>
                  </div>
                  {proj.description && (
                    <ul className="list-disc pl-5 mt-1 flex flex-col gap-1">
                      {String(proj.description).split('\n').filter(Boolean).map((line, i) => (
                        <li key={i} className="pl-1 leading-relaxed">{line.replace(/^- /, '')}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. WORKSHOPS & TRAINING */}
        {workshops?.length > 0 && (
          <section>
            <h3 className="text-[13px] font-bold uppercase tracking-wider mb-2 border-b border-slate-300 pb-1" style={{ color: textDarker }}>Workshops & Training</h3>
            <div className="flex flex-col gap-2">
              {workshops.map((ws, idx) => (
                <div key={ws.id || idx} className="flex justify-between items-baseline">
                  <span><span className="font-bold">{ws.title}</span> <span className="italic">| {ws.issuer}</span></span>
                  <span>{ws.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. CERTIFICATIONS */}
        {certifications?.length > 0 && (
          <section>
            <h3 className="text-[13px] font-bold uppercase tracking-wider mb-2 border-b border-slate-300 pb-1" style={{ color: textDarker }}>Certifications</h3>
            <div className="flex flex-col gap-2">
              {certifications.map((cert, idx) => (
                <div key={cert.id || idx} className="flex justify-between items-baseline">
                  <span><span className="font-bold">{cert.title}</span> <span className="italic">| {cert.issuer}</span></span>
                  <span>{cert.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. SKILLS */}
        {skills?.length > 0 && (
          <section>
            <h3 className="text-[13px] font-bold uppercase tracking-wider mb-2 border-b border-slate-300 pb-1" style={{ color: textDarker }}>Technical Skills</h3>
            <div className="leading-relaxed font-semibold">
              {skills.join(', ')}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

const ProfessionalResume = ({ data, isPdfMode }) => {
  if (!data) return null;
  const { personalInfo = {}, education = [], skills = [], projects = [], experience = [], certifications = [], workshops = [] } = data;
  
  const textDarker = '#000000';
  const textMedium = '#222222';
  const textLight = '#444444';

  return (
    <div className="flex flex-col h-full font-serif leading-relaxed text-[12px]" style={{ color: textMedium }}>
      {/* HEADER */}
      <div className="mb-6 text-center">
        <h1 className="text-[36px] font-bold tracking-normal mb-2 leading-none" style={{ color: textDarker }}>
          {personalInfo?.fullName || 'Full Name'}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 text-[12px]" style={{ color: textLight }}>
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && <span>| {personalInfo.phone}</span>}
          {personalInfo?.location && <span>| {personalInfo.location}</span>}
          {personalInfo?.linkedin && <span>| {formatUrl(personalInfo.linkedin)}</span>}
          {personalInfo?.github && <span>| {formatUrl(personalInfo.github)}</span>}
          {personalInfo?.portfolio && <span>| {formatUrl(personalInfo.portfolio)}</span>}
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {/* 1. PROFESSIONAL SUMMARY */}
        {personalInfo?.summary && (
          <section>
            <h3 className="text-[13px] font-bold uppercase tracking-wider mb-2 border-b border-slate-300 pb-1" style={{ color: textDarker }}>Professional Summary</h3>
            <p className="leading-relaxed">{personalInfo.summary}</p>
          </section>
        )}

        {/* 2. EDUCATION */}
        {education?.length > 0 && (
          <section>
            <h3 className="text-[13px] font-bold uppercase tracking-wider mb-2 border-b border-slate-300 pb-1" style={{ color: textDarker }}>Education</h3>
            <div className="flex flex-col gap-3">
              {education.map((edu, idx) => (
                <div key={edu.id || idx}>
                  <div className="flex justify-between items-baseline font-bold" style={{ color: textDarker }}>
                    <span>{edu.school}</span>
                    <span className="font-normal">{edu.year}</span>
                  </div>
                  <div className="flex justify-between italic">
                    <span>{edu.degree}</span>
                    {edu.cgpa && <span>CGPA: {edu.cgpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. EXPERIENCE */}
        {experience?.length > 0 && (
          <section>
            <h3 className="text-[13px] font-bold uppercase tracking-wider mb-2 border-b border-slate-300 pb-1" style={{ color: textDarker }}>Experience</h3>
            <div className="flex flex-col gap-4">
              {experience.map((exp, idx) => (
                <div key={exp.id || idx}>
                  <div className="flex justify-between items-baseline font-bold" style={{ color: textDarker }}>
                    <span>{exp.role}</span>
                    <span className="font-normal">{exp.duration}</span>
                  </div>
                  <div className="italic mb-0.5">{exp.company}</div>
                  {exp.responsibilities && (
                    <ul className="list-disc pl-5 flex flex-col gap-1 mt-1">
                      {String(exp.responsibilities).split('\n').filter(Boolean).map((line, i) => (
                        <li key={i} className="pl-1 leading-relaxed">{line.replace(/^- /, '')}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. PROJECTS */}
        {projects?.length > 0 && (
          <section>
            <h3 className="text-[13px] font-bold uppercase tracking-wider mb-2 border-b border-slate-300 pb-1" style={{ color: textDarker }}>Projects</h3>
            <div className="flex flex-col gap-4">
              {projects.map((proj, idx) => (
                <div key={proj.id || idx}>
                  <div className="flex justify-between items-baseline font-bold" style={{ color: textDarker }}>
                    <span>
                      {proj.title} 
                      {proj.techStack && <span className="font-normal italic"> | {proj.techStack}</span>}
                    </span>
                    <span className="font-normal">{formatUrl(proj.link)}</span>
                  </div>
                  {proj.description && (
                    <ul className="list-disc pl-5 mt-1 flex flex-col gap-1">
                      {String(proj.description).split('\n').filter(Boolean).map((line, i) => (
                        <li key={i} className="pl-1 leading-relaxed">{line.replace(/^- /, '')}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. WORKSHOPS & TRAINING */}
        {workshops?.length > 0 && (
          <section>
            <h3 className="text-[13px] font-bold uppercase tracking-wider mb-2 border-b border-slate-300 pb-1" style={{ color: textDarker }}>Workshops & Training</h3>
            <div className="flex flex-col gap-2">
              {workshops.map((ws, idx) => (
                <div key={ws.id || idx} className="flex justify-between items-baseline">
                  <span><span className="font-bold">{ws.title}</span> <span className="italic">| {ws.issuer}</span></span>
                  <span>{ws.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. CERTIFICATIONS */}
        {certifications?.length > 0 && (
          <section>
            <h3 className="text-[13px] font-bold uppercase tracking-wider mb-2 border-b border-slate-300 pb-1" style={{ color: textDarker }}>Certifications</h3>
            <div className="flex flex-col gap-2">
              {certifications.map((cert, idx) => (
                <div key={cert.id || idx} className="flex justify-between items-baseline">
                  <span><span className="font-bold">{cert.title}</span> <span className="italic">| {cert.issuer}</span></span>
                  <span>{cert.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. SKILLS */}
        {skills?.length > 0 && (
          <section>
            <h3 className="text-[13px] font-bold uppercase tracking-wider mb-2 border-b border-slate-300 pb-1" style={{ color: textDarker }}>Technical Skills</h3>
            <div className="leading-relaxed font-semibold">
              {skills.join(', ')}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

const MinimalResume = ({ data, isPdfMode }) => {
  if (!data) return null;
  const { personalInfo = {}, education = [], skills = [], projects = [], experience = [], certifications = [], workshops = [] } = data;
  
  const textDarker = '#000000';
  const textMedium = '#333333';
  const textLight = '#555555';

  return (
    <div className="flex flex-col h-full font-mono leading-relaxed text-[12px]" style={{ color: textMedium }}>
      {/* HEADER */}
      <div className="mb-6 text-center">
        <h1 className="text-[36px] font-bold tracking-normal mb-2 leading-none" style={{ color: textDarker }}>
          {personalInfo?.fullName || 'Full Name'}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 text-[12px]" style={{ color: textLight }}>
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && <span>| {personalInfo.phone}</span>}
          {personalInfo?.location && <span>| {personalInfo.location}</span>}
          {personalInfo?.linkedin && <span>| {formatUrl(personalInfo.linkedin)}</span>}
          {personalInfo?.github && <span>| {formatUrl(personalInfo.github)}</span>}
          {personalInfo?.portfolio && <span>| {formatUrl(personalInfo.portfolio)}</span>}
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {/* 1. PROFESSIONAL SUMMARY */}
        {personalInfo?.summary && (
          <section>
            <h3 className="text-[13px] font-bold uppercase tracking-wider mb-2 border-b border-slate-300 pb-1" style={{ color: textDarker }}>Professional Summary</h3>
            <p className="leading-relaxed">{personalInfo.summary}</p>
          </section>
        )}

        {/* 2. EDUCATION */}
        {education?.length > 0 && (
          <section>
            <h3 className="text-[13px] font-bold uppercase tracking-wider mb-2 border-b border-slate-300 pb-1" style={{ color: textDarker }}>Education</h3>
            <div className="flex flex-col gap-3">
              {education.map((edu, idx) => (
                <div key={edu.id || idx}>
                  <div className="flex justify-between items-baseline font-bold" style={{ color: textDarker }}>
                    <span>{edu.school}</span>
                    <span className="font-normal">{edu.year}</span>
                  </div>
                  <div className="flex justify-between italic">
                    <span>{edu.degree}</span>
                    {edu.cgpa && <span>CGPA: {edu.cgpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. EXPERIENCE */}
        {experience?.length > 0 && (
          <section>
            <h3 className="text-[13px] font-bold uppercase tracking-wider mb-2 border-b border-slate-300 pb-1" style={{ color: textDarker }}>Experience</h3>
            <div className="flex flex-col gap-4">
              {experience.map((exp, idx) => (
                <div key={exp.id || idx}>
                  <div className="flex justify-between items-baseline font-bold" style={{ color: textDarker }}>
                    <span>{exp.role}</span>
                    <span className="font-normal">{exp.duration}</span>
                  </div>
                  <div className="italic mb-0.5">{exp.company}</div>
                  {exp.responsibilities && (
                    <ul className="list-disc pl-5 flex flex-col gap-1 mt-1">
                      {String(exp.responsibilities).split('\n').filter(Boolean).map((line, i) => (
                        <li key={i} className="pl-1 leading-relaxed">{line.replace(/^- /, '')}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. PROJECTS */}
        {projects?.length > 0 && (
          <section>
            <h3 className="text-[13px] font-bold uppercase tracking-wider mb-2 border-b border-slate-300 pb-1" style={{ color: textDarker }}>Projects</h3>
            <div className="flex flex-col gap-4">
              {projects.map((proj, idx) => (
                <div key={proj.id || idx}>
                  <div className="flex justify-between items-baseline font-bold" style={{ color: textDarker }}>
                    <span>
                      {proj.title} 
                      {proj.techStack && <span className="font-normal italic"> | {proj.techStack}</span>}
                    </span>
                    <span className="font-normal">{formatUrl(proj.link)}</span>
                  </div>
                  {proj.description && (
                    <ul className="list-disc pl-5 mt-1 flex flex-col gap-1">
                      {String(proj.description).split('\n').filter(Boolean).map((line, i) => (
                        <li key={i} className="pl-1 leading-relaxed">{line.replace(/^- /, '')}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. WORKSHOPS & TRAINING */}
        {workshops?.length > 0 && (
          <section>
            <h3 className="text-[13px] font-bold uppercase tracking-wider mb-2 border-b border-slate-300 pb-1" style={{ color: textDarker }}>Workshops & Training</h3>
            <div className="flex flex-col gap-2">
              {workshops.map((ws, idx) => (
                <div key={ws.id || idx} className="flex justify-between items-baseline">
                  <span><span className="font-bold">{ws.title}</span> <span className="italic">| {ws.issuer}</span></span>
                  <span>{ws.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. CERTIFICATIONS */}
        {certifications?.length > 0 && (
          <section>
            <h3 className="text-[13px] font-bold uppercase tracking-wider mb-2 border-b border-slate-300 pb-1" style={{ color: textDarker }}>Certifications</h3>
            <div className="flex flex-col gap-2">
              {certifications.map((cert, idx) => (
                <div key={cert.id || idx} className="flex justify-between items-baseline">
                  <span><span className="font-bold">{cert.title}</span> <span className="italic">| {cert.issuer}</span></span>
                  <span>{cert.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. SKILLS */}
        {skills?.length > 0 && (
          <section>
            <h3 className="text-[13px] font-bold uppercase tracking-wider mb-2 border-b border-slate-300 pb-1" style={{ color: textDarker }}>Technical Skills</h3>
            <div className="leading-relaxed font-semibold">
              {skills.join(', ')}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

const ResumePreviewPanel = forwardRef((props, ref) => {
  const resumeContext = useResume() || {};
  const { resumeData, activeTemplate = 'Modern', setActiveTemplate } = resumeContext;
  
  const authContext = useAuth() || {};
  const { user } = authContext;

  const templates = ['Modern', 'Professional', 'Minimal'];

  const hasValidString = (val) => typeof val === 'string' && val.trim().length > 0;
  const hasValidArray = (arr) => Array.isArray(arr) && arr.length > 0;

  const demoData = {
    personalInfo: {
      fullName: 'Alex Software Engineer',
      role: 'Software Engineer',
      email: 'alex.engineer@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/alexse',
      github: 'github.com/alexse',
      portfolio: 'alexse.dev',
      summary: 'Results-driven Software Engineer with 2+ years of experience in full-stack development, specializing in React, Node.js, and cloud architecture. Proven ability to architect scalable systems, optimize API performance by 40%, and collaborate within agile teams to deliver enterprise-grade web applications. Passionate about writing clean, maintainable code and solving complex distributed systems problems.'
    },
    education: [
      {
        id: 'demo-edu-1',
        school: 'University of California, Berkeley',
        degree: 'B.S. in Computer Science',
        year: 'Aug 2020 - May 2024',
        cgpa: '3.92/4.00'
      }
    ],
    experience: [
      {
        id: 'demo-exp-1',
        role: 'Software Engineering Intern',
        company: 'CloudScale Technologies',
        duration: 'May 2023 - Aug 2023',
        responsibilities: 'Engineered a scalable microservice using Node.js and Express to process high-throughput analytics data, handling over 10,000 requests per minute.\nOptimized database query performance in PostgreSQL, reducing average read latency by 45% through strategic indexing and query refactoring.\nCollaborated with a cross-functional team of 8 engineers using Agile methodologies to ship 3 major feature sets ahead of schedule.\nImplemented robust CI/CD pipelines using GitHub Actions, decreasing deployment time by 30% and significantly reducing integration errors.'
      },
      {
        id: 'demo-exp-2',
        role: 'Frontend Developer Intern',
        company: 'FinTech Solutions',
        duration: 'Jan 2023 - Apr 2023',
        responsibilities: 'Spearheaded the migration of a legacy Angular dashboard to React.js, resulting in a 60% improvement in initial page load speed.\nDeveloped 15+ reusable UI components adhering strictly to accessibility standards (WCAG 2.1), improving overall user experience for visually impaired customers.\nIntegrated RESTful APIs to dynamically render real-time financial charts using Chart.js and Redux for state management.'
      }
    ],
    projects: [
      {
        id: 'demo-proj-1',
        title: 'Distributed Task Queue System',
        link: 'github.com/alexse/task-queue',
        techStack: 'Go, Redis, Docker, gRPC',
        description: 'Designed and implemented a distributed, fault-tolerant task queue system capable of scheduling and executing 50,000 background jobs per second.\nUtilized Redis for state persistence and gRPC for high-performance communication between worker nodes.\nDeployed the system via Docker containers orchestrated on a local Kubernetes cluster to ensure high availability.'
      },
      {
        id: 'demo-proj-2',
        title: 'Real-time Collaborative Whiteboard',
        link: 'github.com/alexse/whiteboard',
        techStack: 'React, Node.js, Socket.io, Canvas API',
        description: 'Built a real-time collaborative whiteboard application allowing up to 50 concurrent users to draw, erase, and chat simultaneously.\nImplemented WebSocket communication via Socket.io to ensure sub-50ms latency for drawing event synchronization across clients.\nLeveraged the HTML5 Canvas API and optimized rendering loops to maintain a smooth 60 FPS drawing experience.'
      }
    ],
    workshops: [
      {
        id: 'demo-ws-1',
        title: 'Advanced System Design & Distributed Architectures',
        issuer: 'Tech Talks Conference',
        year: '2023'
      },
      {
        id: 'demo-ws-2',
        title: 'Mastering Kubernetes and Container Orchestration',
        issuer: 'Cloud Native Computing Foundation',
        year: '2022'
      }
    ],
    certifications: [
      {
        id: 'demo-cert-1',
        title: 'AWS Certified Solutions Architect – Associate',
        issuer: 'Amazon Web Services',
        year: '2023'
      },
      {
        id: 'demo-cert-2',
        title: 'Meta Front-End Developer Professional Certificate',
        issuer: 'Coursera / Meta',
        year: '2022'
      }
    ],
    skills: ['JavaScript (ES6+)', 'TypeScript', 'Python', 'Go', 'React.js', 'Node.js', 'Next.js', 'Express', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'AWS (S3, EC2, Lambda)', 'Git / GitHub', 'CI/CD']
  };

  const useDemo = true;

  const currentData = {
    personalInfo: {
      fullName: hasValidString(resumeData?.personalInfo?.fullName) ? resumeData.personalInfo.fullName : (useDemo ? demoData.personalInfo.fullName : ''),
      role: hasValidString(resumeData?.personalInfo?.role) ? resumeData.personalInfo.role : (useDemo ? demoData.personalInfo.role : ''),
      email: hasValidString(resumeData?.personalInfo?.email) ? resumeData.personalInfo.email : (useDemo ? demoData.personalInfo.email : ''),
      phone: hasValidString(resumeData?.personalInfo?.phone) ? resumeData.personalInfo.phone : (useDemo ? demoData.personalInfo.phone : ''),
      location: hasValidString(resumeData?.personalInfo?.location) ? resumeData.personalInfo.location : (useDemo ? demoData.personalInfo.location : ''),
      linkedin: hasValidString(resumeData?.personalInfo?.linkedin) ? resumeData.personalInfo.linkedin : (useDemo ? demoData.personalInfo.linkedin : ''),
      github: hasValidString(resumeData?.personalInfo?.github) ? resumeData.personalInfo.github : (useDemo ? demoData.personalInfo.github : ''),
      portfolio: hasValidString(resumeData?.personalInfo?.portfolio) ? resumeData.personalInfo.portfolio : (useDemo ? demoData.personalInfo.portfolio : ''),
      summary: hasValidString(resumeData?.personalInfo?.summary) ? resumeData.personalInfo.summary : (useDemo ? demoData.personalInfo.summary : '')
    },
    education: hasValidArray(resumeData?.education) ? resumeData.education : (useDemo ? demoData.education : []),
    skills: hasValidArray(resumeData?.skills) ? resumeData.skills : (useDemo ? demoData.skills : []),
    projects: hasValidArray(resumeData?.projects) ? resumeData.projects : (useDemo ? demoData.projects : []),
    experience: hasValidArray(resumeData?.experience) ? resumeData.experience : (useDemo ? demoData.experience : []),
    certifications: hasValidArray(resumeData?.certifications) ? resumeData.certifications : (useDemo ? demoData.certifications : []),
    workshops: hasValidArray(resumeData?.workshops) ? resumeData.workshops : (useDemo ? demoData.workshops : [])
  };

  const isEmpty = !hasValidString(resumeData?.personalInfo?.fullName) && !hasValidArray(resumeData?.education) && !hasValidArray(resumeData?.experience);
  const selectedTemplate = activeTemplate.toLowerCase();

  const renderTemplate = () => {
    switch(selectedTemplate) {
      case 'professional': return <ProfessionalResume data={currentData} user={user} isPdfMode={props.isPdfMode} />;
      case 'minimal': return <MinimalResume data={currentData} user={user} isPdfMode={props.isPdfMode} />;
      case 'modern':
      default: return <ModernResume data={currentData} user={user} isPdfMode={props.isPdfMode} />;
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      {/* Compact Template Toolbar */}
      <div className="mb-4 flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-[13px] font-bold text-slate-800">Template Style</h3>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
          {templates.map(t => (
            <button
              key={t}
              onClick={() => setActiveTemplate && setActiveTemplate(t)}
              className={`px-4 py-1.5 rounded-md text-[12px] font-bold transition-all flex items-center gap-2 ${
                activeTemplate === t 
                  ? 'bg-white text-[#6C4CF1] shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Actual A4 Resume Paper Container */}
      <div className="rounded-[16px] border border-slate-200 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.05)] overflow-hidden bg-white w-full">
        {/* The Capture Node */}
        <div 
          ref={ref}
          className="w-full min-h-[900px] p-[40px] flex flex-col relative bg-white"
        >
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
});

ResumePreviewPanel.displayName = 'ResumePreviewPanel';

export default ResumePreviewPanel;

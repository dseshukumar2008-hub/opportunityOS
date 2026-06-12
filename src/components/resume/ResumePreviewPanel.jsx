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
  const { personalInfo = {}, education = [], skills = [], projects = [], experience = [], certifications = [] } = data;
  
  const avatarUrl = personalInfo?.photo || `https://api.dicebear.com/7.x/notionists/svg?seed=${personalInfo?.fullName || 'User'}&backgroundColor=e2e8f0`;
  
  // Dynamic color palette based on strict PDF-safe requirements
  const primary = isPdfMode ? '#7C3AED' : '#6C4CF1';
  const textDark = isPdfMode ? '#111827' : '#1e293b';
  const textDarker = isPdfMode ? '#111827' : '#0f172a';
  const textLight = isPdfMode ? '#6B7280' : '#475569';
  const textLighter = isPdfMode ? '#6B7280' : '#64748b';
  const textMedium = isPdfMode ? '#111827' : '#334155';
  const borderLight = isPdfMode ? '#FFFFFF' : '#f8fafc';
  
  return (
    <div className="flex flex-col h-full font-sans" style={{ color: textDark }}>
      
      {/* Resume Header */}
      <div className="flex items-center gap-6 mb-6">
        <img 
          src={avatarUrl} 
          alt="Profile" 
          crossOrigin="anonymous"
          className="rounded-full object-cover shrink-0 border-4"
          style={{ width: '96px', height: '96px', minWidth: '96px', minHeight: '96px', borderColor: borderLight }}
        />
        <div className="flex flex-col flex-1">
          <h1 className="text-[28px] font-extrabold leading-none tracking-tight mb-1" style={{ color: textDarker }}>
            {personalInfo?.fullName || 'Name not provided'}
          </h1>
          <h2 className="text-[14px] font-bold mb-3" style={{ color: primary }}>
            {personalInfo?.role || 'Full Stack Developer'}
          </h2>
          
          {/* Contact Grid */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-[10px] font-bold" style={{ color: textLight }}>
            {personalInfo?.phone && (
              <div className="flex items-center gap-1.5"><Phone size={12} style={{ color: primary }} />{personalInfo.phone}</div>
            )}
            {personalInfo?.email && (
              <div className="flex items-center gap-1.5"><Mail size={12} style={{ color: primary }} />{personalInfo.email}</div>
            )}
            {personalInfo?.location && (
              <div className="flex items-center gap-1.5"><MapPin size={12} style={{ color: primary }} />{personalInfo.location}</div>
            )}
            {personalInfo?.linkedin && (
              <div className="flex items-center gap-1.5"><User size={12} style={{ color: primary }} />{formatUrl(personalInfo.linkedin)}</div>
            )}
            {personalInfo?.github && (
              <div className="flex items-center gap-1.5"><Code size={12} style={{ color: primary }} />{formatUrl(personalInfo.github)}</div>
            )}
            {personalInfo?.portfolio && (
              <div className="flex items-center gap-1.5"><Globe size={12} style={{ color: primary }} />{formatUrl(personalInfo.portfolio)}</div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full h-[2px] mb-6 shrink-0" style={{ backgroundColor: primary }}></div>

      <div className="flex gap-8 flex-1 overflow-visible">
        {/* Left Column (Wider or Full Width) */}
        <div className="flex flex-col flex-1 gap-6">
          {education && education.length > 0 && (
            <section>
              <h3 className="text-[12px] font-extrabold uppercase tracking-wider mb-3" style={{ color: primary }}>Education</h3>
              <div className="flex flex-col gap-4">
                {education.map((edu, idx) => (
                  <div key={edu.id || idx} className="flex flex-col">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <span className="text-[12px] font-bold" style={{ color: textDarker }}>{edu.degree}</span>
                      <span className="text-[10px] font-bold" style={{ color: textLighter }}>{edu.year}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-[11px] font-medium" style={{ color: textMedium }}>{edu.school}</span>
                      {edu.cgpa && <span className="text-[10px] font-medium" style={{ color: textLighter }}>CGPA: {edu.cgpa}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {skills && skills.length > 0 && (
            <section>
              <h3 className="text-[12px] font-extrabold uppercase tracking-wider mb-3" style={{ color: primary }}>Skills</h3>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {skills.map((skill, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="text-[11px] font-medium" style={{ color: textDark }}>• {String(skill)}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {projects && projects.length > 0 && (
            <section>
              <h3 className="text-[12px] font-extrabold uppercase tracking-wider mb-3" style={{ color: primary }}>Projects</h3>
              <div className="flex flex-col gap-4">
                {projects.map((proj, idx) => (
                  <div key={proj.id || idx} className="flex flex-col">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <span className="text-[12px] font-bold" style={{ color: textDarker }}>{proj.title}</span>
                      <span className="text-[10px] font-medium" style={{ color: primary }}>{formatUrl(proj.link)}</span>
                    </div>
                    <p className="text-[10px] font-medium mb-1 leading-relaxed" style={{ color: textLight }}>{proj.description}</p>
                    {proj.techStack && <p className="text-[9px] font-bold" style={{ color: textLighter }}>{proj.techStack}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column (Narrower) */}
        {((experience && experience.length > 0) || (certifications && certifications.length > 0)) && (
          <div className="w-[40%] flex flex-col gap-6">
            {experience && experience.length > 0 && (
              <section>
                <h3 className="text-[12px] font-extrabold uppercase tracking-wider mb-3" style={{ color: primary }}>Experience</h3>
                <div className="flex flex-col gap-4">
                  {experience.map((exp, idx) => (
                    <div key={exp.id || idx} className="flex flex-col">
                      <span className="text-[12px] font-bold mb-0.5" style={{ color: textDarker }}>{exp.role}</span>
                      <span className="text-[11px] font-medium mb-0.5" style={{ color: textMedium }}>{exp.company}</span>
                      <span className="text-[9px] font-bold mb-2" style={{ color: textLighter }}>{exp.duration}</span>
                      {exp.responsibilities && (
                        <ul className="list-disc pl-3 flex flex-col gap-1">
                          {String(exp.responsibilities).split('\n').filter(Boolean).map((line, i) => (
                            <li key={i} className="text-[10px] font-medium leading-tight" style={{ color: textLight }}>{line.replace(/^- /, '')}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {certifications && certifications.length > 0 && (
              <section>
                <h3 className="text-[12px] font-extrabold uppercase tracking-wider mb-3" style={{ color: primary }}>Certifications</h3>
                <div className="flex flex-col gap-3">
                  {certifications.map((cert, idx) => (
                    <div key={cert.id || idx} className="flex flex-col">
                      <span className="text-[11px] font-bold mb-0.5 leading-tight" style={{ color: textDarker }}>{cert.title}</span>
                      <span className="text-[10px] font-medium" style={{ color: textMedium }}>{cert.issuer}</span>
                      <span className="text-[9px] font-bold" style={{ color: textLighter }}>{cert.year}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ProfessionalResume = ({ data, user, isPdfMode }) => {
  if (!data) return null;
  const textDarker = isPdfMode ? '#111827' : '#0f172a';
  const textLight = isPdfMode ? '#6B7280' : '#475569';
  const borderDark = isPdfMode ? '#111827' : '#1e293b';

  return (
    <div className="flex flex-col h-full font-serif" style={{ color: textDarker }}>
      <div className="text-center mb-6 border-b-2 pb-4" style={{ borderColor: borderDark }}>
        <h1 className="text-[36px] font-bold tracking-tight uppercase mb-2" style={{ color: textDarker }}>{data?.personalInfo?.fullName}</h1>
        <div className="flex justify-center gap-4 text-[12px]" style={{ color: textLight }}>
          {data?.personalInfo?.email && <span>{data.personalInfo.email}</span>}
          {data?.personalInfo?.phone && <span>• {data.personalInfo.phone}</span>}
          {data?.personalInfo?.location && <span>• {data.personalInfo.location}</span>}
        </div>
      </div>
      <ModernResume data={data} user={user} isPdfMode={isPdfMode} />
    </div>
  );
};

const MinimalResume = ({ data, user, isPdfMode }) => {
  if (!data) return null;
  const textDarker = isPdfMode ? '#111827' : '#0f172a';
  const textLighter = isPdfMode ? '#6B7280' : '#64748b';

  return (
    <div className="flex flex-col h-full font-mono" style={{ color: textDarker }}>
      <div className="mb-8">
        <h1 className="text-[28px] font-bold mb-4" style={{ color: textDarker }}>{data?.personalInfo?.fullName}</h1>
        <div className="flex flex-col gap-1 text-[12px]" style={{ color: textLighter }}>
          {data?.personalInfo?.email && <span>{data.personalInfo.email}</span>}
          {data?.personalInfo?.phone && <span>{data.personalInfo.phone}</span>}
        </div>
      </div>
      <ModernResume data={data} user={user} isPdfMode={isPdfMode} />
    </div>
  );
};

const ResumePreviewPanel = forwardRef((props, ref) => {
  const resumeContext = useResume() || {};
  const { resumeData, activeTemplate = 'Modern', setActiveTemplate } = resumeContext;
  
  const authContext = useAuth() || {};
  const { user } = authContext;

  const templates = ['Modern', 'Professional', 'Minimal'];

  const isEmpty = 
    !resumeData || (
      !resumeData.personalInfo?.fullName && 
      !resumeData.personalInfo?.email && 
      (!resumeData.education || resumeData.education.length === 0) && 
      (!resumeData.skills || resumeData.skills.length === 0) && 
      (!resumeData.projects || resumeData.projects.length === 0)
    );

  const fallbackData = {
    personalInfo: {
      fullName: 'Seshu Kumar',
      role: 'Full Stack Developer',
      email: 'seshu@example.com',
      phone: '+91 98765 43210',
      location: 'Bangalore, India',
      linkedin: 'linkedin.com/in/seshu-kumar',
      github: 'github.com/seshu-dev',
      portfolio: 'seshu.dev'
    },
    education: [{ id: '1', degree: 'B.Tech in Computer Science Engineering', school: 'RV College of Engineering, Bangalore', year: '2022 - 2026', cgpa: '8.7/10.0' }],
    skills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Express.js', 'MongoDB', 'HTML', 'CSS', 'Git', 'GitHub', 'Tailwind CSS'],
    projects: [
      { id: '1', title: 'OpportunityOS', link: 'github.com/seshu-dev/opportunityos', description: 'A full-stack platform to discover and track internships, scholarships and competitions.', techStack: 'React • Node.js • MongoDB • Tailwind CSS' },
      { id: '2', title: 'DevBlog', link: 'github.com/seshu-dev/devblog', description: 'A modern blog platform for developers to share technical articles.', techStack: 'Next.js • TypeScript • MongoDB • Tailwind CSS' },
      { id: '3', title: 'TaskFlow', link: 'github.com/seshu-dev/taskflow', description: 'A productivity tool to manage tasks and collaborate with your team.', techStack: 'React • Firebase • Tailwind CSS' }
    ],
    experience: [
      { id: '1', role: 'Frontend Developer Intern', company: 'CodeTech Solutions', duration: 'Jan 2025 - Apr 2025', responsibilities: '- Built responsive web applications using React and Tailwind CSS.\n- Collaborated with designers and backend teams to deliver features.' }
    ],
    certifications: [
      { id: '1', title: 'JavaScript Algorithms and Data Structures', issuer: 'freeCodeCamp', year: '2024' },
      { id: '2', title: 'Responsive Web Design', issuer: 'freeCodeCamp', year: '2024' }
    ]
  };

  const currentData = isEmpty ? fallbackData : resumeData;
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
      {/* Choose Template Header (No card wrapper) */}
      <div className="mb-4">
        <h3 className="text-[14px] font-bold text-slate-800 mb-3">Choose Template</h3>
        <div className="flex gap-3">
          {templates.map(t => (
            <button
              key={t}
              onClick={() => setActiveTemplate && setActiveTemplate(t)}
              className={`px-6 py-2 rounded-lg text-[13px] font-bold transition-all border flex items-center gap-2 ${
                activeTemplate === t 
                  ? 'border-[#6C4CF1] bg-indigo-50 text-[#6C4CF1]' 
                  : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
              }`}
            >
              {t}
              {activeTemplate === t && <div className="w-1.5 h-1.5 rounded-full bg-[#6C4CF1]"></div>}
            </button>
          ))}
        </div>
      </div>

      {/* Actual A4 Resume Paper */}
      <div 
        ref={ref}
        className="rounded-[16px] border shadow-[0_4px_16px_-4px_rgba(0,0,0,0.05)] w-full min-h-[900px] p-[40px] flex flex-col relative"
        style={{ 
          backgroundColor: props.isPdfMode ? '#FFFFFF' : '#ffffff',
          borderColor: props.isPdfMode ? '#FFFFFF' : '#e2e8f0'
        }}
      >
        {isEmpty && !props.isPdfMode && (
          <div className="absolute top-4 right-4 z-10 bg-[#fef3c7] text-[#b45309] text-xs font-bold px-3 py-1 rounded-full shadow-sm border border-[#fde68a]">
            Previewing Placeholder
          </div>
        )}
        {renderTemplate()}
      </div>
    </div>
  );
});

ResumePreviewPanel.displayName = 'ResumePreviewPanel';

export default ResumePreviewPanel;

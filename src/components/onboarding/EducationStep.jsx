import React, { useState } from 'react';
import { 
  GraduationCap, 
  Building2, 
  Check, 
  ArrowRight,
  ArrowLeft,
  Laptop,
  Beaker,
  Briefcase,
  MonitorPlay,
  Cpu,
  ShieldCheck,
  Database,
  Settings,
  Radio,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EducationStep({ onNext, onBack, data, updateData }) {
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  const degrees = [
    { id: 'B.Tech / B.E.', title: 'B.Tech', icon: GraduationCap },
    { id: 'BCA', title: 'BCA', icon: Laptop },
    { id: 'B.Sc', title: 'B.Sc', icon: Beaker },
    { id: 'MCA', title: 'MCA', icon: BookOpen },
    { id: 'BBA', title: 'BBA', icon: Building2 },
    { id: 'Other', title: 'Other', icon: Settings }
  ];

  const branches = [
    { id: 'Computer Science', title: 'Computer Science', icon: Laptop },
    { id: 'AI / ML', title: 'AI & ML', icon: Cpu },
    { id: 'Data Science', title: 'Data Science', icon: Database },
    { id: 'Cyber Security', title: 'Cyber Security', icon: ShieldCheck },
    { id: 'Electronics & Comm.', title: 'ECE', icon: Radio },
    { id: 'Electrical Eng.', title: 'EEE', icon: Cpu },
    { id: 'Mechanical Eng.', title: 'Mechanical', icon: Settings },
    { id: 'Civil Eng.', title: 'Civil', icon: Building2 },
  ];

  const years = [
    { id: '1st Year', title: '1st Year' },
    { id: '2nd Year', title: '2nd Year' },
    { id: '3rd Year', title: '3rd Year' },
    { id: '4th Year', title: '4th Year' },
    { id: '5th Year', title: '5th Year' },
    { id: 'Graduated', title: 'Graduate' }
  ];

  const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];

  const validate = () => {
    const newErrors = {};
    if (!data.university?.trim()) newErrors.university = 'Required';
    if (!data.degree) newErrors.degree = 'Required';
    if (!data.branch) newErrors.branch = 'Required';
    if (!data.currentYear) newErrors.currentYear = 'Required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  const handleSelect = (field, value) => {
    updateData({ [field]: value });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="flex flex-col w-full px-2 sm:px-6 relative">
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col w-full mx-auto relative z-10 max-w-[760px]"
      >
        
        {/* Header */}
        <div className="mb-6 w-full pt-4">
          <h2 className="text-[32px] font-[800] leading-[1.05] tracking-[-0.02em] text-[#1F2435] flex items-center gap-[12px]">
            Education <span className="text-[24px] leading-none flex items-center">🎓</span>
          </h2>
          <p className="text-[15px] font-[500] text-[#64748B] mt-[8px]">Let's understand your academic journey.</p>
        </div>

        {/* Scrollable Form Container with Compressed Spacing */}
        <div className="px-2 pr-[8px] pb-6 flex flex-col gap-8">
          
          {/* College Input */}
          <div className="flex flex-col gap-2 w-full">
            <label className="text-[14px] font-semibold text-[#1F2435]">
              College / University <span className="text-[#7C3AED]">*</span>
            </label>
            <div className="relative group w-full">
              <div className={`relative flex items-center bg-gradient-to-b from-[#ffffff] to-[#fcfcff] border rounded-[18px] transition-all duration-200 h-[68px] px-6 ${errors.university ? 'border-red-400' : focusedField === 'university' ? 'border-[#C4B5FD] shadow-[0_0_0_4px_rgba(124,58,237,0.08)]' : 'border-[#E8EAF5] hover:border-[#C4B5FD]'}`}>
                <div className="mr-3 flex items-center justify-center pointer-events-none transition-colors duration-200">
                  <Building2 size={22} strokeWidth={2} className={errors.university ? "text-red-500" : focusedField === 'university' ? "text-[#7C3AED]" : "text-[#94A3B8]"} />
                </div>
                <input
                  type="text"
                  name="university"
                  value={data.university || ''}
                  onChange={(e) => {
                    updateData({ university: e.target.value });
                    if(errors.university) setErrors(prev => ({...prev, university: ''}));
                  }}
                  onFocus={() => setFocusedField('university')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full h-full bg-transparent border-none focus:ring-0 text-[16px] text-[#1F2435] outline-none placeholder-[#94A3B8]"
                  placeholder="Enter your college or university"
                />
              </div>
            </div>
          </div>

          {/* Degree Selection */}
          <div className="flex flex-col gap-2 w-full">
            <label className="text-[14px] font-semibold text-[#1F2435]">
              Degree <span className="text-[#7C3AED]">*</span>
            </label>
            <div className="flex flex-wrap gap-3">
              {degrees.map((deg) => {
                const isSelected = data.degree === deg.id;
                return (
                  <motion.button
                    key={deg.id}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    animate={{ scale: isSelected ? 1.02 : 1 }}
                    onClick={() => handleSelect('degree', deg.id)}
                    className={`relative flex items-center justify-center px-5 py-3.5 rounded-xl border transition-all duration-200 min-w-[110px] flex-1 sm:flex-none ${isSelected ? 'border-transparent bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white shadow-[0_8px_20px_rgba(124,58,237,0.3)]' : 'border-[#E8EAF5] bg-white hover:border-[#C4B5FD] hover:bg-[#F5F2FF] hover:shadow-md shadow-sm'}`}
                  >
                    <span className={`text-[14px] font-semibold tracking-wide ${isSelected ? 'text-white' : 'text-[#475569]'}`}>{deg.title}</span>
                    {isSelected && <Check size={16} className="ml-2 text-white" strokeWidth={3} />}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Branch Selection */}
          <div className="flex flex-col gap-2 w-full">
            <label className="text-[14px] font-semibold text-[#1F2435]">
              Branch <span className="text-[#7C3AED]">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {branches.map((branch) => {
                const isSelected = data.branch === branch.id;
                return (
                  <motion.button
                    key={branch.id}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    animate={{ scale: isSelected ? 1.02 : 1 }}
                    onClick={() => handleSelect('branch', branch.id)}
                    className={`relative flex items-center justify-center px-4 py-3.5 rounded-xl border transition-all duration-200 w-full ${isSelected ? 'border-transparent bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white shadow-[0_8px_20px_rgba(124,58,237,0.3)]' : 'border-[#E8EAF5] bg-white hover:border-[#C4B5FD] hover:bg-[#F5F2FF] hover:shadow-md shadow-sm'}`}
                  >
                    <span className={`text-[13px] font-semibold text-center leading-tight ${isSelected ? 'text-white' : 'text-[#475569]'}`}>{branch.title}</span>
                    {isSelected && <Check size={15} className="ml-1.5 text-white shrink-0" strokeWidth={3} />}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Current Year */}
          <div className="flex flex-col gap-2 w-full">
            <label className="text-[14px] font-semibold text-[#1F2435]">
              Current Year <span className="text-[#7C3AED]">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {years.map((year) => {
                const isSelected = data.currentYear === year.id;
                return (
                  <motion.button
                    key={year.id}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    animate={{ scale: isSelected ? 1.02 : 1 }}
                    onClick={() => handleSelect('currentYear', year.id)}
                    className={`relative flex items-center justify-center px-4 py-3.5 rounded-xl border transition-all duration-200 w-full ${isSelected ? 'border-transparent bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white shadow-[0_8px_20px_rgba(124,58,237,0.3)]' : 'border-[#E8EAF5] bg-white hover:border-[#C4B5FD] hover:bg-[#F5F2FF] hover:shadow-md shadow-sm'}`}
                  >
                    <span className={`text-[13px] font-semibold text-center leading-tight ${isSelected ? 'text-white' : 'text-[#475569]'}`}>{year.title}</span>
                    {isSelected && <Check size={15} className="ml-1.5 text-white shrink-0" strokeWidth={3} />}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Optional Fields (Semester & CGPA) with generous spacing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
            <div className="flex flex-col gap-2 w-full">
              <label className="text-[14px] font-semibold text-[#1F2435]">
                Semester <span className="text-slate-400 normal-case font-medium">(Optional)</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {semesters.map((sem) => {
                  const isSelected = data.currentSemester === sem;
                  return (
                    <motion.button
                      key={sem}
                      onClick={() => handleSelect('currentSemester', sem)}
                      whileHover={{ y: -2 }}
                      animate={{ scale: isSelected ? 1.02 : 1 }}
                      className={`w-[46px] h-[46px] rounded-xl flex items-center justify-center text-[15px] font-bold transition-all duration-200 border ${isSelected ? 'bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white border-transparent shadow-[0_8px_20px_rgba(124,58,237,0.3)]' : 'bg-white border-[#E8EAF5] text-[#475569] hover:border-[#C4B5FD] hover:bg-[#F5F2FF] hover:shadow-md shadow-sm'}`}
                    >
                      {sem}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <label className="text-[14px] font-semibold text-[#1F2435]">
                CGPA / % <span className="text-slate-400 normal-case font-medium">(Optional)</span>
              </label>
              <div className="relative group w-full">
                <div className={`relative flex items-center bg-gradient-to-b from-[#ffffff] to-[#fcfcff] border rounded-[18px] transition-all duration-200 h-[68px] px-6 ${focusedField === 'cgpa' ? 'border-[#C4B5FD] shadow-[0_0_0_4px_rgba(124,58,237,0.08)]' : 'border-[#E8EAF5] hover:border-[#C4B5FD]'}`}>
                  <input
                    type="text"
                    name="cgpa"
                    value={data.cgpa || ''}
                    onChange={(e) => updateData({ cgpa: e.target.value })}
                    onFocus={() => setFocusedField('cgpa')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full h-full bg-transparent border-none focus:ring-0 text-[16px] text-[#1F2435] outline-none placeholder-[#94A3B8]"
                    placeholder="e.g. 8.75 or 82%"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between w-full pt-4 mt-auto pb-4">
          {onBack ? (
            <button 
              onClick={onBack}
              className="flex items-center gap-3 text-[#1F2435] font-bold text-[15px] hover:text-[#7C3AED] transition-colors group"
            >
              <div className="w-[58px] h-[58px] rounded-full border border-white/60 bg-white/40 backdrop-blur-md shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-center group-hover:border-[#C4B5FD] group-hover:shadow-[0_0_15px_rgba(124,58,237,0.15)] transition-all duration-200">
                <ArrowLeft size={22} strokeWidth={2} className="text-slate-600 group-hover:text-[#7C3AED] transition-colors" />
              </div>
              Back
            </button>
          ) : <div></div>}
          
          <button
            onClick={handleNext}
            className="h-[58px] px-8 bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white rounded-[18px] font-bold text-[16px] shadow-[0_12px_24px_rgba(124,58,237,0.25)] hover:-translate-y-[2px] hover:shadow-[0_16px_32px_rgba(124,58,237,0.35)] active:translate-y-0 active:scale-[0.98] active:shadow-[0_4px_12px_rgba(124,58,237,0.2)] transition-all duration-200 flex items-center justify-center gap-3"
          >
            Continue
            <ArrowRight size={22} strokeWidth={2} />
          </button>
        </div>

      </motion.div>
    </div>
  );
}

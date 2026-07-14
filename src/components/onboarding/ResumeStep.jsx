import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, ArrowRight, ArrowLeft, CheckCircle2, FileText, Sparkles } from 'lucide-react';

export default function ResumeStep({ onNext, onBack }) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const fileInputRef = useRef(null);

  const benefits = [
    "AI Resume Analysis",
    "Personalized Opportunity Matching",
    "ATS Score & Resume Feedback",
    "Skill Gap Analysis",
    "Faster Profile Completion"
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      setIsUploaded(true);
    }
  };

  const handleDropzoneClick = () => {
    if (!isUploaded) {
      fileInputRef.current?.click();
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return '0 MB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="flex flex-col w-full px-2 sm:px-6 relative h-full">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col w-full mx-auto relative z-10 max-w-[900px] h-full"
      >
        
        {/* Header */}
        <div className="mb-8 w-full pt-4">
          <h2 className="text-[28px] font-[800] leading-[1.1] tracking-[-0.02em] text-[#1F2435] flex items-center gap-[10px]">
            You're All Set! <span className="text-[24px] leading-none flex items-center">🎉</span>
          </h2>
          <p className="text-[16px] font-[500] text-[#64748B] mt-[8px]">
            Your profile is ready. Upload your resume now to unlock AI-powered career features, or skip and do it later from your dashboard.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8 flex-1">
          
          {/* Left Column: Benefits Section */}
          <div className="flex flex-col">
            <div className="bg-gradient-to-b from-purple-50 to-indigo-50/30 border border-purple-100 rounded-[24px] p-8 shadow-sm h-full hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-purple-200/50 flex items-center justify-center text-purple-600">
                  <Sparkles size={20} />
                </div>
                <h3 className="text-[18px] font-bold text-purple-900">Unlock with Your Resume</h3>
              </div>
              
              <ul className="space-y-5">
                {benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-center gap-4 group">
                    <div className="w-6 h-6 rounded-full bg-white shadow-sm border border-purple-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle2 size={14} className="text-purple-600" />
                    </div>
                    <span className="text-[15px] font-medium text-slate-700 leading-tight group-hover:text-purple-900 transition-colors">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Upload Card */}
          <div className="flex flex-col gap-4">
            <input 
              type="file" 
              accept="application/pdf"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <div 
              onClick={handleDropzoneClick}
              className={`
                flex-1 w-full min-h-[280px] bg-white/60 backdrop-blur-xl border-2 border-dashed 
                rounded-[24px] cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-4 
                ${isUploaded 
                  ? 'border-green-400 bg-green-50 shadow-[0_0_0_4px_rgba(74,222,128,0.1)] cursor-default' 
                  : 'border-slate-200 hover:border-purple-400 hover:bg-purple-50 hover:shadow-[0_8px_30px_rgba(168,85,247,0.15)] group hover:-translate-y-1'
                }
              `}
            >
              {isUploaded && uploadedFile ? (
                <>
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
                    <FileText size={40} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col items-center gap-1 text-center">
                    <span className="text-[18px] font-bold text-green-700">Resume Uploaded!</span>
                    <span className="text-[14px] font-medium text-green-600/70">{uploadedFile.name} ({formatSize(uploadedFile.size)})</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                    <UploadCloud size={40} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col items-center gap-2 text-center px-4">
                    <span className="text-[18px] font-bold text-slate-800">📄 Upload Resume</span>
                    <span className="text-[15px] font-medium text-slate-600">Drag & Drop your PDF here</span>
                    <span className="text-[14px] font-medium text-slate-400 mt-1">or <span className="text-purple-600 font-semibold underline decoration-purple-200 underline-offset-2">Choose File</span></span>
                    <span className="text-[13px] font-semibold text-slate-400 mt-3 bg-slate-100 px-3 py-1 rounded-full">Maximum size: 5 MB</span>
                  </div>
                </>
              )}
            </div>

            {/* Empty State Reassurance */}
            {!isUploaded && (
              <div className="text-center bg-slate-50 border border-slate-100 rounded-[16px] p-4 mt-2">
                <p className="text-[13px] font-medium text-slate-500">
                  No worries! You can upload your resume anytime from your dashboard.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between w-full pt-6 mt-auto border-t border-slate-100">
          {onBack ? (
            <button 
              onClick={onBack}
              className="flex items-center gap-3 text-slate-700 font-bold text-[15px] hover:text-purple-600 transition-colors group"
            >
              <div className="w-[52px] h-[52px] rounded-full border border-slate-200 bg-white shadow-sm flex items-center justify-center group-hover:border-purple-300 group-hover:shadow-md transition-all duration-200">
                <ArrowLeft size={20} strokeWidth={2} className="text-slate-500 group-hover:text-purple-600 transition-colors" />
              </div>
              Back
            </button>
          ) : <div></div>}
          
          <div className="flex items-center gap-4 ml-auto">
            {!isUploaded && (
              <button 
                onClick={onNext}
                className="text-slate-500 hover:text-slate-800 font-bold text-[15px] transition-colors px-4 py-2"
              >
                Skip for Now
              </button>
            )}
            
            <button
              onClick={() => {
                if (!isUploaded) {
                  fileInputRef.current?.click();
                } else {
                  onNext();
                }
              }}
              className="h-[52px] px-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-[16px] font-bold text-[16px] shadow-[0_8px_20px_rgba(124,58,237,0.25)] hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(124,58,237,0.35)] active:translate-y-0 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3"
            >
              {isUploaded ? 'Complete Setup' : 'Upload Resume'}
              <ArrowRight size={20} strokeWidth={2} />
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}

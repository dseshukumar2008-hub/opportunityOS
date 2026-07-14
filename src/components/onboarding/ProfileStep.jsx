import React, { useState, useRef } from 'react';
import { User, Phone, Calendar, ArrowLeft, ArrowRight, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfileStep({ onNext, onBack, data, updateData }) {
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const dateInputRef = useRef(null);

  const handleDateClick = () => {
    if (dateInputRef.current) {
      if (typeof dateInputRef.current.showPicker === 'function') {
        try { dateInputRef.current.showPicker(); } catch (e) { dateInputRef.current.focus(); dateInputRef.current.click(); }
      } else {
        dateInputRef.current.focus();
        dateInputRef.current.click();
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData({ [name]: value });
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!data.fullName?.trim()) newErrors.fullName = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  const renderField = (name, type, label, IconComponent, placeholder, isRequired = false) => {
    const isError = errors[name];
    const isFocused = focusedField === name;
    
    if (name === 'dob') {
      return (
        <div className="flex flex-col gap-2 w-full mb-6">
          <label className="text-[14px] font-semibold text-[#1F2435]">
            {label} {isRequired && <span className="text-[#7C3AED]">*</span>}
          </label>
          <div className="relative group w-full">
            <div 
              onClick={handleDateClick}
              className={`relative flex items-center bg-gradient-to-b from-[#ffffff] to-[#fcfcff] border rounded-[18px] transition-all duration-200 h-[68px] cursor-pointer px-6 ${isError ? 'border-red-400' : isFocused ? 'border-[#C4B5FD] shadow-[0_0_0_4px_rgba(124,58,237,0.08)]' : 'border-[#E8EAF5] hover:border-[#C4B5FD]'}`}
            >
              <div className="mr-3 flex items-center justify-center pointer-events-none">
                <IconComponent size={22} strokeWidth={2} className={isError ? "text-red-500" : isFocused ? "text-[#7C3AED]" : "text-[#94A3B8]"} />
              </div>
              <div className="relative flex-1 h-full">
                {(!data[name] && !isFocused) && (
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <span className="text-[#94A3B8] text-[16px]">{placeholder}</span>
                  </div>
                )}
                <input
                  ref={dateInputRef}
                  type="date"
                  name={name}
                  value={data[name] || ''}
                  onChange={handleChange}
                  onClick={(e) => e.stopPropagation()} 
                  onFocus={() => setFocusedField(name)}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full h-full bg-transparent border-none focus:ring-0 text-[16px] outline-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer relative z-10 ${(!data[name] && !isFocused) ? 'text-transparent' : 'text-[#1F2435]'}`}
                />
              </div>
              <div className="ml-3 flex items-center justify-center pointer-events-none">
                <Calendar size={22} strokeWidth={2} className="text-[#94A3B8]" />
              </div>
            </div>
            {isError && (
              <div className="absolute -bottom-5 right-0">
                <span className="text-red-500 text-xs font-medium">{isError}</span>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2 w-full mb-6">
        <label className="text-[14px] font-semibold text-[#1F2435]">
          {label} {isRequired && <span className="text-[#7C3AED]">*</span>}
        </label>
        <div className="relative group w-full">
          <div className={`relative flex items-center bg-gradient-to-b from-[#ffffff] to-[#fcfcff] border rounded-[18px] transition-all duration-200 h-[68px] px-6 ${isError ? 'border-red-400' : isFocused ? 'border-[#C4B5FD] shadow-[0_0_0_4px_rgba(124,58,237,0.08)]' : 'border-[#E8EAF5] hover:border-[#C4B5FD]'}`}>
            <div className="mr-3 flex items-center justify-center pointer-events-none">
              <IconComponent size={22} strokeWidth={2} className={isError ? "text-red-500" : isFocused ? "text-[#7C3AED]" : "text-[#94A3B8]"} />
            </div>
            <div className="relative flex-1 h-full">
              <input
                type={type}
                name={name}
                value={data[name] || ''}
                onChange={handleChange}
                onFocus={() => setFocusedField(name)}
                onBlur={() => setFocusedField(null)}
                className="w-full h-full bg-transparent border-none focus:ring-0 text-[16px] text-[#1F2435] outline-none placeholder-[#94A3B8]"
                placeholder={placeholder}
              />
            </div>
          </div>
          {isError && (
             <div className="absolute -bottom-5 right-0">
               <span className="text-red-500 text-xs font-medium">{isError}</span>
             </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div 
      className="w-full relative" 
      style={{ height: 'calc(100vh - 32px)', maxHeight: 'calc(100vh - 32px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
    >
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col w-full flex-1 relative z-10 pt-[24px] pb-[20px] px-8 sm:px-12 md:px-16 overflow-y-auto scrollbar-hide"
      >
        
        {/* Header - Full width of the padded container */}
        <div className="mb-6 w-full pt-4">
          <h2 className="text-[32px] font-[800] leading-[1.08] tracking-[-0.02em] text-[#1F2435] flex items-center gap-[12px]">
            Personal Details <span className="text-[24px] leading-none flex items-center">✨</span>
          </h2>
          <p className="text-[15px] font-[500] text-[#64748B] mt-[8px]">Let's set up your core identity.</p>
        </div>

        {/* Form Container - Constrained width so it doesn't touch divider edges */}
        <div className="flex flex-col max-w-[560px] w-full">
          {renderField("fullName", "text", "Full Name", User, "e.g. Rohit", true)}
          {renderField("phone", "tel", "Phone Number (Optional)", Phone, "Enter your phone number", false)}
          {renderField("dob", "date", "Date of Birth (Optional)", Calendar, "DD / MM / YYYY", false)}

          {/* Security Notice */}
          <div className="mt-4 mb-8 bg-white/40 backdrop-blur-md border border-white/60 rounded-[18px] px-6 py-4 flex items-center gap-3 shadow-[0_4px_12px_rgba(124,58,237,0.03)]">
            <Lock size={22} className="text-[#7C3AED] shrink-0 opacity-80" strokeWidth={2} />
            <p className="text-[14px] text-[#7C3AED] font-medium leading-tight">Your personal information is kept private and secure.</p>
          </div>
        </div>

        {/* Action Buttons - Constrained width to align with form */}
        <div className="flex items-center justify-between w-full max-w-[560px]">
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

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, File, X, Sparkles, Bot } from 'lucide-react';
import HowItWorksModal from './HowItWorksModal';
import { toast } from 'react-hot-toast';

export default function LinkedInUpload({ onAnalyze, loading }) {
  const [textData, setTextData] = useState('');
  const [fileData, setFileData] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      processFile(file);
    } else {
      toast.error('Please upload a PDF file.');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/pdf') {
        processFile(file);
      } else {
        toast.error('Please upload a PDF file.');
      }
    }
  };

  const processFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target.result.split(',')[1];
      setFileData({
        name: file.name,
        type: file.type,
        base64: base64String
      });
      setTextData(''); // Clear text if file is uploaded
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setFileData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    if (!textData.trim() && !fileData) {
      toast.error("Please provide your LinkedIn profile text or upload a PDF.");
      return;
    }
    onAnalyze({ textData, fileData });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
      
      {/* Hero Section */}
      <section className="text-center space-y-2 mb-4 relative">
        <div className="flex justify-end absolute right-0 top-0">
          <button 
            onClick={() => setShowHowItWorks(true)}
            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            How It Works
          </button>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-[#6D4AFF] rounded-full text-xs font-bold tracking-wide">
          <Bot size={16} /> OpportunityOS AI Feature
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-2">
          LinkedIn Analyzer <Sparkles className="text-amber-400" size={24} />
        </h1>
        <p className="text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
          Upload your LinkedIn profile as a PDF or paste the text content. Our AI analyzer will analyze it and provide actionable suggestions to boost your visibility.
        </p>
      </section>

      <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-slate-200">
        
        {/* Upload Zone */}
        {!fileData ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl py-6 px-8 transition-all h-[220px] flex flex-col justify-center ${
              isDragging
                ? 'border-[#6D4AFF] bg-indigo-50'
                : 'border-slate-300 hover:border-[#6D4AFF]/50 bg-slate-50 hover:bg-slate-50/80'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="application/pdf"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              disabled={loading || textData.trim().length > 0}
            />
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isDragging ? 'bg-[#6D4AFF] text-white' : 'bg-white text-[#6D4AFF] shadow-sm'
              }`}>
                <Upload size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-0.5">
                  Upload LinkedIn PDF
                </h3>
                <p className="text-xs text-slate-500">
                  Drag and drop your PDF here, or click to browse
                </p>
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-1">
                Supported format: PDF
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                <File className="text-[#6D4AFF]" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{fileData.name}</h4>
                <p className="text-sm text-slate-500">Ready for analysis</p>
              </div>
            </div>
            <button
              onClick={handleRemoveFile}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-full transition-colors"
              disabled={loading}
            >
              <X size={20} />
            </button>
          </div>
        )}

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-slate-500 font-bold uppercase tracking-wider text-[11px]">OR PASTE TEXT</span>
          </div>
        </div>

        {/* Text Area */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-[#6D4AFF]" />
            <h3 className="font-bold text-slate-900 text-sm">Paste Profile Content</h3>
          </div>
          <textarea
            value={textData}
            onChange={(e) => setTextData(e.target.value)}
            disabled={loading || fileData !== null}
            placeholder="Go to your LinkedIn profile, select all text (Ctrl+A / Cmd+A), copy, and paste it here..."
            className="w-full h-[140px] p-4 bg-slate-50 border border-slate-200 rounded-xl resize-none focus:bg-white focus:border-[#6D4AFF] focus:ring-4 focus:ring-indigo-50 transition-all outline-none text-slate-700 text-sm disabled:opacity-50"
          />
        </div>

        {/* Action Area */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading || (!textData.trim() && !fileData)}
            className="flex items-center gap-2 bg-[#6D4AFF] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#5B3DE6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-sm"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Analyzing Profile...
              </>
            ) : (
              <>
                <Sparkles size={16} /> Analyze LinkedIn Profile
              </>
            )}
          </button>
        </div>
      </div>

      <HowItWorksModal isOpen={showHowItWorks} onClose={() => setShowHowItWorks(false)} />
    </div>
  );
}

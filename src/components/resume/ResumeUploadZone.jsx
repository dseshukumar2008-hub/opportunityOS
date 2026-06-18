import { useState, useRef } from 'react';
import { UploadCloud, FileText, X, File as FileIcon, CheckCircle2, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { analyticsService } from '../../services/analyticsService';

export default function ResumeUploadZone({ onAnalyze, uploadProgress = 0, storedResumeName = null, onDeleteResume }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const validateFile = (file) => {
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    if (!validTypes.includes(file.type)) {
      toast.error('Only PDF and DOCX files are allowed.');
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File is too large. Maximum size is 5MB.');
      return false;
    }
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        analyticsService.trackEvent('Resume Uploaded', { fileName: file.name, fileSize: file.size });
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        analyticsService.trackEvent('Resume Uploaded', { fileName: file.name, fileSize: file.size });
      }
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleAnalyzeClick = () => {
    if (selectedFile) onAnalyze(selectedFile);
  };

  const isUploading = uploadProgress > 0 && uploadProgress < 100;

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 p-6 md:p-8">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Upload Your Resume</h2>
        <p className="text-sm text-slate-500 mt-1">
          {storedResumeName
            ? 'Your resume is saved. Upload a new one to replace it.'
            : "We'll analyze it and provide actionable AI-powered feedback."}
        </p>
      </div>

      {/* Stored resume card */}
      {storedResumeName && !selectedFile && (
        <div className="mb-6 bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
              <CheckCircle2 size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-emerald-800 truncate">Resume Saved</p>
              <p className="text-xs text-emerald-600 truncate">{storedResumeName.replace(/^\d+_/, '')}</p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <label className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-200 text-emerald-700 rounded-lg text-xs font-bold cursor-pointer hover:bg-emerald-50 transition-colors">
              <RefreshCw size={12} />
              Replace
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleChange} className="hidden" />
            </label>
            {onDeleteResume && (
              <button
                onClick={onDeleteResume}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-200 text-red-600 rounded-lg text-xs font-bold hover:bg-red-50 transition-colors"
              >
                <X size={12} />
                Delete
              </button>
            )}
          </div>
        </div>
      )}

      {/* Drop zone */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 transition-colors flex flex-col items-center justify-center min-h-[200px] ${
          dragActive ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {!selectedFile && (
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        )}

        {!selectedFile ? (
          <div className="flex flex-col items-center pointer-events-none">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <UploadCloud size={24} className="text-indigo-600" />
            </div>
            <p className="text-sm font-semibold text-slate-700">Drag &amp; drop your resume here</p>
            <p className="text-xs font-medium text-slate-500 mt-1">Supports PDF, DOCX (Max 5MB)</p>
            <button className="mt-4 text-xs font-bold bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg pointer-events-auto hover:bg-slate-50 transition-colors">
              Browse Files
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full z-10">
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between w-full max-w-sm mb-6">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                  <FileIcon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{selectedFile.name}</p>
                  <p className="text-xs font-medium text-slate-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemove}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-2 shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            {/* Upload Progress Bar */}
            {isUploading && (
              <div className="w-full max-w-sm mb-4">
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                  <span>Uploading to cloud...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleAnalyzeClick}
              disabled={isUploading}
              className="bg-[#6C4CF1] hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold text-sm px-8 py-2.5 rounded-lg transition-colors flex items-center gap-2"
            >
              <FileText size={16} />
              Analyze Resume
            </button>
          </div>
        )}
      </div>

      {/* No resume CTA */}
      {!storedResumeName && !selectedFile && (
        <p className="text-center text-xs text-slate-400 mt-4 font-medium">
          Upload a resume to unlock AI analysis and smarter recommendations.
        </p>
      )}
    </div>
  );
}

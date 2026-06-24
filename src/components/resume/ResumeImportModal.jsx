import { useState, useRef } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  Loader2, 
  FileUp,
  AlertCircle
} from 'lucide-react';
import { geminiService } from '../../services/geminiService';
import { useResume } from '../../contexts/ResumeContext';
import toast from 'react-hot-toast';

export default function ResumeImportModal({ isOpen, onClose }) {
  const { updatePersonalInfo, updateSkills, addArrayItem, setResumeData, createResume, switchResume } = useResume();
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'text'
  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are currently supported for direct upload.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB.');
      return;
    }

    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result.split(',')[1];
        await processExtraction(null, { mimeType: file.type, base64: base64String });
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      toast.error('Failed to read file.');
      setIsProcessing(false);
    }
  };

  const handleTextImport = async () => {
    if (!textInput.trim()) {
      toast.error('Please paste your resume text.');
      return;
    }
    setIsProcessing(true);
    await processExtraction(textInput, null);
  };

  const processExtraction = async (textData, fileData) => {
    try {
      const extractedData = await geminiService.extractResumeData(textData, fileData);
      
      if (extractedData) {
        // 1. Create a brand new isolated document
        const newId = await createResume('Imported Resume');
        
        if (newId) {
          // 2. Switch context to the new document
          switchResume(newId);
          
          // 3. Inject the extracted data into this new document safely
          setResumeData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, ...extractedData.personalInfo },
            education: extractedData.education || [],
            skills: extractedData.skills || [],
            projects: extractedData.projects || [],
            experience: extractedData.experience || [],
            certifications: extractedData.certifications || []
          }));
          
          toast.success('Resume imported successfully into a new document!');
          onClose();
        } else {
          toast.error('Failed to initialize new document for import.');
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to parse resume. Please try again or use text paste.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileUp size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Import Resume</h2>
              <p className="text-xs text-slate-500 font-medium">Use AI to automatically fill your resume</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            disabled={isProcessing}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 border-4 border-indigo-100 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                <Loader2 size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600 animate-pulse" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Analyzing Document</h3>
              <p className="text-sm text-slate-500 max-w-[250px]">
                Our AI is extracting your experience, skills, and projects...
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              
              {/* Tabs */}
              <div className="flex p-1 bg-slate-100 rounded-xl">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'upload' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Upload PDF
                </button>
                <button
                  onClick={() => setActiveTab('text')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'text' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Paste Text
                </button>
              </div>

              {/* Upload Tab */}
              {activeTab === 'upload' && (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-indigo-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 transition-all group"
                >
                  <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <UploadCloud size={28} />
                  </div>
                  <h3 className="text-[15px] font-bold text-slate-900 mb-1">Click to upload PDF</h3>
                  <p className="text-xs font-medium text-slate-500">Maximum file size 5MB.</p>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".pdf"
                    onChange={handleFileSelect}
                  />
                </div>
              )}

              {/* Paste Text Tab */}
              {activeTab === 'text' && (
                <div className="flex flex-col gap-3">
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Paste your resume content here. E.g., copy-paste from LinkedIn or a Word document..."
                    className="w-full h-48 p-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-none"
                  ></textarea>
                  <button
                    onClick={handleTextImport}
                    className="w-full py-3 bg-[#6C4CF1] hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-[0_4px_14px_0_rgba(108,76,241,0.39)]"
                  >
                    Analyze and Import
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { motion } from 'framer-motion';
import { Database, Download, Trash2 } from 'lucide-react';

export default function DataStorageSettings() {
  const handleDownload = () => {
    alert("Downloading data package...");
  };

  const handleClearCache = () => {
    alert("Local cache cleared.");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="card-standard p-8"
    >
      <div className="flex items-start gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-[#F3F0FF] text-[#6C4CF1] flex items-center justify-center shrink-0">
          <Database size={24} />
        </div>
        <div>
          <h2 className="text-[18px] font-bold text-slate-900">Data & Storage</h2>
          <p className="text-[13px] text-slate-500 font-medium mt-0.5">Manage your personal data and cache.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="p-6 border border-slate-100 rounded-xl bg-slate-50">
          <h3 className="text-[14px] font-bold text-slate-900 mb-1">Storage Used</h3>
          <p className="text-[32px] font-extrabold text-[#6C4CF1]">14.2 MB</p>
          <p className="text-[12px] text-slate-500 mt-1">out of 500 MB limit</p>
        </div>
        <div className="p-6 border border-slate-100 rounded-xl bg-slate-50 flex flex-col justify-center">
          <button 
            onClick={handleClearCache}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-[13px] rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Trash2 size={16} />
            Clear Local Cache
          </button>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-8">
        <h3 className="text-[14px] font-bold text-slate-900 mb-2">Download Your Data</h3>
        <p className="text-[13px] text-slate-500 mb-4">Get a copy of your profile, applications, and activity history in JSON format.</p>
        <button 
          onClick={handleDownload}
          className="px-6 py-2.5 text-[13px] font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all flex items-center gap-2 shadow-sm"
        >
          <Download size={16} />
          Request Data Archive
        </button>
      </div>

    </motion.div>
  );
}

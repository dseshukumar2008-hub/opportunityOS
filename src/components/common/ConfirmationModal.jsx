import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = true,
  isLoading = false,
}) {
  const modalRef = useRef(null);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  // Trap focus (simple version)
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => !isLoading && onClose()}
          />
          <motion.div
            ref={modalRef}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden outline-none"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Header / Icon */}
            <div className="p-6 pb-0 flex flex-col items-center text-center">
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 shrink-0 ${
                  isDestructive ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'
                }`}
              >
                <AlertTriangle size={24} strokeWidth={2.5} />
              </div>
              <h2 id="modal-title" className="text-xl font-bold text-slate-900 mb-2">
                {title}
              </h2>
              <div className="text-[15px] text-slate-500 font-medium whitespace-pre-wrap">
                {message}
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 flex items-center gap-3 mt-2">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 text-[14px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={`flex-1 px-4 py-2.5 text-[14px] font-bold text-white rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 ${
                  isDestructive 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-[#6C4CF1] hover:bg-indigo-700'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Loading...
                  </>
                ) : (
                  confirmText
                )}
              </button>
            </div>
            
            <button 
              onClick={onClose}
              disabled={isLoading}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

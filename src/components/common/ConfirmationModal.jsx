import { AlertTriangle, X } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

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
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnBackdropClick={!isLoading}
      ariaLabelledby="modal-title"
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
        <Button
          variant="secondary"
          className="flex-1"
          onClick={onClose}
          disabled={isLoading}
        >
          {cancelText}
        </Button>
        <Button
          variant={isDestructive ? 'danger' : 'primary'}
          className="flex-1"
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {confirmText}
        </Button>
      </div>
      
      <button 
        onClick={onClose}
        disabled={isLoading}
        className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
        aria-label="Close modal"
      >
        <X size={20} />
      </button>
    </Modal>
  );
}

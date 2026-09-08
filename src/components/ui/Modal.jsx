import { motion, AnimatePresence } from 'framer-motion';
import { useModalBehavior } from '../../hooks/useModalBehavior';

/**
 * Reusable Modal Component
 * Encapsulates backdrop, animations, and accessibility logic.
 */
export default function Modal({
  isOpen,
  onClose,
  children,
  className = '',
  maxWidth = 'max-w-md',
  zIndex = 100,
  ariaLabelledby = 'modal-title',
  closeOnBackdropClick = true,
  animateY = 10,
}) {
  const modalRef = useModalBehavior(isOpen, onClose);

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ zIndex }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => closeOnBackdropClick && onClose()}
          />
          
          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.95, y: animateY }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: animateY }}
            className={`relative w-full ${maxWidth} bg-white rounded-2xl shadow-2xl overflow-hidden outline-none ${className}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={ariaLabelledby}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

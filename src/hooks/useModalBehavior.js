import { useEffect, useRef } from 'react';

/**
 * A hook to manage standard modal behaviors:
 * - Focus trapping on mount
 * - Closing on Escape key press
 * - Locking background scrolling
 * 
 * @param {boolean} isOpen Whether the modal is currently open
 * @param {function} onClose Callback to close the modal
 * @param {boolean} disableScrollLock Whether to disable background scroll locking
 * @param {boolean} isLocked When true, Escape key is suppressed (e.g. during a save operation)
 * @returns {React.MutableRefObject} A ref to attach to the modal container
 */
export function useModalBehavior(isOpen, onClose, disableScrollLock = false, isLocked = false) {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Trap focus & restore focus on close
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      if (modalRef.current) {
        modalRef.current.focus();
      }
    } else if (previousFocusRef.current) {
      if (typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus();
      }
      previousFocusRef.current = null;
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isLocked) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLocked, onClose]);

  // Lock scroll
  useEffect(() => {
    if (disableScrollLock) return;
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, disableScrollLock]);

  return modalRef;
}

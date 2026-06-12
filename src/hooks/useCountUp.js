import { useEffect, useRef, useState } from 'react';

/**
 * Animates a number from 0 to `target` over `duration` ms.
 * Returns the current animated value as a formatted string.
 */
export function useCountUp(target, duration = 1800, suffix = '', decimals = 0) {
  const [count, setCount] = useState(0);
  const frameRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const numericTarget = typeof target === 'string'
      ? parseFloat(target.replace(/[^0-9.]/g, ''))
      : target;

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = numericTarget * eased;
      setCount(current);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);

  const formatted = count.toFixed(decimals);
  // Re-apply original suffix / K formatting
  if (typeof target === 'string' && target.includes('k')) {
    return (count / 1000).toFixed(1) + 'k' + suffix;
  }
  return formatted + suffix;
}

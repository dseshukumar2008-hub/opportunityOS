import { useState } from 'react';

/**
 * UserAvatar
 *
 * Renders a user avatar with a robust, multi-layer fallback:
 *   1. If `src` is a valid URL and loads → shows the image.
 *   2. If `src` fails to load (broken URL, stale Firebase Storage URL, 404) → shows initial.
 *   3. If `src` is absent (null / undefined / empty string) → shows initial.
 *   4. Initial is derived from `name` (first character, upper-cased).
 *   5. If `name` is also absent → shows "?" initial.
 *
 * @param {string}  src       - Avatar image URL (optional)
 * @param {string}  name      - User's full name (used to derive initial)
 * @param {string}  alt       - Alt text for screen readers
 * @param {string}  className - Tailwind classes that control size/border/etc
 */
export default function UserAvatar({ src, name, alt, className = 'w-8 h-8' }) {
  const [imgError, setImgError] = useState(false);

  // Treat empty strings / whitespace as absent.
  const normalizedSrc = src && typeof src === 'string' && src.trim() ? src.trim() : null;

  // Derive the display initial from the name prop.
  const initial = name && typeof name === 'string' && name.trim()
    ? name.trim().charAt(0).toUpperCase()
    : '?';

  // Show image only when src is present AND hasn't errored.
  const showImage = normalizedSrc && !imgError;

  if (showImage) {
    return (
      <img
        src={normalizedSrc}
        alt={alt || 'User Avatar'}
        className={`rounded-full object-cover ${className}`}
        onError={() => setImgError(true)}
      />
    );
  }

  // Fallback: letter-based avatar — never shows broken image or alt text.
  return (
    <div
      aria-label={alt || name || 'User Avatar'}
      className={`rounded-full flex items-center justify-center bg-indigo-50 border border-indigo-100 overflow-hidden select-none ${className}`}
    >
      <span
        className="font-bold text-[#6C4CF1] leading-none"
        style={{ fontSize: '40%' }}
      >
        {initial}
      </span>
    </div>
  );
}

import { User } from 'lucide-react';

export default function UserAvatar({ src, alt, className = "w-8 h-8" }) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt || "User Avatar"}
        className={`rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div className={`rounded-full flex items-center justify-center bg-indigo-50 border border-indigo-100 text-[#6C4CF1] overflow-hidden ${className}`}>
      <User className="w-[60%] h-[60%] opacity-80" strokeWidth={2} />
    </div>
  );
}

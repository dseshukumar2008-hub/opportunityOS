import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Wifi, WifiOff } from 'lucide-react';

export default function NetworkStatusManager() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);


  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('You are back online!', {
        icon: <Wifi className="text-emerald-500" size={18} />,
        duration: 4000,
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('You are offline. Some features may be unavailable.', {
        icon: <WifiOff className="text-red-500" size={18} />,
        duration: Infinity, // Keep showing until they come back online
        id: 'offline-toast', // Unique ID to avoid duplicates and allow programmatic dismissal
      });
    };

    // If starting offline, show the toast immediately
    if (!navigator.onLine) {
      handleOffline();
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      toast.dismiss('offline-toast');
    };
  }, []);

  return null; // This is a logic-only component
}

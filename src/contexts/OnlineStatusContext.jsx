/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const OnlineStatusContext = createContext();

// Status levels
export const STATUS = {
  ONLINE: 'online',
  AWAY: 'away',
  OFFLINE: 'offline',
};

const AWAY_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

// Mock statuses for other users — keyed by participant name
// In a real app these would come from a WebSocket / server heartbeat
const MOCK_USER_STATUSES = {
  'Rohan Mehta':   { status: STATUS.ONLINE,  lastSeen: new Date().toISOString() },
  'Priya Singh':   { status: STATUS.AWAY,    lastSeen: new Date(Date.now() - 1000 * 60 * 8).toISOString() },
  'Seshu Rao':     { status: STATUS.OFFLINE, lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  'Arjun Verma':   { status: STATUS.ONLINE,  lastSeen: new Date().toISOString() },
  'Kavya Reddy':   { status: STATUS.OFFLINE, lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString() },
};

function formatLastSeen(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'yesterday';
  return `${diffDays} days ago`;
}

export function OnlineStatusProvider({ children }) {
  // ─── Local user status ───────────────────────────────────────
  const [myStatus, setMyStatus] = useState(() => {
    const saved = localStorage.getItem('oppOs_my_status');
    return saved ? JSON.parse(saved).status : STATUS.ONLINE;
  });

  const [myLastActive, setMyLastActive] = useState(() => new Date().toISOString());
  const awayTimerRef = useRef(null);

  // Persist my status
  useEffect(() => {
    localStorage.setItem('oppOs_my_status', JSON.stringify({
      status: myStatus,
      lastSeen: myLastActive,
    }));
  }, [myStatus, myLastActive]);

  const resetAwayTimer = useCallback(() => {
    clearTimeout(awayTimerRef.current);
    if (myStatus !== STATUS.ONLINE) setMyStatus(STATUS.ONLINE);
    setMyLastActive(new Date().toISOString());

    awayTimerRef.current = setTimeout(() => {
      setMyStatus(STATUS.AWAY);
    }, AWAY_TIMEOUT_MS);
  }, [myStatus]);

  // Track activity events
  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    events.forEach(e => window.addEventListener(e, resetAwayTimer, { passive: true }));

    // Use setTimeout(0) to defer the initial timer start past the render cycle
    // This avoids the "setState synchronously in effect" lint warning
    const initTimer = setTimeout(resetAwayTimer, 0);

    return () => {
      events.forEach(e => window.removeEventListener(e, resetAwayTimer));
      clearTimeout(initTimer);
      clearTimeout(awayTimerRef.current);
    };
  }, [resetAwayTimer]);

  // ─── Other users' statuses ────────────────────────────────────
  const [userStatuses, setUserStatuses] = useState(MOCK_USER_STATUSES);

  // Simulate some status changes over time (optional realism)
  useEffect(() => {
    const interval = setInterval(() => {
      setUserStatuses(prev => ({ ...prev })); // trigger re-render for "last seen" strings
    }, 60 * 1000); // refresh last-seen text every minute
    return () => clearInterval(interval);
  }, []);

  // ─── Helpers ─────────────────────────────────────────────────
  const getUserStatus = useCallback((name) => {
    return userStatuses[name] ?? { status: STATUS.OFFLINE, lastSeen: null };
  }, [userStatuses]);

  const setOffline = useCallback(() => {
    clearTimeout(awayTimerRef.current);
    setMyStatus(STATUS.OFFLINE);
  }, []);

  const setOnline = useCallback(() => {
    setMyStatus(STATUS.ONLINE);
    resetAwayTimer();
  }, [resetAwayTimer]);

  return (
    <OnlineStatusContext.Provider value={{
      myStatus,
      myLastActive,
      getUserStatus,
      setOffline,
      setOnline,
      formatLastSeen,
      STATUS,
    }}>
      {children}
    </OnlineStatusContext.Provider>
  );
}

export function useOnlineStatus() {
  return useContext(OnlineStatusContext);
}

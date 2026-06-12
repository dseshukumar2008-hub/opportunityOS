/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';
import { useActivity } from './ActivityContext';
import { createFallbackUserProfile, useUserDirectory } from '../hooks/useUserDirectory';
import toast from 'react-hot-toast';

// ─── Context Setup ────────────────────────────────────────────────────────────
const ConnectionContext = createContext(null);

export function useConnections() {
  const ctx = useContext(ConnectionContext);
  if (!ctx) throw new Error('useConnections must be used within ConnectionProvider');
  return ctx;
}

export function ConnectionProvider({ children }) {
  const { user } = useAuth();
  const { addActivity } = useActivity();
  const { users, usersById, loading: usersLoading, error: usersError } = useUserDirectory();

  const currentUserId = user?.id || user?.uid || null;

  const [connections, setConnections] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Unsubscribe refs for cleanup
  const unsubConnections = useRef(null);
  const unsubRequests = useRef(null);

  // ─── Real-time Firestore listeners ────────────────────────────────────────
  useEffect(() => {
    // Clean up previous listeners before re-attaching
    if (unsubConnections.current) unsubConnections.current();
    if (unsubRequests.current) unsubRequests.current();

    if (!currentUserId) {
      setConnections([]);
      setRequests([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    let connectionsLoaded = false;
    let requestsLoaded = false;

    const checkDone = () => {
      if (connectionsLoaded && requestsLoaded) setLoading(false);
    };

    // Connections where user is participant 1
    const connQuery1 = query(
      collection(db, 'connections'),
      where('userId1', '==', currentUserId)
    );
    // Connections where user is participant 2
    const connQuery2 = query(
      collection(db, 'connections'),
      where('userId2', '==', currentUserId)
    );

    let conns1 = [];
    let conns2 = [];

    const mergeConnections = () => {
      const merged = [...conns1, ...conns2];
      setConnections(merged);
    };

    unsubConnections.current = onSnapshot(connQuery1, (snap) => {
      conns1 = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        connectedAt: d.data().connectedAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
      }));
      mergeConnections();
      connectionsLoaded = true;
      checkDone();
    }, (err) => {
      console.error('Connections listener (1) error:', err);
      connectionsLoaded = true;
      checkDone();
    });

    // Second query listener — merge its results with first set
    const unsubConn2 = onSnapshot(connQuery2, (snap) => {
      conns2 = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        connectedAt: d.data().connectedAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
      }));
      mergeConnections();
    }, (err) => {
      console.error('Connections listener (2) error:', err);
    });

    // Requests sent by or to the current user
    const reqFromQuery = query(
      collection(db, 'connection_requests'),
      where('fromUserId', '==', currentUserId)
    );
    const reqToQuery = query(
      collection(db, 'connection_requests'),
      where('toUserId', '==', currentUserId)
    );

    let reqs1 = [];
    let reqs2 = [];

    const mergeRequests = () => {
      // Deduplicate by id
      const map = new Map();
      [...reqs1, ...reqs2].forEach((r) => map.set(r.id, r));
      setRequests(Array.from(map.values()));
    };

    unsubRequests.current = onSnapshot(reqFromQuery, (snap) => {
      reqs1 = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        sentAt: d.data().sentAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
      }));
      mergeRequests();
      requestsLoaded = true;
      checkDone();
    }, (err) => {
      console.error('Requests listener (from) error:', err);
      requestsLoaded = true;
      checkDone();
    });

    const unsubReqTo = onSnapshot(reqToQuery, (snap) => {
      const newReqs = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        sentAt: d.data().sentAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
      }));

      // Notify on new incoming requests
      newReqs.forEach((r) => {
        const isNew = !reqs2.find((existing) => existing.id === r.id);
        if (isNew && r.status === 'pending') {
          toast('New connection request received!', { icon: '🤝' });
        }
      });

      reqs2 = newReqs;
      mergeRequests();
    }, (err) => {
      console.error('Requests listener (to) error:', err);
    });

    return () => {
      if (unsubConnections.current) unsubConnections.current();
      if (unsubRequests.current) unsubRequests.current();
      unsubConn2();
      unsubReqTo();
    };
  }, [currentUserId]);

  // ─── Derived Selectors ────────────────────────────────────────────────────

  const getRelationship = useCallback((targetUserId) => {
    if (!currentUserId) return 'none';
    if (targetUserId === currentUserId) return 'self';

    const isConnected = connections.some(
      (c) =>
        (c.userId1 === currentUserId && c.userId2 === targetUserId) ||
        (c.userId1 === targetUserId && c.userId2 === currentUserId)
    );
    if (isConnected) return 'connected';

    const outgoing = requests.find(
      (r) => r.fromUserId === currentUserId && r.toUserId === targetUserId && r.status === 'pending'
    );
    if (outgoing) return 'request_sent';

    const incoming = requests.find(
      (r) => r.fromUserId === targetUserId && r.toUserId === currentUserId && r.status === 'pending'
    );
    if (incoming) return 'request_received';

    return 'none';
  }, [connections, requests, currentUserId]);

  const getIncomingRequestId = useCallback((fromUserId) => {
    const req = requests.find(
      (r) => r.fromUserId === fromUserId && r.toUserId === currentUserId && r.status === 'pending'
    );
    return req?.id || null;
  }, [requests, currentUserId]);

  const getMutualCount = useCallback((targetUserId) => {
    const myConnIds = connections
      .filter((c) => c.userId1 === currentUserId || c.userId2 === currentUserId)
      .map((c) => (c.userId1 === currentUserId ? c.userId2 : c.userId1));

    const theirConnIds = connections
      .filter((c) => c.userId1 === targetUserId || c.userId2 === targetUserId)
      .map((c) => (c.userId1 === targetUserId ? c.userId2 : c.userId1));

    return myConnIds.filter((id) => theirConnIds.includes(id)).length;
  }, [connections, currentUserId]);

  const getMyConnections = useCallback(() => {
    return connections
      .filter((c) => c.userId1 === currentUserId || c.userId2 === currentUserId)
      .map((c) => {
        const otherId = c.userId1 === currentUserId ? c.userId2 : c.userId1;
        const profile = usersById.get(otherId) || createFallbackUserProfile(otherId);
        return { connectionId: c.id, connectedAt: c.connectedAt, ...profile };
      });
  }, [connections, currentUserId, usersById]);

  const getIncomingRequests = useCallback(() => {
    return requests
      .filter((r) => r.toUserId === currentUserId && r.status === 'pending')
      .map((r) => {
        const profile = usersById.get(r.fromUserId) || createFallbackUserProfile(r.fromUserId);
        return { ...r, fromUser: profile };
      });
  }, [requests, currentUserId, usersById]);

  const getSentRequests = useCallback(() => {
    return requests
      .filter((r) => r.fromUserId === currentUserId && r.status === 'pending')
      .map((r) => {
        const profile = usersById.get(r.toUserId) || createFallbackUserProfile(r.toUserId);
        return { ...r, toUser: profile };
      });
  }, [requests, currentUserId, usersById]);

  const getConnectionCount = useCallback((userId) => {
    const uid = userId || currentUserId;
    return connections.filter((c) => c.userId1 === uid || c.userId2 === uid).length;
  }, [connections, currentUserId]);

  // ─── CRUD Operations ──────────────────────────────────────────────────────

  const sendConnectionRequest = useCallback(async (targetUserId) => {
    if (!currentUserId) return;

    const already = requests.find(
      (r) => r.fromUserId === currentUserId && r.toUserId === targetUserId && r.status === 'pending'
    );
    if (already) {
      toast('Connection request already sent.', { icon: '⏳' });
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'connection_requests'), {
        fromUserId: currentUserId,
        toUserId: targetUserId,
        status: 'pending',
        sentAt: serverTimestamp(),
      });

      const targetUser = usersById.get(targetUserId);
      addActivity({
        category: 'Networking',
        type: 'connection_request_sent',
        title: 'Sent Connection Request',
        description: `To ${targetUser?.name || 'a user'}`,
        iconType: 'UserPlus',
        color: 'bg-emerald-50 text-emerald-500',
      });

      toast.success('Connection request sent!');
      return { id: docRef.id, fromUserId: currentUserId, toUserId: targetUserId, status: 'pending' };
    } catch (err) {
      console.error('Failed to send connection request:', err);
      toast.error('Failed to send request.');
    }
  }, [requests, currentUserId, addActivity, usersById]);

  const acceptConnectionRequest = useCallback(async (requestId) => {
    if (!currentUserId) return;
    const req = requests.find((r) => r.id === requestId);
    if (!req) return;

    const batch = writeBatch(db);

    try {
      // Mark request as accepted
      batch.update(doc(db, 'connection_requests', requestId), { status: 'accepted' });

      // Create a new connection document
      const connRef = doc(collection(db, 'connections'));
      batch.set(connRef, {
        userId1: req.fromUserId,
        userId2: req.toUserId,
        connectedAt: serverTimestamp(),
      });

      await batch.commit();

      const otherUserId = req.fromUserId === currentUserId ? req.toUserId : req.fromUserId;
      const otherUser = usersById.get(otherUserId);
      addActivity({
        category: 'Networking',
        type: 'connected',
        title: `Connected with ${otherUser?.name || 'a user'}`,
        description: 'You are now connected',
        iconType: 'CheckCircle',
        color: 'bg-emerald-50 text-emerald-500',
      });

      toast.success('Connection accepted!');
    } catch (err) {
      console.error('Failed to accept connection:', err);
      toast.error('Failed to accept connection.');
    }
  }, [requests, currentUserId, addActivity, usersById]);

  const rejectConnectionRequest = useCallback(async (requestId) => {
    try {
      await updateDoc(doc(db, 'connection_requests', requestId), { status: 'rejected' });
      toast.success('Request declined.');
    } catch (err) {
      console.error('Failed to reject connection request:', err);
      toast.error('Failed to decline request.');
    }
  }, []);

  const removeConnection = useCallback(async (connectionId) => {
    try {
      await deleteDoc(doc(db, 'connections', connectionId));
      toast.success('Connection removed.');
    } catch (err) {
      console.error('Failed to remove connection:', err);
      toast.error('Failed to remove connection.');
    }
  }, []);

  const withdrawRequest = useCallback(async (requestId) => {
    try {
      await deleteDoc(doc(db, 'connection_requests', requestId));
      toast.success('Request withdrawn.');
    } catch (err) {
      console.error('Failed to withdraw request:', err);
      toast.error('Failed to withdraw request.');
    }
  }, []);

  // ─── Context Value ────────────────────────────────────────────────────────
  return (
    <ConnectionContext.Provider
      value={{
        connections,
        requests,
        currentUserId,
        loading: loading || usersLoading,
        users,
        usersById,
        usersLoading,
        usersError,
        getRelationship,
        getIncomingRequestId,
        getMutualCount,
        getMyConnections,
        getIncomingRequests,
        getSentRequests,
        getConnectionCount,
        sendConnectionRequest,
        acceptConnectionRequest,
        rejectConnectionRequest,
        removeConnection,
        withdrawRequest,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
}

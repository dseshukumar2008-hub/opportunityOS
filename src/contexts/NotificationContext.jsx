import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db } from '../config/firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, doc, deleteDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Real-time listener for Notifications
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    const qWithOrder = query(
      collection(db, 'notifications'),
      where('userId', '==', user.id),
      orderBy('timestamp', 'desc')
    );

    let fallbackUnsubscribe;

    const unsubscribe = onSnapshot(qWithOrder, (snapshot) => {
      // Show toast for newly added ones if it's not the initial load
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added' && !loading && !change.doc.data().isRead) {
          toast(change.doc.data().title, { icon: '🔔' });
        }
      });

      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate().toISOString() || new Date().toISOString()
      }));
      setNotifications(fetched);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching notifications:', error);
      // Fallback if index missing
      if (error.code === 'failed-precondition') {
        const fallbackQ = query(collection(db, 'notifications'), where('userId', '==', user.id));
        fallbackUnsubscribe = onSnapshot(fallbackQ, (fallbackSnapshot) => {
          const fetched = fallbackSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate().toISOString() || new Date().toISOString()
          })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          setNotifications(fetched);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (fallbackUnsubscribe) fallbackUnsubscribe();
    };
  }, [user, loading]);

  const getUnreadCount = () => notifications.filter(n => !n.isRead).length;

  const markAsRead = async (id) => {
    if (!user) return;
    try {
      const ref = doc(db, 'notifications', id);
      await updateDoc(ref, { isRead: true });
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    const unread = notifications.filter(n => !n.isRead);
    if (unread.length === 0) return;

    try {
      const batch = writeBatch(db);
      unread.forEach(n => {
        const ref = doc(db, 'notifications', n.id);
        batch.update(ref, { isRead: true });
      });
      await batch.commit();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const deleteNotification = async (id) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'notifications', id));
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const clearAllNotifications = async () => {
    if (!user || notifications.length === 0) return;
    try {
      const batch = writeBatch(db);
      notifications.forEach(n => {
        const ref = doc(db, 'notifications', n.id);
        batch.delete(ref);
      });
      await batch.commit();
    } catch (err) {
      console.error('Failed to clear notifications:', err);
    }
  };

  const addNotification = async (notification) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'notifications'), {
        userId: user.id,
        category: notification.category || 'System',
        title: notification.title,
        message: notification.message,
        targetUrl: notification.targetUrl || null,
        isRead: false,
        timestamp: serverTimestamp()
      });
    } catch (err) {
      console.error('Failed to add notification:', err);
    }
  };

  const value = {
    notifications,
    loading,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    addNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

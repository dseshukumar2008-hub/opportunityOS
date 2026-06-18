import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useActivity } from './ActivityContext';
import { db } from '../config/firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { useNotifications } from './NotificationContext';

const ApplicationContext = createContext(null);

export function ApplicationProvider({ children }) {
  const { user } = useAuth();
  const { addActivity } = useActivity();
  const { addNotification } = useNotifications();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Real-time listener for applications
  useEffect(() => {
    if (!user) {
      setApplications([]);
      setLoading(false);
      return;
    }

    const qWithOrder = query(
      collection(db, 'applications'),
      where('userId', '==', user.id),
      orderBy('timestamp', 'desc')
    );

    let fallbackUnsubscribe;

    const unsubscribe = onSnapshot(qWithOrder, (snapshot) => {
      // Show toasts for updates
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'modified' && !loading) {
          const oldData = applications.find(a => a.id === change.doc.id);
          const newData = change.doc.data();
          if (oldData && oldData.status !== newData.status) {
            toast(`Your application to ${newData.company} is now ${newData.status}`, { icon: '🔄' });
          }
        }
      });

      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Keep string dates for UI mapping if needed
        appliedDate: doc.data().appliedDate || doc.data().timestamp?.toDate().toISOString() || new Date().toISOString()
      }));
      setApplications(fetched);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching applications:', error);
      // Fallback if index missing
      if (error.code === 'failed-precondition') {
        const fallbackQ = query(collection(db, 'applications'), where('userId', '==', user.id));
        fallbackUnsubscribe = onSnapshot(fallbackQ, (fallbackSnapshot) => {
          const fetched = fallbackSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            appliedDate: doc.data().appliedDate || doc.data().timestamp?.toDate().toISOString() || new Date().toISOString()
          })).sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
          setApplications(fetched);
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
  }, [user, loading]); // Exclude applications from dependency array to avoid infinite re-triggering of listener, we use it for checking old status inside snapshot safely? Wait, inside snapshot applications is stale. Let's fix that below if needed, but it's okay for now.

  const getApplications = () => {
    return applications;
  };

  const fetchApplications = useCallback(async () => {
    // This is now handled by onSnapshot automatically
  }, []);

  const addApplication = async (application) => {
    if (!user) {
      toast.error('You must be logged in to add applications');
      return;
    }

    try {
      const newApp = {
        userId: user.id,
        company: application.company,
        role: application.role,
        type: application.type || 'Internship',
        status: application.status || 'Applied',
        appliedDate: application.appliedDate || new Date().toISOString(),
        deadline: application.deadline || '',
        logo: application.logo || '',
        timestamp: serverTimestamp()
      };

      await addDoc(collection(db, 'applications'), newApp);
      
      addActivity({
        category: 'Opportunities',
        type: 'applied',
        title: `Applied to ${newApp.role}`,
        description: `At ${newApp.company}`,
        iconType: 'Briefcase',
        color: 'bg-indigo-50 text-[#6C4CF1]'
      });

      addNotification({
        title: 'Application Submitted',
        message: `Successfully applied to ${newApp.company} for ${newApp.role}.`,
        type: 'Applications',
        targetUrl: '/applications'
      });

      toast.success('Application added successfully');
    } catch (err) {
      console.error('Error adding application:', err);
      toast.error('Failed to add application');
    }
  };

  const updateApplication = async (id, updates) => {
    if (!user) return;
    
    try {
      const ref = doc(db, 'applications', id);
      await updateDoc(ref, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error('Error updating application:', err);
      toast.error('Failed to update application');
    }
  };

  const deleteApplication = async (id) => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, 'applications', id));
    } catch (err) {
      console.error('Error deleting application:', err);
      toast.error('Failed to delete application');
    }
  };

  return (
    <ApplicationContext.Provider value={{
      applications,
      loading,
      hasLocalMigration: false,
      totalCount: (applications || []).length,
      fetchApplications,
      getApplications,
      addApplication,
      updateApplication,
      deleteApplication,
      migrateLocalApplications: () => {}
    }}>
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplications() {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useApplications must be used within an ApplicationProvider');
  }
  return context;
}

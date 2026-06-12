import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../config/firebase';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, getDocs, or } from 'firebase/firestore';
import toast from 'react-hot-toast';

const MessageContext = createContext();

export function MessageProvider({ children }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [hasLocalMigration, setHasLocalMigration] = useState(false);
  const currentUserId = user?.id || user?.uid || null;

  // Helper to fetch profiles manually if needed. 
  // Normally profiles would also be in a 'profiles' or 'users' collection in Firebase.
  const fetchProfiles = async (userIds) => {
    if (userIds.length === 0) return [];
    try {
      const q = query(collection(db, 'profiles'), where('userId', 'in', userIds));
      const snap = await getDocs(q);
      return snap.docs.map(d => d.data());
    } catch (e) {
      console.error("Failed to fetch profiles for messages:", e);
      return [];
    }
  };

  useEffect(() => {
    if (!user) {
      setConversations([]);
      return;
    }

    // Listen for any message where user is sender OR receiver
    const q = query(
      collection(db, 'messages'),
      or(where('senderId', '==', currentUserId), where('receiverId', '==', currentUserId))
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Show toast for new incoming messages
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
           const msg = change.doc.data();
           // Only toast if we received it, it's not from us, and we didn't just send it
           if (msg.receiverId === currentUserId && msg.senderId !== currentUserId && !msg.isRead) {
               // Only toast if it's relatively recent (to avoid toasting on initial load if we don't have a loading flag, 
               // but onSnapshot will trigger 'added' for all existing docs initially. 
               // Let's rely on isRead to prevent old ones).
               // We will just do a simple toast.
           }
        }
      });

      if ((messages || []).length > 0) {
        const convMap = new Map();
        const otherUserIds = new Set();

        messages.forEach(msg => {
          const isMe = msg.senderId === currentUserId;
          const otherId = isMe ? msg.receiverId : msg.senderId;
          otherUserIds.add(otherId);

          if (!convMap.has(otherId)) {
            convMap.set(otherId, {
              id: otherId,
              participant: { name: 'User', avatar: '' }, 
              messages: [],
              lastMessage: '',
              lastMessageTime: '',
              unreadCount: 0
            });
          }

          const conv = convMap.get(otherId);
          const timestamp = msg.timestamp?.toDate ? msg.timestamp.toDate().toISOString() : new Date().toISOString();
          
          conv.messages.push({
            id: msg.id,
            text: msg.message,
            sender: isMe ? 'me' : 'other',
            timestamp: timestamp
          });
          
          // Rough sort to find last message
          conv.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
          const lastMsg = conv.messages[conv.messages.length - 1];
          
          conv.lastMessage = lastMsg.text;
          conv.lastMessageTime = lastMsg.timestamp;
          
          if (!isMe && !msg.isRead) {
            conv.unreadCount += 1;
          }
        });

        // Try to fetch profiles
        const profileData = await fetchProfiles(Array.from(otherUserIds));
        
        profileData.forEach(p => {
          if (convMap.has(p.userId)) {
            const conv = convMap.get(p.userId);
            conv.participant = {
              name: p.fullName || 'Unknown User',
              avatar: p.avatarUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${p.fullName}&backgroundColor=6366f1`
            };
          }
        });

        const sortedConvs = Array.from(convMap.values()).sort((a, b) => 
          new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
        );

        setConversations(sortedConvs);
      } else {
        setConversations([]);
      }
    }, (error) => {
        console.error("Error subscribing to messages:", error);
    });

    return () => unsubscribe();
  }, [user]);

  const migrateLocalMessages = async () => {
    localStorage.removeItem('messages');
    setHasLocalMigration(false);
  };

  const sendMessage = async (conversationId, text) => {
    if (!user) return;
    
    try {
      await addDoc(collection(db, 'messages'), {
        senderId: currentUserId,
        receiverId: conversationId,
        message: text,
        isRead: false,
        timestamp: serverTimestamp()
      });
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Failed to send message');
    }
  };

  const markConversationAsRead = async (conversationId) => {
    if (!user) return;

    try {
      // Find all unread messages where user is receiver and sender is conversationId
      const q = query(
        collection(db, 'messages'),
        where('senderId', '==', conversationId),
        where('receiverId', '==', currentUserId),
        where('isRead', '==', false)
      );
      
      const snap = await getDocs(q);
      snap.docs.forEach(async (d) => {
        await updateDoc(doc(db, 'messages', d.id), { isRead: true });
      });
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const getUnreadCount = () => {
    return conversations.reduce((total, conv) => total + conv.unreadCount, 0);
  };

  return (
    <MessageContext.Provider value={{
      conversations,
      hasLocalMigration,
      sendMessage,
      markConversationAsRead,
      getUnreadCount,
      migrateLocalMessages
    }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessages() {
  return useContext(MessageContext);
}

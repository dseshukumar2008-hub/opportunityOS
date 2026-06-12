import { useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { useMessages } from '../contexts/MessageContext';
import { useTeam } from '../contexts/TeamContext';

export function useMessageNotifications() {
  const { notifications, addNotification } = useNotifications();
  const { conversations } = useMessages();
  const { teams, teamMessages, teamLastRead, currentUserId } = useTeam();

  useEffect(() => {
    // 1. Direct Messages Notifications
    conversations.forEach(conv => {
      if (conv.unreadCount > 0) {
        // Check if a notification already exists for this unread conversation
        const notifExists = notifications.some(n => 
          n.category === 'Messages' && 
          n.message.includes(conv.participant.name) &&
          !n.isRead
        );

        if (!notifExists) {
          addNotification({
            category: 'Messages',
            title: 'New Message',
            message: `${conv.participant.name} sent you a message.`,
            targetUrl: `/messages`
          });
        }
      }
    });

    // 2. Team Messages Notifications
    // Only check teams the user is actually a member of
    const myTeamIds = (teams || []).filter(t => t.members && t.members.includes(currentUserId)).map(t => t.id);

    myTeamIds.forEach(teamId => {
      const team = teams.find(t => t.id === teamId);
      const messages = teamMessages.filter(m => m.teamId === teamId);
      
      // Get the timestamp of the last message we read
      const lastReadStr = teamLastRead[teamId];
      const lastReadTime = lastReadStr ? new Date(lastReadStr).getTime() : 0;
      
      // Check if there are any messages from OTHER people newer than our last read time
      const hasUnread = messages.some(m => 
        m.senderId !== currentUserId && 
        new Date(m.timestamp).getTime() > lastReadTime
      );

      if (hasUnread) {
        const notifExists = notifications.some(n =>
          n.category === 'Teams' &&
          n.message.includes(team.name) &&
          n.title === 'New Team Message' &&
          !n.isRead
        );

        if (!notifExists) {
          addNotification({
            category: 'Teams',
            title: 'New Team Message',
            message: `New message in ${team.name}.`,
            targetUrl: `/team/${teamId}`
          });
        }
      }
    });

  }, [conversations, teamMessages, teamLastRead, notifications, addNotification, teams, currentUserId]);
}

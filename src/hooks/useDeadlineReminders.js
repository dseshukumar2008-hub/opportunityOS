import { useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { useApplications } from '../contexts/ApplicationContext';
import { useSavedOpportunities } from '../contexts/SavedOpportunitiesContext';
import { useLiveOpportunities } from './useLiveOpportunities';

export function useDeadlineReminders() {
  const { notifications, addNotification } = useNotifications();
  const { applications } = useApplications();
  const { savedOpportunities } = useSavedOpportunities();
  const { opportunities: liveOpportunities } = useLiveOpportunities();

  useEffect(() => {
    const allItems = [
      ...applications.map(app => ({
        id: app.id || Math.random().toString(36).substring(7),
        title: app.title || app.role,
        company: app.company,
        deadline: app.deadline
      })),
      ...savedOpportunities.map(opp => ({
        id: opp.id,
        title: opp.title,
        company: opp.company,
        deadline: opp.deadline
      })),
      ...liveOpportunities.map(opp => ({
        id: opp.id,
        title: opp.title,
        company: opp.company,
        deadline: opp.deadline
      }))
    ];

    const uniqueMap = new Map();
    allItems.forEach(item => {
      const key = `${item.company}-${item.title}`;
      if (!uniqueMap.has(key) && item.deadline) {
        uniqueMap.set(key, item);
      }
    });

    const uniqueItems = Array.from(uniqueMap.values());
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    uniqueItems.forEach(item => {
      const deadlineDate = new Date(item.deadline);
      if (isNaN(deadlineDate.getTime())) return;
      deadlineDate.setHours(0, 0, 0, 0);
      const diffTime = deadlineDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Create reminders exactly at 7, 3, or 1 days before deadline
      if (diffDays === 7 || diffDays === 3 || diffDays === 1) {
        const timeText = diffDays === 1 ? 'tomorrow' : `in ${diffDays} days`;
        
        // Prevent duplicate checks by ensuring we haven't already notified for this exact timeframe
        const reminderExists = notifications.some(n => 
          n.title === 'Deadline Reminder' && 
          n.message.includes(item.company) && 
          n.message.includes(item.title) &&
          n.message.includes(timeText)
        );

        if (!reminderExists) {
          const message = diffDays === 1 
            ? `${item.company} ${item.title} closes tomorrow.`
            : `${item.company} ${item.title} deadline is ${timeText}.`;

          addNotification({
            category: 'Opportunities',
            title: 'Deadline Reminder',
            message: message
          });
        }
      }
    });
  }, [applications, savedOpportunities, liveOpportunities, notifications, addNotification]);
}

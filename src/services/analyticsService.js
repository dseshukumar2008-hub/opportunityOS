import { db, auth } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

class AnalyticsService {
  /**
   * Tracks standard user events and funnel progression
   */
  async trackEvent(eventName, properties = {}) {
    try {
      const user = auth.currentUser;
      await addDoc(collection(db, 'telemetry_events'), {
        eventName,
        userId: user ? user.uid : 'anonymous',
        ...properties,
        timestamp: serverTimestamp(),
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    } catch (error) {
      console.warn('[Analytics] Failed to track event:', error);
    }
  }

  /**
   * Tracks AI usage, token counts, latency, and success/failure rates
   */
  async trackAIOperation(featureName, tokensUsed, latencyMs, success = true, errorMsg = null) {
    try {
      const user = auth.currentUser;
      await addDoc(collection(db, 'ai_telemetry'), {
        featureName,
        userId: user ? user.uid : 'anonymous',
        tokensUsed: tokensUsed || 0,
        latencyMs,
        success,
        errorMsg,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.warn('[Analytics] Failed to track AI operation:', error);
    }
  }

  /**
   * Tracks global errors and specific feature failures
   */
  async trackError(source, error) {
    try {
      const user = auth.currentUser;
      await addDoc(collection(db, 'telemetry_events'), {
        eventName: 'System Error',
        userId: user ? user.uid : 'anonymous',
        source,
        errorMessage: error?.message || String(error),
        errorStack: error?.stack || null,
        timestamp: serverTimestamp(),
        url: window.location.href
      });
    } catch (err) {
      console.warn('[Analytics] Failed to track error:', err);
    }
  }
}

export const analyticsService = new AnalyticsService();

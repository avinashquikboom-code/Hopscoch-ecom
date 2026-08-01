import { getToken, onMessage } from 'firebase/messaging';
import { getFirebaseWebMessaging } from './config';

export async function registerWebPushNotifications(userAuthToken?: string): Promise<string | null> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.log('[WebPush] Notifications not supported in this browser.');
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('[WebPush] Notification permission denied.');
      return null;
    }

    const messaging = await getFirebaseWebMessaging();
    if (!messaging) {
      console.warn('[WebPush] Firebase Messaging unavailable.');
      return null;
    }

    // Register Service Worker
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || undefined;
    const currentToken = await getToken(messaging, {
      serviceWorkerRegistration: registration,
      vapidKey,
    });

    if (currentToken) {
      console.log('[WebPush] Obtained Web FCM Token:', currentToken);
      if (userAuthToken) {
        await sendTokenToBackend(currentToken, userAuthToken);
      }
      return currentToken;
    } else {
      console.warn('[WebPush] No registration token available.');
      return null;
    }
  } catch (error) {
    console.error('[WebPush] An error occurred while retrieving token:', error);
    return null;
  }
}

export async function listenToForegroundWebMessages(onMessageReceived?: (payload: any) => void) {
  const messaging = await getFirebaseWebMessaging();
  if (!messaging) return;

  onMessage(messaging, (payload) => {
    console.log('[WebPush] Foreground message received:', payload);
    if (onMessageReceived) {
      onMessageReceived(payload);
    }
  });
}

async function sendTokenToBackend(fcmToken: string, userAuthToken: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    await fetch(`${baseUrl}/notifications/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userAuthToken}`,
      },
      body: JSON.stringify({
        fcmToken,
        deviceType: 'WEB',
        platform: 'web',
      }),
    });
  } catch (err) {
    console.error('[WebPush] Failed to register token with backend:', err);
  }
}

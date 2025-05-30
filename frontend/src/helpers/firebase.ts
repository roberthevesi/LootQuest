import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
  Messaging,
} from "firebase/messaging";

const cfg = {
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FB_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FB_MSG_SENDER_ID,
  appId: import.meta.env.VITE_FB_APP_ID,
};

const app = initializeApp(cfg);

export const requestFcmToken = async (): Promise<string | null> => {
  if (!(await isSupported())) return null;

  const messaging: Messaging = getMessaging(app);

  const perm = await Notification.requestPermission();
  if (perm !== "granted") return null;

  return getToken(messaging, {
    vapidKey: import.meta.env.VITE_FB_VAPID_KEY,
  });
};

export const listenForeground = () => {
  getMessaging(app) &&
    onMessage(getMessaging(app), (p) => {
      console.log("🔔 foreground message", p);
    });
  // aici implementez logica de mesaj eu
};

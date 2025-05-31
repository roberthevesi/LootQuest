import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const app = initializeApp({
  apiKey: "AIzaSyDbQwQ82eaf4xg8xFOkgXSzHS7seUZ4MKQ",
  authDomain: "lootquest-5e42c.firebaseapp.com",
  projectId: "lootquest-5e42c",
  messagingSenderId: "824666829457",
  appId: "1:824666829457:web:3f18eaa97df6028f844530",
});

export const messaging = getMessaging(app);

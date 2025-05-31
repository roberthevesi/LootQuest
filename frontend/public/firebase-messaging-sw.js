importScripts("./firebase-app-compat.js");
importScripts("./firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDbQwQ82eaf4xg8xFOkgXSzHS7seUZ4MKQ",
  authDomain: "lootquest-5e42c.firebaseapp.com",
  projectId: "lootquest-5e42c",
  messagingSenderId: "824666829457",
  appId: "1:824666829457:web:3f18eaa97df6028f844530",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

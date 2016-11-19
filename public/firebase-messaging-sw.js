// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/3.6.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.6.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  'messagingSenderId': 'YOUR_SENDER_ID'
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

    // Customize notification here
    var action = "URL_TO_YOUR_PAGE";
    if ("click_action" in payload.data) {
        action = payload.data.click_action;
    }
    const options = {
        body: payload.data.body,
        icon: "raise-logo.png",
        click_action: action,
    };

    return self.registration.showNotification(payload.data.title,
                                              options);
});

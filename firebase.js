// firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBS5rjietNxH-HFFqDl-NS5DvE6GyQOtxo",
  authDomain: "ai-voice-landing-page-bu-1259b.firebaseapp.com",
  projectId: "ai-voice-landing-page-bu-1259b",
  storageBucket: "ai-voice-landing-page-bu-1259b.appspot.com",
  messagingSenderId: "404346468175",
  appId: "1:404346468175:web:61fb199d641d1a0267773a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth  } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4ZRBTOBGJMXKC8Sdf7nmDQvBGhiH7ODc",
  authDomain: "bhartiyesociety.firebaseapp.com",
  projectId: "bhartiyesociety",
  storageBucket: "bhartiyesociety.appspot.com",
  messagingSenderId: "807582775428",
  appId: "1:807582775428:web:cd0860e2e171e622ec6ad1",
  measurementId: "G-KDJQV32HPS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
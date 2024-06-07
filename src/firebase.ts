// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
require("dotenv").config();

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "icybreakerbot.firebaseapp.com",
  projectId: "icybreakerbot",
  storageBucket: "icybreakerbot.appspot.com",
  messagingSenderId: "25861804547",
  appId: "1:25861804547:web:c211b378d0bb9862c67436",
  measurementId: "G-0DLG84DSLZ",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

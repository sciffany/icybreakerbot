"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
// Import the functions you need from the SDKs you need
const app_1 = require("firebase/app");
const firestore_1 = require("firebase/firestore");
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
const app = (0, app_1.initializeApp)(firebaseConfig);
exports.db = (0, firestore_1.getFirestore)(app);
//# sourceMappingURL=firebase.js.map
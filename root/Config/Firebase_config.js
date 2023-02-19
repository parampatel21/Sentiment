// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBeGxpyW7-XKT4scH41JCzn2Tzb3s7sveY",
  authDomain: "sentiment-6696b.firebaseapp.com",
  databaseURL: "https://sentiment-6696b-default-rtdb.firebaseio.com",
  projectId: "sentiment-6696b",
  storageBucket: "sentiment-6696b.appspot.com",
  messagingSenderId: "929145383886",
  appId: "1:929145383886:web:4059c05a3f9aebca45199f",
  measurementId: "G-38C03L0RC1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
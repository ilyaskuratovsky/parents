// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: "AIzaSyC1Tc4JdpW5W1ttwdlQn-ufAALZ7lQMJzc",
    authDomain: "flagfootball-59d5b.firebaseapp.com",
    projectId: "flagfootball-59d5b",
    storageBucket: "flagfootball-59d5b.appspot.com",
    messagingSenderId: "602495058477",
    appId: "1:602495058477:web:58a956fd4539d14a55eea4"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the database service
export const database = getDatabase(app);

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD6tCcfDROkaf5Yi0xZsx4EwG8L0qRghrw",
    authDomain: "deliverystatus-fb73d.firebaseapp.com",
    projectId: "deliverystatus-fb73d",
    storageBucket: "deliverystatus-fb73d.firebasestorage.app",
    messagingSenderId: "20804965103",
    appId: "1:20804965103:web:7e95de437f90db2656c11a",
    measurementId: "G-Q15X24N78B"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
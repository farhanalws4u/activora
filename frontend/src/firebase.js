import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA8xYO61cu0Go_A_oQtClMFIGfIaxZgso0",
  authDomain: "activora-8d7fb.firebaseapp.com",
  projectId: "activora-8d7fb",
  storageBucket: "activora-8d7fb.appspot.com",
  messagingSenderId: "16444352676",
  appId: "1:16444352676:web:7557b4062501c673a6de31",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth };
export { db };

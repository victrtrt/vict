import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
   apiKey: "AIzaSyCZPtyqjEejOjQblJftcvTUha_Ft7RyJEY",
  authDomain: "vict-dc9dc.firebaseapp.com",
  projectId: "vict-dc9dc",
  storageBucket: "vict-dc9dc.firebasestorage.app",
  messagingSenderId: "205504802411",
  appId: "1:205504802411:web:30068b16d95c9a4c38cb2e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

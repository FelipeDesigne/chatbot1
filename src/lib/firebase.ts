import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB3qVIQ6FHmDqz6DFnx2OtZg42jsnmrsp4",
  authDomain: "chatb-f46d9.firebaseapp.com",
  projectId: "chatb-f46d9",
  storageBucket: "chatb-f46d9.firebasestorage.app",
  messagingSenderId: "199083395890",
  appId: "1:199083395890:web:3b3137192d4eaac760a52b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
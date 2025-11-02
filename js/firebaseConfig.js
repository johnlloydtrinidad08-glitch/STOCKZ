import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBM9tF1lW9omw2Kg1h107ZA7GEq9VJJEpQ",
  authDomain: "verdaderos-inventory.firebaseapp.com",
  projectId: "verdaderos-inventory",
  storageBucket: "verdaderos-inventory.firebasestorage.app",
  messagingSenderId: "406336113641",
  appId: "1:406336113641:web:80f83095efa37012ac9978"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);



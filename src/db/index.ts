import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDY_Nuo5ynKf3mMumXhmNCNNhbDZqjMgDc",
  authDomain: "appmoveis-d536f.firebaseapp.com",
  projectId: "appmoveis-d536f",
  storageBucket: "appmoveis-d536f.firebasestorage.app",
  messagingSenderId: "420778575609",
  appId: "1:420778575609:web:fae12fb955c62a0dd30428",
  measurementId: "G-59GNMV9V4H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)

db
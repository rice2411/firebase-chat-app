import firebase from "firebase/compat/app";

import "firebase/compat/analytics";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCQcDVf4-JicHuZTk27ZFGAMvoC0lwLUMc",
  authDomain: "chat-app-3c67a.firebaseapp.com",
  projectId: "chat-app-3c67a",
  storageBucket: "chat-app-3c67a.appspot.com",
  messagingSenderId: "742151687871",
  appId: "1:742151687871:web:8fb19478fa652cc9f7800a",
  measurementId: "G-HHTX777BFZ",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db };
export default firebase;

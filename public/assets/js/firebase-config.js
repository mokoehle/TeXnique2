// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCePpq2ZKuL1Y8CqLR5tq7jnx34nJkxGf4",
  authDomain: "texnique-2.firebaseapp.com",
  projectId: "texnique-2",
  storageBucket: "texnique-2.firebasestorage.app",
  messagingSenderId: "679489548092",
  appId: "1:679489548092:web:ad999dee23644510cef839"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

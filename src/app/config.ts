import { FirebaseApp, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyCLddLKQR_QtXMBEdt1yIO7vHp6jeWOA9U",
  authDomain: "donbyuib.firebaseapp.com",
  projectId: "donbyuib",
  storageBucket: "donbyuib.appspot.com",
  messagingSenderId: "586021322511",
  appId: "1:586021322511:web:fe97e78a0e10165d2b487a",
  measurementId: "G-D749N7NPLF"
};

export const firebaseApp: FirebaseApp = initializeApp(firebaseConfig);
export const firestore = getFirestore(firebaseApp);

import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCWQxtNuv2JNvceyAvx2I_T1yk3HRaDfG8",
  authDomain: "zaraheightsislamabad.firebaseapp.com",
  projectId: "zaraheightsislamabad",
  storageBucket: "zaraheightsislamabad.appspot.com",
  messagingSenderId: "331482865667",
  appId: "1:331482865667:web:1b739512f3eb6487e5ae36",
  measurementId: "G-BZCTKFMKKM"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
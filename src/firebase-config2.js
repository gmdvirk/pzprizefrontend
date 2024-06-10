/* eslint-disable import/prefer-default-export */
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Initialize Firebase
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
// Firebase storage reference
export const storage = getStorage(app);
// export default storage;

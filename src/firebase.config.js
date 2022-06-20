import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from   'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7AtbUAW6RgMuXV0cuELVJp3W3hYqVmbI",
  authDomain: "house-hunt-app-ac8c5.firebaseapp.com",
  projectId: "house-hunt-app-ac8c5",
  storageBucket: "house-hunt-app-ac8c5.appspot.com",
  messagingSenderId: "114003644356",
  appId: "1:114003644356:web:220a5404ba9ecfced25e91",
  measurementId: "G-DQXGZ7G02T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db=getFirestore()
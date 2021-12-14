import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/compat/storage";

const myFirebase = firebase.initializeApp({
  apiKey: "AIzaSyCQpIIbRHJXGDufhgbdhMprelFEsg7IUNE",
  authDomain: "sketch-it-c7250.firebaseapp.com",
  databaseURL: "https://sketch-it-c7250-default-rtdb.firebaseio.com",
  projectId: "sketch-it-c7250",
  storageBucket: "sketch-it-c7250.appspot.com",
  messagingSenderId: "817910914674",
  appId: "1:817910914674:web:7531f2d3cd132b5948eceb",
});

const myDB = myFirebase.database();

export const sketchDB = myDB.ref('sketch');
export const sketchStorage = myFirebase.storage();
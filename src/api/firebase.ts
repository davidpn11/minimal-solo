import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { firebaseConfig } from "./config";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const database = firebase.firestore();
export const getSessionRef = (id: string) =>
  database.collection("session").doc(id);
export const getUniqueId = () => database.collection("session").doc().id;

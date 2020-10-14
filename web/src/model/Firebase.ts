import * as firebase from 'firebase/app';

export type DocumentSnapshot = firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>;

export type QuerySnapshot = firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>;
export type DocumentReference = firebase.firestore.DocumentReference<
  firebase.firestore.DocumentData
>;

export type CollectionReference = firebase.firestore.CollectionReference<
  firebase.firestore.DocumentData
>;

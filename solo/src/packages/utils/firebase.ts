import * as O from "fp-ts/Option";
import * as admin from "firebase-admin";
import * as firebase from "firebase/app";

export type WebDocumentSnapshop = firebase.firestore.DocumentSnapshot<
  firebase.firestore.DocumentData
>;

export type NodeDocumentSnapshot = admin.firestore.DocumentSnapshot<
  admin.firestore.DocumentData
>;

export type DocumentSnapshot = WebDocumentSnapshop | NodeDocumentSnapshot;

export type WebQuerySnapshot = firebase.firestore.QuerySnapshot<
  firebase.firestore.DocumentData
>;
export type NodeQuerySnapshot = admin.firestore.QuerySnapshot<
  admin.firestore.DocumentData
>;
export type QuerySnapshot = WebQuerySnapshot | NodeQuerySnapshot;

export type DocumentReference = admin.firestore.DocumentReference<
  admin.firestore.DocumentData
>;

export type CollectionReference = admin.firestore.CollectionReference<
  admin.firestore.DocumentData
>;

export function extractDocumentData<T>(doc: DocumentSnapshot): O.Option<T> {
  if (doc.exists) {
    const data = doc.data() as T;
    return O.fromNullable(data);
  } else {
    return O.none;
  }
}
export function normalizeDocument<T>(doc: DocumentSnapshot): Normalized<T> {
  if (doc.exists) {
    const data = doc.data() as T;
    return {
      [doc.id]: data,
    };
  } else {
    return {};
  }
}

export function normalizeQuery<T>(doc: QuerySnapshot): Normalized<T> {
  if (!doc.empty) {
    let data = {};
    // @ts-ignore
    doc.forEach((el) => {
      data = {
        ...data,
        [el.id]: el.data(),
      };
    });
    return data;
  } else {
    return {};
  }
}

export function getQueryHead<T>(doc: QuerySnapshot): O.Option<T & ID> {
  if (!doc.empty && doc.size === 1) {
    const head = doc.docs[0];

    const data = {
      id: head.id,
      ...head.data(),
    };
    return head.exists ? O.some(data as T & ID) : O.none;
  } else {
    return O.none;
  }
}

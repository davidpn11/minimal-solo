import * as O from "fp-ts/Option";
import * as admin from "firebase-admin";

export type DocumentSnapshot = admin.firestore.DocumentSnapshot<
  admin.firestore.DocumentData
>;

export type QuerySnapshot = admin.firestore.QuerySnapshot<
  admin.firestore.DocumentData
>;
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

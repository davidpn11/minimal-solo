import * as O from 'fp-ts/lib/Option';

import { DocumentSnapshot, QuerySnapshot } from '../model/Firebase';
import { Normalized } from '../model/Session';

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
    doc.forEach(el => {
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

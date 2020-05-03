import { DocumentSnapshot, QuerySnapshot } from "../model/Firebase";
import { Normalized } from "../model/Session";
import { Card } from "../model/Card";
import { pipe } from "fp-ts/lib/pipeable";
import * as A from "fp-ts/lib/Array";
import * as O from "fp-ts/lib/Option";
import * as R from "fp-ts/lib/Record";

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

export function popDeckCards(deck: Normalized<Card>, nCards = 1) {
  const keys = pipe(deck, R.keys, A.takeLeft(nCards));
  console.log("pop", keys);
  const getCard = (acc: Normalized<Card>, key: string) => {
    const card: Card = { ...deck[key], status: "HAND" };
    return { ...acc, [key]: card };
  };

  const cards = pipe(keys, A.reduce({}, getCard));
  return {
    keys,
    cards,
  };
}

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import * as R from 'fp-ts/lib/Record';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';

import { firebaseConfig } from './config';
import { normalizeQuery } from './helpers';
import { SessionNotFoundError } from '../model/Error';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
if (window.location.hostname === 'localhost') {
  db.settings({
    host: 'localhost:8080',
    ssl: false,
  });
}

export const database = firebase.firestore();
export const getSessionRef = (id: string) => database.collection('session').doc(id);

export const getSessionRefByCode = (code: string) =>
  database.collection('session').where('code', '==', code);

export const getFullSessionByCode: (code: string) => Promise<LocalSessionWithId> = async (
  code: string,
) => {
  const sessionByCode = await getSessionRefByCode(code).get();
  return pipe(
    normalizeQuery<LocalSession>(sessionByCode),
    R.reduceWithIndex<string, LocalSession, O.Option<LocalSessionWithId>>(
      O.none,
      (id, acc, localSession) =>
        O.some({
          ...localSession,
          id,
        }),
    ),
    O.fold(
      () => {
        const SessionNotFound = SessionNotFoundError(code);
        throw new SessionNotFound();
      },
      async localSession => {
        const players = normalizeQuery<SessionPlayer>(
          await getSessionRef(localSession.id).collection('players').get(),
        );
        return { ...localSession, players };
      },
    ),
  );
};

export const getUniqueId = () => database.collection('session').doc().id;

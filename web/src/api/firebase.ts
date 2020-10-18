import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import axios from 'axios';

import { firebaseConfig } from './config';

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

export async function getFullSessionByCode(code: string): Promise<LocalSessionWithId> {
  try {
    const response = await axios.request<LocalSessionWithId>({
      method: 'GET',
      baseURL: firebaseConfig.baseApi,
      url: `/session/code/${code}`,
    });

    return response.data;
  } catch (e) {
    throw e;
  }
}

export const getUniqueId = () => database.collection('session').doc().id;

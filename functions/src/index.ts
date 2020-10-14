import * as express from 'express';
import * as cors from 'cors';
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import lobby from "./api/lobby";
import cards from "./api/cards";
import session from "./api/session";

const app = express();

admin.initializeApp();

app.use(cors({ origin: true }));

app.use('/lobby', lobby);
app.use('/cards', cards);
app.use('/session', session);

export const solo = functions.https.onRequest(app);

import * as O from "fp-ts/lib/Option";
import * as A from "fp-ts/lib/Array";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { buildOne, sortDeck, createAvatar } from "./helpers/game";
import { pipe } from "fp-ts/function";

admin.initializeApp();

const codeGenerator = () => {
  return String(Math.round(Math.random() * 100000));
};

export const newLobby = functions.https.onRequest(async (req, res) => {
  const { playerId, playerName } = req.query;

  if (typeof playerId !== "string") {
    res.status(400).send({ message: "Missing PlayerID" });
    return;
  }

  if (typeof playerName !== "string") {
    res.status(400).send({ message: "Missing PlayerName" });
    return;
  }

  const deck = sortDeck(buildOne());
  const session = await admin.firestore().collection("session").add({
    code: codeGenerator(),
    status: "INITIAL",
    admin: playerId,
    loadingStatus: O.none,
  });

  await admin
    .firestore()
    .collection("session")
    .doc(session.id)
    .collection("players")
    .doc(playerId)
    .set({
      name: playerName,
      position: 0,
      hand: [],
      avatar: createAvatar(),
      status: "ADMIN",
    });

  const batch = admin.firestore().batch();
  deck.forEach((card) => {
    batch.create(session.collection("deck").doc(), card);
  });
  batch.commit();

  try {
    const sessionDoc = await admin
      .firestore()
      .collection("session")
      .doc(session.id)
      .get();
    const sessionData = sessionDoc.data();
    const sessionWithId = {
      ...sessionData,
      id: sessionDoc.id,
    };

    res.set("Access-Control-Allow-Origin", "*");
    res.send(sessionWithId);
  } catch (e) {
    res.status(500).send(e);
  }
});

export const buyCards = functions.https.onRequest(async (req, res) => {
  const { sessionId, playerId, amount } = req.query;

  if (typeof playerId !== "string") {
    res.status(400).send({ message: "Missing PlayerID" });
    return;
  }

  if (typeof sessionId !== "string") {
    res.status(400).send({ message: "Missing SessionID" });
    return;
  }

  if (typeof amount !== "string") {
    res.status(400).send({ message: "Missing Amount" });
    return;
  }

  const sessionDoc = admin.firestore().collection("session").doc(sessionId);

  // Get list of cards from deck
  const deckDoc = await sessionDoc.collection("deck").get();
  const cardsToTake = pipe(deckDoc.docs, A.takeLeft(parseInt(amount)));

  const batch = admin.firestore().batch();

  cardsToTake.forEach((card) => {
    // add to active cards
    batch.set(sessionDoc.collection("activeCards").doc(card.id), card.data());
    // delete from deck
    batch.delete(sessionDoc.collection("deck").doc(card.id));
  });
  batch.commit();

  // add to player hand
  const cardIds = cardsToTake.map((card) => card.id);
  await sessionDoc.collection("players").doc(playerId).update("hand", cardIds);

  res.send(200);
});

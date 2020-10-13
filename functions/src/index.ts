import * as O from "fp-ts/lib/Option";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { buildOne, sortDeck, createAvatar } from "./helpers/game";

admin.initializeApp();

const codeGenerator = () => {
  return String(Math.round(Math.random() * 100000));
};

export const newGame = functions.https.onRequest(async (req, res) => {
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
  const session = await admin
    .firestore()
    .collection("session")
    .add({
      code: codeGenerator(),
      status: "INITIAL",
      admin: playerId,
      loadingStatus: O.none,
      players: {
        [playerId]: {
          name: playerName,
          position: 0,
          hand: [],
          avatar: createAvatar(),
          status: "ADMIN",
        },
      },
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

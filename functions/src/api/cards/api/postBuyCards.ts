import * as admin from "firebase-admin";
import {pipe} from "fp-ts/function";
import * as A from "fp-ts/Array";
import {RequestHandler} from "express";

type PostBody = {
  playerId: string;
  sessionId: string;
  amount: number;
}

export const postBuyCards: RequestHandler<{}, {}, PostBody> = async (req, res) => {
  const { sessionId, playerId, amount } = req.body;

  const sessionDoc = admin.firestore().collection("session").doc(sessionId);

  try {
    // Get list of cards from deck
    const deckDoc = await sessionDoc.collection("deck").get();
    const cardsToTake = pipe(deckDoc.docs, A.takeLeft(amount));

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
    const player = await sessionDoc.collection("players").doc(playerId).get();
    const playerData = player.data();

    if (playerData) {
      const updatedPlayer = {
        ...playerData,
        hand: [...playerData.hand, ...cardIds],
      };
      await sessionDoc.collection("players").doc(playerId).set(updatedPlayer);
      res.send({ ...updatedPlayer, id: player.id });
      return;
    }
  } catch (e) {
    res.status(500).send(e);
  }
}
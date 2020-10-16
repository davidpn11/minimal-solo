import * as admin from "firebase-admin";
import { RequestHandler } from "express";

import QuerySnapshot = admin.firestore.QuerySnapshot;

type PostBody = {
  playerId: string;
  sessionId: string;
  amount: number;
};

export function getNextCardsFromDeck(sessionId: string, amount: number) {
  return admin
    .firestore()
    .collection("session")
    .doc(sessionId)
    .collection("deck")
    .limit(amount);
}

export async function buyCards(
  sessionId: string,
  playerId: string,
  cardsToTake: QuerySnapshot
) {
  const batch = admin.firestore().batch();
  const sessionDoc = admin.firestore().collection("session").doc(sessionId);

  cardsToTake.forEach((card) => {
    // add to active cards
    batch.set(sessionDoc.collection("activeCards").doc(card.id), card.data());
    // delete from deck
    batch.delete(sessionDoc.collection("deck").doc(card.id));
  });
  await batch.commit();

  // add to player hand
  const cardIds = cardsToTake.docs.map((card) => card.id);
  const playerDoc = await sessionDoc.collection("players").doc(playerId).get();
  const player = playerDoc.data();

  if (playerDoc.exists && player) {
    const updatedPlayer = {
      ...player,
      hand: [...player.hand, ...cardIds],
    };
    await sessionDoc.collection("players").doc(playerId).set(updatedPlayer);
    return { ...updatedPlayer, id: playerDoc.id };
  }
  throw new Error("Cannot buy cards for unexistent player");
}

export const postBuyCards: RequestHandler<{}, {}, PostBody> = async (
  req,
  res
) => {
  const { sessionId, playerId, amount } = req.body;

  try {
    const cardsToTake = await getNextCardsFromDeck(sessionId, amount).get();
    const updatedPlayer = await buyCards(sessionId, playerId, cardsToTake);
    res.send(updatedPlayer);
    return;
  } catch (e) {
    res.status(500).send(e);
  }
};

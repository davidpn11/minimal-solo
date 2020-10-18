import * as admin from "firebase-admin";
import { RequestHandler } from "express";

type PostBody = {
  playerId: string;
  sessionId: string;
  amount: number;
};

export async function buyCards(
  sessionId: string,
  playerId: string,
  amount: number
) {
  const sessionDoc = admin.firestore().collection("session").doc(sessionId);

  // Get list of cards from deck
  const cardsToTake = await sessionDoc.collection("deck").limit(amount).get();

  const batch = admin.firestore().batch();

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
    const updatedPlayer = await buyCards(sessionId, playerId, amount);
    res.send(updatedPlayer);
    return;
  } catch (e) {
    res.status(500).send(e);
  }
};

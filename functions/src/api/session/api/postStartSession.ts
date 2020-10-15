import { RequestHandler } from "express";
import * as admin from "firebase-admin";
import * as O from "fp-ts/lib/Option";

export const postStartSessions: RequestHandler<{ id: string }> = async (
  req,
  res
) => {
  const { id } = req.params;

  try {
    const sessionRef = admin.firestore().collection("session").doc(id);

    const sessionDoc = await sessionRef.get();
    const playersDoc = await sessionRef.collection("players").get();

    const [startingPlayer] = playersDoc.docs;

    if (!startingPlayer.exists) {
      res.status(500).send({ message: "Cannot start a game without players." });
    }

    // Filter only cards that can start the game, and get just the top one.
    const availableCardDoc = await sessionRef
      .collection("deck")
      .where("VALUE", "not-in", [
        "REVERSE",
        "PLUS_TWO",
        "SWAP",
        "BLOCK",
        "PLUS_FOUR",
        "SWAP_ALL",
        "COLOR",
      ])
      .limit(1)
      .get();

    const [currentCardDoc] = availableCardDoc.docs;

    if (!currentCardDoc.exists) {
      res
        .status(500)
        .send({ message: "There are no available cards on the deck." });
    }

    // Set the new session data
    const newSession = {
      ...sessionDoc.data(),
      status: "STARTED",
      currentPlayer: startingPlayer.id,
      currentPlay: "",
      direction: "RIGHT",
      winner: O.none,
      currentCard: currentCardDoc.data(),
    };

    // Delete current card from the deck
    await sessionRef.collection("deck").doc(currentCardDoc.id).delete();

    // Update it
    await sessionRef.update(newSession);

    res.json(newSession);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
};

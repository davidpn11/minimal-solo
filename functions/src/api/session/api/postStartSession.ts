import { RequestHandler } from "express";
import * as O from "fp-ts/lib/Option";
import * as A from "fp-ts/lib/Array";
import { pipe } from "fp-ts/pipeable";
import { buyCards } from "../../cards/api/postBuyCards";
import { getSessionById } from "../../../db/session";

export const postStartSessions: RequestHandler<{ id: string }> = async (
  req,
  res
) => {
  const { id } = req.params;

  try {
    const {
      ref: sessionRef,
      doc: sessionDoc,
      data: sessionData,
    } = await getSessionById(id);

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

    // Buy cards for everyone
    const queries = pipe(
      Object.keys(playersDoc.docs.values()),
      A.map((playerId: string) => buyCards(sessionDoc.id, playerId, 7))
    );
    await Promise.all(queries);

    // Set the new session data
    const newSession = {
      ...sessionData,
      players: playersDoc.docs.values(),
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

    // return relevant info
    const { deck, activeCards, ...relevantSession } = newSession;

    res.json(relevantSession);
    return;
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
};

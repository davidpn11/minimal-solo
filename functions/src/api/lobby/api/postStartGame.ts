import { RequestHandler } from "express";
import * as O from "fp-ts/lib/Option";
import * as T from "fp-ts/lib/Task";
import * as A from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/function";

import { buyCards } from "../../cards/api/postBuyCards";
import { getSessionById } from "../../../db/session";

export const postStartGame: RequestHandler<{ id: string }> = async (
  req,
  res
) => {
  const { id } = req.params;

  try {
    const {
      ref: sessionRef,
      data: sessionData,
      id: sessionId,
    } = await getSessionById(id);

    // notify users the process started
    await sessionRef.update({ status: "STARTING" });

    const playersRef = sessionRef.collection("players");
    const playersDoc = await playersRef.get();

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

    // Deal cards
    const tasks = pipe(
      playersDoc.docs,
      A.map((doc) => doc.id),
      A.map<string, T.Task<{ id: string; hand: string[] }>>((id) => () =>
        buyCards(sessionId, id, 7)
      )
    );
    const dealCardsSeq = A.array.sequence(T.taskSeq)(tasks);

    await dealCardsSeq();

    // Set the new session data
    const newSession = {
      ...sessionData,
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

    // return session
    res.json(newSession);
    return;
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
};

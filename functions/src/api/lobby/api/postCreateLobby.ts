import { RequestHandler } from "express";
import { buildOne, createAvatar, sortDeck } from "../../../helpers/game";
import * as admin from "firebase-admin";
import * as O from "fp-ts/Option";
import { ServerSession } from "../../../db/session";

const codeGenerator = () => {
  return String(Math.round(Math.random() * 100000));
};

type PostBody = {
  playerId: string;
  playerName: string;
};

export const postCreateLobby: RequestHandler<{}, {}, PostBody> = async (
  req,
  res
) => {
  const { playerId, playerName } = req.body;
  console.log({ playerId, playerName });

  try {
    const deck = sortDeck(buildOne());
    const newSession: Partial<ServerSession> = {
      code: codeGenerator(),
      status: "INITIAL",
      admin: playerId,
      loadingStatus: 0,
      currentPlayer: playerId,
      currentPlay: "",
      direction: "RIGHT",
      winner: O.none,
    };

    const session = await admin
      .firestore()
      .collection("session")
      .add(newSession);

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
    await batch.commit();

    const sessionDoc = await session.get();
    const players = await session.collection("players").listDocuments();
    const sessionWithId = {
      ...sessionDoc.data(),
      players: players.values(),
      id: sessionDoc.id,
    };

    res.send(sessionWithId);
  } catch (e) {
    res.status(500).send(e);
  }
};

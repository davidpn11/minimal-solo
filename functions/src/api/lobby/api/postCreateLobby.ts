import { RequestHandler } from "express";
import * as admin from "firebase-admin";
import * as O from "fp-ts/Option";
import { buildDeck, sortDeck } from "@mikelfcosta/solo-lib/lib/card";
import { createAvatar } from "@mikelfcosta/solo-lib/lib/player";

import { ServerSession } from "../../../db/session";

const codeGenerator = () => {
  const epoch = new Date().valueOf().toString();
  const endOfDate = epoch.substring(epoch.length - 5, epoch.length - 1);
  const randomNumber = Math.round(Math.random() * 100);
  return `${endOfDate}${randomNumber}`;
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

  try {
    const deck = sortDeck(buildDeck());
    const newSession: Partial<ServerSession> = {
      code: codeGenerator(),
      status: "LOBBY",
      admin: playerId,
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
    console.error(e);
    res.status(500).send(e);
  }
};

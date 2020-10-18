import { RequestHandler } from "express";
import * as admin from "firebase-admin";
import { pipe } from "fp-ts/lib/pipeable";
import { foldGameSession } from "solo-lib/lib/session";
import { normalizeQuery } from "solo-lib/lib/utils/firebase";

type ReqParams = {
  code: string;
};

export const getSessionByCode: RequestHandler<ReqParams> = async (req, res) => {
  const { code } = req.params;

  try {
    const sessionByCode = await admin
      .firestore()
      .collection("session")
      .where("code", "==", code)
      .get();

    const [sessionDoc] = sessionByCode.docs;
    const sessionId = sessionDoc.id;

    if (!sessionDoc.exists) {
      res.status(404).send({ message: `Session with code ${code} not found.` });
      return;
    }

    const session = sessionDoc.data();
    const sessionRef = admin.firestore().collection("session").doc(sessionId);

    const playersDoc = await sessionRef.collection("players").get();
    const players = normalizeQuery<SessionPlayer>(playersDoc);

    function returnSimpleSession() {
      res.send({ ...session, id: sessionId, players });
    }

    async function returnGameSession() {
      const players = normalizeQuery<SessionPlayer>(playersDoc);
      const progressionDoc = await sessionRef.collection("progression").get();

      const progression = normalizeQuery<Progression>(progressionDoc);
      const cemeteryDoc = await sessionRef.collection("cemetery").get();

      const cemetery = normalizeQuery<Cemetery>(cemeteryDoc);

      return res.send({
        ...session,
        id: sessionId,
        players,
        progression,
        cemetery,
      });
    }

    pipe(
      session as SessionStore,
      foldGameSession({
        whenNoGameSession: returnSimpleSession,
        whenLobbySession: returnSimpleSession,
        whenLoadingSession: returnSimpleSession,
        whenGameStarted: await returnGameSession,
      })
    );
  } catch (e) {
    console.error(e);
    res.send(e);
  }
};

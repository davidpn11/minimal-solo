import { RequestHandler } from "express";
import * as admin from "firebase-admin";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import { foldGameSession } from "solo-lib/lib/session";
import { getQueryHead, normalizeQuery } from "solo-lib/lib/utils/firebase";

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

    return pipe(
      getQueryHead<SessionQueryResult>(sessionByCode),
      O.fold(
        () => {
          res
            .status(404)
            .send({ message: `Session with code ${code} not found.` });
        },
        async (session) => {
          const sessionRef = admin
            .firestore()
            .collection("session")
            .doc(session.id);

          const playersDoc = await sessionRef.collection("players").get();
          const players = normalizeQuery<SessionPlayer>(playersDoc);

          function returnSimpleSession() {
            res.send({ ...session, players });
          }

          async function returnGameSession() {
            const progressionDoc = await sessionRef
              .collection("progression")
              .get();
            const progression = normalizeQuery<Progression>(progressionDoc);

            const cemeteryDoc = await sessionRef.collection("cemetery").get();
            const cemetery = normalizeQuery<Cemetery>(cemeteryDoc);

            return res.send({
              ...session,
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
        }
      )
    );
  } catch (e) {
    console.error(e);
    res.send(e);
  }
};

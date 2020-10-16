import * as admin from "firebase-admin";
import * as io from "io-ts";
import { option, withFallback } from "io-ts-types";
import { CardSchema } from "./card";
import { SessionPlayerSchema } from "./player";
import { PlaySchema } from "./play";
import { pipe } from "fp-ts/function";
import { dto } from "../utils/dto";

import DocumentReference = admin.firestore.DocumentReference;
import DocumentSnapshot = admin.firestore.DocumentSnapshot;

const StatusEnum = io.keyof({
  INITIAL: "",
  STARTING: "",
  STARTED: "",
  FINISHED: "",
});

const DirectionEnum = io.keyof({
  LEFT: "",
  RIGHT: "",
});

const SessionSchema = io.type({
  code: io.string,
  status: StatusEnum,
  admin: io.string,
  deck: withFallback(io.record(io.string, CardSchema), {}),
  activeCards: withFallback(io.record(io.string, CardSchema), {}),
  cemetery: withFallback(io.record(io.string, CardSchema), {}),
  currentCard: withFallback(io.record(io.string, CardSchema), {}),
  players: withFallback(io.record(io.string, SessionPlayerSchema), {}),
  currentPlayer: io.string,
  currentPlay: io.string,
  direction: DirectionEnum,
  progression: withFallback(io.record(io.string, PlaySchema), {}),
  winner: option(SessionPlayerSchema),
  loadingStatus: io.number,
});
export type ServerSession = io.TypeOf<typeof SessionSchema>;

type GetSessionReturn = {
  ref: DocumentReference;
  doc: DocumentSnapshot;
  data: ServerSession;
  id: string;
};

export async function getSessionById(
  sessionId: string
): Promise<GetSessionReturn> {
  const ref = admin.firestore().collection("session").doc(sessionId);
  const doc = await ref.get();

  if (doc.exists) {
    return {
      ref,
      doc,
      data: pipe(doc.data(), dto.runTypeDecoder(SessionSchema)),
      id: doc.id,
    };
  }

  throw new Error(`Could not find session with id: ${sessionId}`);
}

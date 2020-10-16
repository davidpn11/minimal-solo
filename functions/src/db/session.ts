import * as admin from "firebase-admin";
import * as io from "io-ts";
import { option } from "io-ts-types";
import { pipe } from "fp-ts/function";
import { SessionPlayerSchema } from "./player";
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
  currentPlayer: io.string,
  currentPlay: io.string,
  direction: DirectionEnum,
  winner: option(SessionPlayerSchema),
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

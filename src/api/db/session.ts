import {
  database,
  getSessionRef,
  getUniqueId,
  getSessionRefByCode,
} from "../firebase";
import {
  Normalized,
  Session,
  NoGameSession,
  SessionWithId,
  LocalSessionWithId,
  LocalGameSession,
  ID,
} from "../../model/Session";
import { DocumentSnapshot, QuerySnapshot } from "../../model/Firebase";
import { Player, PlayerWithId } from "../../model/Player";
import { buildOne } from "../../model/Card";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";

const codeGenerator = () => {
  return String(Math.round(Math.random() * 100000));
};

function normalizeDocument<T>(doc: DocumentSnapshot): Normalized<T> {
  if (doc.exists) {
    const data = doc.data() as T;
    return {
      [doc.id]: data,
    };
  } else {
    return {};
  }
}

function normalizeQuery<T>(doc: QuerySnapshot): Normalized<T> {
  if (!doc.empty) {
    let data = {};
    doc.forEach((el) => {
      data = {
        ...data,
        [el.id]: el.data(),
      };
    });
    return data;
  } else {
    return {};
  }
}

function getQueryHead<T>(doc: QuerySnapshot): O.Option<T & ID> {
  if (!doc.empty && doc.size === 1) {
    const head = doc.docs[0];

    const data = {
      id: head.id,
      ...head.data(),
    };
    return head.exists ? O.some(data as T & ID) : O.none;
  } else {
    return O.none;
  }
}

//TODO: IMPROVE THIS CODE
export async function requestCreateSession(
  adminName: string
): Promise<LocalSessionWithId> {
  const s = {
    code: codeGenerator(),
    status: "INITIAL" as NoGameSession["status"],
    admin: adminName,
  };

  const session = await database.collection("session").add(s);
  const generateCards = buildOne();

  const player = await getSessionRef(session.id).collection("players").add({
    name: adminName,
    isReady: false,
    hand: [],
  });

  const batch = database.batch();
  const deckRef = getSessionRef(session.id).collection("deck");
  generateCards.forEach(async (card) => {
    batch.set(deckRef.doc(getUniqueId()), card);
  });
  await batch.commit();

  return {
    id: session.id,
    players: {
      [player.id]: {
        name: adminName,
        hand: [],
        isReady: false,
      },
    },
    ...s,
  };
}

//TODO
export async function requestSetSession(
  session: SessionWithId
): Promise<SessionWithId> {
  const { id, ...rest } = session;
  const res = await database.collection("session").doc(id).set(rest);

  return session;
}

export async function requestJoinSession(sessionCode: string) {
  const sessionRef = await getSessionRefByCode(sessionCode).get();
  const session = getQueryHead<LocalGameSession>(sessionRef);
  return pipe(
    session,
    O.fold(
      () => {
        throw new Error();
      },
      (s: LocalSessionWithId) => s
    )
  );
}

export async function requestSessionPlayersListener(
  sessionId: string,
  addFn: (p: Normalized<Player>) => void
) {
  await getSessionRef(sessionId)
    .collection("players")
    .onSnapshot((querySnapshot) => {
      const players = normalizeQuery<Player>(querySnapshot);
      addFn(players);
    });
}

export async function requestAddPlayer(
  sessionId: string,
  name: string
): Promise<Normalized<Player>> {
  const initialPlayerData = {
    name,
    isReady: false,
    hand: [],
  };
  const player = await database
    .collection("session")
    .doc(sessionId)
    .collection("players")
    .add(initialPlayerData);
  return { [player.id]: initialPlayerData };
}

//TODO
export async function requestGetSession(sessionId: string) {
  const res = await database.collection("session").doc(sessionId).get();
  return res;
}

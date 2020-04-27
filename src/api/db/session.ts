import {
  database,
  getSessionRef,
  getUniqueId,
  getSessionRefByCode,
} from "../firebase";
import {
  Normalized,
  NoGameSession,
  LocalSessionWithId,
  LocalGameSession,
  ID,
} from "../../model/Session";
import { DocumentSnapshot, QuerySnapshot } from "../../model/Firebase";
import { SessionPlayer, PlayerStatus } from "../../model/Player";
import { buildOne, sortDeck } from "../../model/Card";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";

const MAX_ROOM_SIZE = 8;
const codeGenerator = () => {
  return String(Math.round(Math.random() * 100000));
};

export function normalizeDocument<T>(doc: DocumentSnapshot): Normalized<T> {
  if (doc.exists) {
    const data = doc.data() as T;
    return {
      [doc.id]: data,
    };
  } else {
    return {};
  }
}

export function normalizeQuery<T>(doc: QuerySnapshot): Normalized<T> {
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

export async function requestCreateSession(
  adminName: string
): Promise<LocalSessionWithId> {
  const sessionData = {
    code: codeGenerator(),
    status: "INITIAL" as NoGameSession["status"],
    admin: adminName,
  };

  const playerData: SessionPlayer = {
    name: adminName,
    hand: [],
    status: "ADMIN",
  };

  const session = await database.collection("session").add(sessionData);
  const generateCards = sortDeck(buildOne());

  const player = await getSessionRef(session.id)
    .collection("players")
    .add(playerData);

  const batch = database.batch();
  const deckRef = getSessionRef(session.id).collection("deck");
  generateCards.forEach(async (card) => {
    batch.set(deckRef.doc(getUniqueId()), card);
  });
  await batch.commit();

  return {
    id: session.id,
    players: {
      [player.id]: playerData,
    },
    ...sessionData,
  };
}

export async function requestJoinSession(sessionCode: string) {
  const sessionRef = await getSessionRefByCode(sessionCode).get();
  const session = getQueryHead<LocalGameSession>(sessionRef);
  return pipe(
    session,
    O.fold(
      () => {
        throw new Error("SESSION NOT FOUND");
      },
      async (s: LocalSessionWithId) => {
        const size = (await getSessionRef(s.id).collection("players").get())
          .size;
        if (size >= MAX_ROOM_SIZE) {
          throw new Error("ROOM IS FULL");
        }
        return s;
      }
    )
  );
}

export async function requestTogglePlayerStatus(
  sessionId: string,
  playerId: string,
  playerStatus: PlayerStatus
) {
  if (playerStatus === "ADMIN") throw new Error("IsAdmin");

  return await getSessionRef(sessionId)
    .collection("players")
    .doc(playerId)
    .set({
      status: playerStatus === "NOT_READY" ? "READY" : "NOT_READY",
    });
}

export async function requestSessionPlayersListener(
  sessionId: string,
  addFn: (p: Normalized<SessionPlayer>) => void
) {
  try {
    await getSessionRef(sessionId)
      .collection("players")
      .onSnapshot((querySnapshot) => {
        const players = normalizeQuery<SessionPlayer>(querySnapshot);
        addFn(players);
      });
  } catch (error) {
    console.error(error);
  }
}

export async function requestAddPlayer(
  sessionId: string,
  name: string
): Promise<Normalized<SessionPlayer>> {
  const initialPlayerData: SessionPlayer = {
    name,
    status: "NOT_READY" as const,
    hand: [],
  };
  const player = await database
    .collection("session")
    .doc(sessionId)
    .collection("players")
    .add(initialPlayerData);
  return { [player.id]: initialPlayerData };
}

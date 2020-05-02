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
import {
  SessionPlayer,
  PlayerStatus,
  SessionPlayerWithId,
} from "../../model/Player";
import { buildOne, sortDeck, Card } from "../../model/Card";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import { normalizeQuery, popDeckCards } from "../helpers";

export const MAX_ROOM_SIZE = 10;
export const MIN_ROOM_SIZE = 3;
const codeGenerator = () => {
  return String(Math.round(Math.random() * 100000));
};

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
  const playerId = getUniqueId();

  const initialSession = {
    code: codeGenerator(),
    status: "INITIAL" as NoGameSession["status"],
    admin: playerId,
  };

  const playerData: SessionPlayer = {
    name: adminName,
    hand: [],
    status: "ADMIN",
  };

  const session = await database.collection("session").add(initialSession);
  const sessionRef = getSessionRef(session.id);
  const player = await sessionRef
    .collection("players")
    .doc(playerId)
    .set(playerData);

  const generateCards = sortDeck(buildOne());

  const batch = database.batch();
  const deckRef = sessionRef.collection("deck");
  generateCards.forEach(async (card) => {
    batch.set(deckRef.doc(getUniqueId()), card);
  });
  await batch.commit();

  return {
    id: session.id,
    players: {
      [playerId]: playerData,
    },
    ...initialSession,
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
    .set(
      {
        status: playerStatus === "NOT_READY" ? "READY" : "NOT_READY",
      },
      { merge: true }
    );
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
): Promise<SessionPlayerWithId> {
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

  return { ...initialPlayerData, id: player.id };
}

export const requestBuyCards = (
  sessionRef: ReturnType<typeof getSessionRef>
) => async (playerId: string, nCards = 1) => {
  const deckRef = sessionRef.collection("deck");
  const deck = normalizeQuery<Card>(await deckRef.get());

  //get number of deck cards
  const userCards = popDeckCards(deck, nCards);

  //delete from deck structure
  await Promise.all(
    userCards.keys.map((key) => {
      return deckRef.doc(key).delete();
    })
  );

  //write on activeCards structture
  const batch = database.batch();
  userCards.keys.map((key) => {
    const cardRef = sessionRef.collection("activeCards").doc(key);
    batch.set(cardRef, userCards.cards[key]);
  });
  await batch.commit();

  //set userHand
  await sessionRef.collection("players").doc(playerId).set(
    {
      hand: userCards.keys,
    },
    { merge: true }
  );
};

export async function requestStartGame(sessionId: string, playerId: string) {
  const sessionRef = getSessionRef(sessionId);
  await requestBuyCards(sessionRef)(playerId);
}

import { database, getSessionRef, getUniqueId } from "../firebase";
import {
  Normalized,
  Session,
  NoGameSession,
  SessionWithId,
  DocumentSnapshot,
  QuerySnapshot,
} from "../../model/Session";
import { Player, PlayerWithId } from "../../model/Player";
import { buildOne } from "../../model/Card";

const codeGenerator = () => {
  return "XXXX";
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

//TODO: IMPROVE THIS CODE
export async function requestCreateSession(
  adminName: string
): Promise<SessionWithId> {
  const s = {
    code: codeGenerator(),
    status: "INITIAL" as NoGameSession["status"],
    admin: adminName,
  };

  console.log("go");
  const session = await database.collection("session").add(s);
  const generateCards = buildOne();

  const player = await getSessionRef(session.id).collection("players").add({
    name: adminName,
    uno: false,
  });

  const playerR = await getSessionRef(session.id)
    .collection("players")
    .doc(player.id)
    .get();

  const batch = database.batch();
  const deckRef = getSessionRef(session.id).collection("deck");
  generateCards.forEach(async (card) => {
    batch.set(deckRef.doc(getUniqueId()), card);
  });
  await batch.commit();

  const deck = await getSessionRef(session.id).collection("deck").get();

  return {
    id: session.id,
    deck: normalizeQuery(deck),
    players: {
      [player.id]: {
        name: adminName,
        uno: false,
        hand: {},
      },
    },
    ...s,
  };
}

export async function requestSetSession(
  session: SessionWithId
): Promise<SessionWithId> {
  const { id, ...rest } = session;
  const res = await database.collection("session").doc(id).set(rest);

  return session;
}

export async function requestAddPlayer(
  sessionId: string,
  player: Player
): Promise<PlayerWithId> {
  const res = await database
    .collection("session")
    .doc(sessionId)
    .collection("players")
    .add(player);
  return { id: res.id, ...player };
}

export async function requestGetSession(sessionId: string) {
  const res = await database.collection("session").doc(sessionId).get();
  return res;
}

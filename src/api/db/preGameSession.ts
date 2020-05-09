import { database, getSessionRef, getUniqueId, getSessionRefByCode } from '../firebase';
import { Normalized, NoGameSession, LocalSessionWithId, LocalGameSession, ID } from '../../model/Session';
import { QuerySnapshot } from '../../model/Firebase';
import { SessionPlayer, PlayerStatus, SessionPlayerWithId } from '../../model/Player';
import { buildOne, sortDeck, Card } from '../../model/Card';
import * as O from 'fp-ts/lib/Option';
import * as R from 'fp-ts/lib/Record';
import * as A from 'fp-ts/lib/Array';
import { pipe } from 'fp-ts/lib/pipeable';
import { normalizeQuery, popDeckCards, extractDocumentData } from '../helpers';

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

export async function requestCreateSession(adminName: string): Promise<LocalSessionWithId> {
  const playerId = getUniqueId();

  const initialSession = {
    code: codeGenerator(),
    status: 'INITIAL' as NoGameSession['status'],
    admin: playerId,
  };

  const playerData: SessionPlayer = {
    name: adminName,
    hand: [],
    status: 'ADMIN',
  };

  const session = await database.collection('session').add(initialSession);
  const sessionRef = getSessionRef(session.id);
  await sessionRef.collection('players').doc(playerId).set(playerData);

  const generateCards = sortDeck(buildOne());

  const batch = database.batch();
  const deckRef = sessionRef.collection('deck');
  generateCards.forEach(async card => {
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
        throw new Error('SESSION NOT FOUND');
      },
      async (s: LocalSessionWithId) => {
        const size = (await getSessionRef(s.id).collection('players').get()).size;
        if (size >= MAX_ROOM_SIZE) {
          throw new Error('ROOM IS FULL');
        }
        return s;
      },
    ),
  );
}

export async function requestTogglePlayerStatus(sessionId: string, playerId: string, playerStatus: PlayerStatus) {
  if (playerStatus === 'ADMIN') throw new Error('IsAdmin');

  return await getSessionRef(sessionId)
    .collection('players')
    .doc(playerId)
    .set(
      {
        status: playerStatus === 'NOT_READY' ? 'READY' : 'NOT_READY',
      },
      { merge: true },
    );
}

export async function requestSessionPlayersListener(
  sessionId: string,
  callback: (p: Normalized<SessionPlayer>) => void,
) {
  try {
    await getSessionRef(sessionId)
      .collection('players')
      .onSnapshot(querySnapshot => {
        const players = normalizeQuery<SessionPlayer>(querySnapshot);
        callback(players);
      });
  } catch (error) {
    console.error(error);
  }
}

export async function requestSessionStatusListener(
  sessionId: string,
  callback: (newSession: LocalSessionWithId) => void,
) {
  try {
    await getSessionRef(sessionId).onSnapshot(documentSnapshot => {
      const newSession = extractDocumentData<LocalSessionWithId>(documentSnapshot);
      if (O.isSome(newSession)) {
        callback(newSession.value);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

export async function requestAddPlayer(sessionId: string, name: string): Promise<SessionPlayerWithId> {
  const initialPlayerData: SessionPlayer = {
    name,
    status: 'NOT_READY' as const,
    hand: [],
  };

  const player = await database.collection('session').doc(sessionId).collection('players').add(initialPlayerData);

  return { ...initialPlayerData, id: player.id };
}

export const requestBuyCards = (sessionRef: ReturnType<typeof getSessionRef>) => async (
  player: SessionPlayerWithId,
  nCards = 1,
): Promise<SessionPlayerWithId> => {
  const deckRef = sessionRef.collection('deck');
  const deck = normalizeQuery<Card>(await deckRef.get());

  //get number of deck cards
  const userCards = popDeckCards(deck, 'HAND', nCards);

  //delete from deck structure
  await Promise.all(
    userCards.keys.map(key => {
      return deckRef.doc(key).delete();
    }),
  );

  //write on activeCards structrure
  const batch = database.batch();
  userCards.keys.map(key => {
    const cardRef = sessionRef.collection('activeCards').doc(key);
    batch.set(cardRef, userCards.cards[key]);
  });
  await batch.commit();

  //set userHand
  const newHand = [...player.hand, ...userCards.keys];
  await sessionRef.collection('players').doc(player.id).set(
    {
      hand: newHand,
    },
    { merge: true },
  );

  return { ...player, hand: newHand };
};

async function requestSetCurrentCard(sessionRef: ReturnType<typeof getSessionRef>): Promise<Card> {
  const deckRef = sessionRef.collection('deck');
  const deck = normalizeQuery<Card>(await deckRef.get());
  const userCards = popDeckCards(deck, 'GAME');
  const key = pipe(userCards.keys, A.head);

  const card = pipe(
    key,
    O.fold(
      () => O.none,
      key => R.lookup(key, userCards.cards),
    ),
  );

  if (O.isNone(card)) throw new Error('fail to fetch card');

  sessionRef.set(
    {
      currentCard: card.value,
    },
    { merge: true },
  );

  return card.value;
}

export async function initGameSession(
  session: LocalSessionWithId,
  newPlayers: Normalized<SessionPlayer>,
): Promise<LocalSessionWithId> {
  const sessionRef = getSessionRef(session.id);

  const randPlayer = () => {
    const array = pipe(session.players, R.keys);
    return array[Math.floor(Math.random() * array.length)];
  };

  const currentCard = await requestSetCurrentCard(sessionRef);
  const newSession: LocalSessionWithId = {
    ...session,
    players: newPlayers,
    status: 'STARTED',
    currentPlayer: randPlayer(),
    direction: 'RIGHT',
    progression: {},
    winner: O.none,
    currentCard: currentCard,
  };
  const { id, ...newSessionRest } = newSession;
  await sessionRef.set(newSessionRest);

  return newSession;
}

export async function requestDealStartHands(session: LocalSessionWithId) {
  const sessionRef = getSessionRef(session.id);
  const buyCards = requestBuyCards(sessionRef);

  const dealPlayerCard = (key: string, acc: Promise<SessionPlayerWithId>[], player: SessionPlayer) => {
    return [...acc, buyCards({ id: key, ...player }, 7)];
  };

  const players = await Promise.all(pipe(session.players, R.reduceWithIndex([], dealPlayerCard)));
  return players;
}

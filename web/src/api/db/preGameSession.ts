import axios from 'axios';
import * as O from 'fp-ts/lib/Option';
import * as R from 'fp-ts/lib/Record';
import * as A from 'fp-ts/lib/Array';
import { pipe } from 'fp-ts/lib/pipeable';

import { database, getSessionRef, getSessionRefByCode } from '../firebase';
import { Normalized, LocalSessionWithId, LocalGameSession, ID } from '../../model/Session';
import { QuerySnapshot } from '../../model/Firebase';
import {
  SessionPlayer,
  PlayerStatus,
  SessionPlayerWithId,
  createAvatar,
  getSessionPlayerByPosition,
} from '../../model/Player';
import { buyCard, Card } from '../../model/Card';
import { normalizeQuery, popDeckCards, extractDocumentData } from '../helpers';
import { SessionNotFoundError } from '../../model/Error';
import { firebaseConfig } from '../config';

export const MAX_ROOM_SIZE = 10;
export const MIN_ROOM_SIZE = 2;

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
  playerName: string,
  playerId: string,
): Promise<LocalSessionWithId> {
  try {
    const response = await axios.request<LocalSessionWithId>({
      method: 'POST',
      baseURL: firebaseConfig.baseApi,
      url: '/lobby',
      data: { playerName, playerId },
    });
    return response.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function requestJoinSession(
  sessionCode: string,
): Promise<{ session: LocalSessionWithId; playersCount: number }> {
  const sessionRef = await getSessionRefByCode(sessionCode).get();
  const session = getQueryHead<LocalGameSession>(sessionRef);

  return pipe(
    session,
    O.fold(
      () => {
        const SessionNotFound = SessionNotFoundError(sessionCode);
        throw new SessionNotFound();
      },
      async (s: LocalSessionWithId) => {
        const size = (await getSessionRef(s.id).collection('players').get()).size;
        if (size >= MAX_ROOM_SIZE) {
          throw new Error('ROOM IS FULL');
        }
        return { session: s, playersCount: size };
      },
    ),
  );
}

export async function requestTogglePlayerStatus(
  sessionId: string,
  playerId: string,
  playerStatus: PlayerStatus,
) {
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
      const newSession = extractDocumentData<Omit<LocalSessionWithId, 'progression'>>(
        documentSnapshot,
      );
      if (O.isSome(newSession)) {
        callback({ ...newSession.value, progression: {} } as LocalSessionWithId);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

export async function requestAddPlayer(
  sessionId: string,
  name: string,
  playerId: string,
  position: number,
): Promise<SessionPlayerWithId> {
  const initialPlayerData: SessionPlayer = {
    name,
    position,
    status: 'NOT_READY' as const,
    avatar: createAvatar(),
    hand: [],
  };

  await getSessionRef(sessionId).collection('players').doc(playerId).set(initialPlayerData);

  return { ...initialPlayerData, id: playerId };
}

function checkCurrentCardValid(cards: Normalized<Card>): boolean {
  return pipe(
    cards,
    R.some(
      c =>
        c.color === 'BLACK' ||
        c.value === 'REVERSE' ||
        c.value === 'PLUS_TWO' ||
        c.value === 'SWAP' ||
        c.value === 'BLOCK',
    ),
  );
}

function getCurrentCard(deck: Normalized<Card>) {
  let currentCard = popDeckCards(deck, 'GAME');
  let isInvalid = checkCurrentCardValid(currentCard.cards);

  while (isInvalid) {
    const newDeck = pipe(
      deck,
      R.filterWithIndex(key =>
        pipe(
          popDeckCards(deck, 'GAME').keys,
          A.findFirst(cardKey => key === cardKey),
          O.isNone,
        ),
      ),
    );

    currentCard = popDeckCards(newDeck, 'GAME');
  }

  return currentCard;
}

async function requestSetCurrentCard(sessionRef: ReturnType<typeof getSessionRef>): Promise<Card> {
  const deckRef = sessionRef.collection('deck');
  const deck = normalizeQuery<Card>(await deckRef.get());
  const currentCard = getCurrentCard(deck);

  const key = pipe(currentCard.keys, A.head);

  //delete from deck structure
  await Promise.all(
    currentCard.keys.map(key => {
      return deckRef.doc(key).delete();
    }),
  );

  const card = pipe(
    key,
    O.fold(
      () => O.none,
      key => R.lookup(key, currentCard.cards),
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

export async function requestRemoveCardFromHand(
  sessionId: string,
  { id: playerId, ...player }: SessionPlayerWithId,
  cardId: string,
) {
  await getSessionRef(sessionId)
    .collection('players')
    .doc(playerId)
    .set({ ...player, hand: player.hand.filter(id => id !== cardId) });
}

export async function initGameSession(session: LocalSessionWithId): Promise<LocalSessionWithId> {
  const sessionRef = getSessionRef(session.id);
  const { players, ...sessionRest } = session;

  const currentCard = await requestSetCurrentCard(sessionRef);
  const newSession: Partial<LocalSessionWithId> = {
    ...sessionRest,
    status: 'STARTED',
    currentPlayer: getSessionPlayerByPosition(players, 0).id,
    currentPlay: '',
    direction: 'RIGHT',
    winner: O.none,
    currentCard: currentCard,
  };
  const { id, ...newSessionRest } = newSession;
  await sessionRef.set(newSessionRest);

  return { ...newSession, progression: {} } as LocalSessionWithId;
}

export async function requestDealStartHands(session: LocalSessionWithId) {
  const queries = pipe(
    Object.keys(session.players),
    A.map((playerId: string) => buyCard(session.id, playerId, 7)),
  );

  return await Promise.all(queries);
}

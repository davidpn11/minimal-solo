import axios from 'axios';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';

import { getSessionRef, getSessionRefByCode } from '../firebase';
import { Normalized, LocalSessionWithId, LocalGameSession, ID } from '../../model/Session';
import { QuerySnapshot } from '../../model/Firebase';
import { SessionPlayer, PlayerStatus, SessionPlayerWithId, createAvatar } from '../../model/Player';
import { normalizeQuery, extractDocumentData } from '../helpers';
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
    throw error;
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

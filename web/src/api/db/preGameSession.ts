import axios from 'axios';
import { createAvatar } from '@mikelfcosta/solo-lib/lib/player';

import { getFullSessionByCode, getSessionRef } from '../firebase';
import { firebaseConfig } from '../config';

export const MAX_ROOM_SIZE = 10;
export const MIN_ROOM_SIZE = 2;

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
): Promise<{
  session: LocalSessionWithId;
  playersCount: number;
}> {
  const session = await getFullSessionByCode(sessionCode);

  const size = Object.keys(session.players).length;

  if (size >= MAX_ROOM_SIZE) {
    throw new Error('ROOM IS FULL');
  }

  return {
    session,
    playersCount: size,
  };
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

export async function requestAddPlayer(
  sessionId: string,
  name: string,
  playerId: string,
  position: number,
): Promise<SessionPlayerWithId> {
  const initialPlayerData: SessionPlayer = {
    name,
    position,
    status: 'NOT_READY',
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

import * as R from 'fp-ts/lib/Record';
import * as O from 'fp-ts/lib/Option';

import { Play } from '../../../model/Play';
import { ID, LocalGameSession } from '../../../model/Session';
import { getSessionPlayerByPosition, SessionPlayerWithId } from '../../../model/Player';

export function isOwnerOfPlay(play: Play, currentPlayerId: string): boolean {
  return play.player.id === currentPlayerId;
}

function isFirstPosition(currentPlayerPosition: number): boolean {
  return currentPlayerPosition === 0;
}

function isLastPosition(currentPlayerPosition: number, lastPlayerPosition: number): boolean {
  return currentPlayerPosition === lastPlayerPosition;
}

export function getNextPlayer(play: Play, session: LocalGameSession & ID): SessionPlayerWithId {
  const currentPlayer = R.lookup(play.player.id, session.players);
  if (O.isNone(currentPlayer)) throw new Error('Cannot get position of not playing player.');

  const currentPlayerPosition = currentPlayer.value.position;

  const lastPlayerPosition = Object.values(session.players).length - 1;
  const currentDirection = session.direction;

  let nextPlayerPosition = 0;
  if (currentDirection === 'LEFT') {
    nextPlayerPosition = isFirstPosition(currentPlayerPosition)
      ? currentPlayerPosition + 1
      : lastPlayerPosition;
  } else {
    nextPlayerPosition = isLastPosition(currentPlayerPosition, lastPlayerPosition)
      ? 0
      : currentPlayerPosition + 1;
  }

  return getSessionPlayerByPosition(session.players, nextPlayerPosition);
}

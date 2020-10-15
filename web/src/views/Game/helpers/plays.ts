import * as R from 'fp-ts/lib/Record';
import * as O from 'fp-ts/lib/Option';

import { Play } from '../../../model/Play';
import { ID, LocalGameSession } from '../../../model/Session';
import { getSessionPlayerByPosition, SessionPlayerWithId } from '../../../model/Player';
import { getNextPosition } from '../../../store/session/selectors';

export function isOwnerOfPlay(play: Play, currentPlayerId: string): boolean {
  return play.player.id === currentPlayerId;
}

export function getNextPlayerByPlay(
  play: Play,
  session: LocalGameSession & ID,
): SessionPlayerWithId {
  const currentPlayer = R.lookup(play.player.id, session.players);
  if (O.isNone(currentPlayer)) throw new Error('Cannot get position of not playing player.');

  const isBlock = play.type === 'BLOCK_PLAY';

  let nextPosition = getNextPosition(session, currentPlayer.value.position);

  // Run again to skip a person.
  if (isBlock) {
    nextPosition = getNextPosition(session, nextPosition);
  }

  return getSessionPlayerByPosition(session.players, nextPosition);
}

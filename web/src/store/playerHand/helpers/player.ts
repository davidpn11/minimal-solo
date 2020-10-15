import * as R from 'fp-ts/lib/Record';
import { Player } from '../../../model/Player';
import { LocalSessionWithId } from '../../../model/Session';

export function isPlayerInTheGame(player: Player, session: LocalSessionWithId): boolean {
  const playerIds = R.keys(session.players);
  return playerIds.includes(player.id);
}

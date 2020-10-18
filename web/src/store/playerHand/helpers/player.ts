import * as R from 'fp-ts/lib/Record';

export function isPlayerInTheGame(player: Player, session: LocalSessionWithId): boolean {
  const playerIds = R.keys(session.players);
  return playerIds.includes(player.id);
}

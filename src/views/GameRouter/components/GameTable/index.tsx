import React from 'react';
import { useSelector } from 'react-redux';
import { pipe } from 'fp-ts/lib/pipeable';
import * as R from 'fp-ts/lib/Record';

import { TableWrapper } from './styles';
import { PlayerDeck } from '../../../../components/PlayerDeck';
import { SessionPlayer } from '../../../../model/Player';
import {
  getSession,
  getOtherSessionPlayers,
  getCurrentCard,
} from '../../../../store/session/selectors';
import { ActionArea } from '../../../../components/ActionArea';

export default function GameTable() {
  const session = useSelector(getSession);
  const otherPlayers = useSelector(getOtherSessionPlayers);
  const currentCard = useSelector(getCurrentCard);

  const renderPlayerCard = (key: string, player: SessionPlayer, pos: number) => (
    <PlayerDeck key={key} player={player} playerPosition={pos} />
  );

  const renderPlayers = () => {
    let i = 0;
    return pipe(
      otherPlayers,
      R.reduceWithIndex([] as JSX.Element[], (key, acc, p) => {
        const player = renderPlayerCard(key, p, i);
        i = i + 1;
        return [...acc, player];
      }),
    );
  };

  return (
    <TableWrapper>
      <ActionArea
        currentCard={currentCard}
        onDeckClick={() => console.log('Deck')}
        onCurrentClick={() => console.log('Current')}
      />
      {renderPlayers()}
    </TableWrapper>
  );
}

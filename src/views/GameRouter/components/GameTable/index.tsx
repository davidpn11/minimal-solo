import React from 'react';
import { TableWrapper, TableCenter, CardPlaceholder } from './styles';
import TablePlayer from '../TablePlayer';
import { SessionPlayer } from '../../../../model/Player';
import { Logo } from '../../../../components/Logo';
import CardDeck from '../CardDeck';
import CurrentCard from '../CurrentCard';
import { useSelector } from 'react-redux';
import { getSession, getOtherSessionPlayers } from '../../../../store/session/selectors';
import { pipe } from 'fp-ts/lib/pipeable';
import * as O from 'fp-ts/lib/Option';
import * as R from 'fp-ts/lib/Record';
import { getPlayerHandIds } from '../../../../store/playerHand/selector';

export default function GameTable() {
  const session = useSelector(getSession);
  const otherPlayers = useSelector(getOtherSessionPlayers);

  const renderPlayerCard = (key: string, player: SessionPlayer, pos: number) => (
    <TablePlayer key={key} player={player} playerPosition={pos} />
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
      <TableCenter>
        <Logo variant="WHITE" />
        <CardPlaceholder>
          <CurrentCard />
        </CardPlaceholder>
        <CardPlaceholder>
          <CardDeck />
        </CardPlaceholder>
      </TableCenter>
      {renderPlayers()}
    </TableWrapper>
  );
}

import React from 'react';
import { TableWrapper, TableCenter, CardPlaceholder } from './styles';
import TablePlayer from '../TablePlayer';
import { Player } from '../../../../model/Player';
import { Logo } from '../../../../components/Logo';
import CardDeck from '../CardDeck';
import CurrentCard from '../CurrentCard';

const players: Player[] = [
  {
    name: 'kevin',
    hand: [
      {
        status: 'GAME',
        color: 'RED',
        value: 'ONE',
      },
      {
        status: 'GAME',
        color: 'RED',
        value: 'ONE',
      },
    ],
  },
  {
    name: 'michel',
    hand: [
      {
        status: 'GAME',
        color: 'RED',
        value: 'ONE',
      },
      {
        status: 'GAME',
        color: 'RED',
        value: 'ONE',
      },
    ],
  },
  {
    name: 'david',
    hand: [
      {
        status: 'GAME',
        color: 'RED',
        value: 'ONE',
      },
      {
        status: 'GAME',
        color: 'RED',
        value: 'ONE',
      },
    ],
  },
  {
    name: 'david',
    hand: [
      {
        status: 'GAME',
        color: 'RED',
        value: 'ONE',
      },
      {
        status: 'GAME',
        color: 'RED',
        value: 'ONE',
      },
    ],
  },
  {
    name: 'david',
    hand: [
      {
        status: 'GAME',
        color: 'RED',
        value: 'ONE',
      },
      {
        status: 'GAME',
        color: 'RED',
        value: 'ONE',
      },
    ],
  },
  {
    name: 'david',
    hand: [
      {
        status: 'GAME',
        color: 'RED',
        value: 'ONE',
      },
      {
        status: 'GAME',
        color: 'RED',
        value: 'ONE',
      },
    ],
  },
  {
    name: 'david',
    hand: [
      {
        status: 'GAME',
        color: 'RED',
        value: 'ONE',
      },
      {
        status: 'GAME',
        color: 'RED',
        value: 'ONE',
      },
    ],
  },
  {
    name: 'david',
    hand: [
      {
        status: 'GAME',
        color: 'RED',
        value: 'ONE',
      },
      {
        status: 'GAME',
        color: 'RED',
        value: 'ONE',
      },
    ],
  },
  {
    name: 'david',
    hand: [
      {
        status: 'GAME',
        color: 'RED',
        value: 'ONE',
      },
      {
        status: 'GAME',
        color: 'RED',
        value: 'ONE',
      },
    ],
  },
  {
    name: 'david',
    hand: [
      {
        status: 'GAME',
        color: 'RED',
        value: 'ONE',
      },
      {
        status: 'GAME',
        color: 'RED',
        value: 'ONE',
      },
    ],
  },
];

export default function GameTable() {
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
      {players.map((player, i) => (
        <TablePlayer player={player} playerPosition={i} />
      ))}
    </TableWrapper>
  );
}

import React from 'react';
import { TableWrapper } from './styles';
import {Card} from '../../../../components/PlayingCard';

export default function GameTable() {
  return (
    <TableWrapper>
      <Card value="1" color="red" />
      <Card value="1" color="red" />
      <Card value="1" color="red" />
      <Card value="1" color="red" />
    </TableWrapper>
  );
}

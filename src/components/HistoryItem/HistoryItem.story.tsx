import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import * as O from 'fp-ts/lib/Option';
import { random } from 'faker';

import { HistoryItem } from './';
import { createAvatar, SessionPlayer, SessionPlayerWithId } from '../../model/Player';
import { ActionCard, Color, CommonCard, Value } from '../../model/Card';
import { UnionExclude } from '../../model/types';
import {
  createCommonNumberPlay,
  createDrawPlay,
  createPassPlay,
  createUnoPlay,
  Play,
} from '../../model/Play';

const avatar = createAvatar();

const Wrapper = styled.div`
  width: 360px;
`;

const PLAY_TYPES: Record<string, Play['type']> = {
  PassPlay: 'PASS_PLAY',
  UnoPlay: 'UNO_PLAY',
  DrawPlay: 'DRAW_PLAY',
  NumberCardPlay: 'NUMBER_CARD_PLAY',
  PlusTwoPlay: 'PLUS_TWO_PLAY',
  BlockPlay: 'BLOCK_PLAY',
  ReversePlay: 'REVERSE_PLAY',
  SwapPlay: 'SWAP_PLAY',
  SwapAllPlay: 'SWAP_ALL_PLAY',
  PlusFourPlay: 'PLUS_FOUR_PLAY',
};

const COLORS: Record<string, UnionExclude<Color, 'BLACK'>> = {
  Blue: 'BLUE',
  Green: 'GREEN',
  Gold: 'GOLD',
  Red: 'RED',
};

const ALL_COLORS = { ...COLORS, Black: 'BLACK' };

const ACTION_VALUES: Record<string, Value> = {
  SwapAll: 'SWAP_ALL',
  Color: 'COLOR',
  Reverse: 'REVERSE',
};

const ACTION_TARGET_VALUES: Record<string, Value> = {
  PlusFour: 'PLUS_FOUR',
  Block: 'BLOCK',
  PlusTwo: 'PLUS_TWO',
  Swap: 'SWAP',
};

const COMMON_VALUES: Record<string, Value> = {
  One: 'ONE',
  Two: 'TWO',
  Three: 'THREE',
  Four: 'FOUR',
  Five: 'FIVE',
  Six: 'SIX',
  Seven: 'SEVEN',
  Eight: 'EIGHT',
  Nine: 'NINE',
};

export function HistoryItemStory() {
  const nameKnob = text('Player Name', 'Michel Costa');
  const targetNameKnob = text('Player Name', 'John Jameson');
  const playType = select('Play Type', PLAY_TYPES, 'DRAW_CARD');
  const colorKnob = select('Color', COLORS, 'BLUE');
  const actionTargetColorKnob = select('Target Color', ALL_COLORS, 'BLACK');
  const commonValueKnob = select('Common Cards', COMMON_VALUES, 'ONE');
  const targetKnob = boolean('Target', false);
  const actionValueKnob = select('Action Cards', ACTION_VALUES, 'SWAP_ALL');
  const actionTargetKnob = select('Action Cards with Target', ACTION_TARGET_VALUES, 'SWAP');

  const player: SessionPlayerWithId = {
    id: random.uuid(),
    name: nameKnob,
    position: 0,
    status: 'READY',
    avatar,
    hand: [],
  };
  const commonCard: CommonCard = {
    color: 'RED',
    value: 'FIVE',
    status: 'HAND',
  };

  const play: Play = useMemo<Play>(() => {
    console.log({ playType });
    switch (playType) {
      case 'PASS_PLAY':
        return createPassPlay(player, 0);
      case 'DRAW_PLAY':
        return createDrawPlay(player, commonCard, 0);
      case 'UNO_PLAY':
        return createUnoPlay(player, 0);
      case 'PLUS_TWO_PLAY':
      // return createPlusTwoPlay()
      // case 'PLUS_FOUR_PLAY':
      //     return plusFourPlay()
      // case 'BLOCK_PLAY':
      //   return createBlockPlay()
      // case 'REVERSE_PLAY':
      //   return reversePlay()
      // case 'SWAP_PLAY':
      //   return swapPlay()
      // case 'SWAP_ALL_PLAY':
      //   return swapAllPlay(0)
      //   case 'NUMBER_CARD_PLAY':
      default:
        return createCommonNumberPlay(player, commonCard, 0);
      // case ''
      // case 'DRAW_CARD' || '':
      //   return {
      //     type: playType,
      //     player,
      //     target: O.none,
      //     position: 0,
      //     card: O.some({
      //       color: colorKnob,
      //       value: commonValueKnob,
      //       status: 'PLAY',
      //       createdAt: 0,
      //     } as CommonCard),
      //   };
      // case 'PLAY_CARD':
      //   return {
      //     type: playType,
      //     player,
      //     target: O.some({ name: targetNameKnob, position: 1, hand: [], avatar, status: 'READY' }),
      //     position: 0,
      //     card: O.some({
      //       color: colorKnob,
      //       value: commonValueKnob,
      //       status: 'PLAY',
      //       createdAt: 0,
      //     } as CommonCard),
      //   };
      // case 'ACTION':
    }
  }, [
    playType,
    commonValueKnob,
    targetNameKnob,
    colorKnob,
    targetKnob,
    actionTargetKnob,
    actionValueKnob,
    actionTargetColorKnob,
  ]);

  return (
    <Wrapper>
      <HistoryItem play={play} />
    </Wrapper>
  );
}

export default {
  title: 'MinimalSolo/Components/Game',
  component: HistoryItemStory,
  decorators: [withKnobs],
};

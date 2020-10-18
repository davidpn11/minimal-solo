import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';
import { random } from 'faker';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { createAvatar } from 'solo-lib/lib/player';

import { HistoryItem } from './';
import {
  createBlockPlay,
  createColorPlay,
  createCommonNumberPlay,
  createDrawPlay,
  createPassPlay,
  createPlusFourPlay,
  createPlusTwoPlay,
  createReversePlay,
  createSwapAllPlay,
  createSwapPlay,
  createUnoPlay,
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

const COLORS: Record<string, CommonActionCardColor> = {
  Blue: 'BLUE',
  Green: 'GREEN',
  Gold: 'GOLD',
  Red: 'RED',
};

const ALL_COLORS = { ...COLORS, Black: 'BLACK' };

const ACTION_VALUES: Record<string, CardValue> = {
  SwapAll: 'SWAP_ALL',
  Color: 'COLOR',
  Reverse: 'REVERSE',
};

const ACTION_TARGET_VALUES: Record<string, CardValue> = {
  PlusFour: 'PLUS_FOUR',
  Block: 'BLOCK',
  PlusTwo: 'PLUS_TWO',
  Swap: 'SWAP',
};

const COMMON_VALUES: Record<string, CommonCardValue> = {
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
  const targetNameKnob = text('Target Name', 'John Jameson');
  const playType = select('Play Type', PLAY_TYPES, 'DRAW_PLAY');
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
  const target: SessionPlayerWithId = {
    id: random.uuid(),
    name: targetNameKnob,
    position: 1,
    status: 'READY',
    avatar,
    hand: [],
  };
  const commonCard: CommonCardWithId = {
    id: random.uuid(),
    color: colorKnob,
    value: commonValueKnob,
    status: 'PLAY',
    createdAt: Date.now(),
    type: 'COMMON',
  };

  const play: Play = useMemo<Play>(() => {
    switch (playType) {
      case 'PASS_PLAY':
        return createPassPlay(player, 0);
      case 'UNO_PLAY':
        return createUnoPlay(player, 0);
      case 'COLOR_PLAY':
        return createColorPlay(player, commonCard, 'RED', 0);
      case 'DRAW_PLAY':
        return createDrawPlay(player, commonCard, 0);
      case 'NUMBER_CARD_PLAY':
        return createCommonNumberPlay(player, commonCard, 0);
      case 'PLUS_TWO_PLAY':
        return createPlusTwoPlay(player, commonCard, target, 0);
      case 'BLOCK_PLAY':
        return createBlockPlay(player, target, commonCard, 0);
      case 'REVERSE_PLAY':
        return createReversePlay(player, commonCard, 'RIGHT', 0);
      case 'SWAP_PLAY':
        return createSwapPlay(player, commonCard, target, 0);
      case 'SWAP_ALL_PLAY':
        const swapAllCard: SpecialCard = {
          color: 'BLACK',
          value: 'SWAP_ALL',
          status: 'PLAY',
          createdAt: Date.now(),
          type: 'SPECIAL',
        };
        return createSwapAllPlay(player, swapAllCard, 0);
      case 'PLUS_FOUR_PLAY':
        const plusFourCard: SpecialCard = {
          color: 'BLACK',
          value: 'PLUS_FOUR',
          status: 'PLAY',
          createdAt: Date.now(),
          type: 'SPECIAL',
        };
        return createPlusFourPlay(player, plusFourCard, target, 0);
      default:
        throw new Error('No play');
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

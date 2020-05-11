import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import * as O from 'fp-ts/lib/Option';

import { HistoryItem } from './';
import { createAvatar, SessionPlayer } from '../../model/Player';
import { Play } from '../../model/Session';
import { ActionCard, Color, CommonCard, Value } from '../../model/Card';
import { UnionExclude } from '../../model/types';

const avatar = createAvatar();

const Wrapper = styled.div`
  width: 360px;
`;

const PLAY_TYPES: Record<string, Play['type']> = {
  DrawCard: 'DRAW_CARD',
  PlayCard: 'PLAY_CARD',
  Action: 'ACTION',
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

  const player: SessionPlayer = {
    name: nameKnob,
    status: 'READY',
    avatar,
    hand: [],
  };

  const play: Play = useMemo<Play>(() => {
    switch (playType) {
      case 'DRAW_CARD':
        return {
          type: playType,
          player,
          target: O.none,
          card: O.some({
            color: colorKnob,
            value: commonValueKnob,
            status: 'PLAY',
            createdAt: 0,
          } as CommonCard),
        };
      case 'PLAY_CARD':
        return {
          type: playType,
          player,
          target: O.some({ name: targetNameKnob, hand: [], avatar, status: 'READY' }),
          card: O.some({
            color: colorKnob,
            value: commonValueKnob,
            status: 'PLAY',
            createdAt: 0,
          } as CommonCard),
        };
      case 'ACTION':
      default:
        if (targetKnob) {
          return {
            type: playType,
            player,
            card: O.some({
              color: actionTargetColorKnob,
              value: actionTargetKnob,
              status: 'PLAY',
              createdAt: 0,
            } as ActionCard),
            target: O.some({ name: targetNameKnob, hand: [], avatar, status: 'READY' }),
          };
        }
        return {
          type: playType,
          player,
          card: O.some({
            color: 'BLACK',
            value: actionValueKnob,
            status: 'PLAY',
            createdAt: 0,
          } as ActionCard),
          target: O.none,
        };
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

import React from 'react';
import { pipe } from 'fp-ts/lib/pipeable';
import * as R from 'fp-ts/lib/Record';
import * as O from 'fp-ts/lib/Option';

import { HandWrapper, HandCardsWrapper } from './styles';
import { PlayingCard } from '../PlayingCard';
import { Solo } from '../Solo';
import { Pass, PassButtonStates } from '../Pass';
import { Card } from '../../model/Card';
import { Normalized } from '../../model/Session';
import { SoloButtonStates } from '../Solo/styles';
import { useSelector, useDispatch } from 'react-redux';
import { getPlayerActions, getCurrentSessionPlayer } from '../../store/session/selectors';
import { createPassPlay } from '../../model/Play';
import { addPlay } from '../../store/session/actions';

type Props = {
  solo: SoloButtonStates;
  pass: PassButtonStates;
  cards: Normalized<Card>;
};

export function PlayerHand(props: Props) {
  const playerActions = useSelector(getPlayerActions);
  const currSessionPlayer = useSelector(getCurrentSessionPlayer);
  const dispatch = useDispatch();

  const onPass = () => {
    pipe(
      currSessionPlayer,
      O.fold(
        () => {},
        sessionPlayer => {
          const play = createPassPlay(sessionPlayer, 0);
          dispatch(addPlay(play));
        },
      ),
    );
  };

  function renderCards(): React.ReactNode {
    return pipe(
      props.cards,
      R.reduceWithIndex<string, Card, JSX.Element[]>([], (key, acc, card) => [
        ...acc,
        <PlayingCard
          key={key}
          value={card.value}
          status="HAND"
          color={card.color}
          onClick={() => {}}
        />,
      ]),
    );
  }

  return (
    <HandWrapper>
      <Solo state={playerActions.soloAction} onClick={() => {}} />
      <HandCardsWrapper>{renderCards()}</HandCardsWrapper>
      <Pass state={playerActions.passAction} onClick={onPass} />
    </HandWrapper>
  );
}

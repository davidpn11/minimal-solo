import * as O from 'fp-ts/lib/Option';

import {
  ADD_PLAYER,
  CLEAR_SESSION,
  SessionActionTypes,
  SET_SESSION,
  SETUP_GAME,
  SET_GAME_PROGRESSION,
} from './actions';
import { LocalSessionWithId } from '../../model/Session';
import { createAvatar } from '../../model/Player';
import { pipe } from 'fp-ts/lib/pipeable';

const initialState: O.Option<LocalSessionWithId> = O.none;

const starterSession: LocalSessionWithId = {
  id: 'zXI3d1fis8XoNZUaoQT1',
  code: '21665',
  status: 'STARTED',
  players: {
    J8h4cn1KClXvziBKERdF: {
      status: 'READY',
      position: 0,
      avatar: createAvatar(),
      hand: [
        '2VeveEJPTvYlZZyUHKUH',
        '3LDER1PJJdsucVWshn0v',
        '3ftVRlh8i4v3ZAlcSh1i',
        '3wxpiQVaxvEinDLOMKCR',
        '4IlXfdqU6F0RBSRYVWSf',
        '4zGhHymR9nODQXEQoLup',
        '6jTWxymo30dkrkE9eZ5p',
      ],
      name: 'Jamie',
    },
    rmmfi2FbizScaJtIcqPO: {
      name: 'David',
      position: 1,
      avatar: createAvatar(),
      hand: [
        '2VeveEJPTvYlZZyUHKUH',
        '3LDER1PJJdsucVWshn0v',
        '3ftVRlh8i4v3ZAlcSh1i',
        '3wxpiQVaxvEinDLOMKCR',
        '4IlXfdqU6F0RBSRYVWSf',
        '4zGhHymR9nODQXEQoLup',
        '6jTWxymo30dkrkE9eZ5p',
      ],
      status: 'ADMIN',
    },
    wnuIw3JU7FQMJTSAnNs4: {
      status: 'READY',
      position: 2,
      avatar: createAvatar(),
      hand: [
        '2VeveEJPTvYlZZyUHKUH',
        '3LDER1PJJdsucVWshn0v',
        '3ftVRlh8i4v3ZAlcSh1i',
        '3wxpiQVaxvEinDLOMKCR',
        '4IlXfdqU6F0RBSRYVWSf',
        '4zGhHymR9nODQXEQoLup',
        '6jTWxymo30dkrkE9eZ5p',
      ],
      name: 'Michel',
    },
  },
  admin: 'rmmfi2FbizScaJtIcqPO',
  currentPlayer: 'rmmfi2FbizScaJtIcqPO',
  direction: 'RIGHT',
  progression: {},
  winner: {
    _tag: 'None',
  },
  currentCard: {
    color: 'GOLD',
    value: 'THREE',
    createdAt: 0,
    status: 'GAME',
  },
};

export function sessionReducer(
  stateO = initialState,
  action: SessionActionTypes,
): O.Option<LocalSessionWithId> {
  switch (action.type) {
    case SET_SESSION:
      return pipe(
        stateO,
        O.fold<LocalSessionWithId, O.Option<LocalSessionWithId>>(
          () => O.some(action.payload),
          state => {
            return O.some({
              ...state,
              ...action.payload,
            });
          },
        ),
      );
    case CLEAR_SESSION:
      return initialState;
    case SET_GAME_PROGRESSION:
      if (O.isNone(stateO)) throw new Error('Cannot add player to unexistent session.');

      return O.some({
        ...stateO.value,
        progression: action.payload,
      });
    case ADD_PLAYER:
      if (O.isNone(stateO)) throw new Error('Cannot add player to unexistent session.');

      return O.some({
        ...stateO.value,
        players: {
          ...stateO.value.players,
          ...action.payload,
        },
      });
    case SETUP_GAME:
      if (O.isNone(stateO)) throw new Error('Cannot setup game on unexistent session.');

      return O.some({
        ...stateO.value,
        status: 'STARTING',
      });
    default:
      return stateO;
  }
}

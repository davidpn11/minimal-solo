import * as O from 'fp-ts/lib/Option';

import { SessionActionTypes } from './actions';
import { LocalSessionWithId } from '../../model/Session';
import { createAvatar } from '../../model/Player';

const initialState: O.Option<LocalSessionWithId> = O.none;

const starterSession: LocalSessionWithId = {
  id: 'zXI3d1fis8XoNZUaoQT1',
  code: '21665',
  status: 'STARTED',
  players: {
    J8h4cn1KClXvziBKERdF: {
      status: 'READY',
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
  state = initialState,
  action: SessionActionTypes,
): O.Option<LocalSessionWithId> {
  switch (action.type) {
    case 'CREATE_SESSION':
      return O.some(action.payload);
    case 'CLEAR_SESSION':
      return initialState;
    case 'ADD_PLAYER':
      if (O.isNone(state)) throw new Error('Cannot add player to unexistent session.');

      return O.some({
        ...state.value,
        players: {
          ...state.value.players,
          ...action.payload,
        },
      });
    default:
      return state;
  }
}

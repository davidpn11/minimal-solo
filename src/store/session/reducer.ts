import { LocalSessionWithId } from '../../model/Session';
import { SessionActionTypes } from './actions';

const initialState: LocalSessionWithId = {
  id: '',
  code: '',
  status: 'INITIAL',
  players: {},
  admin: '',
};

const starterSession: LocalSessionWithId = {
  id: 'zXI3d1fis8XoNZUaoQT1',
  code: '21665',
  status: 'STARTED',
  players: {
    J8h4cn1KClXvziBKERdF: {
      status: 'READY',
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

export function sessionReducer(state = starterSession, action: SessionActionTypes): LocalSessionWithId {
  switch (action.type) {
    case 'CREATE_SESSION':
      return { ...state, ...action.payload };
    case 'CLEAR_SESSION':
      return initialState;
    case 'ADD_PLAYER':
      return {
        ...state,
        players: {
          ...state.players,
          ...action.payload,
        },
      };
    default:
      return state;
  }
}

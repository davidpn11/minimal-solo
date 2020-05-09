import { ReduxStore } from '../rootReducer';
import { Player } from '../../model/Player';

export const getPlayer = (state: ReduxStore): Player => state.player;

export const getPlayerId = (state: ReduxStore): string => state.player.id;

export const isCurrentPlayerAdmin = (state: ReduxStore): boolean => state.player.id === state.session.admin;

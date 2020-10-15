import { PassButtonStates } from '../../../components/Pass';
import { SoloButtonStates } from '../../../components/Solo/styles';

export type PlayerActions = {
  passAction: PassButtonStates;
  soloAction: SoloButtonStates;
  buyAction: boolean;
};
export const initialPlayerActions: PlayerActions = {
  passAction: 'CANNOT_PASS',
  soloAction: 'CANNOT_SOLO',
  buyAction: false,
};

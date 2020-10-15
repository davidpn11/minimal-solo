import { ThemeColors, ThemeGradients } from '../../../theme';

export function mapCountToColor(cardCount: number): ThemeColors {
  if (cardCount === 1) return 'redBase';
  if (cardCount <= 2) return 'yellowBase';
  if (cardCount <= 8) return 'blueBase';
  if (cardCount <= 16) return 'greenBase';
  return 'white';
}

export function mapCountToGradient(cardCount: number): ThemeGradients {
  if (cardCount === 1) return 'redGradient';
  if (cardCount <= 2) return 'yellowGradient';
  if (cardCount <= 8) return 'blueGradient';
  if (cardCount <= 16) return 'greenGradient';
  return 'blackGradient';
}

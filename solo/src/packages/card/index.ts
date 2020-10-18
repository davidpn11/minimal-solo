export {buildDeck, sortDeck} from "./deck";

export const isCommonCard = (card: Card): card is CommonCard => card.type === 'COMMON';
export const isBlockCard = (card: Card): card is ActionCard => card.value === 'BLOCK';
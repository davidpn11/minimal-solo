import { random } from "faker";

export function createAvatar() {
  return {
    positionX: random.number({ min: -1400, max: -10 }),
    positionY: random.number({ min: -1000, max: -10 }),
    scale: random.number({ min: 5000, max: 5500 }),
  };
}

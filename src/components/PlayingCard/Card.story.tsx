import { select, withKnobs } from "@storybook/addon-knobs";
import React, {useEffect} from "react";
import { PlayingCard } from "./index";
import {Color, Value} from "../../model/Card";

const COLORS: Record<string, Color> = {
  Blue: "BLUE",
  Green: "GREEN",
  Gold: "GOLD",
  Red: "RED",
  Black: "BLACK",
};

const ACTION_VALUES: Record<string, Value> = {
  PlusFour: "PLUS_FOUR",
  SwapAll: "SWAP_ALL",
  Color: "COLOR",
};

const COMMON_VALUES: Record<string, Value> = {
  One: "ONE",
  Two: "TWO",
  Three: "THREE",
  Four: "FOUR",
  Five: "FIVE",
  Six: "SIX",
  Seven: "SEVEN",
  Eight: "EIGHT",
  Nine: "NINE",
  Block: "BLOCK",
  Reverse: "REVERSE",
  PlusTwo: "PLUS_TWO",
  Swap: "SWAP",
};

export function CardStory() {
  const colorKnob = select("Color", COLORS, "BLUE");
  const isActionCard = colorKnob === "BLACK";
  const [cardTypes, defaultCard]: [Record<string, Value>, Value] = isActionCard ? [ACTION_VALUES, "PLUS_FOUR"] : [COMMON_VALUES, "ONE"];
  const valueKnob = select("Card", cardTypes, defaultCard);

  return (
    <PlayingCard
      status={"DECK"}
      value={valueKnob}
      color={colorKnob}
    />
  );
}

export default {
  title: "MinimalSolo/Components/Card",
  component: CardStory,
  decorators: [withKnobs],
};

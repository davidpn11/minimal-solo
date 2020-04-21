import { select, withKnobs } from "@storybook/addon-knobs";
import React from "react";
import { PlayingCard } from "./index";
import { Color } from "../../model/Card";

const COLORS: Record<string, Color> = {
  Blue: "BLUE",
  Green: "GREEN",
  Gold: "GOLD",
  Red: "RED",
  Black: "BLACK",
};

export function CardStory() {
  const colorKnob = select("Color", COLORS, "BLACK");

  return (
    <PlayingCard
      status={"DECK"}
      value={"ONE"}
      color={colorKnob}
      createdAt={0}
    />
  );
}

export default {
  title: "MinimalSolo/Components/Card",
  component: CardStory,
  decorators: [withKnobs],
};

import { select, text, withKnobs } from "@storybook/addon-knobs";
import React from "react";
import { Button } from "./index";

export function ButtonStory() {
  const textKnob = text("Text", "Start a New Room");
  const variantKnob = select(
    "Variant",
    {
      Primary: "primary",
      Secondary: "secondary",
    },
    "primary"
  );

  return <Button variant={variantKnob}>{textKnob}</Button>;
}

export default {
  title: "MinimalSolo/Components/Base",
  component: ButtonStory,
  decorators: [withKnobs],
};

import { select, withKnobs } from "@storybook/addon-knobs";
import React from "react";
import { Logo } from "./index";

export function LogoStory() {
  const variantKnob = select(
    "Variant",
    {
      Color: "COLOR",
      Black: "BLACK",
      White: "WHITE",
    },
    "COLOR"
  );

  return <Logo variant={variantKnob} />;
}

export default {
  title: "MinimalSolo/Components/Base",
  component: LogoStory,
  decorators: [withKnobs],
};

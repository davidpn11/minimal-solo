import React from "react";
import { select, withKnobs } from "@storybook/addon-knobs";

import { Pass, PassButtonStates } from "./";

const STATES: Record<string, PassButtonStates> = {
  CanPass: "CAN_PASS",
  Passed: "PASSED",
  CannotPass: "CANNOT_PASS",
};

export function PassStory() {
  const statesKnob = select("State", STATES, "CAN_PASS");

  return <Pass state={statesKnob} onClick={() => {}} />;
}

export default {
  title: "MinimalSolo/Components/Game",
  component: PassStory,
  decorators: [withKnobs],
};

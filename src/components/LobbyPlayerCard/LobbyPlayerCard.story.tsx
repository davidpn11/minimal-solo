import { select, text, withKnobs } from "@storybook/addon-knobs";
import React from "react";
import { LobbyPlayerCard } from "./index";

export function LobbyPlayerCardStory() {
  const nameKnob = text("Player Name", "Michel Costa");
  const statusKnob = select(
    "Status Type",
    {
      Admin: "ADMIN",
      Ready: "READY",
      NotReady: "NOT_READY",
    },
    "ADMIN"
  );
  const avatarKnob = text("AvatarUrl", "http://placekitten.com/32/32");

  return (
    <LobbyPlayerCard status={statusKnob} name={nameKnob} avatar={avatarKnob} />
  );
}

export default {
  title: "MinimalSolo/Components/PlayerCards",
  component: LobbyPlayerCardStory,
  decorators: [withKnobs],
};

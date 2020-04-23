import React from "react";
import { SoloButtonStates, SoloButton } from "./styles";

import { ReactComponent as SoloIcon } from "../../assets/svg/SoloIcon.svg";

type Props = {
  state: SoloButtonStates;
  onClick(e: React.MouseEvent): void;
};

export function Solo(props: Props) {
  return (
    <SoloButton
      state={props.state}
      onClick={props.onClick}
      disabled={props.state !== "CAN_SOLO"}
    >
      <SoloIcon />
    </SoloButton>
  );
}

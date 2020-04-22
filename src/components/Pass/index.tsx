import React from "react";
import {PassButtonProps, Wrapper} from "./styles";

import { ReactComponent as PassIcon } from "../../assets/svg/PassIcon.svg";

export type PassButtonStates = "CAN_PASS" | "CANNOT_PASS" | "PASSED";
export type Props = { state: PassButtonStates };

function mapStates(state: PassButtonStates): PassButtonProps {
  switch (state) {
    case "CAN_PASS":
      return { isPassable: true, isActive: false };
    case "PASSED":
      return { isPassable: false, isActive: true };
    case "CANNOT_PASS":
      return { isPassable: false, isActive: false };
    default:
      throw new Error("Impossible state at PassButton");
  }

}

export function Pass(props: Props) {
  const {isPassable, isActive} = mapStates(props.state);
  return (
    <Wrapper isPassable={isPassable} isActive={isActive}>
      <PassIcon />
    </Wrapper>
  );
}

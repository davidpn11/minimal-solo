import React from "react";
import { CardWrapper, CardValue, CardUpper, CardLower } from "./styles";
import { Color, Status, Value } from "../../model/Card";

import { ReactComponent as One } from "../../assets/svg/One.svg";
import { ReactComponent as Two } from "../../assets/svg/Two.svg";
import { ReactComponent as Three } from "../../assets/svg/Three.svg";
import { ReactComponent as Four } from "../../assets/svg/Four.svg";
import { ReactComponent as Five } from "../../assets/svg/Five.svg";
import { ReactComponent as Six } from "../../assets/svg/Six.svg";
import { ReactComponent as Seven } from "../../assets/svg/Seven.svg";
import { ReactComponent as Eight } from "../../assets/svg/Eight.svg";
import { ReactComponent as Nine } from "../../assets/svg/Nine.svg";
import { ReactComponent as Block } from "../../assets/svg/Block.svg";
import { ReactComponent as Reverse } from "../../assets/svg/Reverse.svg";
import { ReactComponent as PlusTwo } from "../../assets/svg/PlusTwo.svg";
import { ReactComponent as PlusTwoIcon } from "../../assets/svg/PlusTwoIcon.svg";
import { ReactComponent as PlusFour } from "../../assets/svg/PlusFour.svg";
import { ReactComponent as PlusFourIcon } from "../../assets/svg/PlusFourIcon.svg";
import { ReactComponent as Swap } from "../../assets/svg/Swap.svg";
import { ReactComponent as SwapAll } from "../../assets/svg/SwapAll.svg";
import { ReactComponent as ColorIcon } from "../../assets/svg/Color.svg";

type Props = {
  color: Color;
  value: Value;
  status: Status;
};

function mapIcons(
  value: Value
): { main: React.ReactNode; corner: React.ReactNode } {
  switch (value) {
    case "ONE":
      return {
        main: <One />,
        corner: <One />,
      };
    case "TWO":
      return {
        main: <Two />,
        corner: <Two />,
      };
    case "THREE":
      return {
        main: <Three />,
        corner: <Three />,
      };
    case "FOUR":
      return {
        main: <Four />,
        corner: <Four />,
      };
    case "FIVE":
      return {
        main: <Five />,
        corner: <Five />,
      };
    case "SIX":
      return {
        main: <Six />,
        corner: <Six />,
      };
    case "SEVEN":
      return {
        main: <Seven />,
        corner: <Seven />,
      };
    case "EIGHT":
      return {
        main: <Eight />,
        corner: <Eight />,
      };
    case "NINE":
      return {
        main: <Nine />,
        corner: <Nine />,
      };
    case "BLOCK":
      return {
        main: <Block />,
        corner: <Block />,
      };
    case "REVERSE":
      return {
        main: <Reverse />,
        corner: <Reverse />,
      };
    case "PLUS_TWO":
      return {
        main: <PlusTwoIcon />,
        corner: <PlusTwo />,
      };
    case "PLUS_FOUR":
      return {
        main: <PlusFourIcon />,
        corner: <PlusFour />,
      };
    case "SWAP":
      return {
        main: <Swap />,
        corner: <Swap />,
      };
    case "SWAP_ALL":
      return {
        main: <SwapAll />,
        corner: <SwapAll />,
      };
    case "COLOR":
      return {
        main: <ColorIcon />,
        corner: <ColorIcon />,
      };
    default:
      throw new Error("Not a card")
  }
}

export function PlayingCard(props: Props) {
  const { main, corner } = mapIcons(props.value);

  return (
    <CardWrapper color={props.color}>
      <CardUpper>{corner}</CardUpper>
      <CardValue>{main}</CardValue>
      <CardLower>{corner}</CardLower>
    </CardWrapper>
  );
}

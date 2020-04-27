import { ReduxStore } from "../rootReducer";
import { Player } from "../../model/Player";

export const getPlayer = (state: ReduxStore): Player => state.player;

import { Action } from "redux";
import { ThunkAction } from "redux-thunk";

export type ThunkResult<R, S extends {}, A extends Action<any>> = ThunkAction<
  Promise<R>,
  S,
  {},
  A
>;

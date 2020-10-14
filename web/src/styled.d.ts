import "styled-components";
import { MinimalSoloTheme } from "./theme";

declare module "styled-components" {
  export interface DefaultTheme extends MinimalSoloTheme {}
}

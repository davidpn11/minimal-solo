import "styled-components";
import { MinimalSoloTheme } from "../src/theme";

declare module "styled-components" {
  export interface DefaultTheme extends MinimalSoloTheme {}
}

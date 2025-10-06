import { useColorScheme } from "react-native";
import { PALETTE } from "../theme/palette";
import { useAppearance } from "../store/useAppearance";

export type Palette = {
  background: string;
  surface: string;
  text: string;
  subtle: string;
  border: string;
  primary: string;
  secondary: string;
  headerBg: string;
  headerText: string;
  tabBarBg: string;
  tabActive: string;
  tabInactive: string;
};

const light: Palette = {
  background: PALETTE.gray,
  surface: "#ffffff",
  text: PALETTE.navy,
  subtle: "#6B7280",
  border: "#D7DCE3",
  primary: PALETTE.yellow,
  secondary: PALETTE.blue,
  headerBg: "#ffffff",
  headerText: PALETTE.navy,
  tabBarBg: "#ffffff",
  tabActive: PALETTE.yellow,
  tabInactive: "#8AA0B7"
};

const dark: Palette = {
  background: "#1F2544",
  surface: "#2A3054",
  text: PALETTE.gray,
  subtle: "#BFC7D5",
  border: "#3E456A",
  primary: PALETTE.yellow,
  secondary: PALETTE.blue,
  headerBg: PALETTE.navy,
  headerText: PALETTE.gray,
  tabBarBg: PALETTE.navy,
  tabActive: PALETTE.yellow,
  tabInactive: "#94A9BE"
};

export function useThemeColors() {
  const sys = useColorScheme() ?? "light";
  const mode = useAppearance((s) => s.mode);
  const effective = mode === "system" ? sys : mode;
  const colors = effective === "dark" ? dark : light;
  return { colors, effective };
}

import { useColorScheme } from "react-native";
import { useUIStore } from "../store/uiStore";

export type Palette = {
  background: string;
  surface: string;
  border: string;
  text: string;
  subtle: string;
  headerBg: string;
  headerText: string;
  tabBarBg: string;
  tabActive: string;
  tabInactive: string;
  primary: string;
  secondary: string;
};

const light: Palette = {
  background: "#F1F1F1",
  surface: "#FFFFFF",
  border: "#E3E3E3",
  text: "#23120B",
  subtle: "#6E6E6E",
  headerBg: "#FFFFFF",
  headerText: "#23120B",
  tabBarBg: "#FFFFFF",
  tabActive: "#21209C",
  tabInactive: "#8C8C8C",
  primary: "#21209C",
  secondary: "#FDB827",
};

const dark: Palette = {
  background: "#000000ff",
  surface: "#0e0805ff",
  border: "#3B2A22",
  text: "#F1F1F1",
  subtle: "#C8C8C8",
  headerBg: "#000000ff",
  headerText: "#F1F1F1",
  tabBarBg: "#070301ff",
  tabActive: "#FDB827",
  tabInactive: "#9A9A9A",
  primary: "#4343ccff",
  secondary: "#FDB827",
};

export function useThemeColors() {
  const sys = useColorScheme();
  const pref = useUIStore((s) => s.theme);
  const effective = pref === "system" ? (sys === "dark" ? "dark" : "light") : pref;
  const colors = effective === "dark" ? dark : light;
  return { colors, effective };
}

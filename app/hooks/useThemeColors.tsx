import { useColorScheme } from "react-native";
import { useUIStore } from "../store/uiStore";

export type Palette = {
  background: string;
  surface: string;
  surfaceVariant: string;
  border: string;
  text: string;
  textSecondary: string;
  subtle: string;
  headerBg: string;
  headerText: string;
  tabBarBg: string;
  tabActive: string;
  tabInactive: string;
  primary: string;
  primaryLight: string;
  secondary: string;
  cardBg: string;
  cardBorder: string;
  inputBg: string;
  inputBorder: string;
  inputPlaceholder: string;
  buttonBg: string;
  buttonText: string;
  likeBg: string;
  likeText: string;
  likeActive: string;
  commentBg: string;
  commentBorder: string;
  avatarBg: string;
  danger: string;
  success: string;
};

const light: Palette = {
  background: "#F7F9FB",
  surface: "#FFFFFF",
  surfaceVariant: "#F5F7FA",
  border: "#E4E9F0",
  text: "#1A1A1A",
  textSecondary: "#525252",
  subtle: "#8A8A8A",
  headerBg: "#FFFFFF",
  headerText: "#1A1A1A",
  tabBarBg: "#FFFFFF",
  tabActive: "#5B8FB9",
  tabInactive: "#8A8A8A",
  primary: "#5B8FB9",
  primaryLight: "#7AABCC",
  secondary: "#96C4E0",
  cardBg: "#FFFFFF",
  cardBorder: "#E4E9F0",
  inputBg: "#F5F7FA",
  inputBorder: "#D9E2EC",
  inputPlaceholder: "#8A8A8A",
  buttonBg: "#5B8FB9",
  buttonText: "#FFFFFF",
  likeBg: "#F0F7FC",
  likeText: "#8A8A8A",
  likeActive: "#7AABCC",
  commentBg: "#F7F9FB",
  commentBorder: "#E4E9F0",
  avatarBg: "#7AABCC",
  danger: "#E53E3E",
  success: "#38A169",
};

const dark: Palette = {
  background: "#0F0F0F",
  surface: "#1A1A1A",
  surfaceVariant: "#252525",
  border: "#333333",
  text: "#E8E8E8",
  textSecondary: "#B8B8B8",
  subtle: "#707070",
  headerBg: "#1A1A1A",
  headerText: "#E8E8E8",
  tabBarBg: "#0F0F0F",
  tabActive: "#ED8936",
  tabInactive: "#707070",
  primary: "#ED8936",
  primaryLight: "#F6AD55",
  secondary: "#F6AD55",
  cardBg: "#1A1A1A",
  cardBorder: "#333333",
  inputBg: "#252525",
  inputBorder: "#3A3A3A",
  inputPlaceholder: "#707070",
  buttonBg: "#ED8936",
  buttonText: "#FFFFFF",
  likeBg: "#252525",
  likeText: "#B8B8B8",
  likeActive: "#F6AD55",
  commentBg: "#1A1A1A",
  commentBorder: "#333333",
  avatarBg: "#4A5568",
  danger: "#FC8181",
  success: "#68D391",
};

export function useThemeColors() {
  const sys = useColorScheme();
  const pref = useUIStore((s) => s.theme);
  const effective = pref === "system" ? (sys === "dark" ? "dark" : "light") : pref;
  const colors = effective === "dark" ? dark : light;
  return { colors, effective };
}

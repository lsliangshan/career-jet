// 图标  https://www.figma.com/design/awcDBnJQrEtyp1pyqbNudX/Iconicool-%7C-Free-Iconset--Community-?node-id=201-2755&t=a295C2jBOqBU2wA2-0

import { SupportedPlatform } from "@/types";

export const tabbars = [
  {
    name: "home",
    label: "大厅",
    icon: "../../../static/tabs/tab_home_unselect.png",
    activeIcon: "../../../static/tabs/tab_home_select.png",
  },
  {
    name: "deliver",
    label: "游戏",
    icon: "../../../static/tabs/tab_game_unselect.png",
    activeIcon: "../../../static/tabs/tab_game_select.png",
  },
  {
    name: "profile",
    label: "我的",
    icon: "../../../static/tabs/tab_profile_unselect.png",
    activeIcon: "../../../static/tabs/tab_profile_select.png",
  },
];

export const supportedPlatforms = [
  {
    type: SupportedPlatform.ZHAOPIN,
    name: "zhaopin",
    label: "智联招聘",
    icon: "https://img09.zhaopin.com/2012/other/mobile/clive/resources/imgs/zhaopin.png",
  },
  {
    type: SupportedPlatform.BOSS,
    name: "boss",
    label: "BOSS直聘",
    icon: "https://img09.zhaopin.com/2012/other/mobile/clive/resources/imgs/boss.jpg",
  },
];

export const ThemeColors = {
  primary: "#2B5AED",
  primary100: "rgba(43, 90, 237, 0.1)",
  primary200: "rgba(43, 90, 237, 0.2)",
  primary300: "rgba(43, 90, 237, 0.3)",
  primary400: "rgba(43, 90, 237, 0.4)",
  primary500: "rgba(43, 90, 237, 0.5)",
  primary600: "rgba(43, 90, 237, 0.6)",
  primary700: "rgba(43, 90, 237, 0.7)",
  primary800: "rgba(43, 90, 237, 0.8)",
  primary900: "rgba(43, 90, 237, 0.9)",
  accent: "#00CC88",
  success: "#00CC88",
  warning: "#FF9500",
  error: "#FF3B30",
  text: {
    title: "#1A1A1A",
    body: "#666666",
    label: "#999999",
    disabled: "#C8C8C8",
    placeholder: "#C8C8C8",
    white: "#FFFFFF",
  },
  border: "#f8f8f8",
  bgCard: "#FFFFFF",
  bg: "#F5F5F5",
};

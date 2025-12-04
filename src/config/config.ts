// 图标  https://www.figma.com/design/awcDBnJQrEtyp1pyqbNudX/Iconicool-%7C-Free-Iconset--Community-?node-id=201-2755&t=a295C2jBOqBU2wA2-0

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

export const supportedLevels = [
  {
    name: "新叶视界",
    desc: "初窥画面，描述基础内容。如嫩芽初绽，清晰即可。",
    level: 1,
  },
  {
    name: "溪流之眼",
    desc: "细致观察，捕捉动态与关联。如溪流蜿蜒，需叙述脉络。",
    level: 2,
  },
  {
    name: "光影画师",
    desc: "把握氛围与情感，用语言调配光影。挑战诗意与准确性的平衡。",
    level: 3,
  },
  {
    name: "万物共鸣",
    desc: "超越表象，描述隐喻、文化符号或深层叙事。要求洞察与共情。",
    level: 4,
  },
  {
    name: "灵魂棱镜",
    desc: "以极致创意重构图像，以语言折射万象之魂。",
    level: 5,
  },
];

export const ThemeColors = {
  primary: "#FF9A3C",
  primary100: "rgba(255, 154, 60, 0.1)",
  primary200: "rgba(255, 154, 60, 0.2)",
  primary300: "rgba(255, 154, 60, 0.3)",
  primary400: "rgba(255, 154, 60, 0.4)",
  primary500: "rgba(255, 154, 60, 0.5)",
  primary600: "rgba(255, 154, 60, 0.6)",
  primary700: "rgba(255, 154, 60, 0.7)",
  primary800: "rgba(255, 154, 60, 0.8)",
  primary900: "rgba(255, 154, 60, 0.9)",
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

// 图标  https://www.figma.com/design/awcDBnJQrEtyp1pyqbNudX/Iconicool-%7C-Free-Iconset--Community-?node-id=201-2755&t=a295C2jBOqBU2wA2-0

import { SupportedPlatform } from "@/types";

export const tabbars = [
  {
    name: "position",
    label: "职位",
    icon: "../../../static/tab_position_unselect.png",
    activeIcon: "../../../static/tab_position_select.png",
  },
  {
    name: "deliver",
    label: "投递",
    icon: "../../../static/tab_deliver_unselect.png",
    activeIcon: "../../../static/tab_deliver_select.png",
  },
  {
    name: "profile",
    label: "我的",
    icon: "../../../static/tab_profile_unselect.png",
    activeIcon: "../../../static/tab_profile_select.png",
  },
];

export const supportedPlatforms = [
  {
    type: SupportedPlatform.ZHAOPIN,
    name: "zhaopin",
    label: "智联招聘",
  },
  {
    type: SupportedPlatform.BOSS,
    name: "boss",
    label: "BOSS直聘",
  },
];
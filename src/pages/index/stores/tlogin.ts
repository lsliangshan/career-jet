import { defineStore } from "pinia";
import { ref } from "vue";

export enum ThirdPartLoginType {
  ZHAOPIN = "zhaopin",
  BOSS = "boss",
}

export interface CustomLoginInfo {
  type: ThirdPartLoginType;
  phonenum: string;
  cookie: string;
  isLogin: boolean;
}

export const useTLoginStore = defineStore("tlogin", () => {
  const customLoginInfo = ref<Record<ThirdPartLoginType, CustomLoginInfo>>({
    [ThirdPartLoginType.ZHAOPIN]: {
      type: ThirdPartLoginType.ZHAOPIN,
      phonenum: "183",
      cookie: "",
      isLogin: false,
    },
    [ThirdPartLoginType.BOSS]: {
      type: ThirdPartLoginType.BOSS,
      phonenum: "",
      cookie: "",
      isLogin: false,
    },
  });

  function getCustomLoginInfo(type: ThirdPartLoginType) {
    return customLoginInfo.value[type];
  }

  return {
    getCustomLoginInfo,
  };
});

import { requestThirdPartSmsCode } from "@/request";
import { defineStore } from "pinia";
import { ref } from "vue";

export enum ThirdPartLoginType {
  ZHAOPIN = "zhaopin",
  BOSS = "boss",
}

export interface CookieItem {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires: number;
  httpOnly: boolean;
}

export interface CustomLoginInfo {
  type: ThirdPartLoginType;
  phonenum: string;
  cookie: CookieItem[];
  expireAt: number;
}

export const useTLoginStore = defineStore("tlogin", () => {
  const customLoginInfo = ref<Record<ThirdPartLoginType, CustomLoginInfo>>({
    [ThirdPartLoginType.ZHAOPIN]: {
      type: ThirdPartLoginType.ZHAOPIN,
      phonenum: "10032132100",
      cookie: [],
      expireAt: 0,
    },
    [ThirdPartLoginType.BOSS]: {
      type: ThirdPartLoginType.BOSS,
      phonenum: "",
      cookie: [],
      expireAt: 0,
    },
  });

  function getCustomLoginInfo(type: ThirdPartLoginType) {
    return customLoginInfo.value[type];
  }

  function setCustomLoginInfo(params: {
    type: ThirdPartLoginType;
    phonenum: string;
    cookie: CookieItem[];
  }) {
    if (params.type === ThirdPartLoginType.ZHAOPIN) {
      const cookieAt = params.cookie.find((item) => item.name === "at");
      let expireAt = -1;
      if (cookieAt) {
        expireAt = cookieAt.expires * 1000;
      }
      customLoginInfo.value[ThirdPartLoginType.ZHAOPIN] = {
        ...customLoginInfo.value[ThirdPartLoginType.ZHAOPIN],
        ...params,
        expireAt,
      };

      uni.setStorageSync("customLoginInfo", customLoginInfo.value);
    } else if (params.type === ThirdPartLoginType.BOSS) {
      customLoginInfo.value[ThirdPartLoginType.BOSS] = {
        ...customLoginInfo.value[ThirdPartLoginType.BOSS],
        ...params,
      };
    }
  }

  return {
    getCustomLoginInfo,
    setCustomLoginInfo,
  };
});

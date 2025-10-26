import { requestThirdPartSmsCode, requestValidateLoginStatus } from "@/request";
import { defineStore } from "pinia";
import { onMounted, ref } from "vue";

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

const CUSTOM_LOGIN_INFO_KEY = "customLoginInfo";

export const useTLoginStore = defineStore("tlogin", () => {
  const customLoginInfo = ref<Record<ThirdPartLoginType, CustomLoginInfo>>({
    [ThirdPartLoginType.ZHAOPIN]: {
      type: ThirdPartLoginType.ZHAOPIN,
      phonenum: "",
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

  onMounted(() => {
    const localCustomLoginInfo = uni.getStorageSync(CUSTOM_LOGIN_INFO_KEY);
    if (localCustomLoginInfo) {
      customLoginInfo.value = localCustomLoginInfo;
    }
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

      uni.setStorageSync(CUSTOM_LOGIN_INFO_KEY, customLoginInfo.value);
    } else if (params.type === ThirdPartLoginType.BOSS) {
      customLoginInfo.value[ThirdPartLoginType.BOSS] = {
        ...customLoginInfo.value[ThirdPartLoginType.BOSS],
        ...params,
      };
    }
  }

  function removeCustomLoginInfo(type: ThirdPartLoginType) {
    customLoginInfo.value[type] = {
      type: type,
      phonenum: "",
      cookie: [],
      expireAt: 0,
    };
    uni.setStorageSync(CUSTOM_LOGIN_INFO_KEY, customLoginInfo.value);
  }

  async function validateLoginStatus(type: ThirdPartLoginType) {
    return new Promise(async (resolve) => {
      if (customLoginInfo.value[type].expireAt && customLoginInfo.value[type].expireAt > Date.now()) {
        customLoginInfo.value[type] = {
          type,
          cookie: [],
          phonenum: '',
          expireAt: 0,
        }
        resolve(true);
      }
      const res = await requestValidateLoginStatus({
        type,
        cookies: customLoginInfo.value[type].cookie,
      });

      if (res.code !== 200) {
        customLoginInfo.value[type] = {
          type,
          cookie: [],
          phonenum: '',
          expireAt: 0,
        }
      }
      resolve(true);
    });
  }

  return {
    customLoginInfo,
    getCustomLoginInfo,
    setCustomLoginInfo,
    removeCustomLoginInfo,
    validateLoginStatus,
  };
});

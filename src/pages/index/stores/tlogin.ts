import { requestThirdPartSmsCode, requestValidateLoginStatus } from "@/request";
import { SupportedPlatform } from "@/types";
import { defineStore } from "pinia";
import { onMounted, ref } from "vue";
import { useSubscriberStore } from "./subscriber";
import { storeToRefs } from "pinia";
export interface CookieItem {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires: number;
  httpOnly: boolean;
}

export interface CustomLoginInfo {
  type: SupportedPlatform;
  phonenum: string;
  cookie: CookieItem[];
  expireAt: number;
  username?: string;
  userId?: string;
  avatar?: string;
}

const CUSTOM_LOGIN_INFO_KEY = "customLoginInfo";

export const useTLoginStore = defineStore("tlogin", () => {
  const subscriberStore = useSubscriberStore();
  const { subscriber } = storeToRefs(subscriberStore);

  const customLoginInfo = ref<Record<SupportedPlatform, CustomLoginInfo>>({
    [SupportedPlatform.ZHAOPIN]: {
      type: SupportedPlatform.ZHAOPIN,
      phonenum: "",
      cookie: [],
      expireAt: 0,
      username: "",
      userId: "",
      avatar: "",
    },
    [SupportedPlatform.BOSS]: {
      type: SupportedPlatform.BOSS,
      phonenum: "",
      cookie: [],
      expireAt: 0,
      username: "",
      userId: "",
      avatar: "",
    },
  });

  onMounted(() => {
    const localCustomLoginInfo = uni.getStorageSync(CUSTOM_LOGIN_INFO_KEY);
    if (localCustomLoginInfo) {
      customLoginInfo.value = localCustomLoginInfo;
    }
  });

  function getCustomLoginInfo(type: SupportedPlatform) {
    return customLoginInfo.value[type];
  }

  function setCustomLoginInfo(params: {
    type: SupportedPlatform;
    phonenum: string;
    username?: string;
    userId?: string;
    avatar?: string;
    cookie: CookieItem[];
  }) {
    if (params.type === SupportedPlatform.ZHAOPIN) {
      const cookieAt = params.cookie.find((item) => item.name === "at");
      let expireAt = -1;
      if (cookieAt) {
        expireAt = cookieAt.expires * 1000;
      }
      customLoginInfo.value[SupportedPlatform.ZHAOPIN] = {
        ...customLoginInfo.value[SupportedPlatform.ZHAOPIN],
        ...params,
        expireAt,
      };
      
    } else if (params.type === SupportedPlatform.BOSS) {
      const cookieWt2 = params.cookie.find((item) => item.name === "wt2");
      let expireAt = -1;
      if (cookieWt2) {
        expireAt = parseInt(String(cookieWt2.expires * 1000));
      }
      customLoginInfo.value[SupportedPlatform.BOSS] = {
        ...customLoginInfo.value[SupportedPlatform.BOSS],
        ...params,
        expireAt,
      };
    }
    uni.setStorageSync(CUSTOM_LOGIN_INFO_KEY, customLoginInfo.value);

    // 更新订阅计划中的cookies
    if (subscriber.value && subscriber.value!.id) {
      subscriberStore.updateMySubscriber({
        id: subscriber.value!.id,
        cookies: customLoginInfo.value,
      });
    }
  }

  function removeCustomLoginInfo(type: SupportedPlatform) {
    customLoginInfo.value[type] = {
      type: type,
      phonenum: "",
      cookie: [],
      expireAt: 0,
      username: "",
      userId: "",
      avatar: "",
    };
    uni.setStorageSync(CUSTOM_LOGIN_INFO_KEY, customLoginInfo.value);
  }

  async function validateLoginStatus(type: SupportedPlatform) {
    return new Promise(async (resolve) => {
      if (
        customLoginInfo.value[type].expireAt &&
        customLoginInfo.value[type].expireAt > Date.now()
      ) {
        customLoginInfo.value[type] = {
          type,
          cookie: [],
          phonenum: "",
          expireAt: 0,
          username: "",
          userId: "",
          avatar: "",
        };
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
          phonenum: "",
          expireAt: 0,
          username: "",
          userId: "",
          avatar: "",
        };
        resolve(false);
      } else {
        resolve(true);
      }
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

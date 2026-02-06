import { defineStore } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import {
  requestGetUserSummary,
  requestLogin,
  requestLogout,
  requestUpdateUserInfo,
} from "@/request";
import { jwtDecode } from "@/utils/jwt";

export enum ProfileDetailType {
  NICKNAME = "nickname",
  EMAIL = "email",
}

export enum UserRole {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  USER = "user",
}

export interface LoginInfo {
  id: string;
  avatar: string;
  username?: string;
  nickName?: string;
  phonenum?: string;
  gender?: string;
  birthday?: string;
  token?: string;
  email?: string;
  role?: UserRole;
}

export interface IUserSummary {
  id: string;
  userId: string;
  // 用户总得分
  points: number;
  // 用户"每日答题"连续答题天数
  dailyTimes: number;
  // 用户"每日答题"最后一次答题日期
  lastDailyDate: string;
}

const LOGIN_INFO_KEY = "loginInfo";

export const useUserStore = defineStore("user", () => {
  const loginInfo = ref<LoginInfo>();
  const userSummary = ref<IUserSummary>();

  const isLoggedIn = computed(() => {
    if (!loginInfo.value || !loginInfo.value.id || !loginInfo.value.token) {
      return false;
    }

    const decoded: any = jwtDecode(loginInfo.value.token);

    if (!decoded.iat) {
      return false;
    }
    return (
      (decoded.iat + (decoded.exp || decoded.expiresIn)) * 1000 > Date.now()
    );
  });

  watch(
    isLoggedIn,
    (newVal) => {
      if (newVal) {
        getUserSummary();
      } else {
        userSummary.value = undefined;
      }
    },
    {
      immediate: true,
    }
  );

  onMounted(() => {
    init();
  });

  function init() {
    try {
      let localLoginInfo = uni.getStorageSync(LOGIN_INFO_KEY);
      if (localLoginInfo) {
        if (!localLoginInfo.token) {
          loginInfo.value = undefined;
          uni.removeStorageSync(LOGIN_INFO_KEY);
          return;
        }
        const token = localLoginInfo.token;

        const decoded: any = jwtDecode(token);

        if (
          !decoded.iat ||
          (decoded.iat + (decoded.exp || decoded.expiresIn)) * 1000 <=
            Date.now()
        ) {
          loginInfo.value = undefined;
          uni.removeStorageSync(LOGIN_INFO_KEY);
          return;
        }

        loginInfo.value = localLoginInfo;
      }
    } catch (e) {}
  }

  async function getUserSummary() {
    if (!loginInfo.value?.id) {
      return;
    }
    const res = await requestGetUserSummary({
      userId: loginInfo.value.id,
    });
    if (res.code == 200) {
      userSummary.value = res.data;
    }
  }

  function login() {
    return new Promise((resolve) => {
      uni.login({
        provider: "weixin",
        onlyAuthorize: true,
        success: async (res) => {
          if (res.errMsg == "login:ok") {
            const loginResult = await requestLogin(res.code);

            if (loginResult.code == 200 && loginResult.data) {
              loginInfo.value = loginResult.data;

              uni.setStorageSync(LOGIN_INFO_KEY, loginInfo.value);
              resolve(loginResult.data);
            } else {
              loginInfo.value = undefined;
              uni.removeStorageSync(LOGIN_INFO_KEY);
              resolve(null);
            }
          } else {
            loginInfo.value = undefined;
            uni.removeStorageSync(LOGIN_INFO_KEY);
            resolve(null);
          }
        },
        fail: (err) => {
          loginInfo.value = undefined;
          uni.removeStorageSync(LOGIN_INFO_KEY);
          resolve(null);
        },
      });
    });
  }

  function logout() {
    if (loginInfo.value?.id) {
      requestLogout(loginInfo.value.id);
    }

    loginInfo.value = undefined;
    uni.removeStorageSync(LOGIN_INFO_KEY);

    uni.showToast({
      title: "已经退出登录",
      icon: "none",
    });
  }

  function updateUserInfo(params: {
    avatar?: string;
    nickname?: string;
    gender?: string;
    birthday?: string;
    phonenum?: string;
    email?: string;
    username?: string;
  }) {
    return new Promise((resolve) => {
      if (!isLoggedIn.value) {
        resolve({
          code: 1001,
          message: "请先登录",
        });
        return;
      }
      requestUpdateUserInfo({
        id: loginInfo.value!.id,
        ...params,
      }).then((res: any) => {
        if (res.code == 200) {
          loginInfo.value = {
            ...loginInfo.value!,
            ...res.data,
          };
          uni.setStorageSync(LOGIN_INFO_KEY, loginInfo.value);
          resolve({
            code: 200,
            message: "用户信息更新成功",
          });
        } else {
          uni.showToast({
            title: res.message || "用户信息更新失败",
            icon: "error",
          });
          resolve({
            code: 1002,
            message: res.message || "用户信息更新失败",
          });
        }
      });
    });
  }

  return {
    loginInfo,
    isLoggedIn,
    userSummary,
    init,
    login,
    logout,
    updateUserInfo,
  };
});

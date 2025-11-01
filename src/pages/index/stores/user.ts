import { defineStore } from "pinia";
import { computed, onMounted, ref } from "vue";
import { requestLogin, requestLogout } from "@/request";
import { jwtDecode } from '@/utils/jwt'; 

export interface LoginInfo {
  id: string;
  avatar: string;
  username?: string;
  nickName?: string;
  phonenum?: string;
  gender?: string;
  token?: string;
}

const LOGIN_INFO_KEY = 'loginInfo';

export const useUserStore = defineStore("user", () => {
  const loginInfo = ref<LoginInfo>();

  const isLoggedIn = computed(() => {
    if (!loginInfo.value || !loginInfo.value.id || !loginInfo.value.token) {
      return false;
    }
    
    const decoded: any = jwtDecode(loginInfo.value.token);

    if (!decoded.iat) {
      return false;
    }
    return (decoded.iat + (decoded.exp || decoded.expiresIn)) * 1000 > Date.now();
  });

  onMounted(() => {
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

        if (!decoded.iat || (decoded.iat + (decoded.exp || decoded.expiresIn)) * 1000 <= Date.now()) {
          loginInfo.value = undefined;
          uni.removeStorageSync(LOGIN_INFO_KEY);
          return;
        }

        loginInfo.value = localLoginInfo;
        
      }
    } catch(e) {
    }
  })

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

  return {
    loginInfo,
    isLoggedIn,
    login,
    logout,
  };
});

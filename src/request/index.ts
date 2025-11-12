import { SupportedPlatform } from "@/types";

// const baseUrl = "https://10.2.6.210:4000";
// const baseUrl = "http://192.168.1.4:4000";
const baseUrl = "https://napi.liangqy.com";

/**
 * 第三方登录，获取验证码
 */
export function requestThirdPartSmsCode(params: {
  phonenum?: string;
  type: SupportedPlatform | string;
}) {
  return new Promise((resolve) => {
    uni.request({
      url: `${baseUrl}/crawlerjet/third/get-sms-code`,
      method: "POST",
      data: {
        phonenum: params.phonenum,
        type: params.type,
      },
      success: (res) => {
        resolve(res.data);
      },
      fail: (err) => {
        resolve({
          code: 1000,
          message: err.errMsg,
          data: {},
        });
      },
    });
  });
}

/**
 * 第三方登录
 */
export function requestThirdPartLogin(params: {
  type: SupportedPlatform | string;
  sessionId: string;
  code: string;
}) {
  return new Promise((resolve) => {
    uni.request({
      url: `${baseUrl}/crawlerjet/third/login`,
      method: "POST",
      data: {
        sessionId: params.sessionId,
        code: params.code,
        type: params.type,
      },
      success: (res) => {
        resolve(res.data);
      },
      fail: (err) => {
        resolve({
          code: 1000,
          message: err.errMsg,
          data: {},
        });
      },
    });
  });
}

/**
 * 获取每日职位
 */
export function requestDailyPositions(params: {
  type: SupportedPlatform | string;
  job: string;
  city: string;
  cityPinyin: string;
  cookies?: any[];
}) {
  return new Promise((resolve) => {
    uni.request({
      url: `${baseUrl}/crawlerjet/get/daily/positions`,
      method: "POST",
      data: {
        job: params.job,
        city: params.city,
        type: params.type,
        cityPinyin: params.cityPinyin,
        cookies: params.cookies,
      },
      success: (res) => {
        resolve(res.data);
      },
      fail: (err) => {
        resolve({
          code: 1000,
          message: err.errMsg,
          data: {},
        });
      },
    });
  });
}

/**
 * 验证登录状态
 */
export function requestValidateLoginStatus(params: {
  type: SupportedPlatform | string;
  cookies: any[];
}): Promise<any> {
  return new Promise<any>((resolve) => {
    uni.request({
      url: `${baseUrl}/crawlerjet/validate/login/status`,
      method: "POST",
      data: {
        cookies: params.cookies,
        type: params.type,
      },
      success: (res) => {
        resolve(res.data);
      },
      fail: (err) => {
        resolve({
          code: 1000,
          message: err.errMsg,
          data: {},
        });
      },
    });
  });
}

/**
 * 投递职位
 */
export function requestDeliverPosition(params: {
  type: SupportedPlatform | string;
  cookies: any[];
  numbers: string[];
}): Promise<any> {
  return new Promise<any>((resolve) => {
    uni.request({
      url: `${baseUrl}/crawlerjet/deliver`,
      method: "POST",
      data: {
        cookies: params.cookies,
        type: params.type,
        numbers: params.numbers,
      },
      success: (res) => {
        resolve(res.data);
      },
      fail: (err) => {
        resolve({
          code: 1000,
          message: err.errMsg,
          data: {},
        });
      },
    });
  });
}

/**
 * 投递职位
 */
export function getWxUserInfo(code: string): Promise<any> {
  return new Promise<any>((resolve) => {
    uni.request({
      url: `https://wf.qyflows.com/webhook/get-user-info?code=${code}`,
      method: "GET",
      success: (res) => {
        resolve(res.data);
      },
      fail: (_) => {
        resolve(null);
      },
    });
  });
}

/**
 * 登录
 */
export function requestLogin(code: string): Promise<any> {
  return new Promise<any>((resolve) => {
    uni.request({
      url: `https://wf.qyflows.com/webhook/crawlerjet/login`,
      method: "POST",
      data: {
        code: code,
      },
      success: (res) => {
        resolve(res.data);
      },
      fail: (_) => {
        resolve({});
      },
    });
  });
}

/**
 * 退出登录
 */
export function requestLogout(id: string): Promise<any> {
  return new Promise<any>((resolve) => {
    uni.request({
      url: `https://wf.qyflows.com/webhook/crawlerjet/logout`,
      method: "POST",
      data: {
        id: id,
      },
      success: (res) => {
        resolve(res.data);
      },
      fail: (_) => {
        resolve({});
      },
    });
  });
}

/**
 * 更新用户信息
 */
export function requestUpdateUserInfo(params: {
  id: string;
  avatar?: string;
  nickname?: string;
  gender?: string;
  phonenum?: string;
  email?: string;
  username?: string;
}): Promise<any> {
  return new Promise<any>((resolve) => {
    const requestParams: any = {
      id: params.id,
    };
    if (params.avatar) {
      requestParams.avatar = params.avatar;
    }
    if (params.nickname) {
      requestParams.nickname = params.nickname;
    }
    if (params.gender) {
      requestParams.gender = params.gender;
    }
    if (params.phonenum) {
      requestParams.phonenum = params.phonenum;
    }
    if (params.email) {
      requestParams.email = params.email;
    }
    if (params.username) {
      requestParams.username = params.username;
    }
    uni.request({
      url: `https://wf.qyflows.com/webhook/crawlerjet/update-user-info`,
      method: "POST",
      data: requestParams,
      success: (res) => {
        resolve(res.data);
      },
      fail: (_) => {
        resolve({});
      },
    });
  });
}

/**
 * 获取我的自动投递职位
 */
export function requestGetMyDelivered(params: {
  platform: SupportedPlatform;
  userId: string;
  pageIndex?: number;
  pageSize?: number;
}): Promise<any> {
  return new Promise<any>((resolve) => {
    uni.request({
      url: `https://wf.qyflows.com/webhook/crawlerjet/get-my-delivered`,
      method: "POST",
      data: {
        platform: params.platform,
        userId: params.userId,
        pageIndex: params.pageIndex || 1,
        pageSize: params.pageSize || 20,
      },
      success: (res) => {
        resolve(res.data);
      },
      fail: (_) => {
        resolve({});
      },
    });
  });
}

/**
 * 获取我的自动投递职位信息
 *
 */
export function requestGetMyAutoDeliveredInfo(params: {
  userId: string;
}): Promise<any> {
  return new Promise<any>((resolve) => {
    uni.request({
      url: `https://wf.qyflows.com/webhook/crawlerjet/get-my-auto-delivered-info`,
      method: "POST",
      data: {
        userId: params.userId,
      },
      success: (res) => {
        resolve(res.data);
      },
      fail: (_) => {
        resolve({});
      },
    });
  });
}

/**
 * 获取我的订阅信息
 */
export function requestGetMySubscriber(params: { userId: string }) {
  return new Promise((resolve) => {
    uni.request({
      url: `https://wf.qyflows.com/webhook/crawlerjet/get-my-subscriber`,
      method: "POST",
      data: {
        userId: params.userId,
      },
      success: (res) => {
        resolve(res.data);
      },
      fail: (err) => {
        resolve({
          code: 1000,
          message: err.errMsg,
          data: {},
        });
      },
    });
  });
}

/**
 * 更新我的订阅信息
 */
export function requestUpdateMySubscriber(params: {
  id: string;
  userId: string;
  job?: string;
  city?: string;
  cityPinyin?: string;
  platform?: string;
  cookies?: any;
}) {
  return new Promise((resolve) => {
    uni.request({
      url: `https://wf.qyflows.com/webhook/crawlerjet/update-my-subscriber`,
      method: "POST",
      data: {
        id: params.id,
        userId: params.userId,
        job: params.job,
        city: params.city,
        cityPinyin: params.cityPinyin,
        platform: params.platform,
        cookies: params.cookies,
      },
      success: (res) => {
        resolve(res.data);
      },
      fail: (err) => {
        resolve({
          code: 1000,
          message: err.errMsg,
          data: {},
        });
      },
    });
  });
}

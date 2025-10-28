import { SupportedPlatform } from "@/types";

// const baseUrl = "http://10.2.6.210:4000";
// const baseUrl = "http://192.168.1.4:4000";
const baseUrl = "https://api.liangqy.com";

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
}) {
  return new Promise((resolve) => {
    uni.request({
      url: `${baseUrl}/crawlerjet/get/daily/positions`,
      method: "POST",
      data: {
        job: params.job,
        city: params.city,
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

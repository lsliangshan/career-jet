import { SupportedPlatform } from "@/types";

// const baseUrl = "http://10.2.6.210:4000";
const baseUrl = "http://192.168.1.3:4000";

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

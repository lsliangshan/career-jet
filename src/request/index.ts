export function requestThirdPartSmsCode(params: {
  phonenum: string;
  type: "zhaopin" | "boss" | string;
}) {
  return new Promise((resolve) => {
    uni.request({
      url: "http://127.0.0.1:4000/crawlerjet/third/get-sms-code",
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
          data: null,
        });
      },
    });
  });
}

export function requestThirdPartLogin(params: {
  type: "zhaopin" | "boss" | string;
  sessionId: string;
  code: string;
}) {
  return new Promise((resolve) => {
    uni.request({
      url: "http://127.0.0.1:4000/crawlerjet/third/login",
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
          data: null,
        });
      },
    });
  });
}

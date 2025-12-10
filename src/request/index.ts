const baseUrl = "https://wf.qyflows.com/webhook";

/**
 * 登录
 */
export function requestLogin(code: string): Promise<any> {
  return new Promise<any>((resolve) => {
    uni.request({
      url: `${baseUrl}/crawlerjet/login`,
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
      url: `${baseUrl}/crawlerjet/logout`,
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
      url: `${baseUrl}/crawlerjet/update-user-info`,
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
 * 获取每日挑战
 */
export function requestGetDailyQuestion(params?: {
  level?: number;
}): Promise<any> {
  return new Promise<any>((resolve) => {
    uni.request({
      url: `${baseUrl}/cm/get-daily-question`,
      method: "POST",
      data: params?.level
        ? {
            level: params.level,
          }
        : {},
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
 * 答题
 */
export function requestAnswerQuestion(params?: {
  userId: string;
  questionId: string;
  answer: string;
  answerTime?: number;
  thinkingTime?: number;
}): Promise<any> {
  return new Promise<any>((resolve) => {
    uni.request({
      url: `${baseUrl}/cm/answer`,
      method: "POST",
      data: params,
      timeout: 10 * 60 * 1000,
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
 * 获取某道题的答题历史
 */
export function requestGetAnswers(params?: {
  userId: string;
  questionId: string;
}): Promise<any> {
  return new Promise<any>((resolve) => {
    uni.request({
      url: `${baseUrl}/cm/get-answers`,
      method: "POST",
      data: params,
      success: (res) => {
        resolve(res.data);
      },
      fail: (_) => {
        resolve({});
      },
    });
  });
}

import { GameType } from "@/config/config";

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
  birthday?: string;
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
    if (params.birthday) {
      requestParams.birthday = params.birthday;
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
 * 获取指定等级的问题
 * @param params
 * @param {number} params.userId 用户ID
 * @param {number} params.level 等级
 * @param {GameType} params.type 类型
 * @returns {Promise<IQuestion>}
 */
export function requestGetQuestionByLevel(params?: {
  userId: string;
  level: number;
  type: GameType;
}): Promise<any> {
  return new Promise<any>((resolve) => {
    uni.request({
      url: `${baseUrl}/cm/get-question-by-level`,
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

/**
 * 获取指定等级的问题
 * @param params
 * @param {number} params.id 问题ID
 * @returns {Promise<IQuestion>}
 */
export function requestGetQuestionDetailById(params?: {
  id: string;
}): Promise<any> {
  return new Promise<any>((resolve) => {
    uni.request({
      url: `${baseUrl}/cm/get-question-by-id`,
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

/**
 * 答题
 */
export function requestAnswerQuestion(params?: {
  userId: string;
  questionId: string;
  answer: string;
  answerTime?: number;
  thinkingTime?: number;
  birthday?: string;
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
 * 获取AI的描述
 */
export function requestGetAiAnswer(params?: {
  questionId: string;
}): Promise<any> {
  return new Promise<any>((resolve) => {
    uni.request({
      url: `${baseUrl}/cm/ai-answer`,
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

/**
 * 获取用户总结
 */
export function requestGetUserSummary(params?: {
  userId: string;
}): Promise<any> {
  return new Promise<any>((resolve) => {
    uni.request({
      url: `${baseUrl}/cm/get-user-summary`,
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

/**
 * 获取用户答题历史记录
 */
export function requestGetUserAnswerHistory(params: {
  userId: string;
  type?: GameType;
  pageIndex?: number;
  pageSize?: number;
}): Promise<any> {
  return new Promise<any>((resolve) => {
    uni.request({
      url: `${baseUrl}/cm/get-history`,
      method: "POST",
      data: {
        pageIndex: 1,
        pageSize: 20,
        ...params,
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
 * 生成绘本
 * @param params
 * @param {string} params.theme 主题
 * @param {string} params.storyStyle 故事风格
 * @param {string} params.pictureStyle 图画风格
 * @param {number} params.length 故事长度
 * @param {string} params.language 语言
 * @param {number} params.roleCount 角色个数，-1表示不限制
 * @param {number} params.sceneCount 场景个数，-1表示不限制
 * @param {string} params.ratio 绘本比例
 * @param {boolean} params.autoConfirmedStory 自动确认故事
 * @param {boolean} params.autoConfirmedRole 自动确认角色
 * @param {boolean} params.autoConfirmedScene 自动确认场景
 */
export function requestGeneratePictureBook(params?: {
  theme: string;
  storyStyle: string;
  pictureStyle: string;
  length: number;
  language: string;
  roleCount: number;
  sceneCount?: number;
  ratio: string;
  autoConfirmedStory?: boolean;
  autoConfirmedRole?: boolean;
  autoConfirmedScene?: boolean;
}): Promise<any> {
  return new Promise<any>((resolve) => {
    uni.request({
      url: `${baseUrl}/pb/generate`,
      method: "POST",
      data: {...params},
      success: (res) => {
        resolve(res.data);
      },
      fail: (_) => {
        resolve({});
      },
    });
  });
}

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
 * 编辑绘本
 * @param params
 * @param {string} params.userId 用户ID
 * @param {string} params.pbId 绘本ID
 */
export function requestEditPictureBook(params?: {
  userId: string;
  pbId: string;
}): Promise<any> {
  return new Promise<any>((resolve) => {
    uni.request({
      url: `https://wf.qyflows.com/webhook-test/pb/edit`,
      // url: `${baseUrl}/pb/edit`,
      method: "POST",
      data: { ...params },
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
 * 确认角色
 * @param params
 * @param {string} params.userId 用户ID
 * @param {string} params.pbId 绘本ID
 * @param {object[]} params.confirmed 确认的角色列表
 */
export function requestConfirmRoles(params?: {
  userId: string;
  pbId: string;
  confirmed: object[];
}): Promise<any> {
  return new Promise<any>((resolve) => {
    uni.request({
      // url: `https://wf.qyflows.com/webhook-test/pb/confirm-roles`,
      url: `${baseUrl}/pb/confirm-roles`,
      method: "POST",
      data: { ...params },
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
 * 确认场景
 * @param params
 * @param {string} params.userId 用户ID
 * @param {string} params.pbId 绘本ID
 * @param {object[]} params.confirmed 确认的场景列表
 */
export function requestConfirmScenes(params?: {
  userId: string;
  pbId: string;
  confirmed: object[];
}): Promise<any> {
  return new Promise<any>((resolve) => {
    uni.request({
      // url: `https://wf.qyflows.com/webhook-test/pb/confirm-scenes`,
      url: `${baseUrl}/pb/confirm-scenes`,
      method: "POST",
      data: { ...params },
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
 * 确认封面
 * @param params
 * @param {string} params.userId 用户ID
 * @param {string} params.pbId 绘本ID
 * @param {object} params.confirmed 确认的封面对象
 */
export function requestConfirmCover(params?: {
  userId: string;
  pbId: string;
  confirmed: object;
}): Promise<any> {
  return new Promise<any>((resolve) => {
    uni.request({
      // url: `https://wf.qyflows.com/webhook-test/pb/confirm-cover`,
      url: `${baseUrl}/pb/confirm-cover`,
      method: "POST",
      data: { ...params },
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
 * @param {string} params.userId 用户ID
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
  userId: string;
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
      url: `https://wf.qyflows.com/webhook-test/pb/generate`,
      // url: `${baseUrl}/pb/generate`,
      method: "POST",
      data: { ...params },
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
 * 重新生成角色或场景图片
 * @param params
 * @param {string} params.id 角色或场景ID
 * @param {string} params.prompt 角色或场景 提示词
 * @param {string} [params.ratio=16:9] 绘本比例
 */
export function requestGenerateRoleOrScene(params?: {
  id: string;
  prompt: string;
  ratio?: string;
  imageUrls?: string[];
}): Promise<any> {
  return new Promise<any>((resolve) => {
    uni.request({
      url: `https://wf.qyflows.com/webhook/pb/generate-role-or-scene`,
      // url: `${baseUrl}/pb/generate-role-or-scene`,
      method: "POST",
      data: { ...params },
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
 * 重新生成封面图片
 * @param params
 * @param {string} params.id 绘本id
 * @param {string} params.prompt 封面 提示词
 */
export function requestGenerateCover(params: {
  id: string;
  prompt: string;
}): Promise<any> {
  return new Promise<any>((resolve) => {
    uni.request({
      url: `${baseUrl}/pb/generate-cover`,
      method: "POST",
      data: { ...params },
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
 * 根据绘本ID和音色ID获取绘本的语音
 * @param params
 * @param {string} params.pbId 绘本id
 */
export function requestGetAudiosByPbId(params: {
  pbId: string;
  voiceType?: number;
}): Promise<any> {
  return new Promise<any>((resolve) => {
    uni.request({
      url: `${baseUrl}/pb/get-audios`,
      method: "POST",
      data: {
        ...params,
        voiceType: params.voiceType || 502001,
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
 * 获取我的绘本列表
 * @param params
 * @param {string} params.userId 用户ID
 * @param {"draft" | "final"} params.type 类型 draft: 草稿, final: 正式
 * @param {number} [params.pageIndex=1] 页码
 * @param {number} [params.pageSize=20] 每页条数
 */
export function requestGetMyPictureBooks(params?: {
  userId: string;
  type: "draft" | "final";
  pageIndex?: number;
  pageSize?: number;
}): Promise<any> {
  return new Promise<any>((resolve) => {
    uni.request({
      url: `${baseUrl}/pb/list-my-picture-books`,
      method: "POST",
      data: { ...params },
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
 * 获取我点赞的绘本列表
 * @param params
 * @param {string} params.userId 用户ID
 * @param {number} [params.pageIndex=1] 页码
 * @param {number} [params.pageSize=20] 每页条数
 */
export function requestGetMyFavoritePictureBooks(params?: {
  userId: string;
  pageIndex?: number;
  pageSize?: number;
}): Promise<any> {
  return new Promise<any>((resolve) => {
    uni.request({
      url: `${baseUrl}/pb/list-my-favorite-picture-books`,
      method: "POST",
      data: { ...params },
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
 * 获取绘本列表
 * @param params
 * @param {string} [params.type] 排序方式
 * @param {number} [params.pageIndex=1] 页码
 * @param {number} [params.pageSize=20] 每页条数
 */
export function requestGetPictureBooks(params?: {
  type: "order-by-time" | "order-by-likes" | "order-by-views";
  pageIndex?: number;
  pageSize?: number;
}): Promise<any> {
  return new Promise<any>((resolve) => {
    uni.request({
      url: `${baseUrl}/pb/list-picture-books`,
      method: "POST",
      data: { ...params },
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
 * 获取绘本详情
 * @param params
 * @param {string} params.id 绘本ID
 */
export function requestGetPictureBookDetail(params?: {
  id: string;
}): Promise<any> {
  return new Promise<any>((resolve) => {
    uni.request({
      url: `${baseUrl}/pb/detail`,
      method: "POST",
      data: { ...params },
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
 * 获取绘本点赞状态
 * @param params
 * @param {string} params.userId 用户ID
 * @param {string} params.pbId 绘本ID
 */
export function requestGetPictureBookLikeStatus(params?: {
  userId: string;
  pbId: string;
}): Promise<any> {
  return new Promise<any>((resolve) => {
    uni.request({
      url: `${baseUrl}/pb/get-like-status`,
      method: "POST",
      data: { ...params },
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
 * 给绘本点赞、取消点赞
 * @param params
 * @param {boolean} params.like 点赞状态
 * @param {string} params.userId 用户ID
 * @param {string} params.pbId 绘本ID
 */
export function requestTogglePictureBookLikeStatus(params: {
  like: boolean;
  userId: string;
  pbId: string;
}): Promise<any> {
  return new Promise<any>((resolve) => {
    uni.request({
      url: `${baseUrl}/pb/toggle-like-status`,
      method: "POST",
      data: { ...params },
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
 * 设置绘本浏览量
 * @param params
 * @param {string} params.pbId 绘本ID
 */
export function requestSetPictureBookViews(params?: {
  pbId: string;
}): Promise<any> {
  return new Promise<any>((resolve) => {
    uni.request({
      url: `${baseUrl}/pb/set-views`,
      method: "POST",
      data: { ...params },
      success: (res) => {
        resolve(res.data);
      },
      fail: (_) => {
        resolve({});
      },
    });
  });
}

export function requestCustomUrl(params: {
  url: string;
  method: "POST" | "GET" | "PUT" | "DELETE";
  data: any;
}): Promise<any> {
  return new Promise<any>((resolve) => {
    uni.request({
      url: params.url,
      method: params.method,
      data: params.data,
      timeout: 30 * 60 * 1000,
      success: (res) => {
        resolve(res.data);
      },
      fail: (e) => {
        resolve({
          code: 1001,
        });
      },
      complete: () => {
        resolve({});
      },
    });
  });
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function requestGetImageUrls(params: {
  taskIds: string[];
}): Promise<Map<string, string>> {
  return new Promise<Map<string, string>>(async (resolve) => {
    let remainingTaskIds = params.taskIds;
    const urlMap = new Map<string, string>();

    let attemptCount = 0;

    while (remainingTaskIds.length > 0) {
      attemptCount++;
      const result: any = await uni.request({
        url: `${baseUrl}/pb/get-image-urls`,
        method: "POST",
        data: { taskIds: remainingTaskIds },
        timeout: 60 * 60 * 1000,
      });

      if (
        result.data &&
        result.data.code === 200 &&
        result.data.data &&
        result.data.data.list
      ) {
        result.data.data.list.forEach((item: any) => {
          if (item.data.url) {
            urlMap.set(item.data.taskId, item.data.url);
          }
        });
        remainingTaskIds = result.data.data.list
          .filter((item: any) => item.code === 201)
          .map((item: any) => item.data.taskId);
      }
      await sleep(5000 + (attemptCount - 1) * 2000);
    }

    resolve(urlMap);
  });
}

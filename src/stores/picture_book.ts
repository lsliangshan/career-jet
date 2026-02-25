import type { IPictureBook } from "@/types";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useUserStore } from "./user";
import { storeToRefs } from "pinia";
import {
  requestConfirmCover,
  requestConfirmRoles,
  requestConfirmScenes,
  requestConfirmStory,
  requestEditPictureBook,
  requestGenerateAudios,
  requestGenerateStory,
  requestGetAudiosByPbId,
  requestGetMyFavoritePictureBooks,
  requestGetMyPictureBooks,
  requestGetPictureBookDetail,
  requestGetPictureBookLikeStatus,
  requestGetPictureBooks,
  requestGetReviewPictureBooks,
  requestRegenerateStory,
  requestSetPictureBookViews,
  requestSubmitReview,
  requestTogglePictureBookLikeStatus,
} from "@/request";

export const usePictureBookStore = defineStore("picture_book", () => {
  const userStore = useUserStore();
  const { loginInfo, isLoggedIn } = storeToRefs(userStore);

  const myPictureBooks = ref<IPictureBook[]>([]);

  function ensureLoginStatus() {
    if (!isLoggedIn.value || !loginInfo.value.id) {
      uni.showToast({
        title: "请先登录",
        icon: "none",
      });
      throw new Error("请先登录");
    }
    return loginInfo.value.id;
  }

  function getMyPictureBooks(params?: {
    type: "draft" | "final";
    pageIndex?: number;
    pageSize?: number;
  }) {
    return new Promise(async (resolve) => {
      if (!isLoggedIn.value || !loginInfo.value.id) {
        uni.showToast({
          title: "请先登录",
          icon: "none",
        });
        resolve(false);
        return;
      }
      const pageIndex = params?.pageIndex || 1;
      const pageSize = params?.pageSize || 20;
      const res = await requestGetMyPictureBooks({
        userId: loginInfo.value.id,
        type: params?.type || "final",
        pageIndex,
        pageSize,
      });

      if (res.code === 200) {
        myPictureBooks.value = res.data.list;
      }
      resolve(res);
    });
  }

  function getReviewPictureBooks(params?: {
    type: "default" | "approved" | "unapproved";
    pageIndex?: number;
    pageSize?: number;
  }) {
    let reviewStatus: -1 | 0 | 1 = 0;
    if (params?.type === "approved") {
      reviewStatus = 1;
    } else if (params?.type === "unapproved") {
      reviewStatus = -1;
    }
    return new Promise(async (resolve) => {
      if (!isLoggedIn.value || !loginInfo.value.id) {
        uni.showToast({
          title: "请先登录",
          icon: "none",
        });
        resolve(false);
        return;
      }
      const pageIndex = params?.pageIndex || 1;
      const pageSize = params?.pageSize || 20;
      const res = await requestGetReviewPictureBooks({
        userId: loginInfo.value.id,
        reviewStatus,
        pageIndex,
        pageSize,
      });

      resolve(res);
    });
  }

  function submitReviewPictureBook(params: { pbId: string }) {
    return new Promise(async (resolve) => {
      if (!isLoggedIn.value || !loginInfo.value.id) {
        uni.showToast({
          title: "请先登录",
          icon: "none",
        });
        resolve(false);
        return;
      }
      const res = await requestSubmitReview({
        userId: loginInfo.value.id,
        pbId: params.pbId,
      });

      resolve(res);
    });
  }

  function getMyFavoritePictureBooks(params?: {
    pageIndex?: number;
    pageSize?: number;
  }) {
    return new Promise(async (resolve) => {
      if (!isLoggedIn.value || !loginInfo.value.id) {
        uni.showToast({
          title: "请先登录",
          icon: "none",
        });
        resolve(false);
        return;
      }
      const pageIndex = params?.pageIndex || 1;
      const pageSize = params?.pageSize || 20;
      const res = await requestGetMyFavoritePictureBooks({
        userId: loginInfo.value.id,
        pageIndex,
        pageSize,
      });
      resolve(res);
    });
  }

  function getPictureBooks(params?: {
    type: "order-by-time" | "order-by-likes" | "order-by-views";
    pageIndex?: number;
    pageSize?: number;
  }) {
    return new Promise(async (resolve) => {
      const pageIndex = params?.pageIndex || 1;
      const pageSize = params?.pageSize || 20;
      const res = await requestGetPictureBooks({
        type: params?.type || "order-by-time",
        pageIndex,
        pageSize,
      });
      resolve(res);
    });
  }

  function getPictureBookLikeStatus(params: { pbId: string }) {
    return new Promise(async (resolve) => {
      if (!isLoggedIn.value || !loginInfo.value.id) {
        resolve({
          code: 200,
          message: "请先登录",
          data: {
            pbId: params.pbId,
            like: false,
          },
        });
        return;
      }
      const res = await requestGetPictureBookLikeStatus({
        userId: loginInfo.value.id,
        pbId: params.pbId,
      });
      resolve(res);
    });
  }

  function togglePictureBookLikeStatus(params: {
    like: boolean;
    pbId: string;
  }) {
    return new Promise(async (resolve) => {
      if (!isLoggedIn.value || !loginInfo.value.id) {
        uni.showToast({
          title: "请先登录",
          icon: "none",
        });
        resolve({
          code: 1001,
          message: "请先登录",
          data: {
            pbId: params.pbId,
            like: params.like,
          },
        });
        return;
      }
      const res = await requestTogglePictureBookLikeStatus({
        like: params.like,
        userId: loginInfo.value.id,
        pbId: params.pbId,
      });
      resolve(res);
    });
  }

  function setPictureBookViews(params: { pbId: string }) {
    return new Promise(async (resolve) => {
      const res = await requestSetPictureBookViews({
        pbId: params.pbId,
      });
      resolve(res);
    });
  }

  function getPictureBookDetail(params: { id: string }) {
    return new Promise(async (resolve) => {
      const res = await requestGetPictureBookDetail({
        id: params.id,
      });
      resolve(res);
    });
  }

  function getAudiosByPbId(params: { pbId: string; voiceType?: number }) {
    return new Promise(async (resolve) => {
      const res = await requestGetAudiosByPbId({
        pbId: params.pbId,
      });
      resolve(res);
    });
  }

  function editPictureBook(params: { pbId: string }) {
    return new Promise(async (resolve) => {
      if (!isLoggedIn.value || !loginInfo.value.id) {
        uni.showToast({
          title: "请先登录",
          icon: "none",
        });
        resolve({
          code: 1001,
          message: "请先登录",
          data: {
            pbId: params.pbId,
          },
        });
        return;
      }
      const res = await requestEditPictureBook({
        userId: loginInfo.value.id,
        pbId: params.pbId,
      });
      resolve(res);
    });
  }

  function generateStory(params: {
    theme: string;
    storyStyle: string;
    pictureStyle: string;
    length: number;
    language: string;
    roleCount: number;
    sceneCount?: number;
    ratio: string;
  }) {
    return new Promise(async (resolve) => {
      const userId = ensureLoginStatus();
      const res = await requestGenerateStory({
        userId: userId,
        theme: params.theme,
        storyStyle: params.storyStyle,
        pictureStyle: params.pictureStyle,
        length: params.length,
        language: params.language,
        roleCount: params.roleCount,
        sceneCount: params.sceneCount,
        ratio: params.ratio,
      });
      resolve(res);
    });
  }

  function regenerateStory(params: { pbId: string }) {
    return new Promise(async (resolve) => {
      const userId = ensureLoginStatus();
      const res = await requestRegenerateStory({
        userId: userId,
        pbId: params.pbId,
      });
      resolve(res);
    });
  }

  function confirmStory(params: {
    pbId: string;
    title: string;
    content: string;
  }) {
    return new Promise(async (resolve) => {
      const userId = ensureLoginStatus();
      const res = await requestConfirmStory({
        userId: userId,
        pbId: params.pbId,
        title: params.title,
        content: params.content,
      });
      resolve(res);
    });
  }

  function confirmRoles(params: { pbId: string; confirmed: object[] }) {
    return new Promise(async (resolve) => {
      const userId = ensureLoginStatus();
      const res = await requestConfirmRoles({
        userId: userId,
        pbId: params.pbId,
        confirmed: params.confirmed,
      });
      resolve(res);
    });
  }

  function confirmScenes(params: { pbId: string; confirmed: object[] }) {
    return new Promise(async (resolve) => {
      const userId = ensureLoginStatus();
      const res = await requestConfirmScenes({
        userId: userId,
        pbId: params.pbId,
        confirmed: params.confirmed,
      });
      resolve(res);
    });
  }

  function confirmCover(params: { pbId: string; confirmed: object[] }) {
    return new Promise(async (resolve) => {
      const userId = ensureLoginStatus();
      const res = await requestConfirmCover({
        userId: userId,
        pbId: params.pbId,
        confirmed: params.confirmed,
      });
      resolve(res);
    });
  }

  function generateAudios(params: {
    pbId: string;
    voiceType: number;
    speed?: number;
    volume?: number;
  }) {
    return new Promise(async (resolve) => {
      const userId = ensureLoginStatus();
      const res = await requestGenerateAudios({
        userId: userId,
        pbId: params.pbId,
        voiceType: params.voiceType,
        speed: params.speed,
        volume: params.volume,
      });
      resolve(res);
    });
  }

  return {
    myPictureBooks,
    getMyPictureBooks,
    getReviewPictureBooks,
    submitReviewPictureBook,
    getMyFavoritePictureBooks,
    getPictureBooks,
    getPictureBookDetail,
    getAudiosByPbId,
    getPictureBookLikeStatus,
    togglePictureBookLikeStatus,
    setPictureBookViews,
    editPictureBook,
    generateStory,
    regenerateStory,
    confirmStory,
    confirmRoles,
    confirmScenes,
    confirmCover,
    generateAudios,
  };
});

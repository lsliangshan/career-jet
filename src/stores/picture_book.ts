import type { IPictureBook } from "@/types";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useUserStore } from "./user";
import { storeToRefs } from "pinia";
import {
  requestGetAudiosByPbIdAndVoiceType,
  requestGetMyPictureBooks,
  requestGetPictureBookDetail,
  requestGetPictureBooks,
} from "@/request";

export const usePictureBookStore = defineStore("picture_book", () => {
  const userStore = useUserStore();
  const { loginInfo, isLoggedIn } = storeToRefs(userStore);

  const myPictureBooks = ref<IPictureBook[]>([]);

  function getMyPictureBooks(params?: {
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
        pageIndex,
        pageSize,
      });

      if (res.code === 200) {
        myPictureBooks.value = res.data.list;
      }
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

  function getPictureBookDetail(params: { id: string }) {
    return new Promise(async (resolve) => {
      const res = await requestGetPictureBookDetail({
        id: params.id,
      });
      resolve(res);
    });
  }

  function getAudiosByPbIdAndVoiceType(params: {
    pbId: string;
    voiceType?: number;
  }) {
    return new Promise(async (resolve) => {
      const res = await requestGetAudiosByPbIdAndVoiceType({
        pbId: params.pbId,
        voiceType: params.voiceType || 502001,
      });
      resolve(res);
    });
  }

  return {
    myPictureBooks,
    getMyPictureBooks,
    getPictureBooks,
    getPictureBookDetail,
    getAudiosByPbIdAndVoiceType,
  };
});

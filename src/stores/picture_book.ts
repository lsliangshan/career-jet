import type { IPictureBook } from "@/types";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useUserStore } from "./user";
import { storeToRefs } from "pinia";
import { requestGetMyPictureBooks } from "@/request";

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
      console.log(">>>>>> getMyPictureBooks: ", res);
      if (res.code === 200) {
        myPictureBooks.value = res.data.list;
      }
      resolve(res);
    });
  }

  return {
    myPictureBooks,
    getMyPictureBooks,
  };
});

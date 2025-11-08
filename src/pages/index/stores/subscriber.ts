import { requestGetMySubscriber, requestUpdateMySubscriber } from "@/request";
import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "./user";

export interface SubscriberItem {
  id: string;
  userId: string;
  platform: string;
  job: string;
  city: string;
  startTime: string;
  endTime: string;
  status: string;
  cookies?: any;
}

export const useSubscriberStore = defineStore("subscriber", () => {
  const userStore = useUserStore();
  const { loginInfo, isLoggedIn } = storeToRefs(userStore);

  const subscriber = ref<SubscriberItem>();

  watch(
    () => isLoggedIn.value,
    async () => {
      if (isLoggedIn.value) {
        await getMySubscriber();
      } else {
        subscriber.value = undefined;
      }
    }
  );

  function getMySubscriber() {
    return new Promise((resolve) => {
      if (!isLoggedIn.value) {
        resolve({
          code: 1000,
          message: "请先登录",
          data: {},
        });
      }
      requestGetMySubscriber({ userId: loginInfo.value!.id }).then(
        (res: any) => {
          if (res.code === 200) {
            subscriber.value = res.data;
            resolve(true);
          } else {
            resolve(false);
          }
        }
      );
    });
  }

  function updateMySubscriber(params: {
    id: string;
    job?: string;
    city?: string;
    platform?: string;
    cookies?: any;
  }) {
    return new Promise((resolve) => {
      if (!isLoggedIn.value) {
        resolve({
          code: 1000,
          message: "请先登录",
          data: {},
        });
        return;
      }
      requestUpdateMySubscriber({
        id: params.id,
        userId: loginInfo.value!.id,
        job: params.job,
        city: params.city,
        platform: params.platform,
        cookies: params.cookies,
      }).then((res: any) => {
        if (res.code === 200) {
          subscriber.value = res.data;
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
  return {
    subscriber,
    getMySubscriber,
    updateMySubscriber,
  };
});

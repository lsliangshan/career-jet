import { supportedPlatforms } from "@/config/config";
import { requestDeliverPosition } from "@/request";
import { SupportedPlatform } from "@/types";
import { defineStore } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useTLoginStore } from "./tlogin";
import { storeToRefs } from "pinia";

const DELIVER_RECORDS_KEY = "deliverRecords";

export const useDeliverStore = defineStore("deliver", () => {
  const tLoginStore = useTLoginStore();
  const { customLoginInfo } = storeToRefs(tLoginStore);

  const deliverRecords = ref<{
    [key: string]: any[];
  }>({});

  onBeforeMount(() => {
    const localDeliverRecords = uni.getStorageSync(DELIVER_RECORDS_KEY);
    if (localDeliverRecords) {
      deliverRecords.value = localDeliverRecords;
    } else {
      for (const platform of supportedPlatforms) {
        deliverRecords.value[platform.type] = [];
      }
      uni.setStorageSync(DELIVER_RECORDS_KEY, deliverRecords.value);
    }
  });

  /**
   * 投递职位
   * @param params {
   *   type: SupportedPlatform;
   *   numbers: string[];
   * }
   * @returns
   */
  function deliverPositions(params: {
    type: SupportedPlatform;
    numbers: string[];
  }): Promise<{
    code: number;
    message: string;
    data: {
      /**
       * 投递成功的职位
       */
      success: string[];
      /**
       * 重复投递的职位
       */
      repeated: string[];
      /**
       * 投递失败的职位
       */
      failed: string[];
    };
  }> {
    return new Promise((resolve) => {
      // 过滤已经投递的职位
      const readyToDeliverNumbers = params.numbers.filter(
        (number) => !deliverRecords.value[params.type].includes(number)
      );
      const repeatedNumbers = params.numbers.filter((number) =>
        deliverRecords.value[params.type].includes(number)
      );

      if (readyToDeliverNumbers.length === 0) {
        // 无需要投递的职位
        resolve({
          code: 200,
          message: "投递成功",
          data: {
            success: [],
            repeated: params.numbers,
            failed: [],
          },
        });
        return;
      }

      const cookies = customLoginInfo.value[params.type].cookie;

      requestDeliverPosition({
        type: params.type,
        numbers: readyToDeliverNumbers,
        cookies,
      }).then((res: any) => {
        console.log(">>>>>>> 投递返回: ", res);
        let positions = [];
        if (res.code === 200) {
          positions = [...res.data.success, ...(res.data.repeated || [])];

          deliverRecords.value[params.type].push(
            ...res.data.success,
            ...(res.data.repeated || [])
          );
          uni.setStorageSync(DELIVER_RECORDS_KEY, deliverRecords.value);
          resolve({
            code: 200,
            message: "投递成功",
            data: {
              success: res.data.success || [],
              repeated: [...repeatedNumbers, ...(res.data.repeated || [])],
              failed: res.data.failed || [],
            },
          });
        } else {
          if (res.data.repeated && res.data.repeated.length > 0) {
            deliverRecords.value[params.type].push(...res.data.repeated);
            uni.setStorageSync(DELIVER_RECORDS_KEY, deliverRecords.value);
          }

          resolve({
            code: 1001,
            message: res.message || "",
            data: {
              success: res.data.success || [],
              repeated: [...repeatedNumbers, ...(res.data.repeated || [])],
              failed: res.data.failed || [],
            },
          });
        }
      });
    });
  }

  return {
    deliverRecords,
    deliverPositions,
  };
});

import { supportedPlatforms } from "@/config/config";
import { requestDeliverPosition } from "@/request";
import { SupportedPlatform } from "@/types";
import { defineStore } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useTLoginStore } from "./tlogin";
import { storeToRefs } from "pinia";
import { usePositionStore } from "./position";
import { removeDuplicates } from "@/utils";
import { getTodayDate } from "@/utils/date";

const DELIVER_RECORDS_KEY = "deliverRecords";

export const useDeliverStore = defineStore("deliver", () => {
  const tLoginStore = useTLoginStore();
  const { customLoginInfo } = storeToRefs(tLoginStore);

  const positionStore = usePositionStore();
  const { positions } = storeToRefs(positionStore);

  /**
   * deliverRecords: {
   *  zhaopin: {
   *    "2025-10-28": [
   *      {
   *        number: "1234567890",
   *        name: "张三",
   *      }
   *    ]
   *  }
   * }
   */
  const deliverRecords = ref<{
    [key: string]: {
      [key: string]: any[];
    };
  }>({});

  onBeforeMount(() => {
    const localDeliverRecords = uni.getStorageSync(DELIVER_RECORDS_KEY);
    if (localDeliverRecords) {
      deliverRecords.value = localDeliverRecords;
    } else {
      for (const platform of supportedPlatforms) {
        deliverRecords.value[platform.type] = {};
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
      const todayDate = getTodayDate();
      // 过滤已经投递的职位
      const readyToDeliverNumbers = params.numbers.filter(
        (number) =>
          !deliverRecords.value[params.type][todayDate]?.includes(number)
      );
      const repeatedNumbers = params.numbers.filter((number) =>
        deliverRecords.value[params.type][todayDate]?.includes(number)
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
        let ps = [];
        if (res.code === 200) {
          ps = [...(res.data.repeated || []), ...res.data.success];

          updateLocalDeliverRecords({
            type: params.type,
            numbers: ps,
          });

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
            ps = [...(res.data.repeated || [])];

            updateLocalDeliverRecords({
              type: params.type,
              numbers: ps,
            });
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

  function updateLocalDeliverRecords(params: {
    type: SupportedPlatform;
    numbers: string[];
  }) {
    const todayDate = getTodayDate();

    let ps = params.numbers
      .map((p: any) =>
        positions.value[params.type]?.list?.find(
          (item: any) => item.number === p
        )
      )
      .filter((p: any) => !!p);

    ps = removeDuplicates(
      [...ps, ...(deliverRecords.value[params.type]?.[todayDate] || [])],
      "number"
    );

    deliverRecords.value[params.type][todayDate] = ps;
    
    uni.setStorageSync(DELIVER_RECORDS_KEY, Object.fromEntries(
      Object.entries(deliverRecords.value[params.type] || {}).sort(
        ([keyA], [keyB]) => keyB.localeCompare(keyA)
      )
    ));
  }

  function isDelivered(params: { type: SupportedPlatform; number: string }) {
    let delivered = false;
    for (const d in deliverRecords.value[params.type]) {
      if (
        deliverRecords.value[params.type][d]?.findIndex(
          (item) => item.number === params.number
        ) > -1
      ) {
        delivered = true;
        break;
      }
    }
    return delivered;
  }

  return {
    deliverRecords,
    deliverPositions,
    isDelivered,
  };
});

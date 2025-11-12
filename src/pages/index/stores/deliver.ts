import { supportedPlatforms } from "@/config/config";
import {
  requestDeliverPosition,
  requestGetMyAutoDeliveredInfo,
  requestGetMyDelivered,
} from "@/request";
import { SupportedPlatform } from "@/types";
import { defineStore } from "pinia";
import { onBeforeMount, onMounted, ref } from "vue";
import { useTLoginStore } from "./tlogin";
import { storeToRefs } from "pinia";
import { usePositionStore } from "./position";

import {
  getTodayDate,
  getTodayTimestamp,
  isBeforeDay,
  isSameDay,
} from "@/utils/date";
import { useUserStore } from "./user";

const DELIVER_RECORDS_KEY = "deliverRecords";

export interface AutoDeliveredInfo {
  // 总投递职位数量
  totalCount: number;
  // 总投递次数
  totalTimes: number;
}

export const useDeliverStore = defineStore("deliver", () => {
  const tLoginStore = useTLoginStore();
  const { customLoginInfo } = storeToRefs(tLoginStore);

  const positionStore = usePositionStore();
  const { positions } = storeToRefs(positionStore);

  const userStore = useUserStore();
  const { loginInfo, isLoggedIn } = storeToRefs(userStore);

  const pageIndex = ref(1);
  const pageSize = ref(20);
  const totalPage = ref(1);
  const remoteDelivered = ref<Record<SupportedPlatform, any[]>>();

  const autoDeliveredInfo = ref<AutoDeliveredInfo>();

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
  const deliverRecords = ref<Record<SupportedPlatform, any[]>>();
  const localDeliverRecords = ref<Record<SupportedPlatform, any[]>>();

  onBeforeMount(() => {
    initRemoteDelivered();
    initLocalDelivered();
  });

  onMounted(() => {
    // const ps = [];
    // for (const platform of followedPlatforms.value) {
    //   ps.push(getMyRemoteDelivered({
    //     platform: platform.type,
    //   }));
    // }
    // Promise.all([ps])

    getMyAutoDeliveredInfo();
  });

  function getLocalDelivered() {
    let localRecords = uni.getStorageSync(DELIVER_RECORDS_KEY);
    if (!localRecords) {
      localRecords = {};
      for (const platform of supportedPlatforms) {
        localRecords[platform.type] = [];
      }
    }

    if (supportedPlatforms.length > Object.keys(localRecords).length) {
      for (const platform of supportedPlatforms) {
        if (!localRecords[platform.type]) {
          localRecords[platform.type] = [];
        }
      }
    }

    return localRecords;
  }

  function initLocalDelivered() {
    localDeliverRecords.value = getLocalDelivered();
    uni.setStorageSync(DELIVER_RECORDS_KEY, localDeliverRecords.value);
  }

  function initRemoteDelivered() {
    if (!remoteDelivered.value) {
      remoteDelivered.value = {
        [SupportedPlatform.ZHAOPIN]: [],
        [SupportedPlatform.BOSS]: [],
      };
    }
    if (!deliverRecords.value) {
      deliverRecords.value = {
        [SupportedPlatform.ZHAOPIN]: [],
        [SupportedPlatform.BOSS]: [],
      };
    }
  }

  function mixinDeliveredList(platform: SupportedPlatform) {
    if (
      !localDeliverRecords.value ||
      !localDeliverRecords.value![platform] ||
      localDeliverRecords.value![platform].length === 0
    ) {
      return;
    }

    if (deliverRecords.value![platform].length === 0) {
      deliverRecords.value![platform] = localDeliverRecords.value![platform];
      localDeliverRecords.value![platform] = [];
      return;
    }
    for (let i = 0; i < localDeliverRecords.value![platform].length; i++) {
      const item = localDeliverRecords.value![platform][i];
      const sameDayIndex = deliverRecords.value![platform].findIndex(
        (it: any) => isSameDay(Number(it.time), Number(item.time))
      );

      if (sameDayIndex > -1) {
        deliverRecords.value![platform][sameDayIndex].list.push(
          ...(item.list || [])
        );
        localDeliverRecords.value![platform].splice(i, 1);
        i--;
      } else {
        const index = deliverRecords.value![platform].findIndex((it: any) =>
          isBeforeDay(Number(it.time), Number(item.time))
        );
        if (index > -1) {
          deliverRecords.value![platform].splice(index, 0, item);
          localDeliverRecords.value![platform].splice(i, 1);
          i--;
        } else {
        }
      }
    }

    if (pageIndex.value === totalPage.value) {
      deliverRecords.value![platform] = [
        ...deliverRecords.value![platform],
        ...localDeliverRecords.value![platform],
      ];
      localDeliverRecords.value![platform] = [];
    }
  }

  function getMyRemoteDelivered(params: { platform: SupportedPlatform }) {
    return new Promise((resolve) => {
      if (!isLoggedIn.value) {
        deliverRecords.value![params.platform] = [
          ...localDeliverRecords.value![params.platform],
        ];
        resolve(false);
        return;
      }

      requestGetMyDelivered({
        platform: params.platform,
        userId: loginInfo.value!.id,
        pageIndex: pageIndex.value,
        pageSize: pageSize.value,
      })
        .then((res: any) => {
          if (res.code === 200) {
            if (pageIndex.value === 1) {
              console.log(">>>>>>>local", localDeliverRecords.value);
              remoteDelivered.value![params.platform] = res.data.result || [];
              deliverRecords.value![params.platform] = res.data.result || [];
            } else {
              remoteDelivered.value![params.platform].push(
                ...(res.data.result || [])
              );
              deliverRecords.value![params.platform] = {
                ...(deliverRecords.value![params.platform] || []),
                ...(res.data.result || []),
              };
            }
            totalPage.value = res.data.totalPage;

            mixinDeliveredList(params.platform);
          }
          resolve(true);
        })
        .catch((err) => {
          resolve(false);
        });
    });
  }

  function initDeliveredPositions(params: { type: SupportedPlatform }) {
    pageIndex.value = 1;
    totalPage.value = 1;

    initLocalDelivered();
    initRemoteDelivered();
    return new Promise((resolve) => {
      getMyRemoteDelivered({
        platform: params.type,
      }).then((res: any) => {
        resolve(res);
      });
    });
  }

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
      const allDeliveredNumbers = [
        ...(deliverRecords.value![params.type] || []),
        ...(localDeliverRecords.value![params.type] || []),
      ].reduce((prev, curr) => {
        return [...prev, ...curr.list.map((item: any) => item.number)];
      }, []);
      // 过滤已经投递的职位
      const readyToDeliverNumbers = params.numbers.filter(
        (number) => !allDeliveredNumbers.includes(number)
      );
      const repeatedNumbers = params.numbers.filter((number) =>
        allDeliveredNumbers.includes(number)
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
    // ["CCL1300491210J40794888411"]
    const allDelivered = [
      ...(deliverRecords.value![params.type] || []),
      ...(localDeliverRecords.value![params.type] || []),
    ].reduce((prev, curr) => {
      return [...prev, ...curr.list];
    }, []);

    let ps = params.numbers
      .map((p: any) =>
        positions.value[params.type]?.list?.find(
          (item: any) => item.number === p
        )
      )
      .filter((p: any) => !!p)
      .filter(
        (itm: any) =>
          allDelivered.findIndex((it: any) => it.number === itm.number) === -1
      );
    const deliveredIndex = deliverRecords.value![params.type].findIndex(
      (item: any) => isSameDay(Number(item.time), Number(getTodayDate()))
    );
    if (deliveredIndex > -1) {
      deliverRecords.value![params.type][deliveredIndex].list.push(...ps);
    } else {
      const localDeliveredIndex = localDeliverRecords.value![
        params.type
      ].findIndex((item: any) =>
        isSameDay(Number(item.time), Number(getTodayDate()))
      );
      if (localDeliveredIndex > -1) {
        localDeliverRecords.value![params.type][localDeliveredIndex].list.push(
          ...ps
        );
      } else {
        localDeliverRecords.value![params.type].push({
          time: getTodayTimestamp(),
          list: [...ps],
        });
      }
    }

    // 更新列表渲染
    const todayDeliveredIndexInDeliverRecords = deliverRecords.value![
      params.type
    ].findIndex((item: any) =>
      isSameDay(Number(item.time), Number(getTodayTimestamp()))
    );
    if (todayDeliveredIndexInDeliverRecords > -1) {
      deliverRecords.value![params.type][
        todayDeliveredIndexInDeliverRecords
      ].list.unshift(...ps);
    } else {
      const backIndexInDeliverRecords = deliverRecords.value![
        params.type
      ].findIndex((item: any) =>
        isBeforeDay(Number(item.time), Number(getTodayTimestamp()))
      );
      deliverRecords.value![params.type].splice(backIndexInDeliverRecords, 0, {
        time: getTodayTimestamp(),
        list: [...ps],
      });
    }

    const localDelivered = getLocalDelivered();
    const todayDeliveredIndex = localDelivered[params.type].findIndex(
      (item: any) => isSameDay(Number(item.time), Number(getTodayTimestamp()))
    );

    if (todayDeliveredIndex > -1) {
      localDelivered[params.type][todayDeliveredIndex].list.unshift(...ps);
    } else {
      const backIndex = localDelivered[params.type].findIndex((item: any) =>
        isBeforeDay(Number(item.time), Number(getTodayTimestamp()))
      );
      localDelivered[params.type].splice(backIndex, 0, {
        time: getTodayTimestamp(),
        list: [...ps],
      });
    }
    uni.setStorageSync(DELIVER_RECORDS_KEY, localDelivered);
  }

  function isDelivered(params: { type: SupportedPlatform; number: string }) {
    if (!params.type) {
      return false;
    }
    const allDelivered = [
      ...(deliverRecords.value?.[params.type] || []),
      ...(localDeliverRecords.value?.[params.type] || []),
    ].reduce((prev, curr) => {
      return [...prev, ...curr.list];
    }, []);

    const index = allDelivered.findIndex(
      (item: any) => item.number === params.number
    );
    return index > -1;
  }

  function getMyAutoDeliveredInfo() {
    return new Promise((resolve) => {
      if (!isLoggedIn.value) {
        resolve(false);
        return;
      }
      requestGetMyAutoDeliveredInfo({
        userId: loginInfo.value!.id,
      }).then((res: any) => {
        if (res.code === 200) {
          autoDeliveredInfo.value = res.data;
        }
        resolve(true);
      });
    });
  }

  return {
    deliverRecords,
    remoteDelivered,
    autoDeliveredInfo,
    deliverPositions,
    isDelivered,
    initDeliveredPositions,
    getMyAutoDeliveredInfo,
  };
});

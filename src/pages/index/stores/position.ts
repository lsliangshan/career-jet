import { requestDailyPositions } from "@/request";
import { SupportedPlatform } from "@/types";
import { defineStore } from "pinia";
import { onBeforeMount, onMounted, ref } from "vue";
import { useProfileStore } from "./profile";
import { storeToRefs } from "pinia";
import { supportedPlatforms } from "@/config/config";

const POSITIONS_KEY = "positions";
export interface PositionItem {
  job: string;
  city: string;
  date: string;
  list: any[];
}

export const usePositionStore = defineStore("position", () => {
  const positions = ref<{
    [key: string]: PositionItem;
  }>({});

  // const zhaopinPositions = ref<PositionItem>({
  //   job: "",
  //   city: "",
  //   date: "",
  //   list: [],
  // });
  // const bossPositions = ref<PositionItem>({
  //   job: "",
  //   city: "",
  //   date: "",
  //   list: [],
  // });

  const profileStore = useProfileStore();
  const { followedPosition, followedCity } = storeToRefs(profileStore);

  const date = ref(new Date().toLocaleDateString("zh-CN").replaceAll("/", "-"));

  onBeforeMount(() => {
    const localPositions = uni.getStorageSync(POSITIONS_KEY);
    if (localPositions) {
      positions.value = localPositions || {};
    } else {
      for (const platform of supportedPlatforms) {
        positions.value[platform.type] = {
          job: "",
          city: "",
          date: "",
          list: [],
        };
      }

      uni.setStorageSync(POSITIONS_KEY, positions.value);
    }
  });

  onMounted(async () => {
    const d = new Date();
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    date.value = `${d.getFullYear()}-${month}-${day}`;

    await getPositions();
  });

  function getPositionsByType(params: {
    type: SupportedPlatform;
    refresh?: boolean;
  }) {
    return new Promise((resolve) => {
      if (
        positions.value[params.type]?.date === date.value &&
        positions.value[params.type]?.list.length > 0 &&
        !params.refresh
      ) {
        resolve({
          code: 1000,
          message: "没有更新",
          data: {
            list: positions.value[params.type].list,
          },
        });
        return;
      }

      requestDailyPositions({
        type: params.type,
        job: followedPosition.value,
        city: followedCity.value,
      }).then((res: any) => {
        if (res.code === 200) {
          setPositionsByType({ type: params.type, positions: res.data.list });
          resolve({
            code: 200,
            message: "更新成功",
            data: {
              list: res.data.list,
            },
          });
        } else {
          resolve({
            code: 1000,
            message: "更新失败",
            data: {
              list: [],
            },
          });
        }
      });
    });
  }

  function getPositions() {
    return Promise.all([
      getPositionsByType({ type: SupportedPlatform.ZHAOPIN }),
    ]);
    // return Promise.all([getZhaopinPositions(), getBossPositions()]);
  }

  function setPositionsByType(params: {
    type: SupportedPlatform;
    positions: any[];
  }) {
    positions.value[params.type] = {
      job: followedPosition.value,
      city: followedCity.value,
      date: date.value,
      list: params.positions,
    };
    uni.setStorageSync(POSITIONS_KEY, positions.value);
  }

  function getPositionDetail(params: {
    type: SupportedPlatform;
    number: string;
  }) {
    return positions.value[params.type]?.list?.find(
      (item: any) => item.number === params.number
    );
  }

  function updateDate() {
    const d = new Date();
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    date.value = `${d.getFullYear()}-${month}-${day}`;
  }

  return {
    positions,
    updateDate,
    getPositionsByType,
    setPositionsByType,
    getPositionDetail,
  };
});

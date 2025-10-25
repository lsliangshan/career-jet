import { requestDailyPositions } from "@/request";
import { SupportedPlatform } from "@/types";
import { defineStore } from "pinia";
import { onMounted, ref } from "vue";
import { useProfileStore } from "./profile";
import { storeToRefs } from "pinia";

const ZHAOPIN_POSITIONS_KEY = "zhaopinPositions";
const BOSS_POSITIONS_KEY = "bossPositions";

export interface PositionItem {
  job: string;
  city: string;
  date: string;
  list: any[];
}

export const usePositionStore = defineStore("position", () => {
  const zhaopinPositions = ref<PositionItem>({
    job: "",
    city: "",
    date: "",
    list: [],
  });
  const bossPositions = ref<PositionItem>({
    job: "",
    city: "",
    date: "",
    list: [],
  });

  const profileStore = useProfileStore();
  const { followedPosition, followedCity } = storeToRefs(profileStore);

  const date = ref((new Date()).toLocaleDateString().replaceAll('/', '-'));

  onMounted(async () => {
    const localZhaopinPositions = uni.getStorageSync(ZHAOPIN_POSITIONS_KEY);
    if (localZhaopinPositions) {
      zhaopinPositions.value = localZhaopinPositions;
    }
    const localBossPositions = uni.getStorageSync(BOSS_POSITIONS_KEY);
    if (localBossPositions) {
      bossPositions.value = localBossPositions;
    }

    await getPositions();
  });

  function getZhaopinPositions() {
    return new Promise((resolve) => {
      if (zhaopinPositions.value.date === date.value && zhaopinPositions.value.list.length > 0) {
        resolve(true);
        return;
      }

      requestDailyPositions({
        type: SupportedPlatform.ZHAOPIN,
        job: followedPosition.value,
        city: followedCity.value,
      }).then((res: any) => {
        console.log('>>>>>>>......... 1', res);
        if (res.code === 200) {
          
          setZhaopinPositions(res.data.list);
          resolve(true);
        } else {
          resolve(false);
        }
      });
    })
  }
  function getBossPositions() {
    return new Promise((resolve) => {
      if (bossPositions.value.date === date.value && bossPositions.value.list.length > 0) {
        resolve(true);
      }

      requestDailyPositions({
        type: SupportedPlatform.BOSS,
        job: followedPosition.value,
        city: followedCity.value,
      }).then((res: any) => {
        if (res.code === 200) {
          console.log('>>>>>>>......... 2', res.data.list);
          setBossPositions(res.data.list);
          resolve(true);
        } else {
          resolve(false);
        }
      });
    })
  }

  function getPositions() {
    return Promise.all([getZhaopinPositions()]);
    // return Promise.all([getZhaopinPositions(), getBossPositions()]);
  }

  function setZhaopinPositions(positions: any[]) {
    zhaopinPositions.value = {
      job: followedPosition.value,
      city: followedCity.value,
      date: date.value,
      list: positions,
    };
    uni.setStorageSync(ZHAOPIN_POSITIONS_KEY, zhaopinPositions.value);
  }
  function setBossPositions(positions: any[]) {
    bossPositions.value = {
      job: followedPosition.value,
      city: followedCity.value,
      date: date.value,
      list: positions,
    };
    uni.setStorageSync(BOSS_POSITIONS_KEY, bossPositions.value);
  }

  return {
    zhaopinPositions,
    bossPositions,
    setZhaopinPositions,
    setBossPositions,
  };
});

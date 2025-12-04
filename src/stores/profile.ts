import { supportedLevels } from "@/config/config";
import type { ILevel } from "@/types";
import { defineStore } from "pinia";
import { ref } from "vue";

const LocalGameLevelKey = "localGameLevel";

export const useProfileStore = defineStore("profile", () => {
  // 游戏难度级别
  const level = ref<ILevel>();

  function init() {
    const localGameLevel = uni.getStorageSync(LocalGameLevelKey);
    try {
      const localData = JSON.parse(localGameLevel);
      level.value = localData;
    } catch (error) {
      level.value = supportedLevels[0];
    }
  }

  init();

  function setGameLevel(levelData: ILevel) {
    level.value = levelData;
    uni.setStorageSync(LocalGameLevelKey, JSON.stringify(levelData));
  }

  return {
    level,
    setGameLevel,
  };
});

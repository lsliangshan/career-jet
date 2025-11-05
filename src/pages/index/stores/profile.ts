import { defineStore } from "pinia";
import { ref } from "vue";

export enum FollowedDataType {
  FOLLOWED_POSITION = "followedPosition",
  FOLLOWED_CITY = "followedCity",
}

const FOLLOWED_POSITION_KEY = "followedPosition";
const FOLLOWED_CITY_KEY = "followedCity";

export const useProfileStore = defineStore("profile", () => {
  // 关注的职位
  const followedPosition = ref(uni.getStorageSync(FOLLOWED_POSITION_KEY) || "");

  // 关注的城市
  const followedCity = ref(uni.getStorageSync(FOLLOWED_CITY_KEY) || "");

  function setFollowedPosition(position: string) {
    followedPosition.value = position;
    uni.setStorageSync(FOLLOWED_POSITION_KEY, position);
  }
  function setFollowedCity(city: string) {
    followedCity.value = city;
    uni.setStorageSync(FOLLOWED_CITY_KEY, city);
  }

  return {
    followedCity,
    followedPosition,
    setFollowedPosition,
    setFollowedCity,
  };
});

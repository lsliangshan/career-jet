import { defineStore } from "pinia";
import { ref } from "vue";

export enum FollowedDataType {
  FOLLOWED_POSITION = "followedPosition",
  FOLLOWED_CITY = "followedCity",
}

export const useProfileStore = defineStore("profile", () => {
  // 关注的职位
  const followedPosition = ref("web前端");

  // 关注的城市
  const followedCity = ref("北京");

  function setFollowedPosition(position: string) {
    followedPosition.value = position;
  }
  function setFollowedCity(city: string) {
    followedCity.value = city;
  }

  return {
    followedCity,
    followedPosition,
    setFollowedPosition,
    setFollowedCity,
  };
});

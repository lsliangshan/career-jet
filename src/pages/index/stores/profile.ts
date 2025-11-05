import { defineStore } from "pinia";
import { ref } from "vue";
import { useSubscriberStore } from "./subscriber";
import { storeToRefs } from "pinia";

export enum FollowedDataType {
  FOLLOWED_POSITION = "followedPosition",
  FOLLOWED_CITY = "followedCity",
}

const FOLLOWED_POSITION_KEY = "followedPosition";
const FOLLOWED_CITY_KEY = "followedCity";

export const useProfileStore = defineStore("profile", () => {
  const subscriberStore = useSubscriberStore();
  const { subscriber } = storeToRefs(subscriberStore);

  // 关注的职位
  const followedPosition = ref(uni.getStorageSync(FOLLOWED_POSITION_KEY) || "");

  // 关注的城市
  const followedCity = ref(uni.getStorageSync(FOLLOWED_CITY_KEY) || "");

  function setFollowedPosition(position: string) {
    followedPosition.value = position;
    uni.setStorageSync(FOLLOWED_POSITION_KEY, position);

    if (subscriber.value && subscriber.value!.id) {
      subscriberStore.updateMySubscriber({
        id: subscriber.value!.id,
        job: position,
      });
    }
  }
  function setFollowedCity(city: string) {
    followedCity.value = city;
    uni.setStorageSync(FOLLOWED_CITY_KEY, city);

    if (subscriber.value && subscriber.value!.id) {
      subscriberStore.updateMySubscriber({
        id: subscriber.value!.id,
        city: city,
      });
    }
  }

  return {
    followedCity,
    followedPosition,
    setFollowedPosition,
    setFollowedCity,
  };
});

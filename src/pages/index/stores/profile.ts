import { defineStore } from "pinia";
import { onMounted, ref } from "vue";
import { useSubscriberStore } from "./subscriber";
import { storeToRefs } from "pinia";
import { SupportedPlatform } from "@/types";

export enum FollowedDataType {
  FOLLOWED_POSITION = "followedPosition",
  FOLLOWED_CITY = "followedCity",
}

const FOLLOWED_POSITION_KEY = "followedPosition";
const FOLLOWED_CITY_KEY = "followedCity";
const FOLLOWED_PLATFORMS_KEY = "followedPlatforms";

export const useProfileStore = defineStore("profile", () => {
  const subscriberStore = useSubscriberStore();
  const { subscriber } = storeToRefs(subscriberStore);

  // 关注的职位
  const followedPosition = ref(uni.getStorageSync(FOLLOWED_POSITION_KEY) || "");

  // 关注的城市
  const followedCity = ref(uni.getStorageSync(FOLLOWED_CITY_KEY) || "");

  // 关注的平台
  const followedPlatforms = ref<SupportedPlatform[]>(uni.getStorageSync(FOLLOWED_PLATFORMS_KEY) || []);

  onMounted(() => {
    const localFollowedPlatforms = uni.getStorageSync(FOLLOWED_PLATFORMS_KEY);
    if (localFollowedPlatforms) {
      followedPlatforms.value = localFollowedPlatforms;
    }
  })

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

  function setFollowedPlatforms(platforms: SupportedPlatform[]) {
    followedPlatforms.value = platforms;
    uni.setStorageSync(FOLLOWED_PLATFORMS_KEY, platforms);

    if (subscriber.value && subscriber.value!.id) {
      subscriberStore.updateMySubscriber({
        id: subscriber.value!.id,
        platform: platforms.join(";"),
      });
    }
  }

  function addFollowedPlatform(platform: SupportedPlatform) {
    const index = followedPlatforms.value.indexOf(platform);
    if (index === -1) {
      followedPlatforms.value.push(platform);
    }
    uni.setStorageSync(FOLLOWED_PLATFORMS_KEY, followedPlatforms.value);

    if (subscriber.value && subscriber.value!.id) {
      subscriberStore.updateMySubscriber({
        id: subscriber.value!.id,
        platform: followedPlatforms.value.join(";"),
      });
    }
  }

  function removeFollowedPlatform(platform: SupportedPlatform) {
    followedPlatforms.value = followedPlatforms.value.filter((p: SupportedPlatform) => p !== platform);
    uni.setStorageSync(FOLLOWED_PLATFORMS_KEY, followedPlatforms.value);

    if (subscriber.value && subscriber.value!.id) {
      subscriberStore.updateMySubscriber({
        id: subscriber.value!.id,
        platform: followedPlatforms.value.join(";"),
      });
    }
  }

  return {
    followedCity,
    followedPosition,
    followedPlatforms,
    setFollowedPosition,
    setFollowedCity,
    setFollowedPlatforms,
    addFollowedPlatform,
    removeFollowedPlatform,
  };
});

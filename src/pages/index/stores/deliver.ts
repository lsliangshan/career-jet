import { defineStore } from "pinia";
import { ref } from "vue";

export enum FollowedDataType {
  FOLLOWED_POSITION = "followedPosition",
  FOLLOWED_CITY = "followedCity",
}

const DELIVER_RECORDS_KEY = "deliverRecords";

export const useDeliverStore = defineStore("deliver", () => {
  return {};
});

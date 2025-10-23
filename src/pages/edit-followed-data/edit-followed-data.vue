<template>
  <view class="relative w-full h-full">
    <CustomHeader show-back title="编辑关注数据" />
    <Layout hasHeader>
      <view class="w-full h-[80rpx] bg-[#fff] flex flex-row items-center">
        <input
          class="w-full h-[80rpx] uni-input pl-[24rpx] pr-[24rpx] box-border"
          :value="followedPosition"
          focus
          :placeholder="renderPlaceholder"
        />
        <text class="uni-icon" v-if="showClearIcon" @click="clearIcon"
          >&times;</text
        >
        <view
          class="h-[56rpx] pl-[24rpx] rounded-[8rpx] pr-[24rpx] box-border shrink-0 ml-[12rpx] mr-[12rpx] bg-[#42b983] active:bg-[#36ad6a] flex flex-row items-center justify-center"
        >
          <text class="text-[28rpx] text-[#fff]">保存</text>
        </view>
      </view>
    </Layout>
  </view>
</template>

<script setup lang="ts">
import CustomHeader from "@/components/custom-header/custom-header.vue";
import Layout from "@/components/layout/layout.vue";
import { onLoad } from "@dcloudio/uni-app";
import { FollowedDataType, useProfileStore } from "../index/stores/profile";
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";

const followedDataType = ref(FollowedDataType.FOLLOWED_POSITION);

const profileStore = useProfileStore();
const { followedPosition, followedCity } = storeToRefs(profileStore);

const showClearIcon = computed(() => {
  if (followedDataType.value === FollowedDataType.FOLLOWED_POSITION) {
    return followedPosition.value !== "";
  } else if (followedDataType.value === FollowedDataType.FOLLOWED_CITY) {
    return followedCity.value !== "";
  }
  return false;
});

const renderPlaceholder = computed(() => {
  if (followedDataType.value === FollowedDataType.FOLLOWED_POSITION) {
    return "请输入关注的职位";
  } else if (followedDataType.value === FollowedDataType.FOLLOWED_CITY) {
    return "请输入关注的城市";
  }
  return "";
});

onLoad((options) => {
  const type = options?.type as FollowedDataType | undefined;
  if (!type) {
    uni.navigateBack();
    return;
  }
  followedDataType.value = type;
});

function clearIcon() {}
</script>

<style scoped></style>

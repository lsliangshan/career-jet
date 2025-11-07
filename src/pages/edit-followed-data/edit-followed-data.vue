<template>
  <view class="relative w-full h-full">
    <CustomHeader show-back :title="renderTitle" />
    <Layout hasHeader>
      <view class="w-full h-[80rpx] bg-[#fff] flex flex-row items-center">
        <view class="relative w-full h-full flex flex-row items-center">
          <input
            class="h-full pl-[24rpx] pr-[24rpx] box-border"
            :style="{ width: `calc(100% - 80rpx)` }"
            :value="renderValue"
            ref="inputRef"
            focus
            confirm-type="send"
            :placeholder="renderPlaceholder"
            @input="handleInput"
            @confirm="handleSave"
          />
          <view
            class="absolute right-0 top-0 w-[80rpx] h-[80rpx] rounded-[50%] overflow-hidden z-[9] flex flex-row items-center justify-center bg-[#fff] active:bg-[#f8f8f8]"
            @click="clearInput"
            v-if="showClearIcon"
          >
            <text class="text-[36rpx] text-[#888] font-[400]">&times;</text>
          </view>
        </view>
        <view
          class="h-[56rpx] pl-[24rpx] rounded-[8rpx] pr-[24rpx] box-border shrink-0 ml-[12rpx] mr-[12rpx] flex flex-row items-center justify-center transition-all duration-300"
          :class="[
            valueChanged
              ? 'bg-[#42b983] active:bg-[#36ad6a]'
              : 'bg-[#c8c8c8] pointer-events-none',
          ]"
          @click="handleSave"
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
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";

const followedDataType = ref(FollowedDataType.FOLLOWED_POSITION);

const inputRef = ref();

const renderValue = ref("");

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

const renderTitle = computed(() => {
  if (followedDataType.value === FollowedDataType.FOLLOWED_POSITION) {
    return "修改关注的职位";
  } else if (followedDataType.value === FollowedDataType.FOLLOWED_CITY) {
    return "修改关注的城市";
  }
  return "";
});

const valueChanged = computed(() => {
  if (followedDataType.value === FollowedDataType.FOLLOWED_POSITION) {
    return renderValue.value !== followedPosition.value;
  } else if (followedDataType.value === FollowedDataType.FOLLOWED_CITY) {
    return renderValue.value !== followedCity.value;
  }
  return false;
});

watch(
  followedDataType,
  (newVal) => {
    if (newVal === FollowedDataType.FOLLOWED_POSITION) {
      renderValue.value = followedPosition.value;
    } else if (newVal === FollowedDataType.FOLLOWED_CITY) {
      renderValue.value = followedCity.value;
    }
  },
  {
    immediate: true,
  }
);

onLoad((options) => {
  const type = options?.type as FollowedDataType | undefined;
  if (!type) {
    uni.navigateBack();
    return;
  }
  followedDataType.value = type;
});

function clearInput() {
  renderValue.value = "";
}

function handleInput(e: any) {
  renderValue.value = e.detail.value;
}

function handleSave() {
  if (!renderValue.value) {
    uni.showToast({
      title: "请输入内容",
      icon: "none",
    });
    return;
  }
  if (followedDataType.value === FollowedDataType.FOLLOWED_POSITION) {
    profileStore.setFollowedPosition(renderValue.value);
  } else if (followedDataType.value === FollowedDataType.FOLLOWED_CITY) {
    profileStore.setFollowedCity(renderValue.value);
  }
  uni.navigateBack({
    complete: () => {
      uni.showToast({
        title: "保存成功",
        icon: "none",
      });
    },
  });
}
</script>

<style scoped></style>

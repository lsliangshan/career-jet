<template>
  <view>
    <view
      class="w-full h-[64rpx] mb-[12rpx] flex flex-row items-center"
      v-if="showHeader"
    >
      <text
        class="text-[24rpx] text-shadow-[0_0_10rpx_rgba(255,255,255,0.1)]"
        :style="{
          color: ThemeColors.text.label,
        }"
        >通用设置</text
      >
    </view>
    <view class="w-full rounded-[8rpx] overflow-hidden flex flex-col">
      <view class="flex flex-row items-center">
        <view
          class="h-[100rpx] w-full pl-[24rpx] pr-[24rpx] box-border active:bg-[#fafafa] flex flex-row items-center justify-between"
          :style="{
            backgroundColor: ThemeColors.bgCard,
          }"
          @click="handleEditFollowedPosition"
        >
          <view class="flex flex-row items-center">
            <image
              class="w-[30rpx] h-[30rpx] mr-[12rpx]"
              src="@static/icon_keyword.png"
            ></image>
            <text
              class="text-[28rpx]"
              :style="{
                color: ThemeColors.text.title,
              }"
              >关注的职位</text
            >
          </view>
          <view
            class="h-full shrink-0 flex flex-row items-center justify-center"
          >
            <text
              class="text-[28rpx] mr-[12rpx]"
              :style="{
                color: ThemeColors.text.label,
              }"
              >{{ followedPosition }}</text
            >
            <image
              class="w-[30rpx] h-[30rpx]"
              src="@static/icon_arraw_right.png"
            ></image>
          </view>
        </view>
      </view>

      <view
        class="w-full h-[1rpx] flex flex-row items-center justify-center"
        :style="{
          backgroundColor: ThemeColors.bgCard,
        }"
      >
        <view
          class="h-full"
          :style="{
            width: `calc(100% - 48rpx)`,
            backgroundColor: ThemeColors.bg,
          }"
        ></view>
      </view>

      <view class="flex flex-row items-center">
        <view
          class="h-[100rpx] w-full pl-[24rpx] pr-[24rpx] box-border active:bg-[#fafafa] flex flex-row items-center justify-between"
          :style="{
            backgroundColor: ThemeColors.bgCard,
          }"
          @click="handleEditFollowedCity"
        >
          <view class="flex flex-row items-center">
            <image
              class="w-[36rpx] h-[36rpx] mr-[12rpx]"
              src="@static/icon_city.png"
            ></image>
            <text
              class="text-[28rpx]"
              :style="{
                color: ThemeColors.text.title,
              }"
              >关注的城市</text
            >
          </view>
          <view
            class="h-full shrink-0 flex flex-row items-center justify-center"
          >
            <text
              class="text-[28rpx] mr-[12rpx]"
              :style="{
                color: ThemeColors.text.label,
              }"
              >{{ followedCity }}</text
            >
            <image
              class="w-[30rpx] h-[30rpx]"
              src="@static/icon_arraw_right.png"
            ></image>
          </view>
        </view>
      </view>

      <view
        class="w-full h-[1rpx] flex flex-row items-center justify-center"
        :style="{
          backgroundColor: ThemeColors.bgCard,
        }"
      >
        <view
          class="h-full"
          :style="{
            width: `calc(100% - 48rpx)`,
            backgroundColor: ThemeColors.bg,
          }"
        ></view>
      </view>

      <view class="flex flex-row items-center">
        <view
          class="h-[100rpx] w-full pl-[24rpx] pr-[24rpx] box-border active:bg-[#fafafa] flex flex-row items-center justify-between"
          :style="{
            backgroundColor: ThemeColors.bgCard,
          }"
          @click="handleEditFollowedPlatforms"
        >
          <view class="flex flex-row items-center">
            <image
              class="w-[24rpx] h-[24rpx] mr-[12rpx] ml-[6rpx]"
              src="@static/icon_platform.png"
            ></image>
            <text
              class="text-[28rpx]"
              :style="{
                color: ThemeColors.text.title,
              }"
              >关注的平台</text
            >
          </view>
          <view
            class="h-full shrink-0 flex flex-row items-center justify-center gap-[8rpx]"
          >
            <view
              class="h-[40rpx] px-[8rpx] box-border rounded-[8rpx] overflow-hidden flex flex-row items-center justify-center"
              :style="{ backgroundColor: ThemeColors.primary100 }"
              v-for="platform in followedPlatforms.slice(0, 2)"
              :key="platform"
            >
              <text
                class="text-[20rpx]"
                :style="{
                  color: ThemeColors.primary,
                }"
                >{{ getPlatformLabel(platform) }}</text
              >
            </view>
            <view
              class="h-[40rpx] mr-[12rpx] px-[8rpx] box-border rounded-[20rpx] overflow-hidden flex flex-row items-center justify-center"
              :style="{ backgroundColor: ThemeColors.primary100 }"
              v-if="followedPlatforms.length > 2"
            >
              <text
                class="text-[20rpx] font-bold"
                :style="{
                  color: ThemeColors.primary,
                }"
                >{{
                  followedPlatforms.length > 2
                    ? `+${followedPlatforms.length - 2}`
                    : ""
                }}</text
              >
            </view>

            <image
              class="w-[30rpx] h-[30rpx]"
              src="@static/icon_arraw_right.png"
            ></image>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useProfileStore } from "../../stores/profile";
import { storeToRefs } from "pinia";
import { supportedPlatforms, ThemeColors } from "@/config/config";
import { EModalComponent } from "../../modals/types";
import { SupportedPlatform } from "@/types";

interface Props {
  showHeader?: boolean;
}
withDefaults(defineProps<Props>(), {
  showHeader: true,
});

const profileStore = useProfileStore();
const { followedPosition, followedCity, followedPlatforms } =
  storeToRefs(profileStore);

function handleEditFollowedPosition() {
  uni.navigateTo({
    url: "/pages/edit-followed-data/edit-followed-data?type=followedPosition",
  });
}

function handleEditFollowedCity() {
  uni.navigateTo({
    url: "/pages/edit-followed-data/edit-followed-data?type=followedCity",
  });
}

function handleEditFollowedPlatforms() {
  uni.$emit("show-modal", {
    component: EModalComponent.FOLLOWED_PLATFORMS_MODAL,
  });
}

function getPlatformLabel(platform: SupportedPlatform) {
  return (
    supportedPlatforms.find(
      (p: { type: SupportedPlatform }) => p.type === platform
    )?.label || ""
  );
}
</script>

<style scoped></style>

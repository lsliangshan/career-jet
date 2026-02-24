<template>
  <view
    class="w-full h-[128rpx] fixed left-0 z-10 pl-[32rpx] pr-[32rpx] box-border flex flex-row items-center justify-center"
    :style="{ bottom: safeBottom != 0 ? safeBottom + 'px' : '32rpx' }"
  >
    <view
      class="w-full h-full bg-[rgba(255,255,255,0.5)] backdrop-blur-md rounded-[64rpx] flex flex-row items-center justify-between"
      :class="defaultTheme.shadow.bottomTab"
    >
      <view
        class="w-full h-full flex flex-col items-center justify-center gap-[12rpx]"
        v-for="(item, index) in [tabbars[0], tabbars[1]]"
        :key="item.name"
        @click="changeTab(index)"
        :class="[index === currentIndex ? 'opacity-100' : 'opacity-40']"
      >
        <svg-icon
          :src="item.icon"
          class="w-[42rpx] h-[42rpx]"
          :color="index === currentIndex ? ThemeColors.primary : '#000'"
        />
        <text
          class="text-[28rpx] font-[500] text-shadow-[0_0_10rpx_rgba(255,255,255,1)]"
          :style="{
            color: index === currentIndex ? ThemeColors.primary : '#000',
          }"
          >{{ item.label }}</text
        >
      </view>

      <view class="w-full h-full">
        <view
          class="w-full -mt-[64rpx] flex flex-col items-center justify-start gap-[8rpx]"
          :style="{
            height: `calc(100% + 64rpx)`,
          }"
        >
          <view
            class="w-[128rpx] h-[128rpx] p-[8rpx] box-border bg-white rounded-full flex flex-row items-center justify-center active:scale-95 transition-all duration-300"
            :class="defaultTheme.shadow.bottomTab"
            @click="handleCreatePictureBook"
          >
            <view
              class="w-full h-full rounded-full flex flex-row items-center justify-center"
              :style="{
                backgroundColor: ThemeColors.primary,
              }"
            >
              <svg-icon
                :src="`/static/${iconThemeVersion}/icon_generate.svg`"
                class="w-[52rpx] h-[52rpx]"
                color="#fff"
              />
            </view>
          </view>
          <text
            class="text-[28rpx] text-[#000] font-[500] text-shadow-[0_0_10rpx_rgba(255,255,255,1)] opacity-40"
            >创建</text
          >
        </view>
      </view>

      <view
        class="w-full h-full flex flex-col items-center justify-center gap-[12rpx]"
        v-for="(item, index) in [tabbars[2], tabbars[3]]"
        :key="item.name"
        @click="changeTab(index + 2)"
        :class="[index + 2 === currentIndex ? 'opacity-100' : 'opacity-40']"
      >
        <svg-icon
          :src="item.icon"
          class="w-[42rpx] h-[42rpx]"
          :color="index + 2 === currentIndex ? ThemeColors.primary : '#000'"
        />
        <text
          class="text-[28rpx] font-[500] text-shadow-[0_0_10rpx_rgba(255,255,255,1)]"
          :style="{
            color: index + 2 === currentIndex ? ThemeColors.primary : '#000',
          }"
          >{{ item.label }}</text
        >
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import {
  iconThemeVersion,
  tabbars,
  ThemeColors,
  defaultTheme,
} from "@/config/config";
import { useNavStore } from "@/stores/nav";
import { storeToRefs } from "pinia";
import { validateLoggedIn } from "@/utils/user";
import { navigateToCreatePictureBook } from "@/utils/router";

const navStore = useNavStore();
const { currentIndex } = storeToRefs(navStore);

const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;

function changeTab(index: number) {
  navStore.changeTab(index);
}

function handleCreatePictureBook() {
  validateLoggedIn();
  navigateToCreatePictureBook();
}
</script>

<style scoped></style>

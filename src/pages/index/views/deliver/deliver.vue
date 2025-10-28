<template>
  <view class="relative w-full h-full flex flex-row items-center">
    <view
      class="w-full box-border fixed left-0 top-0 z-10 flex flex-col items-center justify-center"
      :style="{
        height: `calc(88rpx + 80rpx + ${safeTop}px)`,
        paddingTop: `${safeTop}px`,
        backgroundColor: ThemeColors.bgCard,
      }"
    >
      <view
        class="relative w-full h-[88rpx] pl-[24rpx] pr-[24rpx] box-border flex flex-row items-center"
      >
        <view class="h-[88rpx] shrink-0 flex flex-row items-center">
          <image
            class="max-h-[60rpx] max-w-[170rpx]"
            src="https://img.liangqy.com/crawlerjet/img/icon_delivered_positions.png"
          ></image>
        </view>
      </view>
      <view
        class="w-full h-[80rpx] pl-[24rpx] box-border border-t flex flex-row items-end gap-[12rpx]"
        :style="{
          borderColor: ThemeColors.border,
        }"
      >
        <view
          class="h-[56rpx] pl-[24rpx] pr-[24rpx] box-border rounded-tl-[12rpx] rounded-tr-[12rpx] overflow-hidden flex flex-row items-center transition-all duration-300"
          v-for="(platform, index) in supportedPlatforms"
          :key="platform.name"
          :style="{
            backgroundColor:
              currentIndex === index ? ThemeColors.accent : ThemeColors.bgCard,
          }"
          @click="handleChangePlatform(index)"
        >
          <text
            class="text-[28rpx] transition-all duration-300"
            :style="{
              color:
                currentIndex === index
                  ? ThemeColors.text.white
                  : ThemeColors.text.title,
            }"
            >{{ platform.label }}</text
          >
        </view>
      </view>
    </view>

    <Layout :hasHeader="true" :gap="80">
      <swiper
        class="w-full h-full"
        :current="currentIndex"
        @change="handleChange"
      >
        <swiper-item
          v-for="platform in supportedPlatforms"
          :key="platform.name"
        >
          <DeliverList :currentIndex="currentIndex" :type="platform.type" />
        </swiper-item>
      </swiper>
    </Layout>
  </view>
</template>

<script setup lang="ts">
import { supportedPlatforms, ThemeColors } from "@/config/config";
import Layout from "@/components/layout/layout.vue";
import DeliverList from "./deliver-list.vue";
import { ref } from "vue";

const safeTop = uni.getSystemInfoSync().safeAreaInsets?.top || 0;

const currentIndex = ref<number>(0);

function handleChange(e: any) {
  currentIndex.value = e.detail.current;
}

function handleChangePlatform(index: number) {
  currentIndex.value = index;
}
</script>

<style scoped></style>

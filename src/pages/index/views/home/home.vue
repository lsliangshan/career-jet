<template>
  <view class="picture-book-list relative w-full h-full">
    <view
      class="w-full absolute bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-none left-0 top-0 z-10 border-b border-[1rpx] flex flex-col"
      :style="{
        height: `calc(80rpx +  ${safeTop}px)`,
        paddingTop: `${safeTop}px`,
      }"
    >
      <view
        class="relative z-[999] w-full h-[80rpx] px-[24rpx] box-border flex flex-row items-center"
        :style="{ width: `calc(${safeTitleWidth}px)` }"
      >
        <MainTabs class="w-full h-[80rpx]" v-model="activeThemeIndex" />
        <!-- <view
          class="w-full h-full px-[24rpx] box-border flex flex-row items-center justify-center"
        >
          <input
            type="text"
            class="w-full h-[72rpx] bg-[rgba(255,255,255,0.8)] dark:bg-[rgba(0,0,0,0.8)] border border-[1rpx] border-[#d8d8d8] rounded-[40rpx] px-[24rpx] box-border"
            placeholder="搜索绘本故事"
          />
        </view> -->
      </view>

      <!-- <view
        class="absolute left-0 bottom-0 z-[998] w-full h-[116rpx] px-[32rpx] box-border z-[99] flex flex-row items-center justify-center"
        :class="[
          tabPinned.includes(activeTheme)
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none',
        ]"
        v-if="pinnedTabVisible"
      >
        <MainTabs class="w-full h-[88rpx]" :type="activeTheme" />
      </view> -->
    </view>

    <Layout :hasHeader="true">
      <swiper
        class="w-full h-full"
        :current="activeThemeIndex"
        @change="handleChangeTheme"
      >
        <swiper-item v-for="tab in tabs" :key="tab.value">
          <view class="inline-block w-full h-full relative">
            <PbList
              class="overflow-hidden"
              :type="tab.value"
              :active-index="activeThemeIndex"
            ></PbList>
          </view>
        </swiper-item>
      </swiper>

      <!-- <scroll-view
        type="nested"
        scroll-x
        :scroll-into-view="scrollToView"
        :scroll-with-animation="scrollWithAnimation"
        :bounces="false"
        class="w-full h-full whitespace-nowrap"
        @touchstart="handleDragStart"
        @touchend="handleDragEnd"
      >
        <nested-scroll-body>
          <view
            v-for="value in Object.keys(tabs)"
            :key="value"
            :id="`tab-${value}`"
            class="inline-block w-full h-full relative"
          >
            <PbList
              class="overflow-hidden"
              :type="(value as keyof typeof tabs)"
              :activeType="activeTheme"
            ></PbList>
          </view>
        </nested-scroll-body>
      </scroll-view> -->
    </Layout>
  </view>
</template>

<script setup lang="ts">
import Layout from "@/components/layout/layout.vue";
import { ref } from "vue";
import PbList from "./PbList.vue";
import MainTabs from "./MainTabs.vue";
import { tabs } from "@/config/config";

const safeTop = uni.getWindowInfo().safeAreaInsets?.top || 0;

const { left: safeTitleWidth } = uni.getMenuButtonBoundingClientRect();

const activeThemeIndex = ref(0);

function handleChangeTheme(e: any) {
  activeThemeIndex.value = e.detail.current;
  console.log(">>>>>>>", e);
}
</script>

<style>
.picture-book-list {
  /* background: #f0f0f0; */
  /* background: linear-gradient(135deg, #ffe6ee 0%, #e6f0ff 100%); */
}

::-webkit-scrollbar {
  display: none !important;
}
</style>

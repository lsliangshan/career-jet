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
      </view>
    </view>

    <Layout :hasHeader="true">
      <VipCard></VipCard>
      <!-- <swiper
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
      </swiper> -->
    </Layout>
  </view>
</template>

<script setup lang="ts">
import Layout from "@/components/layout/layout.vue";
import { ref } from "vue";
import PbList from "./PbList.vue";
import MainTabs from "./MainTabs.vue";
import { tabs } from "@/config/config";
import VipCard from "../profile/vip-card.vue";

const safeTop = uni.getWindowInfo().safeAreaInsets?.top || 0;

const { left: safeTitleWidth } = uni.getMenuButtonBoundingClientRect();

const activeThemeIndex = ref(0);

function handleChangeTheme(e: any) {
  activeThemeIndex.value = e.detail.current;
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

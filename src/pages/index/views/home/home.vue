<template>
  <view class="picture-book-list relative w-full h-full">
    <view
      class="w-full absolute bg-[transparent] border-none left-0 top-0 z-10 border-b border-[1rpx] flex flex-col"
      :style="{
        backgroundColor: 'transparent',
        height: `calc(176rpx + ${safeTop}px)`,
        paddingTop: `${safeTop}px`,
      }"
    >
      <view
        class="relative w-full h-[88rpx] flex flex-row items-center"
        :style="{ width: `calc(${safeTitleWidth}px)` }"
      >
        <view
          class="w-full h-full px-[24rpx] box-border flex flex-row items-center justify-center"
        >
          <input
            type="text"
            class="w-full h-[80rpx] bg-[transparent] border border-[1rpx] border-[#d8d8d8] rounded-[40rpx] px-[24rpx] box-border"
            placeholder="搜索绘本故事"
          />
        </view>
      </view>

      <view class="w-full h-[88rpx] px-[24rpx] box-border">
        <scroll-view
          type="custom"
          scroll-x
          class="w-full h-full pt-[12rpx] box-border whitespace-nowrap"
        >
          <view
            class="h-[64rpx] mr-[6rpx] px-[24rpx] box-border rounded-full transition-all duration-300 border border-gray-100 inline-flex flex-row items-center justify-center"
            v-for="(tab, key) in tabs"
            :key="key"
            :style="{
              backgroundColor: activeTheme === key ? mainColor : 'white',
            }"
            @click="handleActiveTheme(key)"
          >
            <text
              class="text-[28rpx] font-medium"
              :class="[activeTheme === key ? 'text-white' : 'text-[#4c739a]']"
              >{{ tab }}</text
            >
          </view>
        </scroll-view>
      </view>
    </view>

    <Layout :hasHeader="true" :gap="88">
      <view class="relative w-full h-full overflow-hidden">
        <scroll-view
          type="nested"
          scroll-x
          :scroll-into-view="scrollToView"
          :scroll-with-animation="true"
          class="w-full h-full whitespace-nowrap"
          @touchstart="handleDragStart"
          @touchend="handleDragEnd"
        >
          <nested-scroll-body>
            <view
              v-for="value in Object.keys(tabs)"
              :key="value"
              :id="`tab-${value}`"
              class="inline-block w-full h-full"
            >
              <PbList :type="(value as keyof typeof tabs)"></PbList>
            </view>
          </nested-scroll-body>
        </scroll-view>
      </view>
    </Layout>
  </view>
</template>

<script setup lang="ts">
import Layout from "@/components/layout/layout.vue";
import { ref, watch } from "vue";
import { mainColor, tabs } from "@/config/config";
import PbList from "./PbList.vue";

const safeTop = uni.getWindowInfo().safeAreaInsets?.top || 0;

const { left: safeTitleWidth } = uni.getMenuButtonBoundingClientRect();

// 全部、阅读最多、收藏最多
const activeTheme = ref<keyof typeof tabs>("all");
const scrollToView = ref("tab-all");

watch(
  () => scrollToView.value,
  (newVal) => {
    activeTheme.value = newVal.split("-")[1] as keyof typeof tabs;
  }
);

function handleActiveTheme(value: keyof typeof tabs) {
  activeTheme.value = value;
  scrollToView.value = `tab-${value}`;
}

const clientX = ref(0);
const touchTs = ref(0);

function getNextViewId() {
  const tabList = Object.keys(tabs).map((item) => `tab-${item}`);
  const currentIndex = tabList.indexOf(scrollToView.value);
  if (currentIndex === tabList.length - 1 || currentIndex === -1) {
    return scrollToView.value;
  } else {
    return tabList[currentIndex + 1];
  }
}

function getPreviousViewId() {
  const tabList = Object.keys(tabs).map((item) => `tab-${item}`);
  const currentIndex = tabList.indexOf(scrollToView.value);
  if (currentIndex === 0 || currentIndex === -1) {
    return scrollToView.value;
  } else {
    return tabList[currentIndex - 1];
  }
}

function handleDragStart(e: any) {
  clientX.value = e.changedTouches[0].clientX;
  touchTs.value = Date.now();
}

function handleDragEnd(e: any) {
  const offsetClientX = e.changedTouches[0].clientX - clientX.value;
  const offsetTime = Date.now() - touchTs.value;
  if (offsetClientX >= 0) {
    if (offsetClientX > 100 || (offsetClientX > 20 && offsetTime < 300)) {
      scrollToView.value = getPreviousViewId();
    } else {
      // reset
      const tmpView = scrollToView.value;
      scrollToView.value = "";
      setTimeout(() => {
        scrollToView.value = tmpView;
      }, 0);
    }
  } else {
    if (offsetClientX < -100 || (offsetClientX < -20 && offsetTime < 300)) {
      scrollToView.value = getNextViewId();
    } else {
      // reset
      const tmpView = scrollToView.value;
      scrollToView.value = "";
      setTimeout(() => {
        scrollToView.value = tmpView;
      }, 0);
    }
  }
}
</script>

<style>
.picture-book-list {
  background: #f0f0f0;
  /* background: linear-gradient(135deg, #ffe6ee 0%, #e6f0ff 100%); */
}

::-webkit-scrollbar {
  display: none !important;
}
</style>

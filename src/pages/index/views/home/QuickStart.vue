<template>
  <view class="w-full px-[24rpx] py-[16rpx] box-border">
    <view
      class="quick_start w-full rounded-[32rpx] overflow-hidden px-[32rpx] py-[32rpx] box-border flex flex-col gap-[24rpx]"
    >
      <view class="w-full h-[60rpx] flex flex-row items-center justify-center">
        <text class="text-[#333] text-[40rpx] font-[500]"
          >快速挑战 ({{ activeLevel }}级)</text
        >
      </view>

      <view class="w-full h-[56rpx] flex flex-row items-center justify-center">
        <text class="text-[rgba(0,0,0,0.4)] text-[32rpx] font-[500]"
          >随机挑战一张图片，测试你的观察力！</text
        >
      </view>

      <view
        class="w-full h-[100rpx] flex flex-row items-center justify-around gap-[12rpx] mb-[24rpx]"
      >
        <view
          class="flex-1 h-full rounded-[12rpx] flex flex-col items-center justify-center shadow-[0_4rpx_24rpx_2rpx_rgba(255,255,255,0.3)] active:scale-[0.95] transition-all duration-300"
          v-for="level in supportedLevels"
          :key="level.level"
          :class="[
            activeLevel === level.level ? 'bg-[#FF9A3C]' : 'bg-[#f5f5f5]',
          ]"
          @click="handleChangeLevel(level.level)"
        >
          <view
            class="w-full h-[40rpx] flex flex-row items-center justify-center"
          >
            <text
              class="text-[32rpx] font-[500]"
              :class="[
                activeLevel === level.level ? 'text-[#fff]' : 'text-[#666]',
              ]"
              >{{ level.level }}级</text
            >
          </view>
          <view
            class="w-full h-[28rpx] flex flex-row items-center justify-center"
          >
            <text
              class="text-[24rpx]"
              :class="[
                activeLevel === level.level ? 'text-[#fff]' : 'text-[#666]',
              ]"
              >{{ level.name }}</text
            >
          </view>
        </view>
      </view>

      <view
        class="w-full h-[100rpx] bg-[rgba(255,255,255,1)] rounded-[32rpx] active:scale-[0.95] transition-all duration-300 flex flex-row items-center justify-center gap-[16rpx]"
        @click="goToPlayground"
      >
        <view
          class="w-[36rpx] h-[36rpx] flex flex-row items-center justify-center"
        >
          <image
            class="w-full h-full"
            src="@static/icon_quick_start.png"
            mode="aspectFit"
          />
        </view>
        <text class="text-[#6DD400] text-[36rpx] font-[700]">快速开始</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useProfileStore } from "@/stores/profile";
import { storeToRefs } from "pinia";
import { GameType, supportedLevels } from "@/config/config";
import { ref, watch } from "vue";

const profileStore = useProfileStore();
const { level } = storeToRefs(profileStore);

const activeLevel = ref(level.value?.level || 1);

watch(level, (newVal) => {
  activeLevel.value = newVal?.level || 1;
}, {
  immediate: true,
  deep: true,
});

function handleChangeLevel(level: number) {
  activeLevel.value = level;
}

function goToPlayground() {
  uni.navigateTo({
    url: `/pages/playground/playground?level=${activeLevel.value}&type=${GameType.normal}`,
  });
}
</script>

<style scoped>
.quick_start {
  /* background: linear-gradient(135deg, #6dd400 0%, #4ca600 100%); */
  background: #fff;
}
</style>

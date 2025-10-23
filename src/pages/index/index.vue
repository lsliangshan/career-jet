<template>
  <view class="relative w-full h-full">
    <view class="w-full h-full">
      <swiper class="w-full h-full">
        <swiper-item v-for="item in tabbars" :key="item.name">
          <view class="w-full h-full">
            <text>1</text>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <BottomNav />
  </view>
</template>

<script setup lang="ts">
import BottomNav from "./components/bottom-nav.vue";
import { tabbars } from "@/config/config";
</script>

<style></style>

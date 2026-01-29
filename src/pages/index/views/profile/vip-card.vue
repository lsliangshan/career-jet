<template>
  <view
    class="w-full px-[32rpx] box-border flex flex-row items-center justify-center"
  >
    <view
      class="ultra-luxury-card w-full relative overflow-hidden rounded-[24px] p-6 border-[0.5px] border-svip-gold/40"
    >
      <view class="absolute inset-0 stardust-overlay"></view>
      <view
        class="absolute inset-0 opacity-20 pointer-events-none"
        style="
          background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBk_RwWulS4UjHy4DGXQf9vqX3lxNcLmvwMSA3QMEggG1RZdtZJWLPdhGFiQDJJoEVjBglucKHud0w3lOcU6Mu-wWAZqcCiVb9I4ead5DOkFWCyJtyFhgwUDA4hF0aTXR3X0RlzNWITyr-Uv8GY5g2cggkkFDN9DhRvYvcGXVSamCQ-rV1Vuks7AtrMc6Qu4-9Qh8NqC_J8ttrSqVxksmJid2s5Ar4CxmLTqy0OQ66-MxKXru37ewThI_QhF7XBNMOX7EmhiyU0silV');
        "
      ></view>
      <view class="relative z-10 flex justify-between items-start mb-[24rpx]">
        <view class="flex flex-col">
          <text
            class="text-[10px] tracking-[0.2em] text-[rgba(242,204,13,0.6)] font-bold uppercase mb-1"
            >Elite Membership</text
          >
        </view>
      </view>
      <view class="relative z-10 flex flex-col items-center mb-8">
        <p
          class="text-[11px] text-[rgba(242,204,13,0.5)] font-medium tracking-[0.3em] mb-2"
        >
          当前积分
        </p>
        <view class="flex items-baseline gap-2">
          <h3 class="text-5xl font-serif-elegant font-bold chrome-text">
            2,500
          </h3>
          <text class="text-lg font-serif-elegant chrome-text">积分</text>
        </view>
      </view>
      <view class="relative z-10 px-8 mb-8">
        <view class="flex items-center gap-4">
          <view class="luxury-viewider flex-1"></view>
          <view
            class="size-1.5 rotate-45 border border-svip-gold bg-transparent"
          ></view>
          <view class="luxury-viewider flex-1"></view>
        </view>
      </view>
      <view class="relative z-10 flex justify-center">
        <button
          class="diamond-cut-button w-full py-4 rounded-xl text-black font-bold text-sm tracking-widest active:scale-[0.98] transition-all flex flex-row items-center justify-center gap-[12rpx]"
        >
          <view
            class="w-[32rpx] h-[32rpx] flex flex-row items-center justify-center"
          >
            <svg-icon
              :src="`/static/${iconThemeVersion}/icon_diamond.svg`"
              class="w-full h-full"
              color="#000"
            />
          </view>
          <text class="drop-shadow-sm flex items-center justify-center gap-2">
            立即充值尊享权益
          </text>
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { iconThemeVersion } from "@/config/config";
</script>

<style scoped>
.inspiration-gradient {
  background: linear-gradient(135deg, #f2cc0d 0%, #ff7b5c 100%);
}
.ultra-luxury-card {
  background: radial-gradient(circle at 20% 20%, #2a2a2a 0%, #0a0a0a 100%);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7),
    0 0 1px 1px rgba(230, 175, 46, 0.3);
}
.stardust-overlay {
  background-image: radial-gradient(circle, #ffffff 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.08;
}
.chrome-text {
  background: linear-gradient(
    to bottom,
    #bf953f,
    #fcf6ba,
    #b38728,
    #fbf5b7,
    #aa771c
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.3));
}
.diamond-cut-button {
  background: linear-gradient(
    135deg,
    #bf953f 0%,
    #fcf6ba 45%,
    #b38728 50%,
    #fbf5b7 55%,
    #aa771c 100%
  );
  box-shadow: 0 4px 15px rgba(170, 119, 28, 0.4);
  position: relative;
  overflow: hidden;
}
.diamond-cut-button::after {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  transform: rotate(45deg);
}
.luxury-viewider {
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    #bf953f 50%,
    transparent 100%
  );
}
.emblem-glow {
  filter: drop-shadow(0 0 8px rgba(230, 175, 46, 0.5));
}
</style>

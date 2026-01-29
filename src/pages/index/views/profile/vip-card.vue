<template>
  <view
    class="w-full px-[32rpx] box-border flex flex-row items-center justify-center"
  >
    <view class="ultra-premium-card inner-radius p-6 relative">
      <view class="absolute top-2 right-2 p-4">
        <view class="diamond-badge w-12 h-12 shadow-lg">
          <view class="flex flex-col items-center justify-center -rotate-12">
            <span
              class="material-symbols-outlined !text-[14px] text-black font-black"
              >diamond</span
            >
            <span class="text-[8px] font-black text-black leading-none"
              >SVIP</span
            >
          </view>
        </view>
      </view>
      <view class="relative z-10">
        <view class="flex flex-col mb-6">
          <view class="flex items-center gap-1.5 mb-1">
            <span
              class="text-[10px] text-gold-primary font-bold tracking-[0.2em] uppercase"
              >CURRENT BALANCE</span
            >
          </view>
          <view class="flex items-baseline gap-3">
            <view class="flex items-center gap-2">
              <span
                class="material-symbols-outlined text-gold-primary !text-3xl font-light !fill-1"
                >crown</span
              >
              <span
                class="text-6xl font-serif font-black gold-text-metallic italic tracking-tighter"
                >2,500</span
              >
            </view>
            <span class="text-gold-primary font-bold text-lg">积分</span>
          </view>
        </view>
        <view class="mb-8 max-w-[200px]">
          <view class="flex justify-between items-end mb-2">
            <span
              class="text-[10px] text-cream-secondary font-medium uppercase tracking-wider"
              >Level Progress</span
            >
            <span class="text-[10px] text-gold-primary font-bold">LV.4</span>
          </view>
          <view class="progress-bar-track">
            <view class="progress-bar-active"></view>
          </view>
        </view>
        <view class="flex items-center justify-between">
          <view class="flex items-center gap-3">
            <view
              class="bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-gold-primary/30 flex items-center gap-2"
            >
              <span
                class="material-symbols-outlined !text-[14px] text-gold-primary !fill-1"
                >verified</span
              >
              <span
                class="text-[10px] text-cream-secondary font-bold tracking-wide uppercase"
                >SVIP 终身特权</span
              >
            </view>
          </view>
          <button
            class="glass-gold-button px-7 py-2.5 rounded-full text-white-gold text-sm font-bold active:scale-95 transition-all relative overflow-hidden group"
          >
            <span class="relative z-10 flex items-center gap-2">
              立即充值
              <span class="material-symbols-outlined !text-sm"
                >arrow_forward_ios</span
              >
            </span>
          </button>
        </view>
      </view>
      <view
        class="absolute inset-0 opacity-[0.05] pointer-events-none"
        style="
          background-image: radial-gradient(#e6af2e 0.5px, transparent 0.5px);
          background-size: 24px 24px;
        "
      ></view>
    </view>
  </view>
</template>

<script setup lang="ts"></script>

<style scoped>
.inner-radius {
  border-radius: 16px;
}
.inspiration-gradient {
  background: linear-gradient(135deg, #f2cc0d 0%, #ff7b5c 100%);
}
.ultra-premium-card {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 0 20px 2px rgba(255, 215, 0, 0.1),
    0 10px 30px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(230, 175, 46, 0.2);
}
.gold-text-metallic {
  background: linear-gradient(180deg, #f5d061 0%, #e6af2e 50%, #bf953f 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 2px 1px rgba(0, 0, 0, 0.5));
}
.glass-gold-button {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid #e6af2e;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}
@keyframes pulse-shimmer {
  0%,
  100% {
    opacity: 1;
    transform: scale(1) rotate(12deg);
    filter: brightness(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05) rotate(12deg);
    filter: brightness(1.3);
  }
}
.diamond-badge {
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  background: linear-gradient(135deg, #f5d061 0%, #e6af2e 50%, #bf953f 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse-shimmer 3s ease-in-out infinite;
}
.progress-bar-track {
  background: rgba(191, 149, 63, 0.2);
  height: 2px;
  border-radius: 1px;
  position: relative;
}
.progress-bar-active {
  background: #e6af2e;
  height: 100%;
  width: 65%;
  position: relative;
  box-shadow: 0 0 10px #e6af2e;
}
.progress-bar-active::after {
  content: "";
  position: absolute;
  right: -2px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 4px;
  background: #fff9e3;
  border-radius: 50%;
  box-shadow: 0 0 8px #fff9e3;
}
</style>

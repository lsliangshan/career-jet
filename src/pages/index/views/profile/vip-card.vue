<template>
  <view
    class="w-full px-[32rpx] box-border flex flex-row items-center justify-center transition-opacity duration-300"
    :class="[isFontLoaded ? 'opacity-100' : 'opacity-0']"
  >
    <view
      class="ultra-luxury-card w-full relative overflow-hidden rounded-[24px] px-6 py-4 border-[0.5px] border-svip-gold/40"
    >
      <view class="absolute inset-0 stardust-overlay"></view>
      <view
        class="absolute inset-0 opacity-20 pointer-events-none"
        style="
          background-image: url('https://img.liangqy.com/crawlerjet/picture_book/img/vip_card_bg.png');
        "
      ></view>
      <view class="relative z-10 flex justify-between items-start mb-[24rpx]">
        <view class="flex flex-col">
          <text
            class="text-[10px] tracking-[0.2em] text-[rgba(242,204,13,0.6)] font-[cinzel] font-bold uppercase mb-1"
            >Elite Membership</text
          >
        </view>
      </view>
      <view class="relative z-10 flex flex-col items-center mb-4">
        <text
          class="text-[11px] text-[rgba(242,204,13,0.7)] font-medium tracking-[0.3em] mb-2"
        >
          账户余额
        </text>
        <view class="flex items-baseline gap-2">
          <h3 class="text-5xl font-bold chrome-text">{{ points }}</h3>
          <text class="text-lg font-[cinzel] chrome-text">积分</text>
        </view>
      </view>
      <view class="relative z-10 px-8 mb-4">
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
import { onBeforeMount, ref } from "vue";

defineProps<{
  points: number;
}>();

const isFontLoaded = ref(true);

onBeforeMount(async () => {
  // uni.loadFontFace({
  //   family: "cinzel",
  //   // global: true,
  //   source:
  //     'url("http://img09.zhaopin.com/2012/other/mobile/campus/clive/8vIJ7ww63mVu7gt79mT7PkRXMw.woff2")',
  //   desc: {
  //     weight: "700",
  //   },
  //   complete: () => {
  //     isFontLoaded.value = true;
  //   },
  // });
});
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
  font-family: "cinzel", sans-serif;
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

/* @font-face {
  font-family: "cinzel";
  font-style: normal;
  font-weight: 700;
  src: url(https://img.liangqy.com/crawlerjet/picture_book/font/cinzel2.woff)
    format("woff");
} */
</style>

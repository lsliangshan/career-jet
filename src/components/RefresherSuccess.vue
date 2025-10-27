<template>
  <view
    class="home-refresher-success"
    :class="{ 'home-refresher-success--animation': modelValue }"
  >
    <text class="text-[26rpx] text-[#fff]">{{ refreshText }}</text>
  </view>
</template>

<script setup lang="ts">
import { watch, computed } from "vue";
interface IProps {
  modelValue: boolean;
  text?: string;
}

const props = defineProps<IProps>();
const emit = defineEmits(["update:modelValue"]);

const refreshText = computed(() => {
  return props.text || "列表已更新";
});

// 监听刷新成功动画
watch(
  () => props.modelValue,
  (newval) => {
    if (newval) {
      const timer = setTimeout(() => {
        emit("update:modelValue", false);
        clearTimeout(timer);
      }, 2000);
    }
  },
  {
    immediate: true,
  }
);
</script>

<style>
.home-refresher-success {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 44rpx;
  width: 262rpx;
  height: 60rpx;
  background: #426eff;

  position: absolute;
  top: -100rpx;
  left: 50%;
  z-index: 999;
  margin-left: -130rpx;
  color: #fff;
  transition: transform 0.3s ease-out;
}

.home-refresher-success--animation {
  transform: translateY(164rpx);
}

@keyframes refresher-success {
  0% {
    top: -100rpx;
  }

  30% {
    top: 64rpx;
  }

  70% {
    top: 64rpx;
  }

  100% {
    top: -100rpx;
  }
}

@keyframes refresher-success {
  0% {
    top: -100rpx;
  }

  30% {
    top: 64rpx;
  }

  70% {
    top: 64rpx;
  }

  100% {
    top: -100rpx;
  }
}
</style>

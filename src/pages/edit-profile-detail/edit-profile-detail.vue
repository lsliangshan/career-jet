<template>
  <view class="relative w-full h-full">
    <CustomHeader show-back :title="renderTitle" />
    <Layout hasHeader>
      <view class="w-full h-[80rpx] bg-[#fff] flex flex-row items-center">
        <view class="relative w-full h-full flex flex-row items-center">
          <input
            class="h-full pl-[24rpx] pr-[24rpx] box-border"
            :style="{ width: `calc(100% - 80rpx)` }"
            :value="renderValue"
            ref="inputRef"
            focus
            :placeholder="renderPlaceholder"
            @input="handleInput"
          />
          <view
            class="absolute right-0 top-0 w-[80rpx] h-[80rpx] rounded-[50%] overflow-hidden z-[9] flex flex-row items-center justify-center bg-[#fff] active:bg-[#f8f8f8]"
            @click="clearInput"
            v-if="showClearIcon"
          >
            <text class="text-[36rpx] text-[#888] font-[400]">&times;</text>
          </view>
        </view>
        <view
          class="h-[56rpx] pl-[24rpx] rounded-[8rpx] pr-[24rpx] box-border shrink-0 ml-[12rpx] mr-[12rpx] flex flex-row items-center justify-center transition-all duration-300"
          :class="[
            valueChanged
              ? 'bg-[#42b983] active:bg-[#36ad6a]'
              : 'bg-[#c8c8c8] pointer-events-none',
          ]"
          @click="handleSave"
        >
          <text class="text-[28rpx] text-[#fff]">保存</text>
        </view>
      </view>
    </Layout>
  </view>
</template>

<script setup lang="ts">
import CustomHeader from "@/components/custom-header/custom-header.vue";
import Layout from "@/components/layout/layout.vue";
import { onLoad } from "@dcloudio/uni-app";
import { ProfileDetailType, useUserStore } from "../index/stores/user";
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";

const userStore = useUserStore();
const { loginInfo } = storeToRefs(userStore);

const profileDetailType = ref(ProfileDetailType.NICKNAME);

const inputRef = ref();

const renderValue = ref("");

const showClearIcon = computed(() => {
  if (profileDetailType.value === ProfileDetailType.NICKNAME) {
    return loginInfo.value?.nickname !== "";
  } else if (profileDetailType.value === ProfileDetailType.EMAIL) {
    return loginInfo.value?.email !== "";
  }
  return false;
});

const renderPlaceholder = computed(() => {
  if (profileDetailType.value === ProfileDetailType.NICKNAME) {
    return "请输入昵称";
  } else if (profileDetailType.value === ProfileDetailType.EMAIL) {
    return "请输入邮箱";
  }
  return "";
});

const renderTitle = computed(() => {
  if (profileDetailType.value === ProfileDetailType.NICKNAME) {
    return "修改昵称";
  } else if (profileDetailType.value === ProfileDetailType.EMAIL) {
    return "修改邮箱";
  }
  return "";
});

const valueChanged = computed(() => {
  if (profileDetailType.value === ProfileDetailType.NICKNAME) {
    return renderValue.value !== loginInfo.value?.nickname;
  } else if (profileDetailType.value === ProfileDetailType.EMAIL) {
    return renderValue.value !== loginInfo.value?.email;
  }
  return false;
});

watch(
  profileDetailType,
  (newVal) => {
    if (newVal === ProfileDetailType.NICKNAME) {
      renderValue.value = loginInfo.value?.nickname;
    } else if (newVal === ProfileDetailType.EMAIL) {
      renderValue.value = loginInfo.value?.email;
    }
  },
  {
    immediate: true,
  }
);

onLoad((options) => {
  const type = options?.type as ProfileDetailType | undefined;
  if (!type) {
    uni.navigateBack();
    return;
  }
  profileDetailType.value = type;
});

function clearInput() {
  renderValue.value = "";
}

function handleInput(e: any) {
  renderValue.value = e.detail.value;
}

function handleSave() {
  if (!renderValue.value) {
    uni.showToast({
      title: "请输入内容",
      icon: "none",
    });
    return;
  }
  if (profileDetailType.value === ProfileDetailType.NICKNAME) {
    userStore.updateUserInfo({
      nickname: renderValue.value,
    });
  } else if (profileDetailType.value === ProfileDetailType.EMAIL) {
    userStore.updateUserInfo({
      email: renderValue.value,
    });
  }
  uni.navigateBack({
    complete: () => {
      uni.showToast({
        title: "保存成功",
        icon: "none",
      });
    },
  });
}
</script>

<style scoped></style>

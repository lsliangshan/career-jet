<template>
  <view class="create-picture-book relative w-full h-full">

    <CustomHeader title="创建绘本" show-back title-align="start" />

    <Layout hasHeader>
      <view class="w-full h-full overflow-y-auto">
        <view class="page-bg w-full p-[24rpx] box-border">
          <view
            class="w-full h-full px-[32rpx] py-[32rpx] box-border bg-[#fff] rounded-[24rpx] flex flex-col gap-[32rpx] transition-all duration-300"
            :class="[canGenerate ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-80']">
            <view class="w-full h-[60rpx] flex flex-row items-center justify-start gap-[16rpx]">
              <view class="w-[36rpx] h-[36rpx] flex flex-row items-center justify-center">
                <image src="@static/icon_keyword.png" mode="aspectFill" class="w-full h-full"></image>
              </view>
              <text class="text-[36rpx] font-bold text-[#333]">绘本配置</text>
            </view>

            <view class="w-full h-[168rpx] flex flex-col gap-[16rpx]">
              <view class="w-full h-[64rpx] flex flex-row items-center">
                <text class="text-[32rpx] text-[#666]">绘本主题</text>
              </view>
              <view
                class="w-full h-[88rpx] bg-[#F8F9FF] flex flex-row items-center border border-[#E6E9F0] rounded-[16rpx]"
                :class="[focusElement === 'theme' ? 'custom-input' : '']">
                <picker class="relative h-full flex flex-row items-center"
                  :class="[selectedThemeIndexes[0] === renderMoralityCategory.length - 1 ? 'w-[340rpx]' : 'w-full']"
                  mode="multiSelector" :range="renderMorality" :value="selectedThemeIndexes" @change="handleThemeChange"
                  @columnchange="handleThemeColumnChange">
                  <view
                    class="absolute top-0 left-0 w-full h-full px-[24rpx] box-border flex flex-row items-center justify-between">
                    <text class="text-[#333]"
                      :class="[selectedThemeIndexes[0] === renderMoralityCategory.length - 1 ? 'text-[26rpx]' : 'text-[32rpx]']">{{
                        renderMoralityChild[selectedThemeIndexes[1]] }}</text>

                    <view class="w-[24rpx] h-[24rpx] flex flex-row items-center justify-center">
                      <image src="@static/icon_arraw_right.png" mode="aspectFill" class="w-full h-full rotate-90">
                      </image>
                    </view>
                  </view>
                </picker>
                <template v-if="selectedThemeIndexes[0] === renderMoralityCategory.length - 1">
                  <view class="w-full h-full border-l border-l-[1rpx] border-l-[#E6E9F0]">
                    <input type="text" class="w-full h-full px-[16rpx] box-border" placeholder="请输入绘本主题"
                      placeholder-class="custom-input-placeholder" @focus="focusElement = 'theme'"
                      @blur="focusElement = null" @change="changeCustomTheme">
                  </view>
                </template>
              </view>
            </view>

            <view class="w-full h-[168rpx] flex flex-col gap-[16rpx]">
              <view class="w-full h-[64rpx] flex flex-row items-center">
                <text class="text-[32rpx] text-[#666]">故事风格</text>
              </view>
              <view
                class="w-full h-[88rpx] bg-[#F8F9FF] flex flex-row items-center border border-[#E6E9F0] rounded-[16rpx]"
                :class="[focusElement === 'storyStyle' ? 'custom-input' : '']">
                <picker class="relative h-full flex flex-row items-center"
                  :class="[selectedStoryStyleIndex === renderStoryStyles.length - 1 ? 'w-[340rpx]' : 'w-full']"
                  mode="selector" :range="renderStoryStyles" range-key="name" :value="selectedStoryStyleIndex"
                  @change="handleStoryStylesChange">
                  <view
                    class="absolute top-0 left-0 w-full h-full px-[24rpx] box-border flex flex-row items-center justify-between">
                    <text class="text-[#333]"
                      :class="[selectedStoryStyleIndex === renderStoryStyles.length - 1 ? 'text-[26rpx]' : 'text-[32rpx]']">{{
                        renderStoryStyles[selectedStoryStyleIndex].name }}</text>

                    <view class="w-[24rpx] h-[24rpx] flex flex-row items-center justify-center">
                      <image src="@static/icon_arraw_right.png" mode="aspectFill" class="w-full h-full rotate-90">
                      </image>
                    </view>
                  </view>
                </picker>
                <template v-if="selectedStoryStyleIndex === renderStoryStyles.length - 1">
                  <view class="w-full h-full border-l border-l-[1rpx] border-l-[#E6E9F0]">
                    <input type="text" class="w-full h-full px-[16rpx] box-border" placeholder="请输入绘本主题"
                      placeholder-class="custom-input-placeholder" @focus="focusElement = 'storyStyle'"
                      @blur="focusElement = null" @change="changeCustomStoryStyle">
                  </view>
                </template>
              </view>
            </view>

            <view class="w-full h-[168rpx] flex flex-col gap-[16rpx]">
              <view class="w-full h-[64rpx] flex flex-row items-center">
                <text class="text-[32rpx] text-[#666]">图画风格</text>
              </view>
              <view
                class="w-full h-[88rpx] bg-[#F8F9FF] flex flex-row items-center border border-[#E6E9F0] rounded-[16rpx]"
                :class="[focusElement === 'pictureStyle' ? 'custom-input' : '']">
                <picker class="relative h-full flex flex-row items-center"
                  :class="[selectedPictureStyleIndex === renderPictureStyles.length - 1 ? 'w-[340rpx]' : 'w-full']"
                  mode="selector" :range="renderPictureStyles" range-key="name" :value="selectedPictureStyleIndex"
                  @change="handlePictureStylesChange">
                  <view
                    class="absolute top-0 left-0 w-full h-full px-[24rpx] box-border flex flex-row items-center justify-between">
                    <text class="text-[#333]"
                      :class="[selectedPictureStyleIndex === renderPictureStyles.length - 1 ? 'text-[26rpx]' : 'text-[32rpx]']">{{
                        renderPictureStyles[selectedPictureStyleIndex].name }}</text>

                    <view class="w-[24rpx] h-[24rpx] flex flex-row items-center justify-center">
                      <image src="@static/icon_arraw_right.png" mode="aspectFill" class="w-full h-full rotate-90">
                      </image>
                    </view>
                  </view>
                </picker>
                <template v-if="selectedPictureStyleIndex === renderPictureStyles.length - 1">
                  <view class="w-full h-full border-l border-l-[1rpx] border-l-[#E6E9F0]">
                    <input type="text" class="w-full h-full px-[16rpx] box-border" placeholder="请输入绘本主题"
                      placeholder-class="custom-input-placeholder" @focus="focusElement = 'pictureStyle'"
                      @blur="focusElement = null" @change="changeCustomPictureStyle">
                  </view>
                </template>
              </view>
            </view>

            <view class="w-full h-[168rpx] flex flex-col gap-[16rpx]">
              <view class="w-full h-[64rpx] flex flex-row items-center">
                <text class="text-[32rpx] text-[#666]">故事语言</text>
              </view>
              <view
                class="w-full h-[88rpx] bg-[#F8F9FF] flex flex-row items-center border border-[#E6E9F0] rounded-[16rpx]"
                :class="[focusElement === 'language' ? 'custom-input' : '']">
                <picker class="relative w-full h-full flex flex-row items-center" mode="selector" :range="languages"
                  :value="selectedLanguageIndex" @change="handleLanguageChange">
                  <view
                    class="absolute top-0 left-0 w-full h-full px-[24rpx] box-border flex flex-row items-center justify-between">
                    <text class="text-[32rpx] text-[#333]">{{ languages[selectedLanguageIndex] }}</text>

                    <view class="w-[24rpx] h-[24rpx] flex flex-row items-center justify-center">
                      <image src="@static/icon_arraw_right.png" mode="aspectFill" class="w-full h-full rotate-90">
                      </image>
                    </view>
                  </view>
                </picker>
              </view>
            </view>

            <view class="w-full h-[168rpx] flex flex-col gap-[16rpx]">
              <view class="w-full h-[64rpx] flex flex-row items-center">
                <text class="text-[32rpx] text-[#666]">故事字数（{{ formData.length }}字）</text>
              </view>
              <view class="w-full h-[88rpx] bg-[#F8F9FF] flex flex-row items-center justify-center">
                <slider class="w-full" block-size="20" :activeColor="mainColor" :min="100" :max="1000" step="1"
                  :value="formData.length" @changing="handleLengthChange"></slider>
              </view>
            </view>

            <view class="w-full h-[168rpx] flex flex-col gap-[16rpx]">
              <view class="w-full h-[64rpx] flex flex-row items-center justify-between">
                <text class="text-[32rpx] text-[#666]">角色个数（{{ formData.roleCount === -1 ? '不限制个数' : formData.roleCount
                  + '个'
                  }}）</text>
                <view class="w-[200rpx] h-full flex flex-row items-center gap-[12rpx]">
                  <checkbox-group @change="handleRoleUnlimitedChange">
                    <label>
                      <checkbox value="role-count" :color="mainColor" style="transform:scale(0.6)" :checked="formData.roleCount === -1" />
                      <text class="text-[24rpx] text-[#333]">不限制个数</text>
                    </label>
                  </checkbox-group>
                </view>
              </view>
              <view class="w-full h-[88rpx] bg-[#F8F9FF] flex flex-row items-center justify-center">
                <slider class="w-full" :class="[formData.roleCount === -1 ? 'opacity-50' : '']" :disabled="formData.roleCount === -1" block-size="20" :activeColor="mainColor" :min="2" :max="5" step="1"
                  :value="formData.roleCount" @changing="handleRoleCountChange" @change="handleRoleCountChange"></slider>
              </view>
            </view>

            <view class="w-full h-[168rpx] flex flex-col gap-[16rpx]">
              <view class="w-full h-[64rpx] flex flex-row items-center justify-between">
                <text class="text-[32rpx] text-[#666]">场景个数（{{ formData.sceneCount === -1 ? '不限制个数' : formData.sceneCount
                  + '个'
                  }}）</text>
                <view class="w-[200rpx] h-full flex flex-row items-center gap-[12rpx]">
                  <checkbox-group @change="handleSceneUnlimitedChange">
                    <label>
                      <checkbox value="scene-count" :color="mainColor" style="transform:scale(0.6)" :checked="formData.sceneCount === -1" />
                      <text class="text-[24rpx] text-[#333]">不限制个数</text>
                    </label>
                  </checkbox-group>
                </view>
              </view>
              <view class="w-full h-[88rpx] bg-[#F8F9FF] flex flex-row items-center justify-center">
                <slider class="w-full" :class="[formData.sceneCount === -1 ? 'opacity-50' : '']" :disabled="formData.sceneCount === -1" block-size="20" :activeColor="mainColor" :min="2" :max="20" step="1"
                  :value="formData.sceneCount" @changing="handleSceneCountChange" @change="handleSceneCountChange"></slider>
              </view>
            </view>

            <view class="w-full h-[168rpx] flex flex-col gap-[16rpx]">
              <view class="w-full h-[64rpx] flex flex-row items-center">
                <text class="text-[32rpx] text-[#666]">绘本比例</text>
              </view>
              <view
                class="w-full h-[88rpx] bg-[#F8F9FF] flex flex-row items-center border border-[#E6E9F0] rounded-[16rpx]"
                :class="[focusElement === 'ratio' ? 'custom-input' : '']">
                <picker class="relative w-full h-full flex flex-row items-center" mode="selector" :range="ratios"
                  :value="selectedRatioIndex" @change="handleRatioChange">
                  <view
                    class="absolute top-0 left-0 w-full h-full px-[24rpx] box-border flex flex-row items-center justify-between">
                    <text class="text-[32rpx] text-[#333]">{{ ratios[selectedRatioIndex] }}</text>

                    <view class="w-[24rpx] h-[24rpx] flex flex-row items-center justify-center">
                      <image src="@static/icon_arraw_right.png" mode="aspectFill" class="w-full h-full rotate-90">
                      </image>
                    </view>
                  </view>
                </picker>
              </view>
            </view>

            <view
              class="w-full h-[112rpx] flex flex-row items-center justify-center bg-[#F8F9FF] border border-[#E6E9F0] rounded-[16rpx]">
              <view class="w-full h-full px-[24rpx] box-border flex flex-row items-center justify-between">
                <text class="text-[32rpx] text-[#666]">自动确认故事内容</text>
                <switch :checked="formData.autoConfirmedStory" :color="mainColor" style="transform:scale(0.6); transform-origin: right;" @change="changeAutoConfirmedStory" />
              </view>
            </view>

            <view
              class="w-full h-[112rpx] flex flex-row items-center justify-center bg-[#F8F9FF] border border-[#E6E9F0] rounded-[16rpx]">
              <view class="w-full h-full px-[24rpx] box-border flex flex-row items-center justify-between">
                <text class="text-[32rpx] text-[#666]">自动确认故事角色</text>
                <switch :checked="formData.autoConfirmedRole" :color="mainColor" style="transform:scale(0.6); transform-origin: right;" @change="changeAutoConfirmedRole" />
              </view>
            </view>

            <view
              class="w-full h-[112rpx] flex flex-row items-center justify-center bg-[#F8F9FF] border border-[#E6E9F0] rounded-[16rpx]">
              <view class="w-full h-full px-[24rpx] box-border flex flex-row items-center justify-between">
                <text class="text-[32rpx] text-[#666]">自动确认故事场景</text>
                <switch :checked="formData.autoConfirmedScene" :color="mainColor" style="transform:scale(0.6); transform-origin: right;" @change="changeAutoConfirmedScene" />
              </view>
            </view>

            <view class="w-full h-[112rpx] mt-[12rpx] rounded-[24rpx] flex flex-row items-center justify-center gap-[16rpx] transition-all duration-300"
            :class="[canGenerate ? 'generate-btn-active active:scale-95' : 'generate-btn-disabled']" @click="generate">
              <template v-if="canGenerate">
                <view class="w-[40rpx] h-[40rpx] flex flex-row items-center justify-center">
                  <image src="@static/icon_hot.png" mode="aspectFill" class="w-full h-full"></image>
                </view>

                <text class="text-[32rpx] text-[#fff] font-bold">开始创作绘本</text>
              </template>
              <template v-else>
                <view class="w-[40rpx] h-[40rpx]  flex flex-row items-center justify-center">
                  <image src="@static/icon_loading_white.png" mode="aspectFill" class="w-full h-full animate-spin"></image>
                </view>

                <text class="text-[32rpx] text-[#fff] font-bold">绘本生成中</text>
              </template>
            </view>

          </view>

          <view class="w-full" :style="{ height: `${safeBottom}px` }"></view>
        </view>
      </view>
    </Layout>
  </view>
</template>

<script setup lang="ts">
import CustomHeader from "@/components/custom-header/custom-header.vue";
import Layout from "@/components/layout/layout.vue";
import { computed, onMounted, ref } from "vue";
import { moralities, authors, languages, ratios } from "@/config/config";

enum GenerateStep {
  // 未开始
  unstart = 'unstart',
  // 生成中
  generating = 'generating',
  // 确认故事
  confirmStory = 'confirmStory',
  // 确认角色
  confirmRole = 'confirmRole',
  // 确认场景
  confirmScene = 'confirmScene',
  // 失败
  failed = 'failed',
  // 完成
  finished = 'finished',
}

const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;

const mainColor = ref('#FF7BAC');

const formData = ref({
  theme: '诚实与正直',
  storyStyle: '李欧·李奥尼‌',
  pictureStyle: '李欧·李奥尼‌',
  length: 500,
  language: '英文',
  roleCount: -1,
  sceneCount: -1,
  ratio: '16:9',
  autoConfirmedStory: false,
  autoConfirmedRole: false,
  autoConfirmedScene: false,
});

const selectedThemeIndexes = ref<number[]>([0, 0]);
const selectedStoryStyleIndex = ref<number>(0);
const selectedPictureStyleIndex = ref<number>(0);
const selectedLanguageIndex = ref<number>(0);
const selectedRatioIndex = ref<number>(0);

const focusElement = ref<string | null>(null);

// 绘本生成中
const isGenerating = ref(false);

const generateStep = ref<GenerateStep>(GenerateStep.unstart);

const renderMoralityCategory = computed(() => {
  return moralities.map(item => item.name).concat('自定义');
})

const renderMoralityChild = computed(() => {
  if (selectedThemeIndexes.value[0] === moralities.length) {
    return ['自定义输入'];
  }
  return moralities[selectedThemeIndexes.value[0]].children.map(item => item.name);
})

const renderMorality = computed(() => {
  return [renderMoralityCategory.value, renderMoralityChild.value];
})

const renderStoryStyles = computed(() => {
  return authors.concat({
    name: '自定义输入',
    name_en: 'custom',
  });
})

const renderPictureStyles = computed(() => {
  return authors.concat({
    name: '自定义输入',
    name_en: 'custom',
  });
})

const canGenerate = computed(() => {
  return generateStep.value === GenerateStep.unstart || generateStep.value === GenerateStep.failed || generateStep.value === GenerateStep.finished;
})

onMounted(() => {
  initData();
})

function initData() {
  selectedLanguageIndex.value = languages.findIndex(item => item === formData.value.language);
  if (selectedLanguageIndex.value === -1) {
    selectedLanguageIndex.value = 0;
  }

  selectedRatioIndex.value = ratios.findIndex(item => item === formData.value.ratio);
  if (selectedRatioIndex.value === -1) {
    selectedRatioIndex.value = 8;
  }
}

function handleThemeChange(e: any) {
  selectedThemeIndexes.value = e.detail.value;
  if (selectedThemeIndexes.value[0] === renderMoralityCategory.value.length - 1) {
    // 自定义
    formData.value.theme = '';
  } else {
    formData.value.theme = moralities[selectedThemeIndexes.value[0]].children[selectedThemeIndexes.value[1]].name;
  }
}

function changeCustomTheme(e: any) {
  if (selectedThemeIndexes.value[0] === renderMoralityCategory.value.length - 1) {
    formData.value.theme = e.detail.value;
  }
}

function changeCustomStoryStyle(e: any) {
  if (selectedStoryStyleIndex.value === renderStoryStyles.value.length - 1) {
    formData.value.storyStyle = e.detail.value;
  }
}

function changeCustomPictureStyle(e: any) {
  if (selectedPictureStyleIndex.value === renderPictureStyles.value.length - 1) {
    formData.value.pictureStyle = e.detail.value;
  }
}

function handleThemeColumnChange(e: any) {
  selectedThemeIndexes.value[e.detail.column] = e.detail.value;
  if (e.detail.column === 0) {
    selectedThemeIndexes.value[1] = 0;
  }
}

function handleStoryStylesChange(e: any) {
  selectedStoryStyleIndex.value = Number(e.detail.value);
  if (selectedStoryStyleIndex.value === renderStoryStyles.value.length - 1) {
    formData.value.storyStyle = '';
  } else {
    formData.value.storyStyle = authors[selectedStoryStyleIndex.value].name;
  }
}

function handlePictureStylesChange(e: any) {
  selectedPictureStyleIndex.value = Number(e.detail.value);
  if (selectedPictureStyleIndex.value === renderPictureStyles.value.length - 1) {
    formData.value.pictureStyle = '';
  } else {
    formData.value.pictureStyle = authors[selectedPictureStyleIndex.value].name;
  }
}

function handleLanguageChange(e: any) {
  selectedLanguageIndex.value = Number(e.detail.value);
  formData.value.language = languages[selectedLanguageIndex.value];
}

function handleRatioChange(e: any) {
  selectedRatioIndex.value = Number(e.detail.value);
  formData.value.ratio = ratios[selectedRatioIndex.value];
}

function handleLengthChange(e: any) {
  formData.value.length = Number(e.detail.value);
}

function handleRoleUnlimitedChange(e: any) {
  if (e.detail.value.includes('role-count')) {
    formData.value.roleCount = -1;
  } else {
    formData.value.roleCount = 3;
  }
}

function handleRoleCountChange(e: any) {
  formData.value.roleCount = Number(e.detail.value);
}

function handleSceneUnlimitedChange(e: any) {
  if (e.detail.value.includes('scene-count')) {
    formData.value.sceneCount = -1;
  } else {
    formData.value.sceneCount = 8;
  }
}

function handleSceneCountChange(e: any) {
  formData.value.sceneCount = Number(e.detail.value);
}

function changeAutoConfirmedStory(e: any) {
  formData.value.autoConfirmedStory = e.detail.value;
}

function changeAutoConfirmedRole(e: any) {
  formData.value.autoConfirmedRole = e.detail.value;
}

function changeAutoConfirmedScene(e: any) {
  formData.value.autoConfirmedScene = e.detail.value;
}

function generate() {
  console.log('>>>> formData: ', formData.value)
  if (generateStep.value === GenerateStep.unstart || generateStep.value === GenerateStep.failed || generateStep.value === GenerateStep.finished) {
    generateStep.value = GenerateStep.generating;
  }
  
}
</script>

<style lang="scss" scoped>
.page-bg {
  background: linear-gradient(135deg, #FFE6EE 0%, #E6F0FF 100%);
}

.custom-input {
  outline: none;
  border-color: #FF7BAC;
  box-shadow: 0 0 0 3px rgba(255, 123, 172, 0.1);
}

:deep(.custom-input-placeholder) {
  color: #c8c8c8;
}

.generate-btn-active {
  background: linear-gradient(135deg, #FF7BAC 0%, #5D9CEC 100%);
  box-shadow: 0 6rpx 20rpx rgba(255, 123, 172, 0.3);
}

.generate-btn-disabled {
  background: linear-gradient(135deg, #CCCCCC, #AAAAAA);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}
</style>
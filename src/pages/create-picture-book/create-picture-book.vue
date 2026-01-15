<template>
  <view class="create-picture-book relative w-full h-full">
    <CustomHeader title="创建绘本" show-back title-align="start" />

    <Layout hasHeader>
      <scroll-view
        type="custom"
        scroll-y
        class="w-full h-full overflow-y-auto"
        :scroll-with-animation="!focusedNode"
        :scroll-into-view="scrollToElementId"
      >
        <view class="page-bg w-full p-[24rpx] box-border">
          <view
            class="w-full h-full px-[32rpx] py-[32rpx] box-border bg-[#fff] rounded-[24rpx] flex flex-col gap-[32rpx] transition-all duration-300"
            :class="[
              canGenerate
                ? 'pointer-events-auto opacity-100'
                : 'pointer-events-none opacity-80',
            ]"
            v-if="true"
          >
            <view
              class="w-full h-[60rpx] flex flex-row items-center justify-start gap-[16rpx]"
            >
              <view
                class="w-[36rpx] h-[36rpx] flex flex-row items-center justify-center"
              >
                <image
                  src="@static/icon_keyword.png"
                  mode="aspectFill"
                  class="w-full h-full"
                ></image>
              </view>
              <text class="text-[36rpx] font-bold text-[#333]">绘本配置</text>
            </view>

            <view
              class="w-full h-[168rpx] flex flex-col gap-[16rpx]"
              id="picture-book-theme"
            >
              <view class="w-full h-[64rpx] flex flex-row items-center">
                <text class="text-[32rpx] text-[#666]">绘本主题</text>
              </view>
              <view
                class="w-full h-[88rpx] bg-[#F8F9FF] flex flex-row items-center border border-[#E6E9F0] rounded-[16rpx]"
                :class="[focusElement === 'theme' ? 'custom-input' : '']"
              >
                <picker
                  class="relative h-full flex flex-row items-center"
                  :class="[
                    selectedThemeIndexes[0] ===
                    renderMoralityCategory.length - 1
                      ? 'w-[340rpx]'
                      : 'w-full',
                  ]"
                  mode="multiSelector"
                  :range="renderMorality"
                  :value="selectedThemeIndexes"
                  @change="handleThemeChange"
                  @columnchange="handleThemeColumnChange"
                >
                  <view
                    class="absolute top-0 left-0 w-full h-full px-[24rpx] box-border flex flex-row items-center justify-between"
                  >
                    <text
                      class="text-[#333]"
                      :class="[
                        selectedThemeIndexes[0] ===
                        renderMoralityCategory.length - 1
                          ? 'text-[26rpx]'
                          : 'text-[32rpx]',
                      ]"
                      >{{ renderMoralityChild[selectedThemeIndexes[1]] }}</text
                    >

                    <view
                      class="w-[24rpx] h-[24rpx] flex flex-row items-center justify-center"
                    >
                      <image
                        src="@static/icon_arraw_right.png"
                        mode="aspectFill"
                        class="w-full h-full rotate-90"
                      >
                      </image>
                    </view>
                  </view>
                </picker>
                <template
                  v-if="
                    selectedThemeIndexes[0] ===
                    renderMoralityCategory.length - 1
                  "
                >
                  <view
                    class="w-full h-full border-l border-l-[1rpx] border-l-[#E6E9F0]"
                  >
                    <input
                      type="text"
                      class="w-full h-full px-[16rpx] box-border"
                      placeholder="请输入绘本主题"
                      placeholder-class="custom-input-placeholder"
                      :focus="focusedNode === 'theme'"
                      @focus="focusElement = 'theme'"
                      @blur="focusElement = null"
                      @change="changeCustomTheme"
                    />
                  </view>
                </template>
              </view>
            </view>

            <view
              class="w-full h-[168rpx] flex flex-col gap-[16rpx]"
              id="picture-book-story-style"
            >
              <view class="w-full h-[64rpx] flex flex-row items-center">
                <text class="text-[32rpx] text-[#666]">故事风格</text>
              </view>
              <view
                class="w-full h-[88rpx] bg-[#F8F9FF] flex flex-row items-center border border-[#E6E9F0] rounded-[16rpx]"
                :class="[focusElement === 'storyStyle' ? 'custom-input' : '']"
              >
                <picker
                  class="relative h-full flex flex-row items-center"
                  :class="[
                    selectedStoryStyleIndex === renderStoryStyles.length - 1
                      ? 'w-[340rpx]'
                      : 'w-full',
                  ]"
                  mode="selector"
                  :range="renderStoryStyles"
                  range-key="name"
                  :value="selectedStoryStyleIndex"
                  @change="handleStoryStylesChange"
                >
                  <view
                    class="absolute top-0 left-0 w-full h-full px-[24rpx] box-border flex flex-row items-center justify-between"
                  >
                    <text
                      class="text-[#333]"
                      :class="[
                        selectedStoryStyleIndex === renderStoryStyles.length - 1
                          ? 'text-[26rpx]'
                          : 'text-[32rpx]',
                      ]"
                      >{{
                        renderStoryStyles[selectedStoryStyleIndex].name
                      }}</text
                    >

                    <view
                      class="w-[24rpx] h-[24rpx] flex flex-row items-center justify-center"
                    >
                      <image
                        src="@static/icon_arraw_right.png"
                        mode="aspectFill"
                        class="w-full h-full rotate-90"
                      >
                      </image>
                    </view>
                  </view>
                </picker>
                <template
                  v-if="
                    selectedStoryStyleIndex === renderStoryStyles.length - 1
                  "
                >
                  <view
                    class="w-full h-full border-l border-l-[1rpx] border-l-[#E6E9F0]"
                  >
                    <input
                      type="text"
                      class="w-full h-full px-[16rpx] box-border"
                      placeholder="请输入绘本主题"
                      placeholder-class="custom-input-placeholder"
                      :focus="focusedNode === 'storyStyle'"
                      @focus="focusElement = 'storyStyle'"
                      @blur="focusElement = null"
                      @change="changeCustomStoryStyle"
                    />
                  </view>
                </template>
              </view>
            </view>

            <view
              class="w-full h-[168rpx] flex flex-col gap-[16rpx]"
              id="picture-book-picture-style"
            >
              <view class="w-full h-[64rpx] flex flex-row items-center">
                <text class="text-[32rpx] text-[#666]">图画风格</text>
              </view>
              <view
                class="w-full h-[88rpx] bg-[#F8F9FF] flex flex-row items-center border border-[#E6E9F0] rounded-[16rpx]"
                :class="[focusElement === 'pictureStyle' ? 'custom-input' : '']"
              >
                <picker
                  class="relative h-full flex flex-row items-center"
                  :class="[
                    selectedPictureStyleIndex === renderPictureStyles.length - 1
                      ? 'w-[340rpx]'
                      : 'w-full',
                  ]"
                  mode="selector"
                  :range="renderPictureStyles"
                  range-key="name"
                  :value="selectedPictureStyleIndex"
                  @change="handlePictureStylesChange"
                >
                  <view
                    class="absolute top-0 left-0 w-full h-full px-[24rpx] box-border flex flex-row items-center justify-between"
                  >
                    <text
                      class="text-[#333]"
                      :class="[
                        selectedPictureStyleIndex ===
                        renderPictureStyles.length - 1
                          ? 'text-[26rpx]'
                          : 'text-[32rpx]',
                      ]"
                      >{{
                        renderPictureStyles[selectedPictureStyleIndex].name
                      }}</text
                    >

                    <view
                      class="w-[24rpx] h-[24rpx] flex flex-row items-center justify-center"
                    >
                      <image
                        src="@static/icon_arraw_right.png"
                        mode="aspectFill"
                        class="w-full h-full rotate-90"
                      >
                      </image>
                    </view>
                  </view>
                </picker>
                <template
                  v-if="
                    selectedPictureStyleIndex === renderPictureStyles.length - 1
                  "
                >
                  <view
                    class="w-full h-full border-l border-l-[1rpx] border-l-[#E6E9F0]"
                  >
                    <input
                      type="text"
                      class="w-full h-full px-[16rpx] box-border"
                      placeholder="请输入绘本主题"
                      placeholder-class="custom-input-placeholder"
                      :focus="focusedNode === 'pictureStyle'"
                      @focus="focusElement = 'pictureStyle'"
                      @blur="focusElement = null"
                      @change="changeCustomPictureStyle"
                    />
                  </view>
                </template>
              </view>
            </view>

            <view
              class="w-full h-[168rpx] flex flex-col gap-[16rpx]"
              id="picture-book-language"
            >
              <view class="w-full h-[64rpx] flex flex-row items-center">
                <text class="text-[32rpx] text-[#666]">故事语言</text>
              </view>
              <view
                class="w-full h-[88rpx] bg-[#F8F9FF] flex flex-row items-center border border-[#E6E9F0] rounded-[16rpx]"
                :class="[focusElement === 'language' ? 'custom-input' : '']"
              >
                <picker
                  class="relative w-full h-full flex flex-row items-center"
                  mode="selector"
                  :range="languages"
                  :value="selectedLanguageIndex"
                  @change="handleLanguageChange"
                >
                  <view
                    class="absolute top-0 left-0 w-full h-full px-[24rpx] box-border flex flex-row items-center justify-between"
                  >
                    <text class="text-[32rpx] text-[#333]">{{
                      languages[selectedLanguageIndex]
                    }}</text>

                    <view
                      class="w-[24rpx] h-[24rpx] flex flex-row items-center justify-center"
                    >
                      <image
                        src="@static/icon_arraw_right.png"
                        mode="aspectFill"
                        class="w-full h-full rotate-90"
                      >
                      </image>
                    </view>
                  </view>
                </picker>
              </view>
            </view>

            <view
              class="w-full h-[168rpx] flex flex-col gap-[16rpx]"
              id="picture-book-length"
            >
              <view class="w-full h-[64rpx] flex flex-row items-center">
                <text class="text-[32rpx] text-[#666]"
                  >故事字数（{{ formData.length }}字）</text
                >
              </view>
              <view
                class="w-full h-[88rpx] bg-[#F8F9FF] flex flex-row items-center justify-center"
              >
                <slider
                  class="w-full"
                  block-size="20"
                  :activeColor="mainColor"
                  :min="100"
                  :max="1000"
                  step="1"
                  :value="formData.length"
                  @changing="handleLengthChange"
                  @change="handleLengthChange"
                ></slider>
              </view>
            </view>

            <view
              class="w-full h-[168rpx] flex flex-col gap-[16rpx]"
              id="picture-book-role-count"
            >
              <view
                class="w-full h-[64rpx] flex flex-row items-center justify-between"
              >
                <text class="text-[32rpx] text-[#666]"
                  >角色个数（{{
                    formData.roleCount === -1
                      ? "不限制个数"
                      : formData.roleCount + "个"
                  }}）</text
                >
                <view
                  class="w-[200rpx] h-full flex flex-row items-center gap-[12rpx]"
                >
                  <checkbox-group @change="handleRoleUnlimitedChange">
                    <label>
                      <checkbox
                        value="role-count"
                        :color="mainColor"
                        style="transform: scale(0.6)"
                        :checked="formData.roleCount === -1"
                      />
                      <text class="text-[24rpx] text-[#333]">不限制个数</text>
                    </label>
                  </checkbox-group>
                </view>
              </view>
              <view
                class="w-full h-[88rpx] bg-[#F8F9FF] flex flex-row items-center justify-center"
              >
                <slider
                  class="w-full"
                  :class="[formData.roleCount === -1 ? 'opacity-50' : '']"
                  :disabled="formData.roleCount === -1"
                  block-size="20"
                  :activeColor="mainColor"
                  :min="2"
                  :max="5"
                  step="1"
                  :value="formData.roleCount"
                  @changing="handleRoleCountChange"
                  @change="handleRoleCountChange"
                ></slider>
              </view>
            </view>

            <view
              class="w-full h-[168rpx] flex flex-col gap-[16rpx]"
              id="picture-book-scene-count"
            >
              <view
                class="w-full h-[64rpx] flex flex-row items-center justify-between"
              >
                <text class="text-[32rpx] text-[#666]"
                  >场景个数（{{
                    formData.sceneCount === -1
                      ? "不限制个数"
                      : formData.sceneCount + "个"
                  }}）</text
                >
                <view
                  class="w-[200rpx] h-full flex flex-row items-center gap-[12rpx]"
                >
                  <checkbox-group @change="handleSceneUnlimitedChange">
                    <label>
                      <checkbox
                        value="scene-count"
                        :color="mainColor"
                        style="transform: scale(0.6)"
                        :checked="formData.sceneCount === -1"
                      />
                      <text class="text-[24rpx] text-[#333]">不限制个数</text>
                    </label>
                  </checkbox-group>
                </view>
              </view>
              <view
                class="w-full h-[88rpx] bg-[#F8F9FF] flex flex-row items-center justify-center"
              >
                <slider
                  class="w-full"
                  :class="[formData.sceneCount === -1 ? 'opacity-50' : '']"
                  :disabled="formData.sceneCount === -1"
                  block-size="20"
                  :activeColor="mainColor"
                  :min="2"
                  :max="20"
                  step="1"
                  :value="formData.sceneCount"
                  @changing="handleSceneCountChange"
                  @change="handleSceneCountChange"
                ></slider>
              </view>
            </view>

            <view
              class="w-full h-[168rpx] flex flex-col gap-[16rpx]"
              id="picture-book-ratio"
            >
              <view class="w-full h-[64rpx] flex flex-row items-center">
                <text class="text-[32rpx] text-[#666]">绘本比例</text>
              </view>
              <view
                class="w-full h-[88rpx] bg-[#F8F9FF] flex flex-row items-center border border-[#E6E9F0] rounded-[16rpx]"
                :class="[focusElement === 'ratio' ? 'custom-input' : '']"
              >
                <picker
                  class="relative w-full h-full flex flex-row items-center"
                  mode="selector"
                  :range="ratios"
                  :value="selectedRatioIndex"
                  @change="handleRatioChange"
                >
                  <view
                    class="absolute top-0 left-0 w-full h-full px-[24rpx] box-border flex flex-row items-center justify-between"
                  >
                    <text class="text-[32rpx] text-[#333]">{{
                      ratios[selectedRatioIndex]
                    }}</text>

                    <view
                      class="w-[24rpx] h-[24rpx] flex flex-row items-center justify-center"
                    >
                      <image
                        src="@static/icon_arraw_right.png"
                        mode="aspectFill"
                        class="w-full h-full rotate-90"
                      >
                      </image>
                    </view>
                  </view>
                </picker>
              </view>
            </view>

            <view
              class="w-full h-[112rpx] flex flex-row items-center justify-center bg-[#F8F9FF] border border-[#E6E9F0] rounded-[16rpx]"
            >
              <view
                class="w-full h-full px-[24rpx] box-border flex flex-row items-center justify-between"
              >
                <text class="text-[32rpx] text-[#666]">自动确认故事内容</text>
                <switch
                  :checked="formData.autoConfirmedStory"
                  :color="mainColor"
                  style="transform: scale(0.6); transform-origin: right"
                  @change="changeAutoConfirmedStory"
                />
              </view>
            </view>

            <view
              class="w-full h-[112rpx] flex flex-row items-center justify-center bg-[#F8F9FF] border border-[#E6E9F0] rounded-[16rpx]"
            >
              <view
                class="w-full h-full px-[24rpx] box-border flex flex-row items-center justify-between"
              >
                <text class="text-[32rpx] text-[#666]">自动确认故事角色</text>
                <switch
                  :checked="formData.autoConfirmedRole"
                  :color="mainColor"
                  style="transform: scale(0.6); transform-origin: right"
                  @change="changeAutoConfirmedRole"
                />
              </view>
            </view>

            <view
              class="w-full h-[112rpx] flex flex-row items-center justify-center bg-[#F8F9FF] border border-[#E6E9F0] rounded-[16rpx]"
            >
              <view
                class="w-full h-full px-[24rpx] box-border flex flex-row items-center justify-between"
              >
                <text class="text-[32rpx] text-[#666]">自动确认故事场景</text>
                <switch
                  :checked="formData.autoConfirmedScene"
                  :color="mainColor"
                  style="transform: scale(0.6); transform-origin: right"
                  @change="changeAutoConfirmedScene"
                />
              </view>
            </view>

            <view
              class="w-full h-[112rpx] flex flex-row items-center justify-center bg-[#F8F9FF] border border-[#E6E9F0] rounded-[16rpx]"
            >
              <view
                class="w-full h-full px-[24rpx] box-border flex flex-row items-center justify-between"
              >
                <text class="text-[32rpx] text-[#666]">自动确认故事封面</text>
                <switch
                  :checked="formData.autoConfirmedCover"
                  :color="mainColor"
                  style="transform: scale(0.6); transform-origin: right"
                  @change="changeAutoConfirmedCover"
                />
              </view>
            </view>
          </view>
          <view
            class="w-full h-[160rpx] mt-[12rpx] flex flex-row items-center justify-center"
          >
            <view
              class="w-full h-[112rpx] rounded-[24rpx] flex flex-row items-center justify-center gap-[16rpx] transition-all duration-300"
              :class="[
                canGenerate
                  ? 'generate-btn-active active:scale-95'
                  : 'generate-btn-disabled',
              ]"
              @click="generate"
            >
              <template v-if="canGenerate">
                <view
                  class="w-[40rpx] h-[40rpx] flex flex-row items-center justify-center"
                >
                  <image
                    src="@static/icon_hot.png"
                    mode="aspectFill"
                    class="w-full h-full"
                  ></image>
                </view>

                <text class="text-[32rpx] text-[#fff] font-bold"
                  >开始创作绘本</text
                >
              </template>
              <template v-else>
                <!-- <view
                  class="w-[40rpx] h-[40rpx] flex flex-row items-center justify-center"
                >
                  <image
                    src="@static/icon_loading_white.png"
                    mode="aspectFill"
                    class="w-full h-full animate-spin"
                  ></image>
                </view> -->

                <text class="text-[32rpx] text-[#fff] font-bold"
                  >绘本生成中</text
                >
              </template>
            </view>
          </view>

          <transition name="fade">
            <view
              id="picture-book-generate-panel"
              class="sticky top-0 left-0 w-full py-[24rpx] box-border"
              v-if="!canGenerate"
            >
              <view
                class="w-full h-full py-[32rpx] box-border rounded-[24rpx] border border-dashed border-[1rpx] bg-[#fff] flex flex-col items-center justify-center gap-[16rpx]"
                :style="{ borderColor: mainColor }"
              >
                <div class="spinner">
                  <div class="spinner-inner"></div>
                  <div class="spinner-inner"></div>
                </div>
                <h3 class="text-[36rpx] text-[#333]">
                  正在创作【{{ formData.theme }}】的绘本...
                </h3>
                <p
                  class="text-[32rpx] text-[#666]"
                  v-if="generateStep === GenerateStep.generating"
                >
                  正在生成【{{ formData.theme }}】的故事
                </p>
                <p
                  class="text-[32rpx] text-[#666]"
                  v-else-if="generateStep === GenerateStep.confirmStory"
                >
                  请确认故事内容
                </p>
                <p
                  class="text-[32rpx] text-[#666]"
                  v-else-if="generateStep === GenerateStep.confirmRoles"
                >
                  请确认角色
                </p>
                <p
                  class="text-[32rpx] text-[#666]"
                  v-else-if="generateStep === GenerateStep.confirmScenes"
                >
                  请确认场景
                </p>
                <p
                  class="text-[32rpx] text-[#666]"
                  v-else-if="generateStep === GenerateStep.confirmCover"
                >
                  请确认封面
                </p>
              </view>
            </view>
          </transition>

          <!-- <ConfirmScenesModal
            :info="modalData?.data"
            :ratio="formData.ratio"
            :picture-style="formData.pictureStyle"
            @on-cancel="handleCancelConfirm"
            @on-confirm="handleConfirmedRole"
          /> -->

          <!-- <ConfirmCoverModal
            v-if="modalData?.data"
            :info="modalData?.data"
            :ratio="formData.ratio"
            :picture-style="formData.pictureStyle"
            @on-cancel="handleCancelConfirm"
            @on-confirm="handleConfirmedCover"
          /> -->

          <view class="w-full h-[4000rpx]"></view>
          <view class="w-full" :style="{ height: `${safeBottom}px` }"></view>
        </view>
      </scroll-view>
    </Layout>

    <page-container
      :show="modalVisible"
      z-index="999"
      round
      overlay-style="background-color: rgba(0,0,0,0.05);"
      custom-style="background-color: transparent;"
    >
      <ConfirmStoryModal
        :info="modalData?.data"
        v-if="modalData?.component === EModalComponent.CONFIRM_STORY_MODAL"
        @on-confirm="handleConfirmedStory"
        @on-regenerate="handleRegenerateStory"
        @on-cancel="handleCancelConfirm"
      />

      <ConfirmRolesModal
        :info="modalData?.data"
        :ratio="formData.ratio"
        :picture-style="formData.pictureStyle"
        v-else-if="modalData?.component === EModalComponent.CONFIRM_ROLES_MODAL"
        @on-cancel="handleCancelConfirm"
        @on-confirm="handleConfirmedRole"
      />

      <ConfirmScenesModal
        :info="modalData?.data"
        :ratio="formData.ratio"
        :picture-style="formData.pictureStyle"
        v-else-if="
          modalData?.component === EModalComponent.CONFIRM_SCENES_MODAL
        "
        @on-cancel="handleCancelConfirm"
        @on-confirm="handleConfirmedScene"
      />

      <ConfirmCoverModal
        :info="modalData?.data"
        :ratio="formData.ratio"
        :picture-style="formData.pictureStyle"
        v-else-if="modalData?.component === EModalComponent.CONFIRM_COVER_MODAL"
        @on-cancel="handleCancelConfirm"
        @on-confirm="handleConfirmedCover"
      />
    </page-container>
  </view>
</template>

<script setup lang="ts">
import CustomHeader from "@/components/custom-header/custom-header.vue";
import Layout from "@/components/layout/layout.vue";
import { computed, nextTick, onMounted, ref } from "vue";
import {
  moralities,
  authors,
  languages,
  ratios,
  mainColor,
} from "@/config/config";
import { requestGeneratePictureBook } from "@/request";
import { EModalComponent } from "./modals/types";
import ConfirmStoryModal from "./modals/ConfirmStoryModal.vue";
import { EConfirmAction } from "./types";
import ConfirmRolesModal from "./modals/ConfirmRolesModal.vue";
import ConfirmScenesModal from "./modals/ConfirmScenesModal.vue";
import ConfirmCoverModal from "./modals/ConfirmCoverModal.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

enum GenerateStep {
  // 未开始
  unstart = "unstart",
  // 生成中
  generating = "generating",
  // 确认故事
  confirmStory = "confirm-story",
  // 确认角色
  confirmRoles = "confirm-roles",
  // 确认场景
  confirmScenes = "confirm-scenes",
  // 确认封面
  confirmCover = "confirm-cover",
  // 失败
  failed = "failed",
  // 完成
  finished = "finished",
}

const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;

const userStore = useUserStore();
const { loginInfo, isLoggedIn } = storeToRefs(userStore);

const formData = ref({
  theme: "诚实与正直",
  storyStyle: "李欧·李奥尼‌",
  pictureStyle: "李欧·李奥尼‌",
  length: 500,
  language: "中文",
  roleCount: -1,
  sceneCount: -1,
  ratio: "16:9",
  autoConfirmedStory: false,
  autoConfirmedRole: false,
  autoConfirmedScene: false,
  autoConfirmedCover: false,
});

const selectedThemeIndexes = ref<number[]>([0, 0]);
const selectedStoryStyleIndex = ref<number>(0);
const selectedPictureStyleIndex = ref<number>(0);
const selectedLanguageIndex = ref<number>(0);
const selectedRatioIndex = ref<number>(0);

const focusElement = ref<string | null>(null);

const focusedNode = ref<string | null>(null);

const modalVisible = ref(false);
const modalData = ref<{
  component?: string;
  [key: string]: any;
}>();

const generateStep = ref<GenerateStep>(GenerateStep.unstart);

const scrollToElementId = ref<string>("");

const renderMoralityCategory = computed(() => {
  return moralities.map((item) => item.name).concat("自定义");
});

const renderMoralityChild = computed(() => {
  if (selectedThemeIndexes.value[0] === moralities.length) {
    return ["自定义输入"];
  }
  return moralities[selectedThemeIndexes.value[0]].children.map(
    (item) => item.name
  );
});

const renderMorality = computed(() => {
  return [renderMoralityCategory.value, renderMoralityChild.value];
});

const renderStoryStyles = computed(() => {
  return authors.concat({
    name: "自定义输入",
    name_en: "custom",
  });
});

const renderPictureStyles = computed(() => {
  return authors.concat({
    name: "自定义输入",
    name_en: "custom",
  });
});

const canGenerate = computed(() => {
  return (
    generateStep.value === GenerateStep.unstart ||
    generateStep.value === GenerateStep.failed ||
    generateStep.value === GenerateStep.finished
  );
});

onMounted(() => {
  initData();
});

function initData() {
  selectedLanguageIndex.value = languages.findIndex(
    (item) => item === formData.value.language
  );
  if (selectedLanguageIndex.value === -1) {
    selectedLanguageIndex.value = 0;
  }

  selectedRatioIndex.value = ratios.findIndex(
    (item) => item === formData.value.ratio
  );
  if (selectedRatioIndex.value === -1) {
    selectedRatioIndex.value = 8;
  }
}

function handleThemeChange(e: any) {
  selectedThemeIndexes.value = e.detail.value;
  if (
    selectedThemeIndexes.value[0] ===
    renderMoralityCategory.value.length - 1
  ) {
    // 自定义
    formData.value.theme = "";
  } else {
    formData.value.theme =
      moralities[selectedThemeIndexes.value[0]].children[
        selectedThemeIndexes.value[1]
      ].name;
  }
}

function changeCustomTheme(e: any) {
  if (
    selectedThemeIndexes.value[0] ===
    renderMoralityCategory.value.length - 1
  ) {
    formData.value.theme = e.detail.value;
  }
}

function changeCustomStoryStyle(e: any) {
  if (selectedStoryStyleIndex.value === renderStoryStyles.value.length - 1) {
    formData.value.storyStyle = e.detail.value;
  }
}

function changeCustomPictureStyle(e: any) {
  if (
    selectedPictureStyleIndex.value ===
    renderPictureStyles.value.length - 1
  ) {
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
    formData.value.storyStyle = "";
  } else {
    formData.value.storyStyle = authors[selectedStoryStyleIndex.value].name;
  }
}

function handlePictureStylesChange(e: any) {
  selectedPictureStyleIndex.value = Number(e.detail.value);
  if (
    selectedPictureStyleIndex.value ===
    renderPictureStyles.value.length - 1
  ) {
    formData.value.pictureStyle = "";
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
  if (e.detail.value.includes("role-count")) {
    formData.value.roleCount = -1;
  } else {
    formData.value.roleCount = 3;
  }
}

function handleRoleCountChange(e: any) {
  formData.value.roleCount = Number(e.detail.value);
}

function handleSceneUnlimitedChange(e: any) {
  if (e.detail.value.includes("scene-count")) {
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

function changeAutoConfirmedCover(e: any) {
  formData.value.autoConfirmedCover = e.detail.value;
}

function validateForm() {
  focusedNode.value = "";
  if (!formData.value.theme) {
    scrollToGeneratePanel("picture-book-theme");
    uni.showToast({
      title: "请输入绘本主题",
      icon: "none",
    });

    nextTick(() => {
      focusedNode.value = "theme";
    });
    return false;
  }
  if (!formData.value.storyStyle) {
    scrollToGeneratePanel("picture-book-story-style");
    uni.showToast({
      title: "请输入故事风格",
      icon: "none",
    });
    nextTick(() => {
      focusedNode.value = "storyStyle";
    });
    return false;
  }
  if (!formData.value.pictureStyle) {
    scrollToGeneratePanel("picture-book-picture-style");
    uni.showToast({
      title: "请输入图画风格",
      icon: "none",
    });
    nextTick(() => {
      focusedNode.value = "pictureStyle";
    });
    return false;
  }
  return true;
}

function doGenerate() {
  return new Promise(async (resolve) => {
    if (!isLoggedIn.value || !loginInfo.value?.id) {
      uni.showToast({
        title: "请先登录",
        icon: "none",
      });
      resolve(false);
      return;
    }
    generateStep.value = GenerateStep.generating;

    const res = await requestGeneratePictureBook({
      userId: loginInfo.value?.id || "",
      theme: formData.value.theme,
      storyStyle: formData.value.storyStyle,
      pictureStyle: formData.value.pictureStyle,
      length: formData.value.length,
      language: formData.value.language,
      roleCount: formData.value.roleCount,
      sceneCount: formData.value.sceneCount,
      ratio: formData.value.ratio,
      autoConfirmedStory: formData.value.autoConfirmedStory,
      autoConfirmedRole: formData.value.autoConfirmedRole,
      autoConfirmedScene: formData.value.autoConfirmedScene,
    });

    // const res = {
    //   code: 200,
    //   message: "请确认故事封面",
    //   action: "confirm-cover",
    //   data: {
    //     id: "fb0a7d88d91fbe2fc1b8d27d",
    //     confirmUrl:
    //       "https://wf.qyflows.com/webhook-waiting/630395/pb-confirm-cover",
    //     cover: {
    //       code: 200,
    //       msg: "success",
    //       data: {
    //         taskId: "f6453259e44ed9f9504a0d02ffea574f",
    //         recordId: "f6453259e44ed9f9504a0d02ffea574f",
    //         prompt:
    //           "小熊咕咚和兔子蹦蹦在森林中，蜂蜜四溢，体现温暖诚实和友谊的场景，画面充满生气和童趣。",
    //         prompt_en:
    //           "The bear Gudong and rabbit Bengbeng in the forest, honey flowing, a scene filled with warmth, honesty, and friendship, lively and playful imagery.",
    //       },
    //     },
    //   },
    // };

    if (res.code !== 200) {
      generateStep.value = GenerateStep.failed;
      uni.showToast({
        title: "绘本生成失败，请稍后再试",
        icon: "none",
      });
      resolve(false);
      return;
    }

    if (res.action === EConfirmAction.CONFIRM_STORY) {
      generateStep.value = GenerateStep.confirmStory;
      modalData.value = {
        component: EModalComponent.CONFIRM_STORY_MODAL,
        data: res.data,
      };
      // const t = setTimeout(() => {
      //   openModal({
      //     component: EModalComponent.CONFIRM_STORY_MODAL,
      //     data: res.data,
      //   });
      //   clearTimeout(t);
      // }, 300);
      nextTick(() => {
        openModal({
          component: EModalComponent.CONFIRM_STORY_MODAL,
          data: res.data,
        });
      });
    } else if (res.action === EConfirmAction.CONFIRM_ROLES) {
      generateStep.value = GenerateStep.confirmRoles;
      nextTick(() => {
        openModal({
          component: EModalComponent.CONFIRM_ROLES_MODAL,
          data: res.data,
        });
      });
    } else if (res.action === EConfirmAction.CONFIRM_SCENES) {
      generateStep.value = GenerateStep.confirmScenes;
      nextTick(() => {
        openModal({
          component: EModalComponent.CONFIRM_SCENES_MODAL,
          data: res.data,
        });
      });
    } else if (res.action === EConfirmAction.CONFIRM_COVER) {
      generateStep.value = GenerateStep.confirmCover;
      modalData.value = {
        component: EModalComponent.CONFIRM_COVER_MODAL,
        data: res.data,
      };
      nextTick(() => {
        openModal({
          component: EModalComponent.CONFIRM_COVER_MODAL,
          data: res.data,
        });
      });
    } else if (res.action === EConfirmAction.FINISHED) {
      generateStep.value = GenerateStep.finished;
    }

    resolve(true);
  });
}

async function generate() {
  if (!canGenerate.value) {
    // 生成中
    return;
  }

  const isValid = validateForm();
  if (!isValid) {
    return;
  }

  scrollToGeneratePanel("picture-book-generate-panel");

  await doGenerate();
}

function scrollToGeneratePanel(id: string) {
  scrollToElementId.value = "";
  nextTick(() => {
    scrollToElementId.value = id;
  });
}

function closeModal() {
  const t = setTimeout(() => {
    clearTimeout(t);
    modalVisible.value = false;
  }, 200);
}

function openModal(params: { component?: EModalComponent; data?: any }) {
  if (params.component) {
    modalData.value = {
      component: params.component,
      data: params.data,
    };
  }
  modalVisible.value = true;

  scrollToGeneratePanel("picture-book-generate-panel");
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function handleRegenerateStory(e: any) {
  // await sleep(3000);

  await doGenerate();

  uni.$emit("regenerate-story-response");
}

function handleCancelConfirm(e: any) {
  generateStep.value = GenerateStep.unstart;

  closeModal();
}

function doConfirmRole(e: any) {
  closeModal();

  const t = setTimeout(() => {
    modalData.value = {
      component: EModalComponent.CONFIRM_ROLES_MODAL,
      data: e.data,
    };

    nextTick(() => {
      generateStep.value = GenerateStep.confirmRoles;
      openModal({
        component: EModalComponent.CONFIRM_ROLES_MODAL,
        data: e.data,
      });
    });
    clearTimeout(t);
  }, 300);
}

function doConfirmScene(e: any) {
  closeModal();

  const t = setTimeout(() => {
    modalData.value = {
      component: EModalComponent.CONFIRM_SCENES_MODAL,
      data: e.data,
    };
    nextTick(() => {
      generateStep.value = GenerateStep.confirmScenes;
      openModal({
        component: EModalComponent.CONFIRM_SCENES_MODAL,
        data: e.data,
      });
    });
    clearTimeout(t);
  }, 300);
}

function doConfirmCover(e: any) {
  closeModal();

  const t = setTimeout(() => {
    modalData.value = {
      component: EModalComponent.CONFIRM_COVER_MODAL,
      data: e.data,
    };
    nextTick(() => {
      generateStep.value = GenerateStep.confirmCover;
      openModal({
        component: EModalComponent.CONFIRM_COVER_MODAL,
        data: e.data,
      });
    });
    clearTimeout(t);
  }, 300);
}

function doConfirmFinished(e: any) {
  generateStep.value = GenerateStep.finished;
  closeModal();
  uni.showToast({
    title: "绘本生成成功",
    icon: "none",
  });
}

function handleConfirmedRole(e: any) {
  console.log(">>>>> handleConfirmedRole: ", e);
  if (e.action === EConfirmAction.CONFIRM_SCENES) {
    doConfirmScene(e);
  } else if (e.action === EConfirmAction.CONFIRM_COVER) {
    doConfirmCover(e);
  } else if (e.action === EConfirmAction.FINISHED) {
    doConfirmFinished(e);
  }
}

function handleConfirmedScene(e: any) {
  if (e.action === EConfirmAction.CONFIRM_COVER) {
    doConfirmCover(e);
  } else if (e.action === EConfirmAction.FINISHED) {
    doConfirmFinished(e);
  }
}

function handleConfirmedCover(e: any) {
  if (e.action === EConfirmAction.FINISHED) {
    doConfirmFinished(e);
  }
}

function handleConfirmedStory(e: any) {
  console.log(">>>>> handleConfirmedStory: ", e);
  if (e.action === EConfirmAction.CONFIRM_ROLES) {
    doConfirmRole(e);
  } else if (e.action === EConfirmAction.CONFIRM_SCENES) {
    doConfirmScene(e);
  } else if (e.action === EConfirmAction.CONFIRM_COVER) {
    doConfirmCover(e);
  } else if (e.action === EConfirmAction.FINISHED) {
    doConfirmFinished(e);
  }
}
</script>

<style lang="scss">
.page-bg {
  background: linear-gradient(135deg, #ffe6ee 0%, #e6f0ff 100%);
}

.custom-input {
  outline: none;
  border-color: #ff7bac;
  box-shadow: 0 0 0 3px rgba(255, 123, 172, 0.1);
}

:deep(.custom-input-placeholder) {
  color: #c8c8c8;
}

.generate-btn-active {
  background: linear-gradient(135deg, #ff7bac 0%, #5d9cec 100%);
  box-shadow: 0 6rpx 20rpx rgba(255, 123, 172, 0.3);
}

.generate-btn-disabled {
  background: linear-gradient(135deg, #cccccc, #aaaaaa);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.spinner {
  width: 48rpx;
  height: 48rpx;
  position: relative;
}

.spinner-inner {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 6rpx solid transparent;
  border-top: 6rpx solid #ff7bac;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-inner:nth-child(2) {
  border: 6rpx solid transparent;
  border-top: 6rpx solid #5d9cec;
  animation: spin 1.5s linear infinite reverse;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

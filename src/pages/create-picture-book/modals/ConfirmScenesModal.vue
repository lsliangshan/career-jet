<template>
  <view class="w-[100vw] h-[100vh] flex flex-row items-end justify-center">
    <CustomHeader bg-color="transparent" />

    <Layout :hasHeader="true">
      <view class="relative w-full h-full flex flex-col">
        <view class="w-full h-[290rpx] shrink-0"></view>
        <scroll-view
          type="custom"
          :scroll-y="!regenerateModalVisible"
          class="w-full bg-[#fff] rounded-tl-[32rpx] rounded-tr-[32rpx] overflow-y-auto"
          :style="{
            height: `calc(100vh - 128rpx)`,
          }"
        >
          <view
            class="sticky top-0 left-0 z-[99] w-full h-[88rpx] bg-[#fff] border-b border-b-[1rpx] border-[#F0F0F0] flex flex-row items-center justify-center"
          >
            <text class="text-[36rpx] font-bold text-[#333]">确认场景</text>

            <view
              class="absolute right-[12rpx] top-0 z-[9] w-[88rpx] h-[88rpx] active:opacity-80 shrink-0 flex flex-row items-center justify-center transition-opacity duration-300"
              @click="closeModal"
            >
              <svg-icon
                :src="`/static/${iconThemeVersion}/icon_close.svg`"
                class="w-[32rpx] h-[32rpx]"
                color="#000"
              />
            </view>
          </view>

          <view
            class="relative z-[1] w-full px-[24rpx] py-[24rpx] box-border flex flex-row"
            :style="{
              minHeight: `calc(100% - 88rpx - 100rpx - ${safeBottom}px)`,
            }"
          >
            <view class="w-full h-full flex flex-row flex-wrap gap-[24rpx]">
              <view
                class="relative w-[339rpx] border border-[1rpx] border-[#f0f0f0] rounded-[24rpx] overflow-hidden flex flex-col"
                :style="{
                  minHeight: `${renderImageHeight + 144}rpx`,
                }"
                v-for="(scene, index) in info.scenes"
                :key="scene.data.id"
              >
                <view
                  class="w-full flex flex-row items-start justify-center transition-all duration-300 bg-[rgba(0,0,0,0.05)]"
                  :class="[
                    imageUrls.has(scene.data.id)
                      ? 'opacity-100'
                      : 'opacity-0 pointer-events-none',
                  ]"
                  :style="{ height: `${renderImageHeight}rpx` }"
                  @click="previewImage([imageUrls.get(scene.data.id) || ''])"
                >
                  <image
                    :src="imageUrls.get(scene.data.id)"
                    class="w-full"
                    :style="{ height: `${renderImageHeight}rpx` }"
                    mode="aspectFit"
                  ></image>
                </view>

                <view
                  class="z-[9] bg-[rgba(0,0,0,0.05)] w-full flex-1 flex flex-col"
                >
                  <view
                    class="w-full min-h-[64rpx] px-[12rpx] py-[12rpx] box-border flex flex-row items-center"
                  >
                    <text class="text-[28rpx] text-[#666]">{{
                      scene.data.content
                    }}</text>
                  </view>
                </view>

                <view
                  class="absolute left-[20rpx] top-[20rpx] z-[99] h-[56rpx] bg-[#f0f0f0] rounded-[12rpx] px-[12rpx] box-border flex flex-row items-center justify-center transition-all duration-300"
                >
                  <text class="text-[28rpx] text-[#666]"
                    >场景: {{ scene.data.index }}</text
                  >
                </view>

                <view
                  class="absolute right-0 top-0 z-[99] w-[88rpx] h-[88rpx] opacity-0 flex flex-row items-center justify-center transition-all duration-300"
                  :class="[
                    loadingImageIds.has(scene.data.id)
                      ? 'opacity-0 pointer-events-none'
                      : 'opacity-100 active:scale-95 pointer-events-auto',
                  ]"
                  @click="openRegenerateModal(scene.data.id)"
                >
                  <view
                    class="w-[56rpx] h-[56rpx] rounded-[12rpx] bg-[#fff] flex flex-row items-center justify-center active:scale-95 transition-all duration-300"
                    :style="{
                      backgroundColor: ThemeColors.primary,
                    }"
                  >
                    <svg-icon
                      :src="`/static/${iconThemeVersion}/icon_regenerate.svg`"
                      class="w-[32rpx] h-[32rpx]"
                      color="#fff"
                    />
                  </view>
                </view>
                <view
                  class="absolute left-0 top-0 w-full h-full flex flex-row items-center justify-center"
                  v-if="loadingImageIds.has(scene.data.id)"
                >
                  <div class="spinner mb-[60rpx]">
                    <div class="spinner-inner"></div>
                    <div class="spinner-inner"></div>
                  </div>
                </view>
              </view>
            </view>
          </view>

          <view
            class="sticky bottom-0 left-0 z-[99] w-full bg-[#fff] border-t border-t-[1rpx] border-[#f0f0f0] flex flex-row items-center justify-center gap-[24rpx]"
            :style="{
              height: `calc(${safeBottom}px + 100rpx)`,
              paddingBottom: `${safeBottom}px`,
            }"
          >
            <view
              class="h-[80rpx] px-[64rpx] rounded-[24rpx] box-border flex flex-row items-center justify-center transition-all duration-300"
              :class="[
                loadingImageIds.size === 0 && !isConfirming
                  ? 'opacity-100 active:scale-95'
                  : 'opacity-50',
              ]"
              :style="{
                backgroundColor: ThemeColors.primary,
              }"
              @click="handleConfirmScenes"
            >
              <text class="text-[32rpx] text-[#fff]">{{
                isConfirming ? "正在确认" : "确认"
              }}</text>
            </view>
          </view>

          <view
            class="sticky left-0 bottom-0 z-[99] w-full h-full flex flex-row items-end justify-center"
            v-if="regenerateModalVisible"
          >
            <view
              class="relative w-full h-full rounded-[24rpx] bg-[#fff] transition-all duration-300 shadow-[0_0_16rpx_2rpx_rgba(0,0,0,0.1)] flex flex-col"
              :class="[
                regenerateModalReady
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-full',
              ]"
            >
              <view
                class="w-full h-[88rpx] shrink-0 px-[24rpx] box-border border-b border-b-[1rpx] border-[#f0f0f0] flex flex-row items-center"
              >
                <text class="text-[32rpx] font-bold text-[#333]"
                  >重新生成第 {{ regenerateModalScene?.index }} 个场景</text
                >
              </view>
              <view
                class="w-full flex flex-row items-center justify-center"
                :style="{
                  height: `calc(100% - 88rpx - 100rpx - ${safeBottom}px)`,
                }"
              >
                <scroll-view
                  type="custom"
                  :scroll-y="true"
                  class="w-full h-full"
                >
                  <textarea
                    class="w-full min-h-full text-[34rpx] text-[#666] px-[24rpx] py-[32rpx] box-border"
                    :maxlength="-1"
                    auto-height
                    placeholder="请输入场景描述"
                    v-if="regenerateModalScene"
                    v-model="regenerateModalScene.prompt"
                  />
                </scroll-view>
              </view>
              <view
                class="sticky bottom-0 left-0 z-[99] w-full shrink-0 bg-[#fff] border-t border-t-[1rpx] border-[#f0f0f0] flex flex-row items-center justify-center gap-[24rpx]"
                :style="{
                  height: `calc(${safeBottom}px + 100rpx)`,
                  paddingBottom: `${safeBottom}px`,
                }"
              >
                <view
                  class="h-[80rpx] px-[64rpx] bg-[#eeeeee] rounded-[24rpx] box-border flex flex-row items-center justify-center gap-[12rpx] active:scale-95 transition-all duration-300"
                  @click="hideRegenerateModal"
                >
                  <text
                    class="text-[32rpx]"
                    :style="{
                      color: ThemeColors.primary,
                    }"
                    >取消</text
                  >
                </view>
                <view
                  class="h-[80rpx] px-[64rpx] rounded-[24rpx] box-border flex flex-row items-center justify-center gap-[12rpx] transition-all duration-300"
                  :class="[
                    isRegeneratingScene
                      ? 'opacity-50 pointer-events-none'
                      : 'opacity-100 active:scale-95 pointer-events-auto',
                  ]"
                  :style="{
                    backgroundColor: ThemeColors.primary,
                  }"
                  @click="handleRegenerateScene"
                >
                  <svg-icon
                    :src="`/static/${iconThemeVersion}/icon_generate.svg`"
                    class="w-[32rpx] h-[32rpx]"
                    color="#000"
                  />
                  <text class="text-[32rpx] text-[#fff]">{{
                    isRegeneratingScene ? "正在生成" : "重新生成"
                  }}</text>
                </view>
              </view>

              <view
                class="absolute right-0 top-0 z-[99] w-[88rpx] h-[88rpx] flex flex-row items-center justify-center"
                @click="hideRegenerateModal"
              >
                <svg-icon
                  :src="`/static/${iconThemeVersion}/icon_close.svg`"
                  class="w-[32rpx] h-[32rpx]"
                  color="#000"
                />
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </Layout>
  </view>
</template>

<script setup lang="ts">
import CustomHeader from "@/components/custom-header/custom-header.vue";
import Layout from "@/components/layout/layout.vue";
import { EConfirmAction } from "../types";
import type {
  IConfirmSceneData,
  IConfirmSceneItem,
  IConfirmSceneInfo,
} from "./types";
import {
  requestCustomUrl,
  requestGenerateRoleOrScene,
  requestGetImageUrls,
} from "@/request";
import { computed, nextTick, onMounted, ref } from "vue";
import { previewImage } from "@/utils";
import { iconThemeVersion, ThemeColors } from "@/config/config";

interface Props {
  info: IConfirmSceneInfo;
  ratio: string;
  pictureStyle: string;
}

const props = withDefaults(defineProps<Props>(), {
  info: () =>
    ({
      id: "044822301617c9743c8fbb02",
      confirmUrl:
        "https://wf.qyflows.com/webhook-waiting/624814/pb-confirm-scene",
      scenes: [
        {
          code: 200,
          msg: "success",
          data: {
            taskId: "2be22498de264684989d8c5ee02aa890",
            recordId: "2be22498de264684989d8c5ee02aa890",
            index: 1,
            id: "scene1",
            script:
              "在蓝蓝的小河边，三个好朋友快乐地生活着，他们是小蜗牛悠悠、小青蛙呱呱和小老鼠吱吱。",
            content:
              "三个动物朋友在河边的集体画面，背景是清澈的小河和翠绿的草地，阳光明媚。",
            prompt:
              "全景画面，三个动物朋友在小河边，背景是清澈的小河和翠绿的草地，阳光明媚，充满生机。",
            prompt_en:
              "Wide shot of three animal friends by the riverbank, with the background of a clear river and lush green grass under bright sunlight, full of vitality.",
          },
        },
        {
          code: 200,
          msg: "success",
          data: {
            taskId: "dd3de57bdb11bfa179ee88779d34fb61",
            recordId: "dd3de57bdb11bfa179ee88779d34fb61",
            index: 2,
            id: "scene2",
            script: "他们在草丛里发现了一块亮闪闪、圆润润的蓝色小石头。",
            content: "三位朋友在草丛中找到一块小蓝石头，石头在阳光下闪闪发光。",
            prompt:
              "特写画面，小蓝石头在草丛中被找到，蓝色在阳光下闪闪发光，引人注目。",
            prompt_en:
              "Close-up of the small blue stone found among the grass, glistening in the sunlight, drawing attention.",
          },
        },
        {
          code: 200,
          msg: "success",
          data: {
            taskId: "3b28d50eacb694ca7577e23eb40c214d",
            recordId: "3b28d50eacb694ca7577e23eb40c214d",
            index: 3,
            id: "scene3",
            script: "悠悠把石头放在壳里，非常珍重地保护着它。",
            content: "悠悠把小石头放在壳里，壳内光滑湿润，小心翼翼地照看。",
            prompt:
              "特写画面，悠悠将小石头放在它的小螺旋壳中，壳内呈现潮湿光滑的质感。",
            prompt_en:
              "Close-up of Youyou placing the small stone into its spiral shell, with the interior showing a moist and smooth texture.",
          },
        },
        {
          code: 200,
          msg: "success",
          data: {
            taskId: "8f0c4118a1788bd6eef717eaf0effd48",
            recordId: "8f0c4118a1788bd6eef717eaf0effd48",
            index: 4,
            id: "scene4",
            script: "呱呱把石头顶在头上，如同王冠。",
            content:
              "呱呱把小石头稳稳地放在头上，仿佛戴上了一顶王冠，显得高贵。",
            prompt:
              "特写画面，小青蛙呱呱把小石头顶在头上，显得骄傲和喜悦，像是戴了一顶蓝色的王冠。",
            prompt_en:
              "Close-up of little frog Guagua balancing the small stone on its head, appearing proud and joyful, as if wearing a blue crown.",
          },
        },
        {
          code: 200,
          msg: "success",
          data: {
            taskId: "586f9edde618435b37788330feab0db8",
            recordId: "586f9edde618435b37788330feab0db8",
            index: 5,
            id: "scene5",
            script: "当呱呱要传给吱吱时，石头不见了，朋友们都很伤心。",
            content: "朋友们伤心地寻找丢失的小石头，四处张望却一无所获。",
            prompt:
              "中景画面，三个朋友在小河边伤心地寻找石头，神情落寞，画面有些阴郁。",
            prompt_en:
              "Medium shot of the three friends sadly searching for the lost stone by the riverbank, looking around with forlorn expressions, the scene slightly gloomy.",
          },
        },
        {
          code: 200,
          msg: "success",
          data: {
            taskId: "608e101cb851e70689a82df2ff82cddf",
            recordId: "608e101cb851e70689a82df2ff82cddf",
            index: 6,
            id: "scene6",
            script: "吱吱承认石头在自己这里。",
            content: "吱吱犹豫地将小石头从口袋里拿出，低着头。",
            prompt: "特写画面，吱吱低着头，将小石头从口袋里拿出来，显得愧疚。",
            prompt_en:
              "Close-up of Zhizhi with its head down, taking the small stone out of its pocket, looking guilty.",
          },
        },
        {
          code: 200,
          msg: "success",
          data: {
            taskId: "83f7a4b237f2c94a43f93b7cc8c6e735",
            recordId: "83f7a4b237f2c94a43f93b7cc8c6e735",
            index: 7,
            id: "scene7",
            script: "朋友们原谅了吱吱，三个好朋友重新团聚，沐浴在阳光下。",
            content: "三位朋友在阳光下再次围成圈，看着中间的小石头，露出微笑。",
            prompt:
              "全景画面，三个朋友团聚在阳光下，围绕着中间的蓝色小石头，开心和解。",
            prompt_en:
              "Wide shot of the three friends reunited under the sun, circling around the small blue stone in the center, happily reconciled.",
          },
        },
      ],
    } as IConfirmSceneInfo),
  ratio: "16:9",
  pictureStyle: "李欧·李奥尼‌",
});

const emit = defineEmits<{
  (
    e: "on-confirm",
    params: {
      action: EConfirmAction;
      data: any;
    }
  ): void;
  (
    e: "on-cancel",
    params: {
      id: string;
    }
  ): void;
}>();

const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;

const imageUrls = ref<Map<string, string>>(new Map());

// 正在加载图片的id列表
const loadingImageIds = ref<Set<string>>(new Set());

// 是否确认中
const isConfirming = ref(false);

const regenerateModalVisible = ref(false);
const regenerateModalReady = ref(false);
const regenerateModalScene = ref<IConfirmSceneData | null>(null);
// 重新生成中
const isRegeneratingScene = ref(false);

const allScenes = ref<IConfirmSceneData[]>([]);

const renderImageHeight = computed(() => {
  const ratio = props.ratio.split(":");
  const width = Number(ratio[0]);
  const height = Number(ratio[1]);
  return (339 * height) / width;
});

onMounted(() => {
  resetData();
  allScenes.value = props.info.scenes.map(
    (scene: IConfirmSceneItem) => scene.data
  );
  listImageUrls(
    props.info.scenes.map((scene: IConfirmSceneItem) => scene.data.taskId)
  );
});

function closeModal() {
  uni.showModal({
    title: "提示",
    content: "点击关闭会放弃当前故事内容，是否继续？",
    confirmText: "确定",
    confirmColor: ThemeColors.primary,
    cancelText: "取消",
    cancelColor: "#666",
    success: (res) => {
      if (res.confirm) {
        emit("on-cancel", {
          id: props.info.id,
        });
      }
    },
  });
}

function getIdByTaskId(taskId: string) {
  return allScenes.value.find(
    (scene: IConfirmSceneData) => scene.taskId === taskId
  )?.id;
}

async function listImageUrls(taskIds: string[]) {
  loadingImageIds.value.clear();
  allScenes.value.forEach((scene: IConfirmSceneData) => {
    loadingImageIds.value.add(scene.id);
  });
  const images: Map<string, string> = await requestGetImageUrls({
    taskIds,
  });

  images.forEach((url, taskId) => {
    const id = getIdByTaskId(taskId);

    if (id) {
      if (loadingImageIds.value.has(id)) {
        loadingImageIds.value.delete(id);
      }
      imageUrls.value.set(id, url);
    }
  });
}

function resetData() {
  isConfirming.value = false;
  isRegeneratingScene.value = false;
  allScenes.value = [];
  imageUrls.value.clear();
  loadingImageIds.value.clear();
}

function handleConfirmScenes() {
  return new Promise(async (resolve) => {
    if (isConfirming.value) {
      return;
    }

    let scenes = allScenes.value.map((scene: any) => {
      return {
        ...scene,
        url: imageUrls.value.get(scene.id),
      };
    });

    if (scenes.length > 0) {
      isConfirming.value = true;

      const res = await requestCustomUrl({
        url: props.info.confirmUrl,
        method: "POST",
        data: {
          id: props.info.id,
          confirmed: scenes,
          unconfirmed: [],
        },
      });

      resetData();

      // const res = { "code": 200, "message": "生成成功", "action": "finished", "data": { "id": "26695568c772c4f3015c851c", "title": "真种子与空种子", "content": "阳光明媚的春日，老鼠爷爷给了两只小田鼠——诚诚和巧巧，每人一颗特别的种子。\n\n爷爷说：“这是诚实种子，种下它，用真心照料，秋天就知道结果啦。”\n\n诚诚小心翼翼地把种子埋进土里，每天浇水、除草，耐心等待。\n巧巧却想：“等太久了。”她把种子丢在一边，捡了块光滑的石头埋下。\n\n夏天，诚诚的苗儿茁壮成长，开出星星样的小白花。巧巧的“苗”却光秃秃，什么都没有。\n巧巧急了，偷偷采了野花插在石头上。\n\n秋风起，诚诚的植株结出一颗金灿灿、饱满的大果子。\n巧巧插的野花早已枯萎，只剩光溜溜的石头。\n\n老鼠爷爷来了，微笑着说：“诚实的劳动，结出真实的果实。\n虚假的装扮，就像没有种子的石头，开不出花，也结不出果。”\n\n诚诚把金果子和大家分享，滋味特别香甜。\n巧巧低下头，脸红红的。爷爷也给了她一颗新的真种子：“现在，用你的双手去真正培育它吧。”\n\n第二年秋天，两棵金果子树并排站着，在风中轻轻摇摆，像在唱着关于诚实与成长的歌。", "title_zh": "", "content_zh": "", "authorId": "admin", "roles": [{ "id": "character_1", "url": "https://tempfile.aiquickdraw.com/workers/nano/image_1768182560664_um3en0_16x9_1024x576.png", "name": "诚诚", "prompt": "小田鼠诚诚，是一只年轻且勤劳的小老鼠，外表小巧而略显机灵，身穿绿色小背心，充满春天气息，他的眼中闪烁着坚定的光芒，常常出现在田野间，耐心地照料着种子，他的旁边可以看到一片星星样的小白花，阳光洒在他身上。", "taskId": "866492e31f71ed21ca0d2803aade035d", "recordId": "866492e31f71ed21ca0d2803aade035d", "prompt_en": "Cheng Cheng, a young and diligent field mouse, small in stature and slightly clever-looking. Wears a green vest, exuding a springtime vibe. His eyes sparkle with determination, often seen tending to his seeds in the fields. Nearby are star-like little white flowers, sunlight casting down on him." }, { "id": "character_2", "url": "https://tempfile.aiquickdraw.com/workers/nano/image_1768182561810_kfx1mc_16x9_1024x576.png", "name": "巧巧", "prompt": "小田鼠巧巧，是一只活泼但有些急躁的小老鼠，身穿粉色小裙子，爱打扮，眼中带着些许不耐烦，她的脚边是一个光滑的小石头，环境是一片只有枯萎的野花的土地，神情有些羞愧。", "taskId": "b50e7354a5166cce40b80fb074dab3dd", "recordId": "b50e7354a5166cce40b80fb074dab3dd", "prompt_en": "Qiao Qiao, a lively but somewhat impatient field mouse. Wears a pink dress, enjoys dressing up. Her eyes show a hint of impatience. At her feet is a smooth stone, surrounded by land with wilted wildflowers. She looks slightly embarrassed." }, { "id": "character_3", "url": "https://tempfile.aiquickdraw.com/workers/nano/image_1768182563566_vr5aj5_16x9_1024x576.png", "name": "老鼠爷爷", "prompt": "经验丰富的老鼠爷爷，他有着灰白的毛发，穿着古朴的长袍，总是微笑着面向诚诚和巧巧，他的神态和蔼而睿智，通常在和煦的阳光下指导着小田鼠们，有时手中持着小种子。", "taskId": "ce367e5afde200bc5fc08b8155353ab6", "recordId": "ce367e5afde200bc5fc08b8155353ab6", "prompt_en": "Grandpa Mouse, with gray-white fur, dressed in a simple, traditional robe. Always smiling at Cheng Cheng and Qiao Qiao, with a kind and wise demeanor. Often seen under the gentle sunlight guiding the young mice, sometimes holding small seeds." }], "scenes": [{ "id": "scene_1", "url": "https://tempfile.aiquickdraw.com/workers/nano/image_1768182585948_bg28q5_16x9_1024x576.png", "index": 1, "prompt": "全景镜头，春光明媚的田野，老鼠爷爷在中间，诚诚和巧巧分别站两边，每人手中持有一颗小种子，背景是嫩绿的田野。", "script": "阳光明媚的春日，老鼠爷爷给了两只小田鼠诚诚和巧巧每人一颗特别的种子。", "taskId": "c31ce4f17b2559ce0a15c2e0d2d2c1cf", "content": "春日的田野中，老鼠爷爷微笑着站在诚诚和巧巧面前，阳光洒在他们头上，每人手中都握着一颗小种子。", "recordId": "c31ce4f17b2559ce0a15c2e0d2d2c1cf", "prompt_en": "Wide shot of a sunlit spring field, Grandpa Mouse in the center, Cheng Cheng and Qiao Qiao standing on each side, each holding a small seed. The background is a field of tender green." }, { "id": "scene_2", "url": "https://tempfile.aiquickdraw.com/workers/nano/image_1768182590156_ya1fb3_16x9_1024x576.png", "index": 2, "prompt": "特写镜头，诚诚在田间浇水，手持小水壶，眼神专注，周围的土地上有新播种的痕迹。", "script": "诚诚小心翼翼地把种子埋进土里，每天浇水、除草，耐心等待。", "taskId": "98ba446c7e48629758a7fc0a6e31c2af", "content": "诚诚专注地在田间工作，他用小水壶浇灌刚种下的种子，周围是一片等待发芽的土地。", "recordId": "98ba446c7e48629758a7fc0a6e31c2af", "prompt_en": "Close-up shot, Cheng Cheng watering in the field, holding a small watering can. His gaze is focused, with freshly sown markings on the surrounding soil." }, { "id": "scene_3", "url": "https://tempfile.aiquickdraw.com/workers/nano/image_1768182587145_ti6bgk_16x9_1024x576.png", "index": 3, "prompt": "中景镜头，巧巧在田边，神情不耐烦，丢弃种子并埋下石头，背景是初夏的田野。", "script": "巧巧心想：'等太久了。' 她把种子丢在一边，捡了块光滑的石头埋下。", "taskId": "7541c2631033f71ef66049e7356911f7", "content": "巧巧在田边犹豫地看着手中的种子，然后随意丢弃，并埋下了一块小石头。", "recordId": "7541c2631033f71ef66049e7356911f7", "prompt_en": "Medium shot, Qiao Qiao at the edge of the field, looking impatient. She discards the seed and buries a stone. The background is a field in early summer." }, { "id": "scene_4", "url": "https://tempfile.aiquickdraw.com/workers/nano/image_1768182589146_36xosw_16x9_1024x576.png", "index": 4, "prompt": "全景镜头，夏日阳光下的田地，地面长出茁壮的小苗，上面点缀着星星样的白色小花。", "script": "夏天，诚诚的苗儿茁壮成长，开出星星样的小白花。", "taskId": "933fb98b0f647a3c64a1555caf9b3d45", "content": "在温暖的夏日阳光下，诚诚的植株开满了星星般的小白花，苗儿显得格外茁壮。", "recordId": "933fb98b0f647a3c64a1555caf9b3d45", "prompt_en": "Wide shot of the summer sunlit field. Vigorous sprouts on the ground adorned with star-like small white flowers." }, { "id": "scene_5", "url": "https://tempfile.aiquickdraw.com/workers/nano/image_1768182589337_2eaeo1_16x9_1024x576.png", "index": 5, "prompt": "特写镜头，秋日的一株果树，挂着金色丰满的果实，阳光洒落在果实上，显得格外诱人。", "script": "秋风起，诚诚的植株结出一颗金灿灿、饱满的大果子。", "taskId": "222d5b52c6ca0d3803afa22e6af96250", "content": "在秋风中，诚诚的植株上结满了金色的果实，阳光照耀下显得充满活力。", "recordId": "222d5b52c6ca0d3803afa22e6af96250", "prompt_en": "Close-up shot of an autumn fruit tree, golden and full fruits hanging, sunlight spilling over them, making them look particularly enticing." }, { "id": "scene_6", "url": "https://tempfile.aiquickdraw.com/workers/nano/image_1768182591469_2c2e64_16x9_1024x576.png", "index": 6, "prompt": "中景镜头，巧巧紧张地在田间，采摘并插着野花，背景是一片安静的田地。", "script": "巧巧急了，偷偷采了野花插在石头上。", "taskId": "c6a7feb30b33536a10b2857e2b6d2abc", "content": "巧巧神情慌乱地在田间四处望，然后采来几支野花，小心地插在藏着石头的地上。", "recordId": "c6a7feb30b33536a10b2857e2b6d2abc", "prompt_en": "Medium shot, Qiao Qiao nervously in the field, picking and arranging wildflowers. The backdrop is a quiet field." }, { "id": "scene_7", "url": "https://tempfile.aiquickdraw.com/workers/nano/image_1768182590785_1y6qu1_16x9_1024x576.png", "index": 7, "prompt": "全景镜头，秋风萧瑟的田地里，一块裸露的石头和几根枯萎的野花，氛围显得空旷而寂寥。", "script": "秋风起，巧巧插的野花早已枯萎，只剩光溜溜的石头。", "taskId": "4b35bdfc2ef3d6ddb3157cabb67a2987", "content": "萧瑟的秋风中，巧巧遗弃的石头裸露在地面，旁边是枯萎的野花。", "recordId": "4b35bdfc2ef3d6ddb3157cabb67a2987", "prompt_en": "Wide shot of a desolate field in autumn wind, a bare stone and some withered wildflowers. The atmosphere appears empty and desolate." }, { "id": "scene_8", "url": "https://tempfile.aiquickdraw.com/workers/nano/image_1768182589907_eei2x2_16x9_1024x576.png", "index": 8, "prompt": "全景镜头，各色小老鼠围坐在一起分享金黄果实，快乐的气氛充盈于空中。", "script": "诚诚把金果子和大家分享，滋味特别香甜。", "taskId": "9e472c7c503fe4c2f750832f4017db66", "content": "诚诚开心地将摘下来的金色果实分给其他小老鼠，它们围坐在一起，品尝着果实的甜蜜。", "recordId": "9e472c7c503fe4c2f750832f4017db66", "prompt_en": "Wide shot of various little mice sitting together sharing golden fruit, a joyful atmosphere fills the air." }, { "id": "scene_9", "url": "https://tempfile.aiquickdraw.com/workers/nano/image_1768182590010_g6zz0f_16x9_1024x576.png", "index": 9, "prompt": "中景镜头，巧巧低头羞愧，爷爷微笑着递过一颗种子，背景是一片平和的田地。", "script": "巧巧低下头，脸红红的。爷爷也给了她一颗新的真种子。", "taskId": "24755c1f23bdafc37191d5c8186c2741", "content": "在阳光下，巧巧羞愧地低下头，脸颊微红，老鼠爷爷微笑着递给她一颗新的种子。", "recordId": "24755c1f23bdafc37191d5c8186c2741", "prompt_en": "Medium shot, Qiao Qiao lowers her head in embarrassment. Grandpa smiles and hands over a seed, with a peaceful field in the background." }, { "id": "scene_10", "url": "https://tempfile.aiquickdraw.com/workers/nano/image_1768182589868_hxfhlw_16x9_1024x576.png", "index": 10, "prompt": "全景镜头，两棵金果子树在秋风中摇曳，背景是金色的田野，果实在阳光下闪耀。", "script": "第二年秋天，两棵金果子树并排站着，在风中轻轻摇摆，", "taskId": "976ee053f0fd69332d5ab81185a3469c", "content": "在清爽的秋风中，两棵郁郁葱葱的金果子树并肩而立，树枝上挂满了金色的果实。", "recordId": "976ee053f0fd69332d5ab81185a3469c", "prompt_en": "Wide shot of two golden fruit trees swaying in the autumn wind, with a golden field in the background. The fruits shine in the sunlight." }], "createAt": "2026-01-12 09:49:10", "status": 0, "config": { "ratio": "16:9", "theme": "诚实与正直", "length": 500, "storyId": "26695568c772c4f3015c851c", "language": "中文", "roleCount": -1, "sceneCount": -1, "storyStyle": "李欧·李奥尼‌", "pictureStyle": "李欧·李奥尼‌", "redisExpiredTime": 86400, "autoConfirmedRole": false, "autoConfirmedScene": false, "autoConfirmedStory": false } } };

      if (res.code === 409) {
        uni.showToast({
          title: "场景确认失败，请稍后再试",
          icon: "none",
        });
        emit("on-cancel", {
          id: props.info.id,
        });
        return;
      }
      if (res.code !== 200) {
        uni.showToast({
          title: "场景确认失败，请重新确认",
          icon: "none",
        });
        return;
      }

      handleAllConfirmed(res);

      nextTick(() => {
        isConfirming.value = false;
      });
    }

    resolve(true);
  });
}

function handleAllConfirmed(e: any) {
  emit("on-confirm", {
    action: e.action as EConfirmAction,
    data: e.data as any,
  });
}

function showRegenerateModal(scene: IConfirmSceneData) {
  regenerateModalScene.value = scene;
  regenerateModalVisible.value = true;
  nextTick(() => {
    regenerateModalReady.value = true;
  });
}

function hideRegenerateModal() {
  regenerateModalReady.value = false;
  setTimeout(() => {
    regenerateModalVisible.value = false;
  }, 300);
}

function openRegenerateModal(id: string) {
  const scene = props.info.scenes.find(
    (s: IConfirmSceneItem) => s.data.id === id
  );
  if (!scene) {
    return;
  }
  showRegenerateModal(scene.data);
}

async function handleRegenerateScene() {
  if (!regenerateModalScene.value) {
    return;
  }
  if (isRegeneratingScene.value) {
    return;
  }
  isRegeneratingScene.value = true;
  const res = await requestGenerateRoleOrScene({
    id: regenerateModalScene.value.id,
    prompt: `a children's book illustation style by ${props.pictureStyle}, ${regenerateModalScene.value.prompt}`,
    ratio: props.ratio,
    imageUrls: regenerateModalScene.value.roleUrls,
  });
  console.log(">>> 重新生成返回: ", res);
  if (res.code === 200) {
    hideRegenerateModal();

    // 更新场景图片
    imageUrls.value.set(regenerateModalScene.value.id, res.data.url);
    loadingImageIds.value.delete(regenerateModalScene.value.id);
    const newScene = {
      ...regenerateModalScene.value,
      taskId: res.data.taskId,
      url: res.data.url,
    };
    allScenes.value = allScenes.value.map((scene: IConfirmSceneData) => {
      if (scene.id === newScene.id) {
        return newScene;
      }
      return scene;
    });
  } else {
    uni.showToast({
      title: "生成场景失败，请稍后再试",
      icon: "none",
    });
  }
  nextTick(() => {
    isRegeneratingScene.value = false;
  });
}
</script>

<style scoped></style>

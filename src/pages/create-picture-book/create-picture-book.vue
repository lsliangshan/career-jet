<template>
  <view
    class="w-full fixed top-0 left-0 z-10 bg-[rgba(248,248,245,0.5)] backdrop-blur-md border-none flex flex-col items-start"
    :style="{
      height: `calc(80rpx +  ${safeTop}px + 108rpx)`,
      paddingTop: `${safeTop}px`,
    }"
  >
    <view
      class="h-[80rpx] flex flex-row items-center justify-center"
      :style="{ width: `calc(${safeTitleWidth}px)` }"
    >
      <view
        class="w-[80rpx] h-[80rpx] shrink-0 flex flex-row items-center justify-center"
        @click="handleBack"
      >
        <svg-icon
          class="w-[32rpx] h-[32rpx]"
          :src="`/static/${iconThemeVersion}/icon_back.svg`"
          color="#000"
        />
      </view>
      <view
        class="z-[999] h-[80rpx] pr-[24rpx] box-border flex flex-row items-center"
        :style="{ width: `calc(${safeTitleWidth}px - 80rpx)` }"
      >
        <view
          class="w-full h-full box-border flex flex-row items-center justify-center gap-[8rpx]"
        >
          <text
            class="text-[36rpx] font-bold text-[#000] line-clamp-1 overflow-hidden text-ellipsis break-all"
          >
            {{ createPictureBookSteps[currentStepIndex].label }}
          </text>
        </view>
      </view>
    </view>

    <view
      class="w-full h-[108rpx] flex flex-row items-center justify-start px-[32rpx] box-border"
    >
      <view class="h-full flex flex-col items-start justify-center gap-[12rpx]">
        <view class="w-full h-[40rpx] flex flex-row items-center justify-start">
          <text
            class="font-bold text-[36rpx]"
            :style="{
              color: ThemeColors.primary,
            }"
            >步骤 {{ currentStepIndex + 1 }} /
            {{ createPictureBookSteps.length }}</text
          >
        </view>
        <view class="w-full h-[32rpx] flex flex-row items-center justify-start">
          <text class="text-[30rpx] font-medium text-[#666]">
            {{ createPictureBookSteps[currentStepIndex].desc || " " }}
          </text>
        </view>
      </view>
    </view>
  </view>
  <Layout :hasHeader="false">
    <Configuration
      v-if="currentStepIndex === 0"
      @open-modal="openModal"
      @change-custom-theme="changeCustomTheme"
      @change-custom-story-style="changeCustomStoryStyle"
      @change-custom-picture-style="changeCustomPictureStyle"
      @change-story-length="changeStoryLength"
      @change-role-count="changeRoleCount"
      @change-scene-count="changeSceneCount"
      @on-generated="handleGeneratedStory"
    />
    <ConfirmStory
      v-else-if="currentStepIndex === 1"
      @regenerate-story="handleRegenerateStory"
      @on-confirmed="handleConfirmedStory"
    />
    <ConfirmRoles
      v-else-if="currentStepIndex === 2"
      @on-confirmed="handleConfirmedRoles"
    />
    <ConfirmScenes
      v-else-if="currentStepIndex === 3"
      @on-confirmed="handleConfirmedScenes"
    />
    <ConfirmCover
      v-else-if="currentStepIndex === 4"
      @on-confirmed="handleConfirmedCover"
    />
    <ConfirmAudio
      v-else-if="currentStepIndex === 5"
      @on-confirmed="handleConfirmedAudio"
    />
    <Finished v-else-if="currentStepIndex === 6" />
    <!-- <swiper
      class="w-full h-full"
      :current="currentStepIndex"
      @change="handleChange"
    >
      <swiper-item
        v-for="(step, index) in createPictureBookSteps"
        :key="step.value"
      >
        <Configuration
          v-if="index === 0 && currentStepIndex === index"
          @open-modal="openModal"
          @change-custom-theme="changeCustomTheme"
          @change-custom-story-style="changeCustomStoryStyle"
          @change-custom-picture-style="changeCustomPictureStyle"
          @change-story-length="changeStoryLength"
          @change-role-count="changeRoleCount"
          @change-scene-count="changeSceneCount"
          @on-generated="handleGeneratedStory"
        />
        <ConfirmStory
          v-else-if="index === 1 && currentStepIndex === index"
          @regenerate-story="handleRegenerateStory"
          @on-confirmed="handleConfirmedStory"
        />
        <ConfirmRoles
          v-else-if="index === 2 && currentStepIndex === index"
          @on-confirmed="handleConfirmedRoles"
        />
        <ConfirmScenes
          v-else-if="index === 3 && currentStepIndex === index"
          @on-confirmed="handleConfirmedScenes"
        />
        <ConfirmCover
          v-else-if="index === 4 && currentStepIndex === index"
          @on-confirmed="handleConfirmedCover"
        />
        <ConfirmAudio
          v-else-if="index === 5 && currentStepIndex === index"
          @on-confirmed="handleConfirmedAudio"
        />
        <Finished v-else-if="index === 6 && currentStepIndex === index" />
      </swiper-item>
    </swiper> -->
  </Layout>

  <page-container
    :show="modalVisible"
    z-index="999"
    round
    custom-style="background-color: transparent;"
    @leave="closeModal"
    @beforeleave="handleBeforeLeave"
  >
    <ChooseThemeModal
      :active-index="modalData?.data?.selectedThemeIndexes"
      v-if="modalData?.component === EModalComponent.CHOOSE_THEME_MODAL"
      @on-close="closeModal"
      @on-confirm="handleThemeChange"
    />
    <ChooseRatioModal
      :active-index="modalData?.data?.selectedRatioIndex"
      v-else-if="modalData?.component === EModalComponent.CHOOSE_RATIO_MODAL"
      @on-close="closeModal"
      @on-confirm="handleRatioChange"
    />
    <ChooseStyleModal
      :active-index="modalData?.data?.selectedStyleIndex"
      :type="modalData?.data?.type"
      v-else-if="
        modalData?.component === EModalComponent.CHOOSE_STORY_STYLE_MODAL ||
        modalData?.component === EModalComponent.CHOOSE_PICTURE_STYLE_MODAL
      "
      @on-close="closeModal"
      @on-confirm="handleStyleChange"
    />
    <ChooseLanguageModal
      :active-index="modalData?.data?.selectedLanguageIndex"
      v-else-if="modalData?.component === EModalComponent.CHOOSE_LANGUAGE_MODAL"
      @on-close="closeModal"
      @on-confirm="handleLanguageChange"
    />

    <RegenerateRoleModal
      :role="modalData.data.role"
      :ratio="formData.ratio"
      :pictureStyle="formData.pictureStyle"
      v-else-if="
        modalData?.component === EModalComponent.REGENERATE_ROLE_MODAL &&
        modalData.data.role
      "
      @on-close="closeModal"
      @on-confirm="handleConfirmRegeneratedRole"
    />
    <RegenerateSceneModal
      :scene="modalData.data.scene"
      :ratio="formData.ratio"
      :pictureStyle="formData.pictureStyle"
      v-else-if="
        modalData?.component === EModalComponent.REGENERATE_SCENE_MODAL &&
        modalData.data.scene
      "
      @on-close="closeModal"
      @on-confirm="handleConfirmRegeneratedScene"
    />
    <RegenerateCoverModal
      :cover="modalData.data.cover"
      :ratio="formData.ratio"
      :pictureStyle="formData.pictureStyle"
      v-else-if="
        modalData?.component === EModalComponent.REGENERATE_COVER_MODAL &&
        modalData.data.cover
      "
      @on-close="closeModal"
      @on-confirm="handleConfirmRegeneratedCover"
    />
  </page-container>
</template>

<script setup lang="ts">
import Layout from "@/components/layout/layout.vue";
import {
  authors,
  iconThemeVersion,
  languages,
  moralities,
  ratios,
  ThemeColors,
} from "@/config/config";
import { computed, nextTick, onMounted, provide, ref } from "vue";
import Configuration from "./views/configuration/configuration.vue";
import ConfirmStory from "./views/confirm-story/confirm-story.vue";
import ConfirmRoles from "./views/confirm-roles/confirm-roles.vue";
import ConfirmScenes from "./views/confirm-scenes/confirm-scenes.vue";
import ConfirmCover from "./views/confirm-cover/confirm-cover.vue";
import ConfirmAudio from "./views/confirm-audio/confirm-audio.vue";
import Finished from "./views/finished/finished.vue";
import ChooseThemeModal from "./modals/ChooseThemeModal.vue";
import { EModalComponent } from "./modals/types";
import ChooseRatioModal from "./modals/ChooseRatioModal.vue";
import ChooseStyleModal from "./modals/ChooseStyleModal.vue";
import ChooseLanguageModal from "./modals/ChooseLanguageModal.vue";
import RegenerateRoleModal from "./modals/RegenerateRoleModal.vue";
import RegenerateSceneModal from "./modals/RegenerateSceneModal.vue";
import RegenerateCoverModal from "./modals/RegenerateCoverModal.vue";

import { usePictureBookStore } from "@/stores/picture_book";
import { type ICreatePictureBookFormData, type IStory } from "./types";
import {
  type ICoverItem,
  type IRoleItem,
  type ISceneItem,
  EEmitEvents,
  type IPictureBook,
} from "@/types";

const pictureBookStore = usePictureBookStore();

const safeBottom = uni.getWindowInfo().safeAreaInsets?.bottom || 0;
const safeTop = uni.getWindowInfo().safeAreaInsets?.top || 0;

const { left: safeTitleWidth } = uni.getMenuButtonBoundingClientRect();

const modalVisible = ref(false);
const modalData = ref<{
  component?: string;
  [key: string]: any;
}>();

const createPictureBookSteps = [
  {
    label: "参数设置",
    value: "config",
    desc: "在这里，你可以设置绘本的各种参数。",
  },
  {
    label: "确认绘本故事",
    value: "confirm-story",
    desc: "确认绘本故事，确保故事内容符合你的预期。",
  },
  {
    label: "确认绘本角色",
    value: "confirm-roles",
    desc: "这些是故事里的主角们，满意吗？",
  },
  {
    label: "确认绘本场景",
    value: "confirm-scenes",
    desc: "这是绘本里的奇妙世界，满意吗？",
  },
  {
    label: "确认绘本封面",
    value: "confirm-cover",
    desc: "为你的故事选一个最漂亮的封面吧！",
  },
  {
    label: "确认绘本音频",
    value: "confirm-audio",
    desc: "为你的故事挑选一个好听的声音吧！",
  },
  {
    label: "创作完成",
    value: "finished",
    desc: "绘本创作完成，你可以分享给你的朋友了！",
  },
];

const currentStepIndex = ref(6);

const formData = ref<ICreatePictureBookFormData>({
  theme: "诚实与正直",
  storyStyle: "李欧·李奥尼",
  pictureStyle: "李欧·李奥尼",
  length: 500,
  language: "中文",
  roleCount: 0,
  sceneCount: 0,
  ratio: "9:16",
});

const story = ref<IStory>({
  id: "",
  title: "",
  content: [],
});

const r = {
  code: 200,
  message: "成功",
  action: "confirm-roles",
  data: {
    roles: [
      {
        code: 200,
        msg: "成功",
        data: {
          taskId: "67294d39cd4d68e4fe6326e2f7c4c89b",
          recordId: "67294d39cd4d68e4fe6326e2f7c4c89b",
          id: "role_1",
          name: "阿灰",
          prompt:
            "一只可爱的雄性松鼠，拥有蓬松柔软的大尾巴和圆圆的脑袋。身体覆盖着浅灰色的柔软毛发，肚皮是白色的。眼睛又大又圆，呈棕色，透着天真和好奇。耳朵尖上有小撮深灰色的毛。穿着浅蓝色的小背心。表情友善温暖。使用纯白色背景。",
          prompt_en:
            "A cute male squirrel with a fluffy and soft large tail and a round head. Body covered in soft light gray fur, with a white belly. Large, round brown eyes, full of innocence and curiosity. The tips of his ears have tufts of dark gray fur. Wearing a light blue vest. Friendly and warm expression. Use a pure white background.",
        },
      },
      {
        code: 200,
        msg: "成功",
        data: {
          taskId: "48469da7a7ab9387aec4b706dd3bda8f",
          recordId: "48469da7a7ab9387aec4b706dd3bda8f",
          id: "role_2",
          name: "小兔",
          prompt:
            "一只可爱的雌性兔子，长着长长的粉色耳朵和毛茸茸的白色身体。眼睛是明亮的蓝色，像两颗蓝宝石，闪烁着活泼的光芒。鼻子是粉色的，微微抽动着。脖子上系着一个红色的蝴蝶结。体型小巧圆润，看起来非常友善。使用纯白色背景。",
          prompt_en:
            "A cute female rabbit with long pink ears and a fluffy white body. Bright blue eyes, like sapphires, sparkling with liveliness. Pink nose, twitching slightly. Wears a red bow tie around her neck. Small and chubby body shape, appearing very friendly. Use a pure white background.",
        },
      },
    ],
  },
};

const s = {
  code: 200,
  message: "成功",
  action: "confirm-scenes",
  data: {
    scenes: [
      {
        code: 200,
        msg: "成功",
        data: {
          taskId: "4b888c693257d992008c10fc880372f5",
          recordId: "4b888c693257d992008c10fc880372f5",
          id: "scene_1",
          index: 1,
          content: "小松鼠小诚在树下捡到一颗闪亮的星星。",
          prompt:
            "特写镜头，阳光透过枝叶缝隙洒下斑驳光点。一只穿着橙红色背带裤和浅蓝色衬衫的可爱拟人小松鼠男孩，他正从森林地面上捡起一颗闪闪发光的、有着几个可爱小角的金色星星。他好奇地歪着头，眼睛睁得大大的，充满了惊喜和好奇。周围是柔软的草地和几片落叶，氛围温馨、奇幻而明亮，色彩柔和。",
          prompt_en:
            "A close-up shot with dappled light filtering through the gaps in the leaves. A cute anthropomorphic squirrel boy wearing orange-red overalls and a light blue shirt is picking up a shiny, golden star with several adorable little points from the forest floor. He tilts his head curiously, his eyes wide open, filled with surprise and wonder. The surroundings feature soft grass and a few fallen leaves. The atmosphere is warm, fantastical, and bright, with soft colors.",
          roleIds: ["role_1"],
          roleUrls: [
            "https://tempfile.aiquickdraw.com/workers/nano/image_1770100690097_a65upg.png",
          ],
        },
      },
      {
        code: 200,
        msg: "成功",
        data: {
          taskId: "06390bfaac7181dc785afe6821fecd4f",
          recordId: "06390bfaac7181dc785afe6821fecd4f",
          id: "scene_2",
          index: 2,
          content: "“这是谁的星星呢？”他想，“但它现在是我的了。”",
          prompt:
            "小松鼠的近景镜头，他双手小心翼翼地捧着一颗闪闪发光的金色星星，贴近胸前。他微微低头看着星星，表情从困惑转为开心的领悟。背景是模糊的森林树木，突出角色和星星。星星散发出柔和的金色光芒，照亮了小松鼠的脸庞，他脸上带着一丝调皮又满足的笑容，整体氛围温暖、亲切又带点小骄傲。",
          prompt_en:
            "A medium close-up shot of the squirrel boy. He holds a shiny golden star carefully with both hands, close to his chest. He looks down slightly at the star, his expression changing from confusion to happy realization. The background is a blurred forest tree, highlighting the character and the star. The star emits a soft golden light, illuminating the squirrel's face. He wears a slightly mischievous and content smile. The overall atmosphere is warm, intimate, and with a hint of pride.",
          roleIds: ["role_1"],
          roleUrls: [
            "https://tempfile.aiquickdraw.com/workers/nano/image_1770100690097_a65upg.png",
          ],
        },
      },
    ],
  },
};

const c = {
  code: 200,
  message: "请确认故事封面",
  action: "confirm-cover",
  data: {
    cover: [
      {
        code: 200,
        msg: "成功",
        data: {
          id: "cover_1",
          prompt:
            "绘本封面风格，可爱的拟人小松鼠男孩‘小诚’位于画面中心，他穿着橙红色背带裤和浅蓝色衬衫，兴奋地举着一颗闪闪发光、有着几个可爱小角的金色星星，脸上洋溢着惊喜和开心的笑容。背景是阳光明媚的森林，有高大的树木、柔软的草地和点点野花。整个画面充满明亮、温暖的色调，氛围奇幻、欢乐，适合儿童观看。",
          prompt_en:
            "Picture book cover style. The cute anthropomorphic squirrel boy 'Xiao Cheng' is at the center of the image. He wears orange-red overalls and a light blue shirt, excitedly holding up a shiny, golden star with several adorable little points, with a face full of surprise and happiness. The background is a sunny forest with tall trees, soft grass, and small wildflowers. The entire scene is filled with bright, warm colors. The atmosphere is fantastical and joyful, suitable for children.",
          roleIds: ["role_1"],
          roleUrls: [
            "https://tempfile.aiquickdraw.com/workers/nano/image_1770100690097_a65upg.png",
            "https://tempfile.aiquickdraw.com/workers/nano/image_1770100690322_j4qgfl.png",
          ],
          taskId: "98fc1cea7d5c8f20acb8e856504f1dc6",
          recordId: "98fc1cea7d5c8f20acb8e856504f1dc6",
        },
      },
    ],
  },
};

const p = {
  code: 200,
  message: "确认成功",
  data: {
    id: "4917c55b083be5aeba817bb4",
    title: "两个小木偶",
    content:
      "小木偶方方和小木偶圆圆都想要盒子里唯一的那颗糖。方方偷偷碰了盒子，糖掉了出来。\n----\n圆圆问是谁碰了盒子。方方看着圆圆诚实的大眼睛，小声说：“是我。对不起。”",
    title_zh: "",
    content_zh: "",
    authorId: "o_lhg1z2VXxGtPaGnVKpSbFbA70I",
    roles: [
      {
        id: "role_1",
        url: "https://tempfile.aiquickdraw.com/workers/nano/image_1770175746467_rv3r00.png",
        name: "方方",
        prompt:
          "一个可爱的小木偶男孩，使用纯白色背景。拥有圆润的木质身体，关节处有可爱的圆形连接。头部比例稍大，显得十分Q萌。棕色的木纹头发是俏皮的短发造型。脸上有红扑扑的木质脸颊，一双大大的黑色圆形眼睛显得机灵又有点调皮。穿着蓝色背带裤和白色T恤，笑起来很灿烂。",
        taskId: "fe54ff971a2fc92f2a5694803040c921",
        recordId: "fe54ff971a2fc92f2a5694803040c921",
        prompt_en:
          "An adorable little wooden puppet boy, using a pure white background. He has a rounded wooden body with cute circular joints at the connections. His head is proportionally larger, making him look very chibi and cute. He has playful short brown wooden-textured hair. His face features rosy wooden cheeks and a pair of large, black circular eyes that look clever and a bit mischievous. He wears blue overalls over a white T-shirt, and his smile is bright.",
      },
      {
        id: "role_2",
        url: "https://tempfile.aiquickdraw.com/workers/nano/image_1770175746491_n7fyv8.png",
        name: "圆圆",
        prompt:
          "一个可爱的小木偶女孩，使用纯白色背景。拥有圆润光滑的木质身体，关节连接处很可爱。头部圆圆的，非常讨喜。金色的木纹头发扎成两个小丸子头。脸上有粉粉的脸颊，一双清澈、诚实的大眼睛是深棕色的，眼神充满好奇和友善。穿着粉色的连衣裙，系着一个白色的围裙，看起来很乖巧。",
        taskId: "2576defb971d6e89d40cf152d7c673b8",
        recordId: "2576defb971d6e89d40cf152d7c673b8",
        prompt_en:
          "An adorable little wooden puppet girl, using a pure white background. She has a rounded and smooth wooden body with cute joints. Her head is perfectly round and very endearing. Her golden wooden-textured hair is styled into two small buns. Her face has rosy cheeks and a pair of clear, honest, large brown eyes, filled with curiosity and friendliness. She wears a pink dress with a white apron, looking very sweet and well-behaved.",
      },
    ],
    scenes: [
      {
        id: "scene_1",
        url: "https://tempfile.aiquickdraw.com/workers/nano/image_1770176260171_6jdg2a.png",
        index: 1,
        prompt:
          "儿童绘本卡通风格，在一个温馨明亮的房间里，一个漂亮的礼物盒放在桌子上。可爱的小木偶男孩方方（穿着蓝色背带裤）和小木偶女孩圆圆（穿着粉色连衣裙）都站在桌子旁，眼神充满渴望地盯着盒子。方方的手正偷偷地、轻轻地碰触盒子的边缘，导致盒子里唯一的一颗包装鲜艳的糖果滚落到了桌面上。画面充满戏剧性和动态感，聚焦于方方的动作和糖果掉落的瞬间。柔和的顶光，色彩明亮柔和。",
        taskId: "871ede3765a40195421a49d7b3a0e162",
        content:
          "小木偶方方和小木偶圆圆都想要盒子里唯一的那颗糖。方方偷偷碰了盒子，糖掉了出来。",
        roleIds: ["role_1", "role_2"],
        recordId: "871ede3765a40195421a49d7b3a0e162",
        roleUrls: [
          "https://tempfile.aiquickdraw.com/workers/nano/image_1770175746467_rv3r00.png",
          "https://tempfile.aiquickdraw.com/workers/nano/image_1770175746491_n7fyv8.png",
        ],
        prompt_en:
          "Children's picture book cartoon style, in a warm and bright room, a beautiful gift box is placed on a table. The adorable wooden puppet boy Fangfang (in blue overalls) and wooden puppet girl Yuanyuan (in a pink dress) are both standing by the table, their eyes full of longing as they gaze at the box. Fangfang's hand is secretly and gently touching the edge of the box, causing the single brightly wrapped candy inside to roll out onto the table. The scene is full of drama and dynamic motion, focusing on Fangfang's action and the moment the candy falls. Soft overhead lighting, bright and pastel colors.",
      },
      {
        id: "scene_2",
        url: "https://tempfile.aiquickdraw.com/workers/nano/image_1770176258281_i673xv.png",
        index: 2,
        prompt:
          "儿童绘本卡通风格，特写镜头，画面聚焦于小木偶方方和小木偶圆圆的脸部。圆圆微微歪着头，睁着她那双清澈、诚实的大眼睛，带着疑惑和关心的表情看着方方，她的嘴唇微张仿佛在提问。方方低着头，眼神有些闪烁和愧疚，他正抬眼看向圆圆那双真诚的眼睛。他的嘴巴微微张开，正在小声说话，表情充满了歉意和紧张。背景虚化以突出角色的情感交流，柔和的面部光线刻画了细腻的情绪。",
        taskId: "3ab9dc20b0ca3859f1f8c23491b4c6d2",
        content:
          "圆圆问是谁碰了盒子。方方看着圆圆诚实的大眼睛，小声说：“是我。对不起。”",
        roleIds: ["role_1", "role_2"],
        recordId: "3ab9dc20b0ca3859f1f8c23491b4c6d2",
        roleUrls: [
          "https://tempfile.aiquickdraw.com/workers/nano/image_1770175746467_rv3r00.png",
          "https://tempfile.aiquickdraw.com/workers/nano/image_1770175746491_n7fyv8.png",
        ],
        prompt_en:
          "Children's picture book cartoon style, close-up shot, the frame focuses on the faces of the wooden puppet Fangfang and Yuanyuan. Yuanyuan tilts her head slightly, her clear, honest big eyes wide open as she looks at Fangfang with a puzzled and concerned expression, her lips parted as if asking a question. Fangfang looks down, his eyes slightly evasive and full of guilt, as he lifts his gaze to meet Yuanyuan's sincere eyes. His mouth is slightly open, whispering, his expression filled with apology and nervousness. The background is blurred to emphasize the emotional exchange between the characters, with soft facial lighting highlighting the subtle emotions.",
      },
    ],
    createAt: "2026-02-04 11:28:09",
    status: 0,
    config: {
      ratio: "9:16",
      theme: "诚实与正直",
      length: 100,
      userId: "o_lhg1z2VXxGtPaGnVKpSbFbA70I",
      storyId: "4917c55b083be5aeba817bb4",
      language: "中文",
      roleCount: 2,
      sceneCount: 2,
      storyStyle: "李欧·李奥尼",
      pictureStyle: "李欧·李奥尼",
      redisExpiredTime: 86400,
    },
    cover: {
      id: "cover_1",
      url: "https://tempfile.aiquickdraw.com/workers/nano/image_1770176299413_mcpsxu.png",
      prompt:
        "儿童绘本封面风格，画面中心是一个打翻的漂亮礼物盒，一颗包装鲜艳的糖果躺在盒子旁边。可爱的小木偶方方（蓝色背带裤）站在盒子一侧，低着头，双手紧张地背在身后，脸上带着羞愧和后悔的表情。可爱的小木偶圆圆（粉色连衣裙）站在盒子另一侧，微微弯腰，伸出一只手仿佛要去捡糖果，同时转过头用她那双诚实的大眼睛关切地看着方方。背景是温馨的房间一角，整体色调明亮柔和，充满故事感和友爱氛围。标题文字区域留空。",
      taskId: "511d0c1dd41b45ecc39184f9b5c796bc",
      roleIds: ["role_1", "role_2"],
      recordId: "511d0c1dd41b45ecc39184f9b5c796bc",
      roleUrls: [
        "https://tempfile.aiquickdraw.com/workers/nano/image_1770175746467_rv3r00.png",
        "https://tempfile.aiquickdraw.com/workers/nano/image_1770175746491_n7fyv8.png",
      ],
      prompt_en:
        "Children's picture book cover style, at the center of the image is an overturned beautiful gift box, with a single brightly wrapped candy lying next to it. The adorable wooden puppet Fangfang (in blue overalls) stands on one side of the box, head bowed, hands nervously behind his back, with an expression of shame and regret on his face. The adorable wooden puppet Yuanyuan (in a pink dress) stands on the other side of the box, slightly bent over, reaching out a hand as if to pick up the candy, while turning her head to look at Fangfang with her honest big eyes filled with concern. The background is a cozy corner of a room. The overall color palette is bright and pastel, full of narrative and a friendly atmosphere. Space is left for the title text.",
    },
  },
};

// const pbDetail = ref<IPictureBook | undefined>();
const roles = ref<IRoleItem[]>([]);
const scenes = ref<ISceneItem[]>([]);
const cover = ref<ICoverItem[]>([]);

const pbDetail = ref<IPictureBook | undefined>(
  p.data as unknown as IPictureBook
);
// const roles = ref<IRoleItem[]>(r.data.roles.map((item: any) => item.data));
// const scenes = ref<ISceneItem[]>(s.data.scenes.map((item: any) => item.data));
// const cover = ref<ICoverItem[]>(c.data.cover.map((item: any) => item.data));

const selectedThemeIndexes = ref<number[]>([0, 0]);
const selectedStoryStyleIndex = ref<number>(0);
const selectedPictureStyleIndex = ref<number>(0);
const selectedLanguageIndex = ref<number>(0);
const selectedRatioIndex = ref<number>(0);

provide("formData", formData);
provide("selectedThemeIndexes", selectedThemeIndexes);
provide("selectedStoryStyleIndex", selectedStoryStyleIndex);
provide("selectedPictureStyleIndex", selectedPictureStyleIndex);
provide("selectedLanguageIndex", selectedLanguageIndex);
provide("selectedRatioIndex", selectedRatioIndex);
provide("story", story);
provide("roles", roles);
provide("scenes", scenes);
provide("cover", cover);
provide("pbDetail", pbDetail);

const renderStoryStyles = computed(() => {
  return [
    ...authors,
    {
      name: "自定义",
      en_name: "Custom",
      avatar:
        "https://img.liangqy.com/crawlerjet/picture_book/img/author/custom.jpg",
    },
  ];
});

const renderPictureStyles = computed(() => {
  return [
    ...authors,
    {
      name: "自定义",
      en_name: "Custom",
      avatar:
        "https://img.liangqy.com/crawlerjet/picture_book/img/author/custom.jpg",
    },
  ];
});

onMounted(() => {
  initData();

  uni.$on(
    EEmitEvents.OPEN_REGENERATE_ROLE_MODAL,
    handleOpenRegenerateRoleModal
  );
  uni.$on(
    EEmitEvents.OPEN_REGENERATE_SCENE_MODAL,
    handleOpenRegenerateSceneModal
  );
  uni.$on(
    EEmitEvents.OPEN_REGENERATE_COVER_MODAL,
    handleOpenRegenerateCoverModal
  );
});

function initData() {
  selectedLanguageIndex.value = languages.findIndex(
    (item) => item.name === formData.value.language
  );
  if (selectedLanguageIndex.value === -1) {
    selectedLanguageIndex.value = 0;
  }

  selectedStoryStyleIndex.value = renderStoryStyles.value.findIndex(
    (item) => item.name === formData.value.storyStyle
  );
  if (selectedStoryStyleIndex.value === -1) {
    selectedStoryStyleIndex.value = 0;
  }

  selectedPictureStyleIndex.value = renderPictureStyles.value.findIndex(
    (item) => item.name === formData.value.pictureStyle
  );
  if (selectedPictureStyleIndex.value === -1) {
    selectedPictureStyleIndex.value = 0;
  }

  selectedRatioIndex.value = ratios.findIndex(
    (item) => item === formData.value.ratio
  );
  if (selectedRatioIndex.value === -1) {
    selectedRatioIndex.value = 8;
  }
}

function handleChange(e: any) {
  currentStepIndex.value = e.detail.current;
}

function handleBack() {
  uni.navigateBack({
    fail: () => {
      uni.reLaunch({
        url: "/pages/index/index",
      });
    },
  });
}

function closeModal() {
  modalVisible.value = false;
}

function handleBeforeLeave() {
  if (modalData.value?.component === EModalComponent.REGENERATE_ROLE_MODAL) {
    uni.$emit(EEmitEvents.CANCEL_REGENERATE_ROLE, {
      role: modalData.value.data.role,
    });
  }
}

function showSelectThemeModal() {
  modalData.value = {
    component: EModalComponent.CHOOSE_THEME_MODAL,
    data: {
      selectedThemeIndexes: [0, 0],
    },
  };
  nextTick(() => {
    modalData.value = {
      component: EModalComponent.CHOOSE_THEME_MODAL,
      data: {
        selectedThemeIndexes: selectedThemeIndexes.value,
      },
    };
    modalVisible.value = true;
  });
}

function showSelectStoryStyleModal() {
  modalData.value = {
    component: EModalComponent.CHOOSE_STORY_STYLE_MODAL,
    data: {
      selectedStyleIndex: 0,
      type: "storyStyle",
    },
  };
  nextTick(() => {
    modalData.value = {
      component: EModalComponent.CHOOSE_STORY_STYLE_MODAL,
      data: {
        selectedStyleIndex: selectedStoryStyleIndex.value,
        type: "storyStyle",
      },
    };
    modalVisible.value = true;
  });
}

function showSelectPictureStyleModal() {
  modalData.value = {
    component: EModalComponent.CHOOSE_PICTURE_STYLE_MODAL,
    data: {
      selectedStyleIndex: 0,
      type: "pictureStyle",
    },
  };
  nextTick(() => {
    modalData.value = {
      component: EModalComponent.CHOOSE_PICTURE_STYLE_MODAL,
      data: {
        selectedStyleIndex: selectedPictureStyleIndex.value,
        type: "pictureStyle",
      },
    };
    modalVisible.value = true;
  });
}

function showSelectLanguageModal() {
  modalData.value = {
    component: EModalComponent.CHOOSE_LANGUAGE_MODAL,
    data: {
      selectedLanguageIndex: -1,
    },
  };
  nextTick(() => {
    modalData.value = {
      component: EModalComponent.CHOOSE_LANGUAGE_MODAL,
      data: {
        selectedLanguageIndex: selectedLanguageIndex.value,
      },
    };
    modalVisible.value = true;
  });
}

function showSelectRatioModal() {
  modalData.value = {
    component: EModalComponent.CHOOSE_RATIO_MODAL,
    data: {
      selectedRatioIndex: -1,
    },
  };
  nextTick(() => {
    modalData.value = {
      component: EModalComponent.CHOOSE_RATIO_MODAL,
      data: {
        selectedRatioIndex: selectedRatioIndex.value,
      },
    };
    modalVisible.value = true;
  });
}

function showRegenerateRoleModal(data: any) {
  modalData.value = {
    component: EModalComponent.REGENERATE_ROLE_MODAL,
    data: {
      role: null,
    },
  };
  nextTick(() => {
    modalData.value = {
      component: EModalComponent.REGENERATE_ROLE_MODAL,
      data: {
        role: data.role,
      },
    };
    modalVisible.value = true;
  });
}

function showRegenerateSceneModal(data: any) {
  modalData.value = {
    component: EModalComponent.REGENERATE_SCENE_MODAL,
    data: {
      scene: null,
    },
  };
  nextTick(() => {
    modalData.value = {
      component: EModalComponent.REGENERATE_SCENE_MODAL,
      data: {
        scene: data.scene,
      },
    };
    modalVisible.value = true;
  });
}

function showRegenerateCoverModal(data: any) {
  modalData.value = {
    component: EModalComponent.REGENERATE_COVER_MODAL,
    data: {
      cover: null,
    },
  };
  nextTick(() => {
    modalData.value = {
      component: EModalComponent.REGENERATE_COVER_MODAL,
      data: {
        cover: data.cover,
      },
    };
    modalVisible.value = true;
  });
}

function openModal(params: { component: string; data: any }) {
  if (params.component === EModalComponent.CHOOSE_THEME_MODAL) {
    showSelectThemeModal();
  } else if (params.component === EModalComponent.CHOOSE_STORY_STYLE_MODAL) {
    showSelectStoryStyleModal();
  } else if (params.component === EModalComponent.CHOOSE_PICTURE_STYLE_MODAL) {
    showSelectPictureStyleModal();
  } else if (params.component === EModalComponent.CHOOSE_LANGUAGE_MODAL) {
    showSelectLanguageModal();
  } else if (params.component === EModalComponent.CHOOSE_RATIO_MODAL) {
    showSelectRatioModal();
  } else if (params.component === EModalComponent.REGENERATE_ROLE_MODAL) {
    showRegenerateRoleModal(params.data);
  } else if (params.component === EModalComponent.REGENERATE_SCENE_MODAL) {
    showRegenerateSceneModal(params.data);
  } else if (params.component === EModalComponent.REGENERATE_COVER_MODAL) {
    showRegenerateCoverModal(params.data);
  }
}

function handleStyleChange(e: any) {
  if (e.type === "storyStyle") {
    selectedStoryStyleIndex.value = e.index;
    formData.value.storyStyle = e.value;
  } else if (e.type === "pictureStyle") {
    selectedPictureStyleIndex.value = e.index;
    formData.value.pictureStyle = e.value;
  }
  closeModal();
}

function handleThemeChange(e: any) {
  selectedThemeIndexes.value = [...e.index];
  formData.value.theme = e.value;
  closeModal();
}

function handleLanguageChange(e: any) {
  selectedLanguageIndex.value = e.index;
  formData.value.language = e.value;
  closeModal();
}

function handleRatioChange(e: any) {
  selectedRatioIndex.value = e.index;
  formData.value.ratio = e.value;
  closeModal();
}

function changeCustomTheme(e: any) {
  if (selectedThemeIndexes.value[0] === moralities.length) {
    formData.value.theme = e;
  }
}

function changeCustomStoryStyle(e: any) {
  if (selectedStoryStyleIndex.value === renderStoryStyles.value.length - 1) {
    formData.value.storyStyle = e;
  }
}

function changeCustomPictureStyle(e: any) {
  if (
    selectedPictureStyleIndex.value ===
    renderPictureStyles.value.length - 1
  ) {
    formData.value.pictureStyle = e;
  }
}

function changeStoryLength(value: number) {
  formData.value.length = value;
}

function changeRoleCount(value: number) {
  formData.value.roleCount = value;
}

function changeSceneCount(value: number) {
  formData.value.sceneCount = value;
}

async function handleGeneratedStory(e: any) {
  story.value = {
    id: e.id,
    title: e.story.title,
    content: e.story.content,
  };
  currentStepIndex.value = 1;
}

function handleRegenerateStory(e: any) {
  story.value = e.story;
  currentStepIndex.value = 1;
}

function handleConfirmedStory(e: any) {
  roles.value = e.roles.map((item: any) => item.data);
  currentStepIndex.value = 2;
}

function handleConfirmedRoles(e: any) {
  scenes.value = e.scenes.map((item: any) => item.data);
  currentStepIndex.value = 3;
}

function handleConfirmedScenes(e: any) {
  cover.value = e.cover.map((item: any) => item.data);
  currentStepIndex.value = 4;
}

function handleConfirmedCover(e: any) {
  pbDetail.value = e;
  currentStepIndex.value = 5;
}

function handleConfirmedAudio(e: any) {
  currentStepIndex.value = 6;
}

function handleOpenRegenerateRoleModal(e: any) {
  openModal({
    component: EModalComponent.REGENERATE_ROLE_MODAL,
    data: {
      role: e.role,
    },
  });
}

function handleOpenRegenerateSceneModal(e: any) {
  openModal({
    component: EModalComponent.REGENERATE_SCENE_MODAL,
    data: {
      scene: e.scene,
    },
  });
}

function handleOpenRegenerateCoverModal(e: any) {
  openModal({
    component: EModalComponent.REGENERATE_COVER_MODAL,
    data: {
      cover: e.cover,
    },
  });
}

function handleConfirmRegeneratedRole(e: any) {
  // 重新生成角色
  roles.value = roles.value.map((item: IRoleItem) => {
    if (item.id === e.role.id) {
      return e.role;
    }
    return item;
  });
}

function handleConfirmRegeneratedScene(e: any) {
  // 重新生成场景
  scenes.value = scenes.value.map((item: ISceneItem) => {
    if (item.id === e.scene.id) {
      return e.scene;
    }
    return item;
  });
}

function handleConfirmRegeneratedCover(e: any) {
  // 重新生成封面
  cover.value = cover.value.map((item: ICoverItem) => {
    if (item.id === e.cover.id) {
      return e.cover;
    }
    return item;
  });
}
</script>

<style lang="scss">
:deep(.custom-input-placeholder) {
  color: #c8c8c8;
}
</style>

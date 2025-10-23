import { defineStore, storeToRefs } from "pinia";
import { ref, watch } from "vue";
import LivingPlayer from "../living/LivingPlayer.vue";
import {
  ELiveState,
  EUserRole,
  EUserType,
  IConfiguration,
  IPlaybackDetail,
  IRoomDetail,
} from "../types";
import {
  getRoomDetail,
  getSingleRecord,
  getTencentTrtcSign,
} from "@/servers/api/clive";
import { useUserStore } from "@mp-substrate";
import { formatCount } from "../utils/utils";

export interface UseLivingStoreOptions {
  roomId?: string;
}

export type ClearScreenArea = "title" | "watermark" | "all";

export const useLivingStore = defineStore("living", () => {
  const roomId = ref("");

  const roomDetail = ref<IRoomDetail>();

  const playbackDetail = ref<IPlaybackDetail>();

  const isReady = ref(false);

  const viewCount = ref(0);
  const likeCount = ref(0);
  const likeCountStr = ref("0");

  const titleVisible = ref(true);
  const watermarkVisible = ref(true);

  const livingPlayer = ref<InstanceType<typeof LivingPlayer>>();

  const trtcConfig = ref<IConfiguration>();

  const userStore = useUserStore();
  const { isLogin } = storeToRefs(userStore);

  watch(isLogin, () => {
    getTrtcConfig();
  });

  async function init(options?: UseLivingStoreOptions) {
    roomId.value = options?.roomId || "";

    // livingPlayer.value = options?.livingPlayer

    await Promise.all([initRoomDetail(), getTrtcConfig()]);

    isReady.value = true;
  }

  async function initRoomDetail() {
    if (!roomId.value) {
      return;
    }

    const res = await getRoomDetail({ roomId: roomId.value });

    if (res.code === 200 && res.data) {
      roomDetail.value = res.data;
      viewCount.value = res.data.stats?.viewCount || 0;
      likeCount.value = res.data.stats?.likeCount || 0;
      likeCountStr.value = res.data.stats?.likeCountStr || "0";
      // roomDetail.value!.room.liveState = 4
      // roomDetail.value!.room.topic = '高薪优选岗，智联视频见智联视频见联视频见'
      // roomDetail.value!.room.liveState = 2
      // roomDetail.value!.streamUrl = 'rtmp://liteavapp.qcloud.com/live/liteavdemoplayerstreamid'
    }
  }

  async function getTrtcConfig() {
    const res = await getTencentTrtcSign({
      roomId: roomId.value,
      userType: EUserType.C,
      userRole: EUserRole.AUDIENCE,
    });

    if (res.code !== 200) return;
    trtcConfig.value = res.data;
  }

  function setLivingPlayer(params: {
    player: InstanceType<typeof LivingPlayer>;
  }) {
    livingPlayer.value = params.player;
  }

  function setViewCount(count: number) {
    viewCount.value = Math.max(count, viewCount.value);
  }

  function setLikeCount(count: number) {
    likeCount.value = Math.max(count, likeCount.value);
    likeCountStr.value = formatCount(likeCount.value);
  }

  function likeCountPlus(count: number) {
    likeCount.value = +likeCount.value + count;
    likeCountStr.value = formatCount(likeCount.value);
  }

  function startLive() {
    // livingPlayer.value?.startLive()
    console.log(">>>>>>>>>>> startLive");
  }

  function stopLive() {
    // livingPlayer.value?.stopLive()
    roomDetail.value!.room.liveState = ELiveState.ENDED;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function clearScreen(area?: ClearScreenArea[]) {
    if (!area || area.length === 0 || area.includes("all")) {
      livingPlayer.value?.clearScreen();
    } else {
      if (area.includes("title")) {
        titleVisible.value = false;
      }
      if (area.includes("watermark")) {
        watermarkVisible.value = false;
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function restoreScreen() {
    livingPlayer.value?.restoreScreen();
    titleVisible.value = true;
    watermarkVisible.value = true;
  }

  function showTitle() {
    titleVisible.value = true;
  }

  function hideTitle() {
    titleVisible.value = false;
  }

  function showWatermark() {
    watermarkVisible.value = true;
  }

  function hideWatermark() {
    watermarkVisible.value = false;
  }

  function resetRoomDetail() {
    roomDetail.value = undefined;
    isReady.value = false;
  }

  async function getPlaybackDetail() {
    if (!roomId.value) {
      return "";
    }

    const res = await getSingleRecord({ roomId: Number(roomId.value) });

    if (res.code === 200 && res.data) {
      playbackDetail.value = res.data;
      // const ran = Math.random()
      // if (ran < 0.5) {
      //   playbackDetail.value!.url = 'http://adsfas.zhaopin.com/adsfas.mp4'
      // }
    }
    return playbackDetail.value?.url || "";
  }

  return {
    isReady,
    viewCount,
    livingPlayer,
    trtcConfig,
    roomDetail,
    titleVisible,
    watermarkVisible,
    playbackDetail,
    likeCountStr,
    init,
    getTrtcConfig,
    setViewCount,
    setLikeCount,
    likeCountPlus,
    startLive,
    stopLive,
    setLivingPlayer,
    clearScreen,
    restoreScreen,
    showTitle,
    hideTitle,
    showWatermark,
    hideWatermark,
    resetRoomDetail,
    getPlaybackDetail,
  };
});

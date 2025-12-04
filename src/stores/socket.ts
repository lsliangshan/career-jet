import { defineStore } from "pinia";
import { ref } from "vue";
import qs from "qs";

export enum SocketType {
  // QRCode登录
  CRAWLERJET_THIRD_QRCODE_LOGIN = "/crawlerjet-third-qrcode-login",
}

export const useSocketStore = defineStore("socket", () => {
  // const baseUrl = "wss://127.0.0.1:4000";
  const baseUrl = "wss://napi.liangqy.com";

  const sockets = ref<Map<string, UniApp.SocketTask>>(new Map());

  async function createSocket(params: {
    url?: string;
    type?: SocketType;
    params?: {
      [key: string]: any;
    };
    method?: "GET" | "POST";
    header?: {
      [key: string]: string;
    };
    onOpen?: (result: UniApp.OnSocketOpenCallbackResult) => void;
    onClose?: (result: any) => void;
    onError?: (result: UniApp.GeneralCallbackResult) => void;
    onMessage?: (result: UniApp.OnSocketMessageCallbackResult) => void;
  }): Promise<UniApp.SocketTask> {
    const socketId = `${sockets.value.size + 1}`;

    const socketTask: UniApp.SocketTask = uni.connectSocket({
      url:
        params.url || `${baseUrl}${params.type}?${qs.stringify(params.params)}`,
      method: params.method || "GET",
      header: params.header,
      success: (res) => {
        // console.log(">>>>>> res", res);
      },
      fail: (err) => {
        // console.log(">>>>>> err", err);
      },
      complete: () => {
        // console.log(">>>>>> complete");
      },
    });
    sockets.value.set(socketId, socketTask);

    if (params.onOpen) {
      socketTask.onOpen(params.onOpen!);
    }
    if (params.onClose) {
      socketTask.onClose(params.onClose!);
    }
    if (params.onError) {
      socketTask.onError(params.onError!);
    }
    if (params.onMessage) {
      socketTask.onMessage(params.onMessage!);
    }
    return socketTask;
  }

  return {
    sockets,
    createSocket,
  };
});

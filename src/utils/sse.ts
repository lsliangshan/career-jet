// utils/useStreamingRequest.js
import { ref } from "vue";

export function useStreamingRequest() {
  const isLoading = ref(false);
  let requestTask: any = null;
  let buffer: string = ""; // 用于拼接可能被拆分的数据包

  function sendStreamRequest(
    params: {
      url: string,
      method: "GET" | "POST",
      data?: any,
      header?: {
        [key: string]: string;
      };
      onMessage?: (data: any) => void;
      onError?: (error: any) => void;
      onComplete?: () => void;
    }
  ) {
    isLoading.value = true;
    buffer = ""; // 重置缓冲区

    requestTask = uni.request({
      url: params.url,
      method: params.method, // 根据后端接口调整
      data: params.data,
      header: {
        "Content-Type": "application/json",
        Accept: "text/event-stream", // 告知服务器需要SSE流
        ...params.header,
      },
      enableChunked: true, // **核心：启用分块传输**
      // responseType: "arraybuffer", // **核心：响应类型设为arraybuffer**
      success: (res) => {
        // 注意：开启 enableChunked 后，完整响应最终会走到这里，但主要数据在 onChunkReceived
        // console.log("请求成功（最终响应）:", res);
      },
      fail: (err) => {
        params.onError?.(err);
      },
      complete: () => {
        isLoading.value = false;
        params.onComplete?.();
      },
    });

    // **核心：监听分块数据接收**
    requestTask.onChunkReceived((res: any) => {
      try {
        // 1. 将 ArrayBuffer 转换为字符串
        const uint8Array = new Uint8Array(res.data);
        // 优先使用 TextDecoder
        const text =
          typeof TextDecoder !== "undefined"
            ? new TextDecoder("utf-8").decode(uint8Array)
            : String.fromCharCode.apply(null, Array.from(uint8Array));

        buffer += text;

        // 2. 按SSE协议解析数据（以\n\n为消息结束符）
        const lines = buffer.split("\n");
        buffer = ""; // 清空buffer，实际处理中可能需要更精细的拼接逻辑
        // 或者遍历lines，将未处理完的部分存回buffer

        for (let line of lines) {
          line = line.trim();
          if (line.startsWith("data:")) {
            const eventData = line.substring(5).trim();
            // 如果数据是JSON，可以解析
            try {
              const jsonData = JSON.parse(eventData);
              console.log('>>>>> jsonData: ', jsonData)
              params.onMessage?.(jsonData);
            } catch (e) {
              console.log('>>>>>>> errroror', e)
              // 非JSON数据，直接返回
              params.onMessage?.(eventData);
            }
          }
          // 可以处理其他SSE字段，如 'event:', 'id:'
        }
      } catch (error) {
        console.warn("处理数据块时出错:", error);
      }
    });
  }

  function abortRequest() {
    if (requestTask) {
      requestTask.abort();
      requestTask = null;
    }
  }

  return {
    isLoading,
    sendStreamRequest,
    abortRequest,
  };
}

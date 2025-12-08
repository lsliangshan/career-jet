import CryptoJS from "crypto-js";
import { uuid } from "@/utils";

export interface IAsrConfig {
  /**
   * 录音的时长，单位 ms，最大值 600000（10 分钟）
   * 默认: 60000
   */
  duration?: number;
  /**
   * 采样率（pc不支持）
   * 默认: 8000
   */
  sampleRate?:
    | 8000
    | 11025
    | 12000
    | 16000
    | 22050
    | 24000
    | 32000
    | 44100
    | 48000;
  /**
   * 录音通道数
   * 默认: 2
   */
  numberOfChannels?: 1 | 2;
  /**
   * 编码码率
   * 默认: 48000
   */
  encodeBitRate?: 48000;
  /**
   * 音频格式
   * 默认: aac
   */
  format?: "mp3" | "aac" | "wav" | "PCM";
  /**
   * 指定帧大小，单位 KB。传入 frameSize 后，每录制指定帧大小的内容后，会回调录制的文件内容，不指定则不会回调。暂仅支持 mp3、pcm 格式。
   * 默认: 不指定
   */
  frameSize?: number;
}

export interface AsrResult {
  text: string;
  isFinal: boolean;
  volume?: number;
  sessionId?: string;
}

export interface AsrError {
  code: number;
  message: string;
  detail?: any;
}

export type AsrEventCallback = (result: AsrResult) => void;
export type AsrErrorCallback = (error: AsrError) => void;
export type AsrStatusCallback = (status: string) => void;

const secretId = import.meta.env.VITE_TENCENT_ASR_SECRET_ID;
const secretKey = import.meta.env.VITE_TENCENT_ASR_SECRET_KEY;
const appId = import.meta.env.VITE_TENCENT_ASR_APP_ID;
const engineModelType = "16k_zh";

function generateSignature(params: {
  timestamp: number;
  nonce: number;
  voiceId: string;
}) {
  const rawString = `asr.cloud.tencent.com/asr/v2/${appId}?engine_model_type=${engineModelType}&expired=${
    params.timestamp + 24 * 60 * 60
  }&needvad=1&nonce=${params.nonce}&secretid=${secretId}&timestamp=${
    params.timestamp
  }&voice_format=1&voice_id=${params.voiceId}`;
  const hmac = CryptoJS.HmacSHA1(
    CryptoJS.enc.Utf8.parse(rawString),
    CryptoJS.enc.Utf8.parse(secretKey)
  );
  return CryptoJS.enc.Base64.stringify(hmac);
}

function getAsrServerUrl() {
  const timestamp = Math.floor(Date.now() / 1000);
  const voiceId = uuid();
  const nonce = Math.floor(Math.random() * 10000);
  const signature = generateSignature({
    timestamp: timestamp,
    nonce: nonce,
    voiceId: voiceId,
  });
  return `wss://asr.cloud.tencent.com/asr/v2/${appId}?engine_model_type=${engineModelType}&expired=${
    timestamp + 24 * 60 * 60
  }&needvad=1&nonce=${nonce}&secretid=${secretId}&timestamp=${timestamp}&voice_format=1&voice_id=${voiceId}&signature=${encodeURIComponent(
    signature
  )}`;
}

export default class TencentAsrService {
  private config: IAsrConfig = {
    duration: 60000,
    sampleRate: 8000,
    numberOfChannels: 2,
    encodeBitRate: 48000,
    format: "aac",
  };

  private requestId: number = 0;

  // 录音管理
  private recorderManager: UniApp.RecorderManager | null = null;
  private isRecording: boolean = false;

  // WebSocket管理
  private socketTask: UniApp.SocketTask | null = null;
  private isConnected: boolean = false;
  private isRecognizing: boolean = false;

  // 录音参数（根据腾讯云要求设置）
  private readonly recordOptions: UniApp.RecorderManagerStartOptions = {
    duration: 60000,
    sampleRate: 16000, // 16kHz 采样率
    numberOfChannels: 1, // 单声道
    encodeBitRate: 48000,
    format: "mp3", // 或 'aac'，需与 voiceFormat 对应
    frameSize: 2048, // 每帧大小
  };

  // 事件回调
  private onResultCallback?: AsrEventCallback;
  private onErrorCallback?: AsrErrorCallback;
  private onStatusCallback?: AsrStatusCallback;

  constructor(config?: IAsrConfig) {
    // this.config = {
    //   engineModelType: '16k_zh',
    //   voiceFormat: 2,      // 2-mp3, 4-pcm, 5-speex
    //   needVad: 1,          // 开启静音检测
    //   ...config
    // }
    this.initRecorder();
  }

  // 初始化录音管理器
  private initRecorder(): void {
    this.recorderManager = uni.getRecorderManager();

    console.log(">>>>>>>>> initRecorder: ", this.recorderManager);

    // 监听录音帧数据（实时传输的关键）
    this.recorderManager.onFrameRecorded((res) => {
      console.log(">>>>>>>>> onFrameRecorded: ", res);
      if (this.isRecognizing && res.frameBuffer) {
        this.sendAudioFrame(res.frameBuffer, res.isLastFrame);
      }
    });

    // 录音错误处理
    this.recorderManager.onError((err) => {
      this.handleError({
        code: -1001,
        message: `录音错误: ${err.errMsg}`,
      });
    });
  }

  // 初始化WebSocket连接
  public async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.updateStatus("正在连接...");
        const wssUrl = getAsrServerUrl();
        this.socketTask = uni.connectSocket({
          url: wssUrl,
          success: (res) => {
            resolve();
          },
        });
        this.setupSocketListeners();
      } catch (err: any) {
        reject(new Error(`连接失败: ${err.message}`));
      }
    });
  }

  // 设置WebSocket监听器
  private setupSocketListeners(): void {
    if (!this.socketTask) return;
    this.socketTask.onOpen(() => {
      this.isConnected = true;
      this.updateStatus("已连接");
      console.log("✅ WebSocket连接成功");

      // 发送初始化请求
      // this.sendInitialRequest();
    });

    this.socketTask.onMessage((res) => {
      console.log(">>>>>>>>>>>>>>> onMessage: ", res);
      this.handleServerMessage(res.data);
    });

    this.socketTask.onClose(() => {
      this.isConnected = false;
      this.isRecognizing = false;
      this.updateStatus("已断开");
      console.log("🔌 WebSocket连接关闭");
    });

    this.socketTask.onError((err) => {
      this.handleError({
        code: -1002,
        message: `WebSocket错误: ${err.errMsg}`,
      });
    });
  }

  // 发送初始化请求
  private sendInitialRequest(): void {
    const requestId = this.generateRequestId();
    const initRequest = {
      request: {
        requestId: requestId.toString(),
        appId: appId,
        secretId: secretId, // 实际项目中可能需要 secretId
        timestamp: Math.floor(Date.now() / 1000),
        expired: Math.floor(Date.now() / 1000) + 24 * 3600,
        // engineModelType: this.config.engineModelType,
        // voiceFormat: this.config.voiceFormat,
        // needVad: this.config.needVad,
        // hotwordId: this.config.hotwordId || '',
        speakerDiarization: 0,
        filterDirty: 0,
        filterModal: 0,
        filterPunc: 0,
        convertNumMode: 1,
        wordInfo: 0,
        firstChannelOnly: 1,
      },
      audio: "",
    };

    this.send(JSON.stringify(initRequest));
  }

  // 开始语音识别
  public async startRecognition(): Promise<void> {
    // 检查权限
    try {
      await uni.authorize({ scope: "scope.record" });
    } catch (err) {
      this.handleError({
        code: -1003,
        message: "麦克风权限未授权",
      });
      throw err;
    }

    // 检查连接
    if (!this.isConnected) {
      try {
        await this.connect();
      } catch (err: any) {
        throw new Error(`连接未就绪: ${err.message}`);
      }
    }

    // 开始录音
    this.isRecognizing = true;
    this.recorderManager?.start(this.recordOptions);
    this.isRecording = true;
    this.updateStatus("正在录音识别中...");

    console.log("🎤 开始语音识别");
  }

  // 停止语音识别
  public stopRecognition(): void {
    this.isRecognizing = false;
    this.recorderManager?.stop();
    this.isRecording = false;

    // 发送结束标记
    this.sendAudioFrame(new ArrayBuffer(0), true);

    this.updateStatus("识别结束");
    console.log("🛑 停止语音识别");
  }

  // 发送音频帧数据
  private sendAudioFrame(
    audioBuffer: ArrayBuffer,
    isLast: boolean = false
  ): void {
    if (!this.socketTask || !this.isConnected) return;

    const requestId = this.generateRequestId();

    // 将音频数据转换为base64
    const base64Audio = this.arrayBufferToBase64(audioBuffer);

    console.log(">>>>>>> send: ", base64Audio);

    const audioRequest = {
      request: {
        requestId: requestId.toString(),
        audioEnd: isLast ? 1 : 0,
      },
      audio: base64Audio,
    };
    console.log(
      ">>>>>>>>...... JSON.stringify(audioRequest)",
      JSON.stringify(audioRequest)
    );
    this.send(JSON.stringify(audioRequest));
  }

  // 处理服务端消息
  private handleServerMessage(data: string | ArrayBuffer): void {
    if (typeof data !== "string") {
      console.warn("收到非文本消息，忽略");
      return;
    }

    try {
      const message = JSON.parse(data);

      // 处理不同的消息类型
      if (message.code === 0 && message.message === "SUCCESS") {
        // 识别结果
        const result: AsrResult = {
          text: message.result?.text || "",
          isFinal: message.result?.final === 1,
          volume: message.result?.volume,
          sessionId: message.sessionId,
        };

        this.onResultCallback?.(result);

        if (result.isFinal) {
          console.log("📝 最终结果:", result.text);
        }
      } else if (message.code !== 0) {
        // 错误处理
        this.handleError({
          code: message.code,
          message: message.message || "识别错误",
          detail: message,
        });
      }

      // 处理中间状态
      if (message.status) {
        this.updateStatus(message.status);
      }
    } catch (err) {
      console.error("消息解析失败:", err, "原始数据:", data);
    }
  }

  // 发送数据
  private send(data: string): void {
    if (this.socketTask && this.isConnected) {
      this.socketTask.send({ data });
    }
  }

  // 断开连接
  public disconnect(): void {
    if (this.isRecording) {
      this.stopRecognition();
    }

    if (this.socketTask) {
      // this.socketTask.close()
      this.socketTask = null;
    }

    this.isConnected = false;
    this.updateStatus("已断开连接");
  }

  // 生成请求ID
  private generateRequestId(): number {
    return ++this.requestId;
  }

  // ArrayBuffer转Base64
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    if (buffer.byteLength === 0) return "";

    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return uni.arrayBufferToBase64
      ? uni.arrayBufferToBase64(buffer)
      : btoa(binary);
  }

  // 错误处理
  private handleError(error: AsrError): void {
    console.error("ASR错误:", error);
    this.onErrorCallback?.(error);
    this.updateStatus(`错误: ${error.message}`);
  }

  // 状态更新
  private updateStatus(status: string): void {
    console.log("状态:", status);
    this.onStatusCallback?.(status);
  }

  // 设置回调
  public onResult(callback: AsrEventCallback): this {
    this.onResultCallback = callback;
    return this;
  }

  public onError(callback: AsrErrorCallback): this {
    this.onErrorCallback = callback;
    return this;
  }

  public onStatus(callback: AsrStatusCallback): this {
    this.onStatusCallback = callback;
    return this;
  }

  // 获取当前状态
  public getStatus(): {
    isRecording: boolean;
    isConnected: boolean;
    isRecognizing: boolean;
  } {
    return {
      isRecording: this.isRecording,
      isConnected: this.isConnected,
      isRecognizing: this.isRecognizing,
    };
  }

  // 销毁资源
  public destroy(): void {
    this.disconnect();

    if (this.recorderManager) {
      this.recorderManager.stop();
      // 移除所有监听器
      this.recorderManager.onStop(() => {});
      this.recorderManager.onError(() => {});
      this.recorderManager.onFrameRecorded(() => {});
    }

    this.onResultCallback = undefined;
    this.onErrorCallback = undefined;
    this.onStatusCallback = undefined;

    console.log("♻️ 服务资源已清理");
  }
}

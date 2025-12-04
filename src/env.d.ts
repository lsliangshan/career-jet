/// <reference types="vite/client" />

declare module "*.vue" {
  import { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "pinia";

interface ImportMetaEnv {
  readonly VITE_TENCENT_ASR_SECRET_ID: string;
  readonly VITE_TENCENT_ASR_SECRET_KEY: string;
  readonly VITE_TENCENT_ASR_APP_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

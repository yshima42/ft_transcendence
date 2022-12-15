/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  // ここに定義した変数を追加していく
  readonly VITE_WS_BASE_URL: string;
  // readonly VITE_WS_CHAT_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

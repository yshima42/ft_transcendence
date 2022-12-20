/// <reference types="vite/client" />

interface ImportMetaEnv {
  // ここに定義した変数を追加していく
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_URL: string;
  readonly VITE_WS_BASE_URL: string;
  readonly VITE_WS_CHAT_URL: string;
  readonly VITE_WS_DM_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

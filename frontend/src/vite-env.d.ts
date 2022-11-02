/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // ここに定義した変数を追加していく
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

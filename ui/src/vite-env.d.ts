interface ImportMetaEnv {
  readonly VITE_ENABLE_MOCK: string;
  readonly VITE_AUTHORITY: string;
  readonly VITE_REDIRECT_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

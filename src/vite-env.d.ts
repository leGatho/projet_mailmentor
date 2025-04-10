/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LAPLATEFORME_API_KEY: string;
  // ajouter d'autres variables d'environnement si nécessaire
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 
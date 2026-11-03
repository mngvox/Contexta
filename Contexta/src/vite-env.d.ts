/// <reference types="vite/client" />

interface Window {
  contexta?: { platform: () => Promise<string> };
}

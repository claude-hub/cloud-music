//全局变量定义

import { MusicInfo } from ".";

declare global {
  interface Window {
    list: MusicInfo[];
  }
}

export {};

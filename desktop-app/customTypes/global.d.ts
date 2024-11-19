import { ipcRenderer, shell } from 'electron';

export {};

interface ScreenshotSource {
  id: string;
  name: string;
  dataURL: string;
}

export interface IElectronAPI {
  getToken: () => string | null;
  setToken: (token: string) => void;
  captureScreenshot: () => Promise<ScreenshotSource[] | null>;
  onMouseMove: (callback: (data: { x: number; y: number }) => void) => void;
  onKeyPress: (callback: (keycode: number) => void) => void;
}


declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}

interface AnyObject {
  [key: string]: any;
}

interface MemoryInfo {
  jsHeapSizeLimit: number;
  totalJSHeapSize: number;
  usedJSHeapSize: number;
}

declare global {
  interface Window {
    performance: {
      memory: MemoryInfo;
    };
    ipcRenderer: typeof ipcRenderer;
    systemInfo: {
      platform: string;
      release: string;
      arch: string;
      nodeVersion: string;
      electronVersion: string;
    };
    shell: {
      shell: typeof shell;
    };
    crash: {
      start: () => void;
    };
  }
}

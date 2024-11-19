import { contextBridge, ipcRenderer, IpcRendererEvent, shell, screen, desktopCapturer, globalShortcut } from 'electron';
import { platform, release, arch } from 'os';
import path from 'path';

// Define interfaces for type safety
interface ScreenshotSource {
  id: string;
  name: string;
  dataURL: string;
}

type MouseMoveCallback = (data: { x: number; y: number }) => void;
type KeyPressCallback = (keycode: number) => void;

// Expose electron API
contextBridge.exposeInMainWorld('electronAPI', {
  getToken: () => localStorage.getItem('token'),
  setToken: (token: string) => localStorage.setItem('token', token),
  getDirname: () => __dirname,
  joinPath: (...args: string[]) => path.join(...args),

  // Screenshot capture with proper error handling
  captureScreenshot: async (): Promise<ScreenshotSource[] | null> => {
    try {
      // Use ipcRenderer to handle screen capture in the main process
      return await ipcRenderer.invoke('capture-screenshot');
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      return null;
    }
  },

  // Mouse movement tracking with proper typing
  onMouseMove: (callback: MouseMoveCallback) => {
    const mouseHandler = (e: MouseEvent) => {
      callback({ x: e.screenX, y: e.screenY });
    };
    document.addEventListener('mousemove', mouseHandler);
    // Return cleanup function
    return () => document.removeEventListener('mousemove', mouseHandler);
  },

  // Keyboard tracking with proper typing
  onKeyPress: (callback: KeyPressCallback) => {
    const keyHandler = (e: KeyboardEvent) => {
      callback(e.keyCode);
    };
    document.addEventListener('keydown', keyHandler);
    // Return cleanup function
    return () => document.removeEventListener('keydown', keyHandler);
  },
});

// IPC communication
contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (channel: string, args?: unknown) => ipcRenderer.send(channel, args),
  sendSync: (channel: string, args?: unknown) => ipcRenderer.sendSync(channel, args),
  on: (channel: string, listener: (event: IpcRendererEvent, ...args: unknown[]) => void) => {
    ipcRenderer.on(channel, listener);
    return () => ipcRenderer.removeListener(channel, listener);
  },
  once: (channel: string, listener: (event: IpcRendererEvent, ...args: unknown[]) => void) => ipcRenderer.once(channel, listener),
  invoke: (channel: string, args?: unknown) => ipcRenderer.invoke(channel, args),
  removeAllListeners: (channel: string) => ipcRenderer.removeAllListeners(channel),
});

// System information
contextBridge.exposeInMainWorld('systemInfo', {
  platform: platform(),
  release: release(),
  arch: arch(),
});

// Shell operations
contextBridge.exposeInMainWorld('shell', {
  shell,
});

// Crash reporting
contextBridge.exposeInMainWorld('crash', {
  start: () => {
    process.crash();
  },
});

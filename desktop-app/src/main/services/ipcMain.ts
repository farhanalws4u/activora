import { ipcMain, dialog, BrowserWindow, app } from 'electron';
import { join } from 'path';
import config from '@config/index';
import { winURL } from '../config/StaticPath';
import { updater } from './HotUpdater';
import DownloadFile from './downloadFile';
import Update from './checkupdate';

export default {
  Mainfunc() {
    const allUpdater = new Update();

    // Handle system title bar usage
    ipcMain.handle('IsUseSysTitle', async () => {
      return config.IsUseSysTitle;
    });

    // Minimize window
    ipcMain.handle('windows-mini', (event, args) => {
      BrowserWindow.fromWebContents(event.sender)?.minimize();
    });

    // Maximize or restore window
    ipcMain.handle('window-max', async (event, args) => {
      if (BrowserWindow.fromWebContents(event.sender)?.isMaximized()) {
        BrowserWindow.fromWebContents(event.sender)?.restore();
        return { status: false };
      }
      BrowserWindow.fromWebContents(event.sender)?.maximize();
      return { status: true };
    });

    // Close window
    ipcMain.handle('window-close', (event, args) => {
      BrowserWindow.fromWebContents(event.sender)?.close();
    });

    // Quit the application
    ipcMain.handle('app-close', (event, args) => {
      app.quit();
    });

    // Check for updates
    ipcMain.handle('check-update', (event) => {
      allUpdater.checkUpdate(BrowserWindow.fromWebContents(event.sender));
    });

    // Confirm update and install
    ipcMain.handle('confirm-update', () => {
      allUpdater.quitAndInstall();
    });

    // Open a message box dialog
    ipcMain.handle('open-messagebox', async (event, arg) => {
      const res = await dialog.showMessageBox(BrowserWindow.fromWebContents(event.sender), {
        type: arg.type || 'info',
        title: arg.title || '',
        buttons: arg.buttons || [],
        message: arg.message || '',
        noLink: arg.noLink || true,
      });
      return res;
    });

    // Open an error box dialog
    ipcMain.handle('open-errorbox', (event, arg) => {
      dialog.showErrorBox(arg.title, arg.message);
    });

    // Trigger hot update
    ipcMain.handle('hot-update', (event, arg) => {
      updater(BrowserWindow.fromWebContents(event.sender));
    });

    // Start downloading a file
    ipcMain.handle('start-download', (event, msg) => {
      new DownloadFile(BrowserWindow.fromWebContents(event.sender), msg.downloadUrl).start();
    });

    // Open a child window
    ipcMain.handle('open-win', (event, arg) => {
      const ChildWin = new BrowserWindow({
        titleBarStyle: config.IsUseSysTitle ? 'hidden' : 'default',
        height: 700,
        useContentSize: true,
        width: 1140,
        autoHideMenuBar: true,
        minWidth: 842,
        frame: !config.IsUseSysTitle,
        show: false,
        webPreferences: {
          sandbox: false,
          webSecurity: false,
          // If in development mode, devTools can be used
          devTools: process.env.NODE_ENV === 'development',
          // Enable rubber-band scrolling on macOS
          scrollBounce: process.platform === 'darwin',
          preload:
            process.env.NODE_ENV === 'development' ? join(app.getAppPath(), 'preload.js') : join(app.getAppPath(), 'dist', 'electron', 'main', 'preload.js'),
        },
      });

      // Automatically open devtools in development mode
      if (process.env.NODE_ENV === 'development') {
        ChildWin.webContents.openDevTools({ mode: 'undocked', activate: true });
      }

      console.log('children window url:', winURL + arg.url);

      ChildWin.loadURL(winURL + arg.url);

      ChildWin.once('ready-to-show', () => {
        ChildWin.show();

        if (arg.IsPay) {
          // Automatically close the child window after payment is completed
          const testUrl = setInterval(() => {
            const Url = ChildWin.webContents.getURL();
            if (Url.includes(arg.PayUrl)) {
              ChildWin.close();
            }
          }, 1200);

          ChildWin.on('close', () => {
            clearInterval(testUrl);
          });
        }
      });

      // Triggered when the rendering process is displayed
      ChildWin.once('show', () => {
        ChildWin.webContents.send('send-data', arg.sendData);
      });
    });
  },
};

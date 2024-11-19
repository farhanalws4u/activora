import config from '@config/index';
import { app, BrowserWindow, Menu, dialog } from 'electron';
import { join } from 'path';
import setIpc from './ipcMain';
import menuconfig from '../config/menu';
import { winURL, loadingURL, getPreloadFile } from '../config/StaticPath';

setIpc.Mainfunc();

class MainInit {
  public winURL = '';

  public shartURL = '';

  public childURL = '';

  public loadWindow: BrowserWindow = null;

  public mainWindow: BrowserWindow = null;

  public childWindow: BrowserWindow = null;

  constructor() {
    this.winURL = winURL;
    this.shartURL = loadingURL;
    // if (process.env.NODE_ENV === 'development') {
    menuconfig.push({
      label: 'Developer Settings',
      submenu: [
        {
          label: 'Switch to Developer Mode',
          accelerator: 'CmdOrCtrl+I',
          role: 'toggledevtools',
        },
      ],
    });
    // }
  }

  // Main window function
  createMainWindow() {
    this.mainWindow = new BrowserWindow({
      titleBarStyle: config.IsUseSysTitle ? 'hidden' : 'default',
      height: 700,
      useContentSize: true,
      minWidth: 1164,
      width: 1164,
      show: false,
      frame: !config.IsUseSysTitle,
      webPreferences: {
        sandbox: false,
        webSecurity: false,
        // If in development mode, devTools can be used
        // devTools: process.env.NODE_ENV === 'development',
        devTools: true,
        // Enable rubber-band scrolling on macOS
        scrollBounce: process.platform === 'darwin',
        preload: getPreloadFile('preload'),
      },
    });
    // Assign the template
    const menu = Menu.buildFromTemplate(menuconfig as any);
    // Load the template
    Menu.setApplicationMenu(menu);
    // Load the main window
    this.mainWindow.loadURL(this.winURL);
    // Show the interface after dom-ready
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow.show();
      if (config.UseStartupChart) this.loadWindow.destroy();
    });
    // Automatically open devtools in development mode
    if (process.env.NODE_ENV === 'development') {
      this.mainWindow.webContents.openDevTools({
        mode: 'undocked',
        activate: true,
      });
    }
    // When the rendering process is confirmed to be stuck, perform alert operations based on the type
    app.on('render-process-gone', (event, webContents, details) => {
      const message = {
        title: '',
        buttons: [],
        message: '',
      };
      switch (details.reason) {
        case 'crashed':
          message.title = 'Warning';
          message.buttons = ['OK', 'Exit'];
          message.message = 'The graphical process has crashed. Would you like to perform a soft restart?';
          break;
        case 'killed':
          message.title = 'Warning';
          message.buttons = ['OK', 'Exit'];
          message.message = 'The graphical process was terminated for unknown reasons. Would you like to perform a soft restart?';
          break;
        case 'oom':
          message.title = 'Warning';
          message.buttons = ['OK', 'Exit'];
          message.message = 'Out of memory. Would you like to perform a soft restart to free memory?';
          break;

        default:
          break;
      }
      dialog
        .showMessageBox(this.mainWindow, {
          type: 'warning',
          title: message.title,
          buttons: message.buttons,
          message: message.message,
          noLink: true,
        })
        .then((res) => {
          if (res.response === 0) this.mainWindow.reload();
          else this.mainWindow.close();
        });
    });
    // For unknown reasons, when the page in this window triggers a freeze, execute this
    this.mainWindow.on('unresponsive', () => {
      dialog
        .showMessageBox(this.mainWindow, {
          type: 'warning',
          title: 'Warning',
          buttons: ['Reload', 'Exit'],
          message: 'The graphical process is unresponsive. Would you like to wait for it to recover?',
          noLink: true,
        })
        .then((res) => {
          if (res.response === 0) this.mainWindow.reload();
          else this.mainWindow.close();
        });
    });
    /**
     * New GPU crash detection. For detailed parameters see:
     * http://www.electronjs.org/docs/api/app
     * @returns {void}
     * @author zmr (umbrella22)
     * @date 2020-11-27
     */
    app.on('child-process-gone', (event, details) => {
      const message = {
        title: '',
        buttons: [],
        message: '',
      };
      switch (details.type) {
        case 'GPU':
          switch (details.reason) {
            case 'crashed':
              message.title = 'Warning';
              message.buttons = ['OK', 'Exit'];
              message.message = 'The hardware acceleration process has crashed. Would you like to disable hardware acceleration and restart?';
              break;
            case 'killed':
              message.title = 'Warning';
              message.buttons = ['OK', 'Exit'];
              message.message = 'The hardware acceleration process was unexpectedly terminated. Would you like to disable hardware acceleration and restart?';
              break;
            default:
              break;
          }
          break;

        default:
          break;
      }
      dialog
        .showMessageBox(this.mainWindow, {
          type: 'warning',
          title: message.title,
          buttons: message.buttons,
          message: message.message,
          noLink: true,
        })
        .then((res) => {
          // When a GPU crash occurs, use this setting to disable GPU acceleration mode.
          if (res.response === 0) {
            if (details.type === 'GPU') app.disableHardwareAcceleration();
            this.mainWindow.reload();
          } else {
            this.mainWindow.close();
          }
        });
    });
    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });
  }

  // Loading window function
  loadingWindow(loadingURL: string) {
    this.loadWindow = new BrowserWindow({
      width: 400,
      height: 600,
      frame: false,
      skipTaskbar: true,
      transparent: true,
      resizable: false,
      webPreferences: {
        experimentalFeatures: true,
        preload: process.env.NODE_ENV === 'development' ? join(app.getAppPath(), 'preload.js') : join(app.getAppPath(), 'dist/electron/main/preload.js'),
      },
    });

    this.loadWindow.loadURL(loadingURL);
    this.loadWindow.show();
    this.loadWindow.setAlwaysOnTop(true);

    // Delay for two seconds; can be adjusted later depending on the situation. It's basically like sleep.
    setTimeout(() => {
      this.createMainWindow();
    }, 1500);
  }

  // Initialize window function
  initWindow() {
    if (config.UseStartupChart) {
      return this.loadingWindow(this.shartURL);
    }

    return this.createMainWindow();
  }
}
export default MainInit;

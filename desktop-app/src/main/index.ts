import { app, session } from 'electron';
import InitWindow from './services/windowManager';
import DisableButton from './config/DisableButton';
import { ipcMain, desktopCapturer } from 'electron';

function onAppReady() {
  new InitWindow().initWindow();
  DisableButton.Disablef12();
  if (process.env.NODE_ENV === 'development') {
    const { VUEJS3_DEVTOOLS } = require('electron-devtools-vendor');
    session.defaultSession.loadExtension(VUEJS3_DEVTOOLS, {
      allowFileAccess: true,
    });
    console.log('Vue DevTools installed');
  }
}

app.whenReady().then(()=>{
  
  onAppReady()
});

// Due to issues with version 9.x, this configuration is needed to disable cross-origin restrictions
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');

app.on('window-all-closed', () => {
  // On all platforms, exit the app when all windows are closed
  app.quit();
});

app.on('browser-window-created', () => {
  console.log('window-created');
});

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.removeAsDefaultProtocolClient('electron-vue-template');
    console.log('Due to the special nature of the framework, it cannot be used in the development environment');
  }
} else {
  app.setAsDefaultProtocolClient('electron-vue-template');
}

ipcMain.handle('capture-screenshot', async () => {
  try {
    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: { width: 1920, height: 1080 },
    });

    if (sources && sources.length > 0) {
      return sources.map((source) => ({
        id: source.id,
        name: source.name,
        dataURL: source.thumbnail.toDataURL(),
      }));
    }
    return null;
  } catch (error) {
    console.error('Error capturing screenshot:', error);
    return null;
  }
});


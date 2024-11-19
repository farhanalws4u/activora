import { autoUpdater } from 'electron-updater';
import { BrowserWindow } from 'electron';

/**
 * Update status codes:
 * -1: Update check failed
 *  0: Checking for updates
 *  1: New version detected, preparing to download
 *  2: No new version detected
 *  3: Downloading
 *  4: Download complete
 */
class Update {
  public mainWindow!: BrowserWindow;

  constructor() {
    // Set the update URL
    autoUpdater.setFeedURL('http://127.0.0.1:25565/');

    // Triggered when an error occurs during the update process.
    autoUpdater.on('error', (err) => {
      console.log('An error occurred during the update', err.message);
      if (err.message.includes('sha512 checksum mismatch')) {
        this.messageFn(-1, 'sha512 checksum failed');
      } else {
        this.messageFn(-1, 'See main process console for error details');
      }
    });

    // Triggered when checking for updates starts
    autoUpdater.on('checking-for-update', () => {
      console.log('Checking for updates');
      this.messageFn(0);
    });

    // Triggered when an update is available
    autoUpdater.on('update-available', () => {
      console.log('Update available');
      this.messageFn(1);
    });

    // Triggered when no update is available
    autoUpdater.on('update-not-available', () => {
      console.log('No update available');
      this.messageFn(2);
    });

    // Listening to download progress
    autoUpdater.on('download-progress', (progressObj) => {
      this.messageFn(3, `${progressObj}`);
    });

    // Triggered when the update has been downloaded
    autoUpdater.on('update-downloaded', () => {
      console.log('Download complete');
      this.messageFn(4);
    });
  }

  // Execute automatic update check
  checkUpdate(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
    autoUpdater.checkForUpdates().catch((err) => {
      console.log('Network connection issue', err);
    });
  }

  // Responsible for sending information to the renderer process
  messageFn(type: number, data?: string) {
    const sendData = {
      state: type,
      msg: data || '',
    };
    this.mainWindow.webContents.send('UpdateMsg', sendData);
  }

  // Quit and install the update
  static quitAndInstall() {
    autoUpdater.quitAndInstall();
  }
}

export default Update;

import { emptyDir, createWriteStream, readFile, copy, remove } from 'fs-extra';
import { join, resolve } from 'path';
import { promisify } from 'util';
import { pipeline } from 'stream';
import { app, BrowserWindow } from 'electron';
import { gt } from 'semver';
import { createHmac } from 'crypto';
import extract from 'extract-zip';
import axios, { AxiosResponse } from 'axios';
import { version } from '../../../package.json';
import { hotPublishConfig } from '../config/hotPublish';

const streamPipeline = promisify(pipeline);
const appPath = app.getAppPath();
const updatePath = resolve(appPath, '..', '..', 'update');
const request = axios.create();

/**
 * @param data File stream
 * @param type Hash type, default is sha256
 * @param key Key used to match the calculated result
 * @returns {string} Calculated hash result
 * @author umbrella22
 * @date 2021-03-05
 */
function hash(data, type = 'sha256', key = 'Sky'): string {
  const hmac = createHmac(type, key);
  hmac.update(data);
  return hmac.digest('hex');
}

/**
 * @param url Download URL
 * @param filePath Path to save the downloaded file
 * @returns {void}
 * @author umbrella22
 * @date 2021-03-05
 */
async function download(url: string, filePath: string): Promise<void> {
  const res = await request({ url, responseType: 'stream' });
  await streamPipeline(res.data, createWriteStream(filePath));
}

const updateInfo = {
  status: 'init',
  message: '',
};

interface Res extends AxiosResponse<any> {
  data: {
    version?: string;
    name?: string;
    hash?: string;
  };
}

/**
 * @param windows The main window reference
 * @returns {void}
 * @author umbrella22
 * @date 2021-03-05
 */
export const updater = async (windows?: BrowserWindow): Promise<void> => {
  try {
    const res: Res = await request({
      url: `${hotPublishConfig.url}/${hotPublishConfig.configName}.json?time=${new Date().getTime()}`,
    });

    // Check if the new version is greater than the current version
    if (gt(res.data.version, version)) {
      await emptyDir(updatePath);
      const filePath = join(updatePath, res.data.name);
      updateInfo.status = 'downloading';

      // Notify the window about the update status
      if (windows) windows.webContents.send('hot-update-status', updateInfo);

      // Download the update file
      await download(`${hotPublishConfig.url}/${res.data.name}`, filePath);

      // Verify the downloaded file's hash (sha256)
      const buffer = await readFile(filePath);
      const sha256 = hash(buffer);
      if (sha256 !== res.data.hash) throw new Error('sha256 error');

      // Extract the update files to a temporary directory
      const appPathTemp = join(updatePath, 'temp');
      await extract(filePath, { dir: appPathTemp });

      updateInfo.status = 'moving';

      // Notify the window about the moving status
      if (windows) windows.webContents.send('hot-update-status', updateInfo);

      // Remove old files and replace them with new ones
      await remove(join(`${appPath}`, 'dist'));
      await remove(join(`${appPath}`, 'package.json'));
      await copy(appPathTemp, appPath);

      updateInfo.status = 'finished';

      // Notify the window that the update process is finished
      if (windows) windows.webContents.send('hot-update-status', updateInfo);
    }
  } catch (error) {
    updateInfo.status = 'failed';
    updateInfo.message = error;

    // Notify the window that the update process failed
    if (windows) windows.webContents.send('hot-update-status', updateInfo);
  }
};

// Function to get current update information/status
export const getUpdateInfo = () => updateInfo;

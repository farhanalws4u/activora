import { dialog } from 'electron';
import { type, arch, release } from 'os';
import packageInfo from '../../../package.json';

/**
 * Displays an information dialog about the application.
 */
function info() {
  dialog.showMessageBox({
    title: 'About',
    type: 'info',
    message: 'electron-Vue framework',
    detail: `Version: ${packageInfo.version}\nEngine Version: ${process.versions.v8}\nCurrent System: ${type()} ${arch()} ${release()}`,
    noLink: true,
    buttons: ['View on GitHub', 'OK'],
  });
}

const menu = [
  {
    label: 'Settings',
    submenu: [
      {
        label: 'Quick Restart',
        accelerator: 'F5',
        role: 'reload',
      },
      {
        label: 'Exit',
        accelerator: 'CmdOrCtrl+F4',
        role: 'close',
      },
    ],
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'About',
        click() {
          info();
        },
      },
    ],
  },
];

export default menu;

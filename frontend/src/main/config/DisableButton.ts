import { globalShortcut } from 'electron';
import config from '@config/index';

export default {
  Disablef12() {
    if (process.env.NODE_ENV === 'production' && config.DisableF12) {
      globalShortcut.register('f12', () => {
        console.log('The user attempted to launch the console');
      });
    }
  },
};

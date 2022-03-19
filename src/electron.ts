import { app, BrowserWindow, Menu } from 'electron';
import { autoUpdater } from 'electron-updater';
import { join } from 'path';
import { menu } from './menu';

app.whenReady().then(() => {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
    },
  });
  const html = join(__dirname, '../public/index.html');
  window.loadFile(html);

  autoUpdater.checkForUpdatesAndNotify();
});

Menu.setApplicationMenu(menu);

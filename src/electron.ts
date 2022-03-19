import { app, BrowserWindow, Menu } from 'electron';
import { join } from 'path';
import { menu } from './menu';

let window: any;

function createWindow() {
  window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
    },
  });

  if (process.env.DEBUG) {
    window.loadURL('http://localhost:8080');
  } else {
    const html = join(__dirname, '../public/index.html');
    window.loadFile(html);
  }
  window.on('closed', () => {
    window = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (window === null) {
    createWindow();
  }
});

Menu.setApplicationMenu(menu);

const { app, BrowserWindow, Menu } = require('electron');
const menu = require('./menu');
const { autoUpdater } = require('electron-updater');

let window;

app.whenReady().then(() => {
  window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  window.loadFile('index.html');

  autoUpdater.checkForUpdatesAndNotify();
});

Menu.setApplicationMenu(menu);

const { app, BrowserWindow, Menu } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require("path");
const menu = require('./menu');

let window;

app.whenReady().then(() => {
  window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });
  window.loadFile('index.html');

  autoUpdater.checkForUpdatesAndNotify();
});

Menu.setApplicationMenu(menu);

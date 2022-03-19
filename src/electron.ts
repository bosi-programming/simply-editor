const { app, BrowserWindow, Menu } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require("path");
const menu = require('./menu');

app.whenReady().then(() => {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });
  const html = path.join(__dirname, "../public/index.html");
  console.log(html);
  window.loadFile(html);

  autoUpdater.checkForUpdatesAndNotify();
});

Menu.setApplicationMenu(menu);


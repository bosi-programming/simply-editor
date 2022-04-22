import {
  app,
  Menu,
  shell,
  ipcMain,
  BrowserWindow,
  globalShortcut,
  dialog,
} from 'electron';
import showdown from 'showdown';

import { readFileSync, writeFileSync } from 'fs';

const converter = new showdown.Converter();

function saveFile() {
  console.log('Saving the file');

  const window = BrowserWindow.getFocusedWindow();
  window.webContents.send('editor-event', 'save');
}

function saveFileAsHtml() {
  console.log('Saving the file as html');

  const window = BrowserWindow.getFocusedWindow();
  window.webContents.send('editor-event', 'save-as-html');
}

function loadFile() {
  const window = BrowserWindow.getFocusedWindow();
  const files = dialog.showOpenDialogSync(window, {
    properties: ['openFile'],
    title: 'Pick a markdown file',
    filters: [{ name: 'Markdown', extensions: ['md', 'markdown', 'txt'] }],
  });
  if (!files) return;

  const file = files[0];
  const fileContent = readFileSync(file).toString();
  console.log(fileContent);
  window.webContents.send('load', fileContent);
}

app.on('ready', () => {
  globalShortcut.register('CommandOrControl+S', () => {
    saveFile();
  });

  globalShortcut.register('CommandOrControl+shift+S', () => {
    saveFileAsHtml();
  });

  globalShortcut.register('CommandOrControl+O', () => {
    loadFile();
  });
});

ipcMain.on('save', (event, arg) => {
  console.log(`Saving content of the file`);
  console.log(arg);

  const window = BrowserWindow.getFocusedWindow();
  const options = {
    title: 'Save markdown file',
    filters: [
      {
        name: 'MyFile',
        extensions: ['md'],
      },
    ],
  };

  const filename = dialog.showSaveDialogSync(window, options);
  if (filename) {
    console.log(`Saving content to the file: ${filename}`);
    writeFileSync(filename, arg);
  }
});

ipcMain.on('save-as-html', (event, arg) => {
  console.log(`Saving content of the file as HTML`);
  console.log(arg);
  const htmlFile = converter.makeHtml(arg);

  const window = BrowserWindow.getFocusedWindow();
  const options = {
    title: 'Save html file',
    filters: [
      {
        name: 'MyFile',
        extensions: ['html'],
      },
    ],
  };

  const filename = dialog.showSaveDialogSync(window, options);
  if (filename) {
    console.log(`Saving content to the file: ${filename}`);
    writeFileSync(filename, htmlFile);
  }
});

ipcMain.on('editor-reply', (event, arg) => {
  console.log(`Received reply from web page: ${arg}`);
});

const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open',
        accelerator: 'CommandOrControl+O',
        click() {
          loadFile();
        },
      },
      {
        label: 'Save',
        accelerator: 'CommandOrControl+S',
        click() {
          saveFile();
        },
      },
      {
        label: 'Save as HTML',
        accelerator: 'CommandOrControl+shift+S',
        click() {
          saveFileAsHtml();
        },
      },
    ],
  },
  {
    label: 'Format',
    submenu: [
      {
        label: 'Toggle Bold',
        click() {
          const window = BrowserWindow.getFocusedWindow();
          window.webContents.send('editor-event', 'toggle-bold');
        },
      },
    ],
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'About Editor Component',
        click() {
          shell.openExternal('https://simplemde.com/');
        },
      },
    ],
  },
];

if (process.env.DEBUG) {
  template.push({
    label: 'Debugging',
    submenu: [
      {
        label: 'Dev Tools',
        // @ts-ignore
        role: 'toggleDevTools',
      },

      // @ts-ignore
      { type: 'separator' },
      {
        // @ts-ignore
        role: 'reload',
        accelerator: 'Alt+R',
      },
    ],
  });
}

if (process.platform === 'darwin') {
  template.unshift({
    label: app.name,
    // @ts-ignore
    submenu: [{ role: 'about' }, { type: 'separator' }, { role: 'quit' }],
  });
}

// @ts-ignore
export const menu = Menu.buildFromTemplate(template);

import {
  app,
  Menu,
  shell,
  ipcMain,
  BrowserWindow,
  globalShortcut,
} from 'electron';
import { Html } from './model/Html';
import { Markdown } from './model/Markdown';

app.on('ready', () => {
  globalShortcut.register('CommandOrControl+S', () => {
    const markdown = new Markdown();
    markdown.saveFile();
  });

  globalShortcut.register('CommandOrControl+shift+S', () => {
    const html = new Html();
    html.saveFileAsHtml();
  });

  globalShortcut.register('CommandOrControl+O', () => {
    const markdown = new Markdown();
    markdown.loadFile();
  });

  globalShortcut.register('CommandOrControl+shift+O', () => {
    const html = new Html();
    html.loadFile();
  });
});

ipcMain.on('editor-reply', (_, arg) => {
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
          const markdown = new Markdown();
          markdown.loadFile();
        },
      },
      {
        label: 'Open html file',
        accelerator: 'CommandOrControl+shift+O',
        click() {
          const html = new Html();
          html.loadFile();
        },
      },
      {
        label: 'Save',
        accelerator: 'CommandOrControl+S',
        click() {
          const markdown = new Markdown();
          markdown.saveFile();
        },
      },
      {
        label: 'Save as HTML',
        accelerator: 'CommandOrControl+shift+S',
        click() {
          const html = new Html();
          html.saveFileAsHtml();
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

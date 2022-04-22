import { BrowserWindow, ipcMain, dialog } from 'electron';
import { readFileSync, writeFileSync } from 'fs';

ipcMain.on('save', (_, arg) => {
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

export class Markdown {
  saveFile() {
    console.log('Saving the file');

    const window = BrowserWindow.getFocusedWindow();
    window.webContents.send('editor-event', 'save');
  }

  loadFile() {
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
}

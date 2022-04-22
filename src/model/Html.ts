import { BrowserWindow, ipcMain, dialog } from 'electron';
import { readFileSync, writeFileSync } from 'fs';
import showdown from 'showdown';
import TurndownService from 'turndown';

const turndownService = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  emDelimiter: '*',
});
const converter = new showdown.Converter();

ipcMain.on('save-as-html', (_, arg) => {
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

export class Html {
  saveFileAsHtml() {
    console.log('Saving the file as html');

    const window = BrowserWindow.getFocusedWindow();
    window.webContents.send('editor-event', 'save-as-html');
  }

  loadFile() {
    const window = BrowserWindow.getFocusedWindow();
    const files = dialog.showOpenDialogSync(window, {
      properties: ['openFile'],
      title: 'Pick a html file',
      filters: [{ name: 'Html', extensions: ['html'] }],
    });
    console.log(files);
    if (!files) return;

    const file = files[0];
    const fileContent = readFileSync(file).toString();
    const markdown = turndownService.turndown(fileContent);
    console.log(markdown);
    window.webContents.send('load', markdown);
  }
}

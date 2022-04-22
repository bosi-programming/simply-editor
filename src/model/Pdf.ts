import { BrowserWindow, ipcMain, dialog } from 'electron';
import { writeFileSync } from 'fs';
import { mdToPdf } from 'md-to-pdf';

ipcMain.on('export-pdf', async (_, arg) => {
  console.log('Export as pdf');
  console.log(arg);
  const pdfFile = await mdToPdf({ content: arg }).catch(console.error);

  const window = BrowserWindow.getFocusedWindow();
  const options = {
    title: 'Export pdf file',
    filters: [
      {
        name: 'MyFile',
        extensions: ['pdf'],
      },
    ],
  };
  const filename = dialog.showSaveDialogSync(window, options);
  if (filename && pdfFile) {
    console.log(`Export content to the file: ${filename}`);
    writeFileSync(filename, pdfFile.content);
  }
});

export class Pdf {
  exportFile() {
    console.log('Saving the file as pdf');

    const window = BrowserWindow.getFocusedWindow();
    window.webContents.send('editor-event', 'export-pdf');
  }
}

const {app, BrowserWindow, ipcMain} = require('electron');

let mainWindow;
function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    /*frame: false,*/
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
  })
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});

ipcMain.on("change-loaded-HTML",(event, arg) => {
  mainWindow.loadFile(arg);
});
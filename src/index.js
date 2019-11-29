const path = require("path");
const { app, BrowserWindow, ipcMain, screen } = require("electron");

let isShow = false;

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      nodeIntegration: true
    },
    x: 0,
    y: 0,
    width: 300,
    height: 200
  });
  let pickerWindow = null;
  mainWindow.loadFile(path.resolve(__dirname, "./view/index.html"));
  function showMain() {
    // mainWindow.webContents.openDevTools();
    mainWindow.show();
  }
  function hideMain() {
    mainWindow.webContents.closeDevTools();
    mainWindow.hide();
  }
  mainWindow.on("ready-to-show", () => {
    showMain();
  });
  ipcMain.on("hide-main", () => {
    hideMain();
  });
  ipcMain.on("show-main", () => {
    showMain();
  });
  ipcMain.on("color-reciever", (event, color) => {
    if (pickerWindow) {
      isShow = false;
      pickerWindow.close();
      pickerWindow = null;
      showMain();
      mainWindow.webContents.send("send-color", color);
    }
  });
  ipcMain.on("start-get-color", (event, dataUrl) => {
    if (!isShow) {
      isShow = true;
      pickerWindow = new BrowserWindow({
        frame: false,
        webPreferences: {
          nodeIntegration: true
        },
        x: 0,
        y: 0,
        ...screen.getPrimaryDisplay().size,
        show: false,
        resizable: false,
        movable: false,
        fullscreen: true,
        alwaysOnTop: true
      });

      pickerWindow.loadFile(
        path.resolve(__dirname, "./view/color-picker.html")
      );
      pickerWindow.on("ready-to-show", () => {
        pickerWindow.show();
        pickerWindow.webContents.send("data-url", dataUrl);
      });
    }
  });
});

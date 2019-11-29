import { app, BrowserWindow } from 'electron';

const mode = process.env.NODE_ENV.trim();
const isDev = mode === 'development';

app.on('ready', () => {
  const browserWindow = new BrowserWindow({
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true
    }
  });
  if (isDev) {
    browserWindow.loadURL('http://localhost:3000');
  } else {
    console.log('还没写呢');
  }
});

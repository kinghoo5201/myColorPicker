"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const mode = process.env.NODE_ENV.trim();
const isDev = mode === 'development';
electron_1.app.on('ready', () => {
    const browserWindow = new electron_1.BrowserWindow({
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true
        }
    });
    if (isDev) {
        browserWindow.loadURL('http://localhost:3000');
    }
    else {
        console.log('还没写呢');
    }
});

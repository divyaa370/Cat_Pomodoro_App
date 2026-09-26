const {app, BrowserWindow} = require('electron');
const {ipcMain} = require('electron');
const url = require('url');
const path = require('path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        title: 'MyPomo',
        width: 400,
        height: 430,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        }
    });

    const startUrl = url.format({
        pathname: path.join(__dirname, '../build/index.html'), //connect to react app
        protocol: 'file:',
        slashes: true,
    });
    mainWindow.loadURL(startUrl); //load app in electron

    //listen for close event from react app
    ipcMain.on('close-app', () => {
        app.quit();
    });
};

app.whenReady().then(createWindow)




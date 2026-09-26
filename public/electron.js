const {app, BrowserWindow} = require('electron');
const {ipcMain} = require('electron');
const url = require('url');
const path = require('path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        title: 'MyPomo',
        width: 400,
        height: 400,
        frame: false,
        titleBarStyle: 'hidden',
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
    mainWindow.setMenuBarVisibility(false); //hide menu bar
    mainWindow.setWindowButtonVisibility(false); //hide window buttons
    mainWindow.loadURL(startUrl); //load app in electron

    //listen for close event from react app
    ipcMain.on('close-app', () => {
        app.quit();
    });
};

app.whenReady().then(createWindow)




const { app, BrowserWindow } = require('electron');
const path = require('path');
const electronReload = require('electron-reloader');
import dotenv from 'dotenv';

dotenv.config();




// Enable hot-reloading during development
if (process.env.NODE_ENV === 'development') {
  electronReload(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
  });
}

const userInputBox = document.getElementById('userInput');

const search = {

    gptKey: process.env.gptKey,
    gptReqUrl: "https://api.openai.com/v1/chat/completions",
    modUrl: 'https://api.openai.com/v1/moderations',

    searchStart(event) {
  
        if (event.key === 'Enter' ) {


}
    }
}
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 200,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile('index.html');
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}


app.on('ready', createWindow);

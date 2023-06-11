const { app, BrowserWindow, Tray, globalShortcut, ipcMain, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let tray;

const filePath = path.resolve(path.dirname(app.getPath('exe')), 'api.cfg');

// Handle IPC message from renderer process
ipcMain.on('loadConfig', (event) => { // Remove the filePath parameter
  try {
    const fileContents = fs.readFileSync(filePath, 'utf-8'); // Use the outer filePath variable
    event.reply('configLoaded', fileContents);
  } catch (error) {
    event.reply('configError', error.message);
  }
});

function createWindow() {
  mainWindow = new BrowserWindow({
    icon: './gpt.ico',
    width: 700,
    height: 1300,
    transparent: true,
    frame: false,
    show: false,
    // Other window configuration options
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,

    }    
    });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('window-ready'); // Notify the renderer process that the window is ready
  });
}

app.on('ready', () => {
  createWindow();

  // Create the system tray
  tray = new Tray(path.join(__dirname, './gpttray.png'));

  let uiVisible = false; // Track the visibility of the UI

  // Register the hotkey to show or hide the window
  globalShortcut.register('Ctrl+Space', () => {
    if (uiVisible) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }

    uiVisible = !uiVisible; // Toggle the visibility

      // Send a message to the renderer process
  mainWindow.webContents.send('ctrlSpacePressed', uiVisible);
  
  });



  // Create the context menu for the tray
  const trayMenu = Menu.buildFromTemplate([
    {
      label: 'Quit',
      click: () => {
        app.quit();
      }
    }
  ]);

  // Show the context menu when right-clicking the tray icon
  tray.on('right-click', () => {
    tray.popUpContextMenu(trayMenu);
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

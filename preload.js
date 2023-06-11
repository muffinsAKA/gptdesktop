const { contextBridge, ipcRenderer } = require('electron');

// Expose ipcRenderer to the renderer process and the window object
contextBridge.exposeInMainWorld('api', {
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  receive: (channel, callback) => {
    ipcRenderer.on(channel, (event, ...args) => callback(...args));
  },
  ipcRenderer: {
    on: (channel, listener) => ipcRenderer.on(channel, listener),
    removeListener: (channel, listener) => ipcRenderer.removeListener(channel, listener),
    send: (channel, data) => ipcRenderer.send(channel, data)
  }
});

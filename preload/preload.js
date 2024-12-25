const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  navigate: (page) => ipcRenderer.send("navigate", page),
});

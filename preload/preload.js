const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  navigate: (page) => ipcRenderer.send("navigate", page),
  getSelectedDirectories: () => ipcRenderer.invoke("get-selected-dir"),
  openDirectoryDialog: (command) =>
    ipcRenderer.invoke("dialog:openDirectory", command),
  submitForm: (data) => ipcRenderer.invoke("submit-application-form", data),
});

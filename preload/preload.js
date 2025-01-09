const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  navigate: (page) => ipcRenderer.send("navigate", page),
  getDashboardData: () => ipcRenderer.invoke("get-dashboard-data"),
  getSelectedDirectories: () => ipcRenderer.invoke("get-selected-dir"),
  getOutputDirectoryContent: (directory) =>
    ipcRenderer.invoke("get-output-directory-content", directory),
  openDirectoryDialog: (command) =>
    ipcRenderer.invoke("dialog:openDirectory", command),
  saveCompanyPath: (directory) =>
    ipcRenderer.send("save-company-path", directory),
  saveAppliedJobPath: (directory) =>
    ipcRenderer.send("save-job-directory-path", directory),
  getJobDetails: () => ipcRenderer.invoke("get-job-details"),
  deleteDirectory: (directory, type) =>
    ipcRenderer.invoke("delete-directory", directory, type),
  submitForm: (data) => ipcRenderer.invoke("submit-application-form", data),
});

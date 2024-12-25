import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path, { dirname } from "path";
import fs from "fs";
import Store from "electron-store";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const store = new Store();
let win;

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "/preload/preload.js"),
    },
  });

  win.loadFile(path.join(__dirname, "/views/home.html"));
  win.webContents.openDevTools();

  win.on("closed", () => {
    win = null;
  });
};

ipcMain.on("navigate", (event, page) => {
  win.loadFile(path.join(__dirname, `views/${page}`));
});

ipcMain.handle("dialog:openDirectory", async (event, command) => {
  const result = await dialog
    .showOpenDialog({
      properties: ["openDirectory"],
    })
    .then((result) => {
      if (!result.canceled && result.filePaths.length > 0) {
        const selectedDirectory = result.filePaths[0];
        console.log("Selected Directory: ", selectedDirectory);

        store.set(command, selectedDirectory);
        return result;
      }
    });
  return result.filePaths[0] || null;
});

ipcMain.handle("get-selected-dir", () => {
  const data = {
    inputDir: store.get("SourceDirectory") || "Not Selected.",
    outputDir: store.get("DestinationDirectory") || "Not Selected.",
  };

  return data;
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform != "darwin") {
    app.quit();
  }
});

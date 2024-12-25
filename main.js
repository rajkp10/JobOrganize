import { app, BrowserWindow } from "electron";
import path, { dirname } from "path";
// import fs from "fs";
// import Store from "electron-store";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let win;

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
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

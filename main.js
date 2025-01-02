import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path, { dirname } from "path";
import fs from "fs";
import Store from "electron-store";
import { fileURLToPath } from "url";
import { DESTINATION_DIRECTORY, SOURCE_DIRECTORY } from "./utils/constants.js";
import {
  copyResumeFiles,
  saveJobDetails,
  saveRecruiterDetails,
} from "./utils/utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const store = new Store();
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
    inputDir: store.get(SOURCE_DIRECTORY) || "Not Selected.",
    outputDir: store.get(DESTINATION_DIRECTORY) || "Not Selected.",
  };
  return data;
});

ipcMain.handle("submit-application-form", async (event, data) => {
  try {
    const destinationDir = store.get(DESTINATION_DIRECTORY);
    const sourceDir = store.get(SOURCE_DIRECTORY);

    const { jobDetails, recruiterDetails } = data;
    const { companyName, jobRole } = jobDetails;

    let dirPath = path.join(destinationDir, companyName);
    let subDirPath = path.join(dirPath, jobRole);

    if (!fs.existsSync(dirPath)) {
      await fs.promises.mkdir(dirPath);
    }

    if (fs.existsSync(subDirPath)) {
      throw new Error("Application for this Job has already done");
    } else {
      await fs.promises.mkdir(subDirPath);
    }

    copyResumeFiles(sourceDir, subDirPath);
    saveJobDetails(data, subDirPath);
    saveRecruiterDetails(jobRole, recruiterDetails, dirPath);
  } catch (error) {
    console.error("Error: ", error);
    return { success: false };
  }
  return { success: true };
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

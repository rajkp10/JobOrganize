import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path, { dirname } from "path";
import fs from "fs";
import Store from "electron-store";
import { fileURLToPath } from "url";
import {
  APPLICATION_STATUS_APPLIED,
  APPLIED_JOB_DIRECTORY,
  COMPANY_DIRECTORY,
  DESTINATION_DIRECTORY,
  NOT_ALLOWED_CHARACTERS,
  SOURCE_DIRECTORY,
  TYPE_COMPANY,
  TYPE_JOB,
} from "./utils/constants.js";
import {
  convertTextToJson,
  copyResumeFiles,
  extractDirectories,
  extractFiles,
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
      webviewTag: true,
    },
  });

  win.loadFile(path.join(__dirname, "/views/home.html"));
  // win.webContents.openDevTools();

  win.on("closed", () => {
    win = null;
  });
};

ipcMain.on("navigate", (event, page) => {
  win.loadFile(path.join(__dirname, `views/${page}`));
});

ipcMain.handle("get-dashboard-data", async () => {
  const destinationDirectory = store.get(DESTINATION_DIRECTORY);
  const items = await fs.promises.readdir(destinationDirectory);
  const directories = await Promise.all(
    items.map(async (item) => {
      const fullPath = path.join(destinationDirectory, item);
      const stats = await fs.promises.stat(fullPath);
      return stats.isDirectory();
    })
  );

  const totalDirectories = directories.filter(Boolean).length;

  console.log(
    `Total directories in ${destinationDirectory}: ${totalDirectories}`
  );
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

    let dirPath = path.join(
      destinationDir,
      companyName.replace(NOT_ALLOWED_CHARACTERS, " ")
    );
    let today = new Date();
    let date = today.toISOString().split("T")[0];
    let subDirPath = path.join(
      dirPath,
      `${jobRole.replace(NOT_ALLOWED_CHARACTERS, " ")}-${date}`
    );

    if (!fs.existsSync(dirPath)) {
      await fs.promises.mkdir(dirPath);
    }

    if (fs.existsSync(subDirPath)) {
      const directoryPath = store.get(APPLIED_JOB_DIRECTORY);
      saveJobDetails(data, directoryPath);
      saveRecruiterDetails(jobRole, recruiterDetails, dirPath);
    } else {
      await fs.promises.mkdir(subDirPath);
      jobDetails["applicationStatus"] = APPLICATION_STATUS_APPLIED;
      copyResumeFiles(sourceDir, subDirPath);
      saveJobDetails(data, subDirPath);
      saveRecruiterDetails(jobRole, recruiterDetails, dirPath);
    }
  } catch (error) {
    console.error("Error: ", error);
    return { success: false };
  }
  return { success: true };
});

ipcMain.handle("get-output-directory-content", async (event, type) => {
  const destinatinDirectoryPath = store.get(DESTINATION_DIRECTORY) || "";

  if (!destinatinDirectoryPath) {
  }

  if (type === TYPE_COMPANY) {
    const directories = await extractDirectories(destinatinDirectoryPath);
    return directories;
  } else if (type === TYPE_JOB) {
    const companyDirectoryPath = store.get(COMPANY_DIRECTORY);
    const directories = await extractDirectories(companyDirectoryPath);
    return directories;
  }
});

ipcMain.on("save-company-path", (event, directory) => {
  const directoryPath = path.join(store.get(DESTINATION_DIRECTORY), directory);
  store.set(COMPANY_DIRECTORY, directoryPath);
  win.loadFile(path.join(__dirname, "/views/jobsAppliedList.html"));
});

ipcMain.on("save-job-directory-path", async (event, directory) => {
  const directoryPath = path.join(store.get(COMPANY_DIRECTORY), directory);
  store.set(APPLIED_JOB_DIRECTORY, directoryPath);
  win.loadFile(path.join(__dirname, "/views/jobDetails.html"));
});

ipcMain.handle("get-job-details", async () => {
  const directoryPath = store.get(APPLIED_JOB_DIRECTORY);

  const files = await extractFiles(directoryPath);
  const textFile = files.filter((str) => str.includes(".txt"))[0];
  const resumeFile = files.find((str) => str.includes(".pdf"));

  const textFilePath = path.join(directoryPath, textFile);

  const applicationDetail = await convertTextToJson(textFilePath);
  applicationDetail["resume"] = `file:\\${directoryPath}\\${resumeFile}`;

  return applicationDetail;
});

ipcMain.handle("delete-directory", async (event, directory, type) => {
  let directoryPath;
  try {
    if (type === TYPE_COMPANY) {
      directoryPath = path.join(store.get(DESTINATION_DIRECTORY), directory);
    } else if (type === TYPE_JOB) {
      directoryPath = path.join(store.get(COMPANY_DIRECTORY), directory);
    } else {
      throw new Error("Invalid Parameter");
    }
    await fs.promises.rm(directoryPath, { recursive: true, force: true });

    return { success: true };
  } catch (error) {
    console.log(error.message);
    return { success: false, message: error.message };
  }
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

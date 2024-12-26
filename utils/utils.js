import fs from "fs";
import path from "path";
import { JOB_DETAILS_FILE, RECRUITER_DETAIL_FILE } from "./constants.js";

const copyResumeFiles = async (sourceDir, destinationDir) => {
  const files = await fs.promises.readdir(sourceDir);

  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const destinationPath = path.join(destinationDir, file);

    await fs.promises.copyFile(sourcePath, destinationPath);
  }
};

const saveJobDetails = async (data, subDirPath) => {
  const filePath = path.join(subDirPath, JOB_DETAILS_FILE);
  let fileContent = "";

  for (const [key, value] of Object.entries(data)) {
    fileContent += addDetail(key, value);
  }

  await fs.promises.writeFile(filePath, fileContent);
};

const addDetail = (title, details) => {
  let content = `${title.toUpperCase()}:\n`;

  for (const [key, value] of Object.entries(details)) {
    content += `${key}` + `: ${value}\n`;
  }
  content += "\n\n";

  return content;
};

const saveRecruiterDetails = async (
  jobRole,
  recruiterDetails,
  destinationDir
) => {
  const filePath = path.join(destinationDir, RECRUITER_DETAIL_FILE);

  if (!fs.existsSync(filePath)) {
    const header = "Recruiter Name,Recruiter Email,Job Role\n";
    await fs.promises.writeFile(filePath, header, "utf8");
  }

  const { recruiterName, recruiterEmail } = recruiterDetails;
  const newEntry = `${recruiterName},${recruiterEmail},${jobRole}\n`;

  await fs.promises.appendFile(filePath, newEntry, "utf8");
};

export { copyResumeFiles, saveJobDetails, saveRecruiterDetails };

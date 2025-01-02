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
  const { jobDetails, recruiterDetails, additionalDetails } = data;

  fileContent += addDetail("Job Details", jobDetails);
  // for (const key in recruiterDetails) {
  //   const recruiter = recruiterDetails[key];
  //   fileContent += addDetail(key.split("-")[0], recruiter);
  // }
  for (let i = 1; i <= recruiterDetails.length; i++) {
    const recruiter = recruiterDetails[i - 1];
    fileContent += addDetail(`Recruiter-${i}`, recruiter);
  }
  fileContent += addDetail("Additinal Details", additionalDetails);

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
    const header = "Recruiter Name,Recruiter Linkedin,Job Role\n";
    await fs.promises.writeFile(filePath, header, "utf8");
  }

  console.log(recruiterDetails);

  recruiterDetails.forEach(async (recruiter) => {
    const { Name, Linkedin } = recruiter;
    const newEntry = `${Name},${Linkedin},${jobRole}\n`;
    await fs.promises.appendFile(filePath, newEntry, "utf8");
  });
};

export { copyResumeFiles, saveJobDetails, saveRecruiterDetails };

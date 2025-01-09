import fs from "fs";
import path from "path";
import { JOB_DETAILS_FILE, RECRUITER_DETAIL_FILE } from "./constants.js";

const copyResumeFiles = async (sourceDir, destinationDir) => {
  const files = await fs.promises.readdir(sourceDir);

  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const destinationPath = path.join(destinationDir, file);

    try {
      await fs.promises.copyFile(sourcePath, destinationPath);
    } catch (error) {
      console.error(
        `Error copying the files from ${sourcePath} to ${destinationPath}`,
        error
      );
    }
  }
};

const saveJobDetails = async (data, subDirPath) => {
  const filePath = path.join(subDirPath, JOB_DETAILS_FILE);
  let fileContent = "";
  const { jobDetails, jobDescription, recruiterDetails, additionalDetails } =
    data;

  fileContent += addDetail("Job Details", jobDetails);
  for (let i = 1; i <= recruiterDetails.length; i++) {
    const recruiter = recruiterDetails[i - 1];
    fileContent += addDetail(`Recruiter-${i}`, recruiter);
  }
  fileContent += addDetail("Additinal Details", additionalDetails);
  fileContent += `JOB DESCRIPTION\n${jobDescription}`;

  try {
    await fs.promises.writeFile(filePath, fileContent, "utf8");
  } catch (error) {
    console.error(`Error writing to the file ${filePath}`, error);
  }
};

const addDetail = (title, details) => {
  let content = `${title.toUpperCase()}\n`;

  for (const [key, value] of Object.entries(details)) {
    content += `${key}` + `: ${value}\n`;
  }
  content += "\nSECTION\n";

  return content;
};

const saveRecruiterDetails = async (
  jobRole,
  recruiterDetails,
  destinationDir
) => {
  const filePath = path.join(destinationDir, RECRUITER_DETAIL_FILE);

  if (!fs.existsSync(filePath)) {
    const header = "Recruiter Name,Recruiter Linkedin,Job Role,Priority\n";
    try {
      await fs.promises.writeFile(filePath, header, "utf8");
    } catch (error) {
      console.error(`Error writing to the file ${filePath}`, error);
    }
  }

  let fileContent = "";

  try {
    fileContent = await fs.promises.readFile(filePath, "utf8");
  } catch (error) {
    console.error("Error reading file", error);
  }

  const lines = fileContent.split("\n");
  const header = lines[0];
  const existingRecruiters = lines.slice(1).filter((line) => {
    const [name, linkedin, role, priority] = line.split(",");
    return role && role.trim() !== jobRole;
  });

  const newEntries = recruiterDetails.map((recruiter) => {
    const { Name, Linkedin, Priority } = recruiter;
    return `${Name},${Linkedin},${jobRole},${Priority}`;
  });

  const updatedContent = [header, ...existingRecruiters, ...newEntries].join(
    "\n"
  );

  try {
    await fs.promises.writeFile(filePath, updatedContent, "utf8");
    console.log(
      `Recruiter details for ${jobRole} have been updated successfully`
    );
  } catch (error) {
    console.error("Error writing to file", error);
  }
};

const extractDirectories = async (directoryPath) => {
  const directoryContent = await fs.promises.readdir(directoryPath);
  const directories = [];

  for (const file of directoryContent) {
    const filePath = path.join(directoryPath, file);

    let stat;
    try {
      stat = await fs.promises.stat(filePath);
    } catch (error) {
      console.error(`Error getting stats of the file ${filePath}`, error);
    }

    if (stat.isDirectory()) {
      directories.push(file);
    }
  }

  return directories;
};

const extractFiles = async (directoryPath) => {
  const directoryContent = await fs.promises.readdir(directoryPath);

  const files = [];

  for (const file of directoryContent) {
    const filePath = path.join(directoryPath, file);

    let stat;
    try {
      stat = await fs.promises.stat(filePath);
    } catch (error) {
      console.error(`Error getting stats of the file ${filePath}`, error);
    }

    if (stat.isFile()) {
      files.push(file);
    }
  }

  return files;
};

const extractJobOrAdditionalDetails = (textContent) => {
  const jobOrAdditionalDetails = {};
  const details = textContent.split("\n").slice(1);
  details.forEach((detail) => {
    const [key, value] = detail.split(": ").map((str) => str.trim());
    if (key && value) {
      jobOrAdditionalDetails[key] = value;
    }
  });

  return jobOrAdditionalDetails;
};

const extractJobDescription = (textContent) => {
  return textContent.replace("JOB DESCRIPTION", "").replace("\n", "");
};

const extractRecruiterDetails = (textContent) => {
  const details = textContent.split("\n").slice(1);

  const Name = details[0].split(":")[1].trim();
  const Linkedin = details[1].split(":")[1].trim();
  const Priority = details[2].split(":")[1].trim();

  return { Name, Linkedin, Priority };
};

const convertTextToJson = async (file) => {
  let content = "";
  try {
    content = await fs.promises.readFile(file, "utf8");
  } catch (error) {
    console.error(`Error reading the file ${file}`, error);
  }
  const result = {
    jobDetails: {},
    jobDescription: "",
    recruiterDetails: [],
    additionalDetails: {},
  };

  const sections = content.split("SECTION");

  sections.forEach((section) => {
    section = section.trim();
    if (section.startsWith("JOB DETAILS")) {
      result.jobDetails = extractJobOrAdditionalDetails(section);
    } else if (section.startsWith("JOB DESCRIPTION")) {
      result.jobDescription = extractJobDescription(section);
    } else if (section.startsWith("RECRUITER")) {
      result.recruiterDetails.push(extractRecruiterDetails(section));
    } else if (section.startsWith("ADDITINAL DETAILS")) {
      result.additionalDetails = extractJobOrAdditionalDetails(section);
    }
  });

  return result;
};

export {
  copyResumeFiles,
  saveJobDetails,
  saveRecruiterDetails,
  extractDirectories,
  extractFiles,
  convertTextToJson,
};

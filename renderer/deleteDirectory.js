import { directoryData, setDirectoryData } from "../utils/shared.js";

const list = document.getElementById("list");
const noBtn = document.getElementById("no-btn");
const yesBtn = document.getElementById("yes-btn");
const modal = document.getElementById("delete-modal");

noBtn.addEventListener("click", () => {
  setDirectoryData(directoryData);
  modal.style.display = "none";
});

yesBtn.addEventListener("click", async () => {
  modal.style.display = "none";
  await deleteDirectory(directoryData);
});

const getJobDirectoryContent = async () => {
  const { getDirectoryContent } = await import("./jobsAppliedList.js");
  return getDirectoryContent();
};

const getCompanyDirectoryContent = async () => {
  const { getDirectoryContent } = await import("./companyList.js");
  return getDirectoryContent();
};

const deleteDirectory = async (directoryData) => {
  const { directory, type } = directoryData;

  const response = await window.api.deleteDirectory(directory, type);
  const { success } = response;

  console.log(response);
  if (success) {
    list.replaceChildren();
    if (type === "JOB") {
      await getJobDirectoryContent();
    } else if (type === "COMPANY") {
      await getCompanyDirectoryContent();
    }
  }
};

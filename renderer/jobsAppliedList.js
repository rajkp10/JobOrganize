import { TYPE_JOB } from "../utils/constants.js";
import { setDirectoryData } from "../utils/shared.js";

const jobList = document.getElementById("list");
const modal = document.getElementById("delete-modal");

document.getElementById("company-list").addEventListener("click", () => {
  window.api.navigate("companyList.html");
});

const getDirectoryContent = async () => {
  const data = await window.api.getOutputDirectoryContent(TYPE_JOB);
  console.log(data);

  data.forEach((jobName) => {
    const job = document.createElement("li");
    const jobSpan = document.createElement("span");
    const viewBtn = document.createElement("button");
    const deleteBtn = document.createElement("button");
    const btnDiv = document.createElement("div");

    job.id = jobName.toLowerCase();
    viewBtn.id = `view-${jobName}`;
    deleteBtn.id = `delete-${jobName}`;

    jobSpan.textContent = jobName;
    viewBtn.textContent = "View";
    deleteBtn.textContent = "Delete";

    viewBtn.classList.add("btn-primary");
    deleteBtn.classList.add("btn-danger");
    btnDiv.classList.add("flex");

    viewBtn.addEventListener("click", () =>
      window.api.saveAppliedJobPath(jobName)
    );

    deleteBtn.addEventListener("click", () => {
      modal.style.display = "flex";
      setDirectoryData({ directory: jobName, type: TYPE_JOB });
    });

    job.appendChild(jobSpan);
    btnDiv.appendChild(viewBtn);
    btnDiv.appendChild(deleteBtn);
    job.appendChild(btnDiv);
    jobList.appendChild(job);
  });
};

getDirectoryContent();

export { getDirectoryContent };

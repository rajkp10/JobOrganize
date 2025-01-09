import { fieldCount, incrementFieldCount } from "../utils/shared.js";

import {
  APPLICATION_STATUS_APPLIED,
  APPLICATION_STATUS_NOT_SELECTED,
  APPLICATION_STATUS_REJECTED,
  PRIORITY_HIGH,
  PRIORITY_LOW,
  PRIORITY_MODERATE,
} from "../utils/constants.js";

const resumeViewer = document.getElementById("resume");
const jobDetailsContainer = document.getElementById("job-details-container");
const recruiterDetailsContainer = document.getElementById(
  "recruiter-details-container"
);
const additionalDetailsContainer = document.getElementById(
  "additional-details-container"
);
const jobDescriptionModal = document.getElementById("job-description-modal");
const jobDescriptionView = document.getElementById("job-description-view");
const editBtn = document.getElementById("edit-btn");

let editMode = false;

let defaultDivsCount = 0;

document.getElementById("job-list").addEventListener("click", () => {
  window.api.navigate("jobsAppliedList.html");
});

document.getElementById("close-modal").addEventListener("click", () => {
  jobDescriptionModal.style.display = "none";
});

editBtn.addEventListener("click", () => {
  editMode = !editMode;
  const buttons = document.querySelectorAll('button[id^="form-"]');

  if (editMode) {
    editBtn.textContent = "Cancel";
    editBtn.classList.remove("btn-secondary");
    editBtn.classList.add("btn-danger");

    const disabledInputControls = document.querySelectorAll(
      ".input-control-disabled"
    );
    disabledInputControls.forEach((control) => {
      control.classList.remove("input-control-disabled");
      control.classList.add("input-control");

      const inputs = control.querySelectorAll("input, textarea, select");
      inputs.forEach((input) => (input.disabled = false));
    });

    buttons.forEach((button) => (button.style.display = "block"));
  } else {
    editBtn.textContent = "Edit";
    editBtn.classList.remove("btn-danger");
    editBtn.classList.add("btn-secondary");

    const divs = document.querySelectorAll("div");

    divs.forEach((div) => {
      const divId = div.id;

      const match = divId.match(/^div-(\d+)$/);

      if (match) {
        const number = parseInt(match[1]);

        if (number > defaultDivsCount) {
          div.remove();
        }
      }
    });

    const inputControls = document.querySelectorAll(".input-control");
    inputControls.forEach((control) => {
      control.classList.remove("input-control");
      control.classList.add("input-control-disabled");

      const inputs = control.querySelectorAll("input, textarea, select");
      inputs.forEach((input) => (input.disabled = true));
    });

    buttons.forEach((button) => (button.style.display = "none"));
  }
});

const setJobDetails = (details, jobDescription) => {
  const companyNameLabel = document.createElement("label");
  const companyNameInput = document.createElement("input");
  const jobRoleLabel = document.createElement("label");
  const jobRoleInput = document.createElement("input");
  const jobPostingUrlLabel = document.createElement("label");
  const jobPostingUrlInput = document.createElement("input");
  const applicationStatusLabel = document.createElement("label");
  const applicationStatusInput = document.createElement("select");
  const jobDescriptionLabel = document.createElement("label");
  const jobDescriptionInput = document.createElement("textarea");
  const companyNameDiv = document.createElement("div");
  const jobRoleDiv = document.createElement("div");
  const jobPostingUrlDiv = document.createElement("div");
  const applicationStatusDiv = document.createElement("div");
  const jobDescriptionDiv = document.createElement("div");

  companyNameInput.id = "company-name";
  jobRoleInput.id = "job-role-name";
  jobPostingUrlInput.id = "job-posting-url";
  applicationStatusInput.id = "application-status";
  jobDescriptionInput.id = "job-description";

  companyNameLabel.setAttribute("for", companyNameInput.id);
  jobRoleLabel.setAttribute("for", jobRoleInput.id);
  jobPostingUrlLabel.setAttribute("for", jobPostingUrlInput.id);
  applicationStatusLabel.setAttribute("for", applicationStatusInput.id);
  jobDescriptionLabel.setAttribute("for", jobDescriptionInput.id);

  [
    companyNameDiv,
    jobRoleDiv,
    jobPostingUrlDiv,
    applicationStatusDiv,
    jobDescriptionDiv,
  ].forEach((div) => div.classList.add("input-control-disabled"));

  companyNameLabel.textContent = "Company Name:";
  jobRoleLabel.textContent = "Job Role:";
  jobPostingUrlLabel.textContent = "Job Posting URL:";
  applicationStatusLabel.textContent = "Application Status";
  jobDescriptionLabel.textContent = "Job Description:";

  [
    APPLICATION_STATUS_APPLIED,
    APPLICATION_STATUS_NOT_SELECTED,
    APPLICATION_STATUS_REJECTED,
  ].forEach((status) => {
    const option = document.createElement("option");
    option.value = status;
    option.text = status;

    applicationStatusInput.appendChild(option);
  });

  companyNameInput.value = details.companyName;
  jobRoleInput.value = details.jobRole;
  jobPostingUrlInput.value = details.jobPostingUrl;
  applicationStatusInput.value = details.applicationStatus;
  jobDescriptionInput.value = jobDescription;
  jobDescriptionView.textContent = jobDescription;

  [
    companyNameInput,
    jobRoleInput,
    jobPostingUrlInput,
    applicationStatusInput,
    jobDescriptionInput,
  ].map((element) => element.setAttribute("disabled", true));

  jobDescriptionLabel.addEventListener("click", () => {
    jobDescriptionModal.style.display = "flex";
  });
  jobDescriptionLabel.style.cursor = "pointer";

  companyNameDiv.appendChild(companyNameLabel);
  companyNameDiv.appendChild(companyNameInput);
  jobRoleDiv.appendChild(jobRoleLabel);
  jobRoleDiv.appendChild(jobRoleInput);
  jobPostingUrlDiv.appendChild(jobPostingUrlLabel);
  jobPostingUrlDiv.appendChild(jobPostingUrlInput);
  applicationStatusDiv.appendChild(applicationStatusLabel);
  applicationStatusDiv.appendChild(applicationStatusInput);
  jobDescriptionDiv.appendChild(jobDescriptionLabel);
  jobDescriptionDiv.appendChild(jobDescriptionInput);

  jobDetailsContainer.appendChild(companyNameDiv);
  jobDetailsContainer.appendChild(jobRoleDiv);
  jobDetailsContainer.appendChild(jobPostingUrlDiv);
  jobDetailsContainer.appendChild(applicationStatusDiv);
  jobDetailsContainer.appendChild(jobDescriptionDiv);

  jobDetailsContainer.style.display = "flex";
};

const setRecruiterDetails = (details) => {
  details.forEach((recruiter) => {
    const rootDiv = document.createElement("div");
    const nameLabel = document.createElement("label");
    const nameInput = document.createElement("input");
    const linkedinLabel = document.createElement("label");
    const linkedinInput = document.createElement("input");
    const priorityLabel = document.createElement("label");
    const priorityInput = document.createElement("select");
    const removeButton = document.createElement("button");
    const nameDiv = document.createElement("div");
    const linkedinDiv = document.createElement("div");
    const priorityDiv = document.createElement("div");

    incrementFieldCount();

    rootDiv.id = `div-${fieldCount}`;
    nameLabel.id = `recruiterName-label-${fieldCount}`;
    nameInput.id = `recruiterName-input-${fieldCount}`;
    linkedinLabel.id = `recruiterLinkedin-label-${fieldCount}`;
    linkedinInput.id = `recruiterLinkedin-input-${fieldCount}`;
    priorityLabel.id = `recruiterPriority-label-${fieldCount}`;
    priorityInput.id = `recruiterPriority-input-${fieldCount}`;
    removeButton.id = `form-remove-recruiter-btn-${fieldCount}`;

    [PRIORITY_HIGH, PRIORITY_MODERATE, PRIORITY_LOW].forEach((priority) => {
      const option = document.createElement("option");
      option.value = priority;
      option.text = priority;

      priorityInput.appendChild(option);
    });

    nameLabel.textContent = "Recruiter's Name";
    linkedinLabel.textContent = "Recruiter's Linkedin";
    priorityLabel.textContent = "Recruiter Priority";
    nameInput.value = recruiter.Name;
    linkedinInput.value = recruiter.Linkedin;
    priorityInput.value = recruiter.Priority;

    nameLabel.setAttribute("for", nameLabel.id);
    linkedinLabel.setAttribute("for", linkedinInput.id);
    priorityLabel.setAttribute("for", priorityInput.id);

    removeButton.textContent = "Remove Recruiter";
    removeButton.type = "button";

    rootDiv.classList.add("flex", "flex-column");
    nameDiv.classList.add("input-control-disabled");
    linkedinDiv.classList.add("input-control-disabled");
    priorityDiv.classList.add("input-control-disabled");
    nameInput.disabled = true;
    linkedinInput.disabled = true;
    priorityInput.disabled = true;
    removeButton.classList.add("btn-danger");
    removeButton.style.maxWidth = "fit-content";
    removeButton.style.alignSelf = "flex-end";
    removeButton.style.display = "none";

    removeButton.addEventListener("click", () => {
      rootDiv.remove();
      if (recruiterDetailsContainer.children.length === 0) {
        recruiterDetailsContainer.style.display = "none";
      }
    });

    nameDiv.appendChild(nameLabel);
    nameDiv.appendChild(nameInput);
    linkedinDiv.appendChild(linkedinLabel);
    linkedinDiv.appendChild(linkedinInput);
    priorityDiv.appendChild(priorityLabel);
    priorityDiv.appendChild(priorityInput);

    rootDiv.appendChild(nameDiv);
    rootDiv.appendChild(linkedinDiv);
    rootDiv.appendChild(priorityDiv);
    rootDiv.appendChild(removeButton);
    recruiterDetailsContainer.appendChild(rootDiv);
    if (recruiterDetailsContainer.style.display == "none") {
      recruiterDetailsContainer.style.display = "flex";
    }
  });
};

const setAdditionalDetails = (details) => {
  for (const [key, value] of Object.entries(details)) {
    const rootDiv = document.createElement("div");
    const inputDiv = document.createElement("div");
    const label = document.createElement("input");
    const input = document.createElement("input");
    const removeButton = document.createElement("button");

    incrementFieldCount();

    rootDiv.id = `div-${fieldCount}`;
    label.id = `label-${fieldCount}`;
    input.id = `input-${fieldCount}`;
    removeButton.id = `form-remove-additional-detail-${fieldCount}`;

    label.value = key;
    input.value = value;
    removeButton.textContent = "Remove Field";
    removeButton.type = "button";

    rootDiv.classList.add("flex", "flex-column");
    inputDiv.classList.add("input-control-disabled");
    label.setAttribute("disabled", true);
    input.setAttribute("disabled", true);
    removeButton.classList.add("btn-danger");
    removeButton.style.maxWidth = "fit-content";
    removeButton.style.alignSelf = "flex-end";
    removeButton.style.display = "none";

    removeButton.addEventListener("click", () => {
      additionalDetailsContainer.removeChild(rootDiv);
      if (additionalDetailsContainer.children.length === 0) {
        additionalDetailsContainer.style.display = "none";
      }
    });

    inputDiv.appendChild(label);
    inputDiv.appendChild(input);
    rootDiv.appendChild(inputDiv);
    rootDiv.appendChild(removeButton);
    additionalDetailsContainer.appendChild(rootDiv);
    if (additionalDetailsContainer.style.display == "none") {
      additionalDetailsContainer.style.display = "flex";
    }
  }
};

const getJobDetails = async () => {
  const data = await window.api.getJobDetails();
  const { jobDetails, jobDescription, recruiterDetails, additionalDetails } =
    data;
  console.log(data);

  resumeViewer.setAttribute("data", data.resume);
  setJobDetails(jobDetails, jobDescription);
  setRecruiterDetails(recruiterDetails);
  setAdditionalDetails(additionalDetails);

  defaultDivsCount = fieldCount;
};

document
  .getElementById("form-submit-btn")
  .addEventListener("click", async (e) => {
    e.preventDefault();

    const companyNameInput = document.getElementById("company-name");
    const jobRoleNameInput = document.getElementById("job-role-name");
    const jobPostingUrlInput = document.getElementById("job-posting-url");
    const applicationStatus = document.getElementById("application-status");
    const jobDescription = document.getElementById("job-description");

    const data = {
      jobDetails: {
        companyName: companyNameInput.value.trim(),
        jobRole: jobRoleNameInput.value.trim(),
        jobPostingUrl: jobPostingUrlInput.value.trim(),
        applicationStatus: applicationStatus.value,
      },
      jobDescription: jobDescription.value,
    };

    const recruiterDetails = [];
    const recruiterNameLabels = recruiterDetailsContainer.querySelectorAll(
      'label[id^="recruiterName-label-"'
    );

    recruiterNameLabels.forEach((label) => {
      const controlId = label.id.charAt(label.id.length - 1);
      const nameId = `recruiterName-input-${controlId}`;
      const linkedinId = `recruiterLinkedin-input-${controlId}`;
      const priorityId = `recruiterPriority-input-${controlId}`;
      const name = document.getElementById(nameId);
      const linkedin = document.getElementById(linkedinId);
      const priority = document.getElementById(priorityId);

      if (name && linkedin) {
        recruiterDetails.push({
          Name: name.value.trim(),
          Linkedin: linkedin.value.trim(),
          Priority: priority.value,
        });
      }
    });

    const additionalDetails = {};
    const additionalDetailsLabels = additionalDetailsContainer.querySelectorAll(
      'input[id^="label-"]'
    );

    additionalDetailsLabels.forEach((label) => {
      const controlId = label.id.charAt(label.id.length - 1);
      const inputId = `input-${controlId}`;
      const input = document.getElementById(inputId);

      if (input) {
        additionalDetails[label.value.trim()] = input.value.trim();
      }
    });

    data["recruiterDetails"] = recruiterDetails;
    data["additionalDetails"] = additionalDetails;

    const { success } = await window.api.submitForm(data);

    if (success) {
      window.location.reload();
    }
  });

getJobDetails();

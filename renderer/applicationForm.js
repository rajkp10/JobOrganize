const comapnyNameInput = document.getElementById("company-name");
const jobRoleNameInput = document.getElementById("job-role-name");
const jobPostingUrlInput = document.getElementById("job-posting-url");
const recruiterDetailsContainer = document.getElementById(
  "recruiter-details-container"
);
const additionalDetailsContainer = document.getElementById(
  "additional-details-container"
);
let fieldCount = 0;

document.getElementById("home").addEventListener("click", () => {
  window.api.navigate("home.html");
});

document.getElementById("add-new-recruiter").addEventListener("click", () => {
  const nameDiv = document.createElement("div");
  const newNameLabel = document.createElement("label");
  const newNameInput = document.createElement("input");
  const linkedinDiv = document.createElement("div");
  const newLinkedinLabel = document.createElement("label");
  const newLinkedinInput = document.createElement("input");
  const removeButton = document.createElement("button");

  fieldCount++;

  newNameLabel.id = `recruiterName-label-${fieldCount}`;
  newNameInput.id = `recruiterName-input-${fieldCount}`;
  newLinkedinLabel.id = `recruiterLinkedin-label-${fieldCount}`;
  newLinkedinInput.id = `recruiterLinkedin-input-${fieldCount}`;

  newNameLabel.textContent = "Recruiter Name";
  newLinkedinLabel.textContent = "Recruiter's Linkedin";

  newNameLabel.setAttribute("for", newNameInput.id);
  newLinkedinLabel.setAttribute("for", newLinkedinInput.id);

  removeButton.textContent = "Remove Recruiter";
  removeButton.type = "button";

  nameDiv.classList.add("input-control");
  linkedinDiv.classList.add("input-control");
  removeButton.classList.add("btn-danger");
  removeButton.style.maxWidth = "fit-content";
  removeButton.style.alignSelf = "flex-end";

  removeButton.addEventListener("click", () => {
    recruiterDetailsContainer.removeChild(nameDiv);
    recruiterDetailsContainer.removeChild(linkedinDiv);
    recruiterDetailsContainer.removeChild(removeButton);
    if (recruiterDetailsContainer.children.length === 0) {
      recruiterDetailsContainer.style.display = "none";
    }
  });

  nameDiv.appendChild(newNameLabel);
  nameDiv.appendChild(newNameInput);
  linkedinDiv.appendChild(newLinkedinLabel);
  linkedinDiv.appendChild(newLinkedinInput);

  recruiterDetailsContainer.appendChild(nameDiv);
  recruiterDetailsContainer.appendChild(linkedinDiv);
  recruiterDetailsContainer.appendChild(removeButton);
  if (recruiterDetailsContainer.style.display == "none") {
    recruiterDetailsContainer.style.display = "flex";
  }
});

document.getElementById("add-new-field").addEventListener("click", () => {
  const fieldDiv = document.createElement("div");
  const newFieldLabel = document.createElement("input");
  const newFiledInput = document.createElement("input");
  const removeButton = document.createElement("button");

  fieldCount++;

  newFieldLabel.placeholder = "Enter Field Name";
  newFiledInput.placeholder = "Enter Field Value";

  newFieldLabel.id = `label-${fieldCount}`;
  newFiledInput.id = `input-${fieldCount}`;

  removeButton.textContent = "Remove Field";
  removeButton.type = "button";

  fieldDiv.classList.add("input-control");
  removeButton.classList.add("btn-danger");
  removeButton.style.maxWidth = "fit-content";
  removeButton.style.alignSelf = "flex-end";

  removeButton.addEventListener("click", () => {
    additionalDetailsContainer.removeChild(fieldDiv);
    additionalDetailsContainer.removeChild(removeButton);
    if (additionalDetailsContainer.children.length === 0) {
      additionalDetailsContainer.style.display = "none";
    }
  });

  fieldDiv.appendChild(newFieldLabel);
  fieldDiv.appendChild(newFiledInput);
  additionalDetailsContainer.appendChild(fieldDiv);
  additionalDetailsContainer.appendChild(removeButton);
  if (additionalDetailsContainer.style.display == "none") {
    additionalDetailsContainer.style.display = "flex";
  }
});

document.getElementById("submit-btn").addEventListener("click", async (e) => {
  e.preventDefault();
  const data = {
    jobDetails: {
      companyName: comapnyNameInput.value,
      jobRole: jobRoleNameInput.value,
      jobPostingUrl: jobPostingUrlInput.value,
    },
  };

  const recruiterDetails = [];
  const recruiterNameLabels = recruiterDetailsContainer.querySelectorAll(
    'label[id^="recruiterName-label-"'
  );

  recruiterNameLabels.forEach((label) => {
    const controlId = label.id.charAt(label.id.length - 1);
    const nameId = `recruiterName-input-${controlId}`;
    const linkedinId = `recruiterLinkedin-input-${controlId}`;
    const name = document.getElementById(nameId);
    const linkedin = document.getElementById(linkedinId);

    if (name && linkedin) {
      recruiterDetails.push({
        Name: name.value,
        Linkedin: linkedin.value,
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
      additionalDetails[label.value] = input.value;
    }
  });

  data["recruiterDetails"] = recruiterDetails;
  data["additionalDetails"] = additionalDetails;

  console.log(data);

  const { success } = await window.api.submitForm(data);
  console.log(success);

  // if (success) {
  //   window.api.navigate("home.html");
  // }
});

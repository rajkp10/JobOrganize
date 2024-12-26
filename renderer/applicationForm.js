const comapnyNameInput = document.getElementById("company-name");
const jobRoleNameInput = document.getElementById("job-role-name");
const jobPostingUrlInput = document.getElementById("job-posting-url");
const recruiterNameInput = document.getElementById("recruiter-name");
const recruiterEmailInput = document.getElementById("recruiter-email");
const inputContainer = document.getElementById("input-container");
let fieldCount = 0;

document.getElementById("home").addEventListener("click", () => {
  window.api.navigate("home.html");
});

document.getElementById("add-new-field").addEventListener("click", () => {
  const newFieldLabel = document.createElement("input");
  const newFiledInput = document.createElement("input");
  const removeButton = document.createElement("button");
  const breakTag = document.createElement("br");

  fieldCount++;

  newFieldLabel.placeholder = "Enter Field Name";
  newFiledInput.placeholder = "Enter Field Value";

  newFieldLabel.id = `label-${fieldCount}`;
  newFiledInput.id = `input-${fieldCount}`;

  removeButton.textContent = "Remove";
  removeButton.type = "button";

  removeButton.addEventListener("click", () => {
    inputContainer.removeChild(newFieldLabel);
    inputContainer.removeChild(newFiledInput);
    inputContainer.removeChild(removeButton);
    inputContainer.removeChild(breakTag);
  });

  inputContainer.appendChild(newFieldLabel);
  inputContainer.appendChild(newFiledInput);
  inputContainer.appendChild(removeButton);
  inputContainer.appendChild(breakTag);
});

document.getElementById("submit-btn").addEventListener("click", async (e) => {
  e.preventDefault();
  const data = {
    jobDetails: {
      companyName: comapnyNameInput.value,
      jobRole: jobRoleNameInput.value,
      jobPostingUrl: jobPostingUrlInput.value,
    },
    recruiterDetails: {
      recruiterName: recruiterNameInput.value,
      recruiterEmail: recruiterEmailInput.value,
    },
  };

  const additionalDetails = {};
  const labels = inputContainer.querySelectorAll('input[id^="label-"]');

  labels.forEach((label) => {
    const inputId = `input-${label.id.charAt(label.id.length - 1)}`;
    const input = document.getElementById(inputId);

    if (input) {
      additionalDetails[label.value] = input.value;
    }
  });

  data["additionalDetails"] = additionalDetails;
  console.log(data);

  const { success } = await window.api.submitForm(data);
  console.log(success);

  // if (success) {
  //   window.api.navigate("home.html");
  // }
});

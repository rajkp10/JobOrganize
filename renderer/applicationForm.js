const comapnyNameInput = document.getElementById("company-name");
const jobRoleNameInput = document.getElementById("job-role-name");
const jobPostingUrlInput = document.getElementById("job-posting-url");
const jobDescription = document.getElementById("job-description");
const recruiterDetailsContainer = document.getElementById(
  "recruiter-details-container"
);
const additionalDetailsContainer = document.getElementById(
  "additional-details-container"
);

document.getElementById("home").addEventListener("click", () => {
  window.api.navigate("home.html");
});

document
  .getElementById("form-submit-btn")
  .addEventListener("click", async (e) => {
    e.preventDefault();
    const data = {
      jobDetails: {
        companyName: comapnyNameInput.value.trim(),
        jobRole: jobRoleNameInput.value.trim(),
        jobPostingUrl: jobPostingUrlInput.value.trim(),
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

      if (name && linkedin && priority) {
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

    console.log(data);

    const { success } = await window.api.submitForm(data);
    console.log(success);

    if (success) {
      window.api.navigate("home.html");
    }
  });

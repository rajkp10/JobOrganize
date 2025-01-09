import {
  PRIORITY_HIGH,
  PRIORITY_LOW,
  PRIORITY_MODERATE,
} from "../utils/constants.js";
import { fieldCount, incrementFieldCount } from "../utils/shared.js";

const recruiterDetailsContainer = document.getElementById(
  "recruiter-details-container"
);
const additionalDetailsContainer = document.getElementById(
  "additional-details-container"
);

document
  .getElementById("form-add-new-recruiter")
  .addEventListener("click", () => {
    const rootDiv = document.createElement("div");
    const nameDiv = document.createElement("div");
    const newNameLabel = document.createElement("label");
    const newNameInput = document.createElement("input");
    const linkedinDiv = document.createElement("div");
    const newLinkedinLabel = document.createElement("label");
    const newLinkedinInput = document.createElement("input");
    const priorityDiv = document.createElement("div");
    const priorityLabel = document.createElement("label");
    const priorityInput = document.createElement("select");
    const removeButton = document.createElement("button");

    incrementFieldCount();

    rootDiv.id = `div-${fieldCount}`;
    newNameLabel.id = `recruiterName-label-${fieldCount}`;
    newNameInput.id = `recruiterName-input-${fieldCount}`;
    newLinkedinLabel.id = `recruiterLinkedin-label-${fieldCount}`;
    newLinkedinInput.id = `recruiterLinkedin-input-${fieldCount}`;
    priorityLabel.id = `recruiterPriority-label-${fieldCount}`;
    priorityInput.id = `recruiterPriority-input-${fieldCount}`;
    removeButton.id = `form-remove-recruiter-btn-${fieldCount}`;

    newNameLabel.textContent = "Recruiter's Name";
    newLinkedinLabel.textContent = "Recruiter's Linkedin";
    priorityLabel.textContent = "Recruiter Priority";

    newNameLabel.setAttribute("for", newNameInput.id);
    newLinkedinLabel.setAttribute("for", newLinkedinInput.id);
    priorityLabel.setAttribute("for", priorityInput.id);

    removeButton.textContent = "Remove Recruiter";
    removeButton.type = "button";

    rootDiv.classList.add("flex", "flex-column");
    nameDiv.classList.add("input-control");
    linkedinDiv.classList.add("input-control");
    priorityDiv.classList.add("input-control");
    removeButton.classList.add("btn-danger");
    removeButton.style.maxWidth = "fit-content";
    removeButton.style.alignSelf = "flex-end";

    [PRIORITY_HIGH, PRIORITY_MODERATE, PRIORITY_LOW].forEach((priority) => {
      const option = document.createElement("option");

      option.value = priority;
      option.text = priority;

      priorityInput.appendChild(option);
    });

    removeButton.addEventListener("click", () => {
      rootDiv.remove();
      if (recruiterDetailsContainer.children.length === 0) {
        recruiterDetailsContainer.style.display = "none";
      }
    });

    nameDiv.appendChild(newNameLabel);
    nameDiv.appendChild(newNameInput);
    linkedinDiv.appendChild(newLinkedinLabel);
    linkedinDiv.appendChild(newLinkedinInput);
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

document.getElementById("form-add-new-field").addEventListener("click", () => {
  const rootDiv = document.createElement("div");
  const fieldDiv = document.createElement("div");
  const newFieldLabel = document.createElement("input");
  const newFiledInput = document.createElement("input");
  const removeButton = document.createElement("button");

  incrementFieldCount();

  newFieldLabel.placeholder = "Enter Field Name";
  newFiledInput.placeholder = "Enter Field Value";

  rootDiv.id = `div-${fieldCount}`;
  newFieldLabel.id = `label-${fieldCount}`;
  newFiledInput.id = `input-${fieldCount}`;
  removeButton.id = `form-remove-additional-detail-${fieldCount}`;

  removeButton.textContent = "Remove Field";
  removeButton.type = "button";

  rootDiv.classList.add("flex", "flex-column");
  fieldDiv.classList.add("input-control");
  removeButton.classList.add("btn-danger");
  removeButton.style.maxWidth = "fit-content";
  removeButton.style.alignSelf = "flex-end";

  removeButton.addEventListener("click", () => {
    rootDiv.remove();
    if (additionalDetailsContainer.children.length === 0) {
      additionalDetailsContainer.style.display = "none";
    }
  });

  fieldDiv.appendChild(newFieldLabel);
  fieldDiv.appendChild(newFiledInput);
  rootDiv.appendChild(fieldDiv);
  rootDiv.appendChild(removeButton);
  additionalDetailsContainer.appendChild(rootDiv);
  if (additionalDetailsContainer.style.display == "none") {
    additionalDetailsContainer.style.display = "flex";
  }
});

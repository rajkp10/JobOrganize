import { TYPE_COMPANY } from "../utils/constants.js";
import { setDirectoryData } from "../utils/shared.js";

const companyList = document.getElementById("list");
const modal = document.getElementById("delete-modal");

document.getElementById("home").addEventListener("click", () => {
  window.api.navigate("home.html");
});

const getDirectoryContent = async () => {
  const data = await window.api.getOutputDirectoryContent(TYPE_COMPANY);
  console.log(data);

  data.forEach((companyName) => {
    const company = document.createElement("li");
    const companySpan = document.createElement("span");
    const viewBtn = document.createElement("button");
    const deleteBtn = document.createElement("button");
    const btnDiv = document.createElement("div");

    company.id = companyName.toLowerCase();
    viewBtn.id = `view-${companyName}`;
    deleteBtn.id = `delete-${companyName}`;

    companySpan.textContent = companyName;
    viewBtn.textContent = "View";
    deleteBtn.textContent = "Delete";

    viewBtn.classList.add("btn-primary");
    deleteBtn.classList.add("btn-danger");
    btnDiv.classList.add("flex");

    viewBtn.addEventListener("click", () => {
      window.api.saveCompanyPath(companyName);
    });

    deleteBtn.addEventListener("click", () => {
      modal.style.display = "flex";
      setDirectoryData({ directory: companyName, type: TYPE_COMPANY });
    });

    company.appendChild(companySpan);
    btnDiv.appendChild(viewBtn);
    btnDiv.appendChild(deleteBtn);
    company.appendChild(btnDiv);
    companyList.appendChild(company);
  });
};

getDirectoryContent();

export { getDirectoryContent };

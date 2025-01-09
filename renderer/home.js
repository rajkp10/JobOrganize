document.getElementById("select-directories").addEventListener("click", () => {
  window.api.navigate("selectDirectories.html");
});

document.getElementById("application-form").addEventListener("click", () => {
  window.api.navigate("applicationForm.html");
});

document.getElementById("list-of-companies").addEventListener("click", () => {
  window.api.navigate("companyList.html");
});

const getDashboardData = async () => {
  await window.api.getDashboardData();
};

getDashboardData();

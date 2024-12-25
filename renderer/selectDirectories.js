const sourceDirView = document.getElementById("source-dir");
const destinationDirView = document.getElementById("destination-dir");

document.getElementById("home").addEventListener("click", () => {
  window.api.navigate("home.html");
});

document.getElementById("select-source").addEventListener("click", async () => {
  const sourceDir = await window.api.openDirectoryDialog("SourceDirectory");
  if (sourceDir) {
    sourceDirView.textContent = sourceDir;
  }
});

document.getElementById("select-dest").addEventListener("click", async () => {
  const destDir = await window.api.openDirectoryDialog("DestinationDirectory");
  if (destDir) {
    destinationDirView.textContent = destDir;
  }
});

const getSelectedDir = async () => {
  const data = await window.api.getSelectedDirectories();
  console.log(data);

  sourceDirView.textContent = data.inputDir;
  destinationDirView.textContent = data.outputDir;
};

getSelectedDir();

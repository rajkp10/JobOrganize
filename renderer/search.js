const searchBox = document.getElementById("search-box");

searchBox.addEventListener("input", () => {
  const allListItems = document.querySelectorAll("li");
  if (!searchBox.value) {
    allListItems.forEach((item) => (item.style.display = "flex"));
    return;
  }
  allListItems.forEach((item) => (item.style.display = "flex"));

  const searchedItems = document.querySelectorAll(
    `li:not([id*="${searchBox.value.toLowerCase()}"])`
  );
  searchedItems.forEach((item) => (item.style.display = "none"));
});

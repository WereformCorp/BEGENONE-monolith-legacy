/* eslint-disable */
const searchInput = document.querySelector(".searchBar-InputField");

// Event listener for the search input
searchInput.addEventListener("keydown", async event => {
  // event.preventDefault();
  if (event.key === "Enter") {
    const searchTerm = searchInput.value.trim();
    window.location.href = `/search?query=${searchTerm}`;
    // Update your UI with the search results
  }
});

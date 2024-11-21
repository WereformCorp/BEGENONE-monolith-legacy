/* eslint-disable */
const searchInput = document.querySelector('.searchBar-InputField');
const searchIcon = document.querySelector('.searchBar-search-Icon');

// Event listener for the search input
searchInput.addEventListener('keydown', async (event) => {
  // event.preventDefault();
  if (event.key === 'Enter') {
    const searchTerm = searchInput.value.trim();
    window.location.href = `/search?query=${searchTerm}`;
    // Update your UI with the search results
  }
});

searchIcon.addEventListener('click', async (event) => {
  const searchTerm = searchInput.value.trim();
  window.location.href = `/search?query=${searchTerm}`;
  // Update your UI with the search results
});

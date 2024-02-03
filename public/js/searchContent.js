/* eslint-disable */
const searchInput = document.querySelector('.searchBar-InputField');

// Event listener for the search input
searchInput.addEventListener('keydown', async (event) => {
  // event.preventDefault();
  if (event.key === 'Enter') {
    const searchTerm = searchInput.value.trim();

    try {
      // Make a GET request to your search endpoint
      // const response = await axios.get(
      //   `http://127.0.0.1:3000/search/content?query=${searchTerm}`,
      // );
      // const searchResults = response.data.results;
      // console.log(response);

      // if (response.data.status === 'success')
      window.location.href = `/search?query=${searchTerm}`;

      console.log('Search results:', searchResults);
      // Update your UI with the search results
    } catch (error) {
      console.error('Error during search:', error);
    }
  }
});

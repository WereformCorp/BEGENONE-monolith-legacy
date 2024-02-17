/* eslint-disable */

function toggleDescription() {
  var description = document.getElementById('description');
  var btn = document.getElementById('readMoreBtn');

  if (description.style.maxHeight) {
    // If the description is expanded, collapse it
    description.style.maxHeight = null;
    btn.innerHTML = 'Read More';
  } else {
    // If the description is collapsed, expand it
    description.style.maxHeight = description.scrollHeight + 'px';
    btn.innerHTML = 'Read Less';
  }
}

toggleDescription();

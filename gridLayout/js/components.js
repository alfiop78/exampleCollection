console.log('component');

document.querySelectorAll('.btn-dropdown').forEach(dropdown => {
  dropdown.addEventListener('click', (e) => {
    e.preventDefault();
    console.log(e.target.dataset.dropdownId);
    const dropdown = document.getElementById(e.target.dataset.dropdownId);
    dropdown.classList.toggle('show');
    // dropdown.style.display = 'block';
  })
});

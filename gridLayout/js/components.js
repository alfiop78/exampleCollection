console.log('component');

document.querySelectorAll('a.btn-dropdown').forEach(dropdown => {
  dropdown.addEventListener('click', (e) => {
    e.preventDefault();
    const dropdown = document.getElementById(e.currentTarget.dataset.dropdownId);
    dropdown.classList.toggle('show');
  })
});

document.querySelectorAll('button.btn-dropdown').forEach(dropdown => {
  dropdown.addEventListener('click', (e) => {
    const dropdown = document.getElementById(e.currentTarget.dataset.dropdownId);
    dropdown.classList.toggle('show');
  })
});

const menu = document.getElementById('menu');
menu.addEventListener('click', toggleNav);

function toggleNav(e) {
  const main_nav = document.getElementById(e.currentTarget.dataset.referenceId);
  main_nav.classList.toggle('show');

}

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

// eventi sugli elementi all'interno di una dropdown
document.querySelectorAll('.dropdown:not([multiple]) .items').forEach(li => {
  li.addEventListener('click', handleSelectElement);
});

document.querySelectorAll('.dropdown[multiple] .items').forEach(li => {
  li.addEventListener('click', handleMultiSelectElement);
});

const menu = document.getElementById('menu');
menu.addEventListener('click', toggleNav);

function toggleNav(e) {
  const main_nav = document.getElementById(e.currentTarget.dataset.referenceId);
  main_nav.classList.toggle('show');
}

function handleSelectElement(e) {
  // visualizzo l'items selezionato nello span del <button> relativo
  const button = document.querySelector(`button[data-dropdown-id='${e.currentTarget.parentElement.dataset.parent}']`);
  button.dataset.value = e.currentTarget.innerText;
}

function handleMultiSelectElement(e) {
  e.currentTarget.toggleAttribute("selected");
}

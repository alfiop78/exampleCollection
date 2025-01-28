console.log('component');

const wrapper = document.getElementById('wrapper');
// wrapper.addEventListener('click', close, false);
// wrapper.addEventListener('click', close, true);

document.querySelectorAll('a.btn-dropdown').forEach(dropdown => {
  dropdown.addEventListener('click', (e) => {
    e.preventDefault();
    wrapper.addEventListener('click', close, true);
    const dropdown = document.getElementById(e.currentTarget.dataset.dropdownId);
    dropdown.classList.toggle('show');
  })
});

document.querySelectorAll('button.btn-dropdown, button.btn').forEach(dropdown => {
  dropdown.addEventListener('click', (e) => {
    wrapper.addEventListener('click', close, true);
    // chiudo le dropdown eventualmente aperte
    document.querySelectorAll('.ul__dropdown.show').forEach(dropdown => dropdown.classList.toggle('show'));
    const dropdown = document.getElementById(e.currentTarget.dataset.relId);
    dropdown.classList.toggle('show');
  })
});

// eventi sugli elementi all'interno di una dropdown
document.querySelectorAll('.ul__dropdown:not([multiple]) .items').forEach(li => {
  li.addEventListener('click', handleSelectElement);
});

document.querySelectorAll('.ul__dropdown[multiple] .items').forEach(li => {
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

function close(e) {
  // console.log(e);
  // console.log(e.currentTarget, this)
  // console.log(e.target)
  // offsetParent : https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
  // In questo caso offsetParent mi restituisce (quando si clicca su un item di una dropdown multiselect)
  // ul__dropdown, quindi , chiudo le dropdown se l'utente non ha cliccato su un elemento della dropdown
  if (!e.target.offsetParent.classList.contains('ul__dropdown')) {
    if (e.currentTarget === this) document.querySelectorAll('.ul__dropdown.show').forEach(dropdown => dropdown.classList.toggle('show'));
    wrapper.removeEventListener('click', close, true);
  }
}

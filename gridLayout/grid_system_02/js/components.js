console.log('component');

const wrapper = document.getElementById('wrapper');
// wrapper.addEventListener('click', wrapperClick, false);
// wrapper.addEventListener('click', wrapperClick, true);

document.querySelectorAll('a.btn').forEach(nav => {
  nav.addEventListener('click', (e) => {
    e.preventDefault();
    // if (e.currentTarget.classList.contains('show')) e.currentTarget.classList.remove('show');

    // chiudo eventuali menù già aperti, se ci sono
    const openedNav = document.querySelector('.ul__nav.show');
    const nav = document.getElementById(e.currentTarget.dataset.relId);
    if (openedNav) {
      // document.querySelector('.ul__nav.show')?.classList.toggle('show');
      openedNav.classList.toggle('show');
      nav.classList.toggle('show');
      // se l'elemeneto aperto è diverso da quello cliccato
    } else if (openedNav === e.currentTarget) {
      openedNav.classList.remove('show');
    } else {
      nav.classList.toggle('show');
    }
  })
});

document.querySelectorAll('button.btn-dropdown, button.btn').forEach(dropdown => {
  dropdown.addEventListener('click', (e) => {
    wrapper.addEventListener('click', wrapperClick, true);
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

function wrapperClick(e) {
  // console.log(e);
  // console.log(e.currentTarget, this)
  // console.log(e.target)
  // offsetParent : https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
  // In questo caso offsetParent mi restituisce (quando si clicca su un item di una dropdown multiselect)
  // ul__dropdown, quindi , chiudo le dropdown se l'utente non ha cliccato su un elemento della dropdown
  if (!e.target.offsetParent.classList.contains('ul__dropdown')) {
    if (e.currentTarget === this) document.querySelectorAll('.ul__dropdown.show').forEach(dropdown => dropdown.classList.toggle('show'));
    wrapper.removeEventListener('click', wrapperClick, true);
  }
}

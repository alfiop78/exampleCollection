console.log('component');

const wrapper = document.getElementById('wrapper');
// wrapper.addEventListener('click', wrapperClick, false);
// wrapper.addEventListener('click', wrapperClick, true);

document.querySelectorAll('a.btn').forEach(nav => {
  nav.addEventListener('click', (e) => {
    e.preventDefault();
    // nav da aprire/chiudere
    const nav__item = document.getElementById(e.currentTarget.dataset.relId);
    // nav attualmente aperto
    const opened = document.querySelector('.ul__nav.show');
    // chiudo eventuali altri nav attualmente aperti
    document.querySelector('.ul__nav.show')?.classList.remove('show');
    // se è presente un nav già aperto, verifico se è lo stesso rispetto al currentTarget.
    if (opened) {
      // se il nav aperto è diverso dal currentTarget effettuo il toggle, quindi apro/chiudo currentTarget 
      // se il nav aperto è lo stesso di currentTarget è stato già chiuso (prima dell'if)
      if (opened.id !== e.currentTarget.dataset.relId) nav__item.classList.toggle('show');
    } else {
      // non ci sono altri nav aperti, apro/chiudo currentTarget
      nav__item.classList.toggle('show');
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
  const main_nav_content = document.getElementById('main-nav__content');
  main_nav.classList.toggle('show');

  main_nav.ontransitionend = () => {
    main_nav_content.classList.toggle('open');
  }

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

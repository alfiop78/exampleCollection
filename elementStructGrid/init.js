console.log('init');
document.querySelectorAll('section[data-section-active]').forEach(section => {
  section.querySelectorAll('*[data-section]').forEach(subSection => {
    subSection.addEventListener('mouseenter', (e) => {
      // console.log(section, e.target);
      section.dataset.sectionActive = e.target.dataset.section;
    }, false);
  });
});

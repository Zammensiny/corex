const navToggle = document.querySelector('.burger');
const nav = document.querySelector('.main-nav');
const navHiddenText = navToggle?.querySelector('.visually-hidden');

if (navToggle && nav) {
  const setMenuState = (isOpen) => {
    nav.classList.toggle('is-open', isOpen);
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));

    if (navHiddenText) {
      navHiddenText.textContent = isOpen ? 'Закрыть меню' : 'Открыть меню';
    }
  };

  navToggle.addEventListener('click', (event) => {
    event.stopPropagation();
    setMenuState(!nav.classList.contains('is-open'));
  });

  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      setMenuState(false);
    }
  });

  document.addEventListener('click', (event) => {
    if (!nav.classList.contains('is-open')) return;

    const clickInsideMenu = nav.contains(event.target);
    const clickOnToggle = navToggle.contains(event.target);

    if (!clickInsideMenu && !clickOnToggle) {
      setMenuState(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setMenuState(false);
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 920) {
      setMenuState(false);
    }
  });
}

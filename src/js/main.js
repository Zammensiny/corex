const navToggle = document.querySelector('.burger');
const nav = document.querySelector('.main-nav');
const navHiddenText = navToggle?.querySelector('.visually-hidden');

const setMenuState = (isOpen) => {
  if (!navToggle || !nav) return;

  nav.classList.toggle('is-open', isOpen);
  navToggle.classList.toggle('is-open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));

  if (navHiddenText) {
    navHiddenText.textContent = isOpen ? 'Закрыть меню' : 'Открыть меню';
  }
};

if (navToggle && nav) {
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

  window.addEventListener('resize', () => {
    if (window.innerWidth > 920) {
      setMenuState(false);
    }
  });
}

const modal = document.querySelector('[data-menu-modal]');
const modalOpenButtons = document.querySelectorAll('[data-menu-modal-open]');
const modalCloseButtons = document.querySelectorAll('[data-menu-modal-close]');
const modalLinks = document.querySelectorAll('[data-menu-modal-link]');
let modalLastFocused = null;

const getModalFocusable = () => {
  if (!modal) return [];
  return Array.from(
    modal.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])')
  ).filter((element) => element.offsetParent !== null || element === document.activeElement);
};

const setModalState = (isOpen) => {
  if (!modal) return;

  modal.classList.toggle('is-open', isOpen);
  modal.setAttribute('aria-hidden', String(!isOpen));
  document.body.classList.toggle('is-menu-modal-open', isOpen);

  modalOpenButtons.forEach((button) => {
    button.classList.toggle('is-active', isOpen);
    button.setAttribute('aria-expanded', String(isOpen));
  });

  if (isOpen) {
    modalLastFocused = document.activeElement;
    setMenuState(false);
    window.setTimeout(() => {
      const focusable = getModalFocusable();
      focusable[0]?.focus({ preventScroll: true });
    }, 80);
  } else if (modalLastFocused) {
    modalLastFocused.focus?.({ preventScroll: true });
    modalLastFocused = null;
  }
};

modalOpenButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setModalState(true);
  });
});

modalCloseButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setModalState(false);
  });
});

modalLinks.forEach((link) => {
  link.addEventListener('click', () => {
    setModalState(false);
  });
});

if (modal) {
  modal.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;

    const focusable = getModalFocusable();
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    }

    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setMenuState(false);
    setModalState(false);
  }
});

document.querySelectorAll('[data-copy-email]').forEach((button) => {
  button.addEventListener('click', async () => {
    const email = button.dataset.copyEmail;
    if (!email || !navigator.clipboard) return;

    try {
      await navigator.clipboard.writeText(email);
      button.classList.add('is-copied');
      window.setTimeout(() => button.classList.remove('is-copied'), 1000);
    } catch (error) {
      console.warn('Не удалось скопировать email', error);
    }
  });
});

const casesBlocks = document.querySelectorAll('.cases');

casesBlocks.forEach((casesBlock) => {
  const tabs = Array.from(casesBlock.querySelectorAll('[data-case-tab]'));
  const panels = Array.from(casesBlock.querySelectorAll('[data-case-panel]'));

  if (!tabs.length || !panels.length) return;

  const setActiveCase = (caseId) => {
    tabs.forEach((tab) => {
      const isActive = tab.dataset.caseTab === caseId;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
      tab.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    panels.forEach((panel) => {
      const isActive = panel.dataset.casePanel === caseId;
      panel.classList.toggle('is-active', isActive);
      panel.hidden = !isActive;
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      if (tab.disabled || !tab.dataset.caseTab) return;
      setActiveCase(tab.dataset.caseTab);
    });

    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;

      event.preventDefault();
      const enabledTabs = tabs.filter((item) => !item.disabled);
      const currentIndex = enabledTabs.indexOf(tab);
      let nextIndex = currentIndex;

      if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % enabledTabs.length;
      if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = enabledTabs.length - 1;

      enabledTabs[nextIndex]?.focus();
    });

    tab.setAttribute('tabindex', index === 0 ? '0' : '-1');
  });
});

const workflowSliders = document.querySelectorAll('[data-workflow-slider]');

workflowSliders.forEach((slider) => {
  const viewport = slider.querySelector('[data-workflow-viewport]');
  const track = slider.querySelector('[data-workflow-track]');
  const slides = Array.from(slider.querySelectorAll('[data-workflow-slide]'));
  const prevButton = slider.querySelector('[data-workflow-prev]');
  const nextButton = slider.querySelector('[data-workflow-next]');

  if (!viewport || !track || !slides.length) return;

  let activeIndex = slides.findIndex((slide) => slide.classList.contains('is-active'));
  if (activeIndex < 0) activeIndex = 0;

  const updateSlider = () => {
    const activeSlide = slides[activeIndex];
    const viewportCenter = viewport.clientWidth / 2;
    const slideCenter = activeSlide.offsetLeft + activeSlide.offsetWidth / 2;
    const offset = Math.max(0, slideCenter - viewportCenter);

    track.style.transform = `translate3d(${-offset}px, 0, 0)`;

    slides.forEach((slide, index) => {
      const isActive = index === activeIndex;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
    });
  };

  const setSlide = (nextIndex) => {
    activeIndex = (nextIndex + slides.length) % slides.length;
    updateSlider();
  };

  prevButton?.addEventListener('click', () => setSlide(activeIndex - 1));
  nextButton?.addEventListener('click', () => setSlide(activeIndex + 1));

  slides.forEach((slide, index) => {
    slide.addEventListener('click', () => {
      if (index !== activeIndex) setSlide(index);
    });
  });

  slider.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') setSlide(activeIndex - 1);
    if (event.key === 'ArrowRight') setSlide(activeIndex + 1);
  });

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(updateSlider, 90);
  });

  requestAnimationFrame(updateSlider);
});

const supportSliders = document.querySelectorAll('[data-support-slider]');

supportSliders.forEach((slider) => {
  const viewport = slider.querySelector('[data-support-viewport]');
  const track = slider.querySelector('[data-support-track]');
  const slides = Array.from(slider.querySelectorAll('[data-support-slide]'));
  const prevButton = slider.querySelector('[data-support-prev]');
  const nextButton = slider.querySelector('[data-support-next]');

  if (!viewport || !track || !slides.length) return;

  let activeIndex = slides.findIndex((slide) => slide.classList.contains('is-active'));
  if (activeIndex < 0) activeIndex = 0;

  const updateSlider = () => {
    const activeSlide = slides[activeIndex];
    const viewportCenter = viewport.clientWidth / 2;
    const slideCenter = activeSlide.offsetLeft + activeSlide.offsetWidth / 2;
    const maxOffset = Math.max(0, track.scrollWidth - viewport.clientWidth);
    const offset = Math.min(Math.max(0, slideCenter - viewportCenter), maxOffset);

    track.style.transform = `translate3d(${-offset}px, 0, 0)`;

    slides.forEach((slide, index) => {
      const isActive = index === activeIndex;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
    });
  };

  const setSlide = (nextIndex) => {
    activeIndex = (nextIndex + slides.length) % slides.length;
    updateSlider();
  };

  prevButton?.addEventListener('click', () => setSlide(activeIndex - 1));
  nextButton?.addEventListener('click', () => setSlide(activeIndex + 1));

  slides.forEach((slide, index) => {
    slide.addEventListener('click', () => {
      if (index !== activeIndex) setSlide(index);
    });
  });

  slider.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') setSlide(activeIndex - 1);
    if (event.key === 'ArrowRight') setSlide(activeIndex + 1);
  });

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(updateSlider, 90);
  });

  requestAnimationFrame(updateSlider);
});

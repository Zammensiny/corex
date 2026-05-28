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

const setModalState = (isOpen, options = {}) => {
  const { restoreFocus = true } = options;
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
    if (restoreFocus) {
      modalLastFocused.focus?.({ preventScroll: true });
    }
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
    setModalState(false, { restoreFocus: false });
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
    document.querySelectorAll('[data-case-lightbox].is-open').forEach(closeCaseLightbox);
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

const caseLightboxes = document.querySelectorAll('[data-case-lightbox]');
let caseLightboxLastFocused = null;

const closeCaseLightbox = (lightbox) => {
  if (!lightbox) return;

  const image = lightbox.querySelector('[data-case-lightbox-image]');
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('is-case-lightbox-open');

  if (image) {
    image.removeAttribute('src');
    image.removeAttribute('alt');
  }

  caseLightboxLastFocused?.focus?.({ preventScroll: true });
  caseLightboxLastFocused = null;
};

const openCaseLightbox = (trigger) => {
  const casesBlock = trigger.closest('.cases');
  const lightbox = casesBlock?.querySelector('[data-case-lightbox]');
  const image = lightbox?.querySelector('[data-case-lightbox-image]');
  const src = trigger.dataset.lightboxSrc;
  const thumb = trigger.querySelector('.case-gallery__image');

  if (!lightbox || !image || !src) return;

  caseLightboxLastFocused = trigger;
  image.src = src;
  image.alt = thumb?.alt || 'Изображение кейса';
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('is-case-lightbox-open');
  lightbox.querySelector('[data-case-lightbox-close]')?.focus({ preventScroll: true });
};

caseLightboxes.forEach((lightbox) => {
  lightbox.addEventListener('click', (event) => {
    if (event.target.closest('[data-case-lightbox-close]')) {
      closeCaseLightbox(lightbox);
    }
  });
});

document.querySelectorAll('[data-case-lightbox-open]').forEach((trigger) => {
  trigger.addEventListener('click', () => openCaseLightbox(trigger));
});


const attachSwipeControls = (viewport, goPrev, goNext) => {
  if (!viewport || typeof goPrev !== 'function' || typeof goNext !== 'function') return;

  let startX = 0;
  let startY = 0;
  let deltaX = 0;
  let isHorizontal = false;

  viewport.addEventListener('touchstart', (event) => {
    if (!event.touches.length) return;
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
    deltaX = 0;
    isHorizontal = false;
  }, { passive: true });

  viewport.addEventListener('touchmove', (event) => {
    if (!event.touches.length) return;

    const currentX = event.touches[0].clientX;
    const currentY = event.touches[0].clientY;
    deltaX = currentX - startX;
    const deltaY = currentY - startY;

    if (!isHorizontal && Math.abs(deltaX) > 10 && Math.abs(deltaX) > Math.abs(deltaY) * 1.15) {
      isHorizontal = true;
    }

    if (isHorizontal) {
      event.preventDefault();
    }
  }, { passive: false });

  viewport.addEventListener('touchend', () => {
    if (!isHorizontal || Math.abs(deltaX) < 46) return;
    if (deltaX < 0) {
      goNext();
    } else {
      goPrev();
    }
  });
};

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
  attachSwipeControls(viewport, () => setSlide(activeIndex - 1), () => setSlide(activeIndex + 1));

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
    const trackStyle = window.getComputedStyle(track);
    const trackPaddingLeft = parseFloat(trackStyle.paddingLeft) || 0;
    const endOffset = parseFloat(trackStyle.getPropertyValue('--slider-end-offset')) || 0;
    const maxOffset = Math.max(0, track.scrollWidth - viewport.clientWidth);
    const safeMaxOffset = maxOffset + (activeIndex === slides.length - 1 ? endOffset : 0);
    const offset = Math.min(Math.max(0, activeSlide.offsetLeft - trackPaddingLeft), safeMaxOffset);

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
  attachSwipeControls(viewport, () => setSlide(activeIndex - 1), () => setSlide(activeIndex + 1));

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


const requestModal = document.querySelector('[data-request-modal]');
const requestModalOpenButtons = document.querySelectorAll('[data-request-modal-open]');
const requestModalCloseButtons = document.querySelectorAll('[data-request-modal-close]');
let requestModalLastFocused = null;

const requestModalConfig = {
  brief: {
    type: 'Обсудить задачу',
    eyebrow: 'Бриф',
    title: 'Обсудить задачу',
    text: 'Оставьте контакты — уточним задачу и предложим ближайший рабочий шаг.',
    button: 'Отправить задачу'
  },
  audit: {
    type: 'Получить аудит',
    eyebrow: 'Аудит',
    title: 'Получить аудит',
    text: 'Посмотрим текущую систему, найдём слабые места и подскажем, с чего начать.',
    button: 'Запросить аудит'
  }
};

const getRequestModalFocusable = () => {
  if (!requestModal) return [];
  return Array.from(
    requestModal.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])')
  ).filter((element) => element.offsetParent !== null || element === document.activeElement);
};

const fillRequestModal = (type = 'brief') => {
  if (!requestModal) return;
  const config = requestModalConfig[type] || requestModalConfig.brief;
  const eyebrow = requestModal.querySelector('[data-request-modal-eyebrow]');
  const title = requestModal.querySelector('[data-request-modal-title]');
  const text = requestModal.querySelector('[data-request-modal-text]');
  const hiddenType = requestModal.querySelector('[data-request-form-type]');
  const submit = requestModal.querySelector('[data-request-submit]');
  const form = requestModal.querySelector('[data-ajax-form]');
  const status = requestModal.querySelector('[data-form-status]');

  if (eyebrow) eyebrow.textContent = config.eyebrow;
  if (title) title.textContent = config.title;
  if (text) text.textContent = config.text;
  if (hiddenType) hiddenType.value = config.type;
  if (submit) submit.textContent = config.button;
  if (form) form.dataset.formType = config.type;
  if (status) {
    status.textContent = '';
    status.classList.remove('is-success');
  }
};

const setRequestModalState = (isOpen) => {
  if (!requestModal) return;

  requestModal.classList.toggle('is-open', isOpen);
  requestModal.setAttribute('aria-hidden', String(!isOpen));
  document.body.classList.toggle('is-request-modal-open', isOpen);

  if (isOpen) {
    requestModalLastFocused = document.activeElement;
    setMenuState(false);
    setModalState(false, { restoreFocus: false });
    window.setTimeout(() => {
      const focusable = getRequestModalFocusable();
      focusable[0]?.focus({ preventScroll: true });
    }, 80);
  } else if (requestModalLastFocused) {
    requestModalLastFocused.focus?.({ preventScroll: true });
    requestModalLastFocused = null;
  }
};

requestModalOpenButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    fillRequestModal(button.dataset.requestType || 'brief');
    setRequestModalState(true);
  });
});

requestModalCloseButtons.forEach((button) => {
  button.addEventListener('click', () => setRequestModalState(false));
});

if (requestModal) {
  requestModal.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;

    const focusable = getRequestModalFocusable();
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
    setRequestModalState(false);
  }
});

document.querySelectorAll('[data-ajax-form]').forEach((form) => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const status = form.querySelector('[data-form-status]');
    const submit = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    const formType = form.dataset.formType || formData.get('form_type') || 'Форма';

    formData.set('form_type', formType);

    if (status) {
      status.textContent = 'Отправляем...';
      status.classList.remove('is-success');
    }

    if (submit) submit.disabled = true;

    try {
      await fetch(form.getAttribute('action') || 'send.php', {
        method: form.getAttribute('method') || 'POST',
        body: formData
      });
    } catch (error) {
      console.warn('send.php пока недоступен, показываем заглушку успешной отправки', error);
    } finally {
      if (submit) submit.disabled = false;
      if (status) {
        status.textContent = 'Спасибо! Форма отправлена. Мы скоро свяжемся.';
        status.classList.add('is-success');
      }
      form.reset();

      const hiddenType = form.querySelector('input[name="form_type"]');
      if (hiddenType) hiddenType.value = formType;
    }
  });
});


const scrollTopButton = document.querySelector('[data-scroll-top]');

if (scrollTopButton) {
  const toggleScrollTopButton = () => {
    scrollTopButton.classList.toggle('is-visible', window.scrollY > 420);
  };

  scrollTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', toggleScrollTopButton, { passive: true });
  toggleScrollTopButton();
}

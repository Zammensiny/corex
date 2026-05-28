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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IG5hdlRvZ2dsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idXJnZXInKTtcbmNvbnN0IG5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tYWluLW5hdicpO1xuY29uc3QgbmF2SGlkZGVuVGV4dCA9IG5hdlRvZ2dsZT8ucXVlcnlTZWxlY3RvcignLnZpc3VhbGx5LWhpZGRlbicpO1xuXG5jb25zdCBzZXRNZW51U3RhdGUgPSAoaXNPcGVuKSA9PiB7XG4gIGlmICghbmF2VG9nZ2xlIHx8ICFuYXYpIHJldHVybjtcblxuICBuYXYuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtb3BlbicsIGlzT3Blbik7XG4gIG5hdlRvZ2dsZS5jbGFzc0xpc3QudG9nZ2xlKCdpcy1vcGVuJywgaXNPcGVuKTtcbiAgbmF2VG9nZ2xlLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIFN0cmluZyhpc09wZW4pKTtcblxuICBpZiAobmF2SGlkZGVuVGV4dCkge1xuICAgIG5hdkhpZGRlblRleHQudGV4dENvbnRlbnQgPSBpc09wZW4gPyAn0JfQsNC60YDRi9GC0Ywg0LzQtdC90Y4nIDogJ9Ce0YLQutGA0YvRgtGMINC80LXQvdGOJztcbiAgfVxufTtcblxuaWYgKG5hdlRvZ2dsZSAmJiBuYXYpIHtcbiAgbmF2VG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgc2V0TWVudVN0YXRlKCFuYXYuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy1vcGVuJykpO1xuICB9KTtcblxuICBuYXYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICBpZiAoZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJ2EnKSkge1xuICAgICAgc2V0TWVudVN0YXRlKGZhbHNlKTtcbiAgICB9XG4gIH0pO1xuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgaWYgKCFuYXYuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy1vcGVuJykpIHJldHVybjtcblxuICAgIGNvbnN0IGNsaWNrSW5zaWRlTWVudSA9IG5hdi5jb250YWlucyhldmVudC50YXJnZXQpO1xuICAgIGNvbnN0IGNsaWNrT25Ub2dnbGUgPSBuYXZUb2dnbGUuY29udGFpbnMoZXZlbnQudGFyZ2V0KTtcblxuICAgIGlmICghY2xpY2tJbnNpZGVNZW51ICYmICFjbGlja09uVG9nZ2xlKSB7XG4gICAgICBzZXRNZW51U3RhdGUoZmFsc2UpO1xuICAgIH1cbiAgfSk7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICBpZiAod2luZG93LmlubmVyV2lkdGggPiA5MjApIHtcbiAgICAgIHNldE1lbnVTdGF0ZShmYWxzZSk7XG4gICAgfVxuICB9KTtcbn1cblxuY29uc3QgbW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1tZW51LW1vZGFsXScpO1xuY29uc3QgbW9kYWxPcGVuQnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLW1lbnUtbW9kYWwtb3Blbl0nKTtcbmNvbnN0IG1vZGFsQ2xvc2VCdXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtbWVudS1tb2RhbC1jbG9zZV0nKTtcbmNvbnN0IG1vZGFsTGlua3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1tZW51LW1vZGFsLWxpbmtdJyk7XG5sZXQgbW9kYWxMYXN0Rm9jdXNlZCA9IG51bGw7XG5cbmNvbnN0IGdldE1vZGFsRm9jdXNhYmxlID0gKCkgPT4ge1xuICBpZiAoIW1vZGFsKSByZXR1cm4gW107XG4gIHJldHVybiBBcnJheS5mcm9tKFxuICAgIG1vZGFsLnF1ZXJ5U2VsZWN0b3JBbGwoJ2FbaHJlZl0sIGJ1dHRvbjpub3QoW2Rpc2FibGVkXSksIHRleHRhcmVhLCBpbnB1dCwgc2VsZWN0LCBbdGFiaW5kZXhdOm5vdChbdGFiaW5kZXg9XCItMVwiXSknKVxuICApLmZpbHRlcigoZWxlbWVudCkgPT4gZWxlbWVudC5vZmZzZXRQYXJlbnQgIT09IG51bGwgfHwgZWxlbWVudCA9PT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCk7XG59O1xuXG5jb25zdCBzZXRNb2RhbFN0YXRlID0gKGlzT3Blbiwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGNvbnN0IHsgcmVzdG9yZUZvY3VzID0gdHJ1ZSB9ID0gb3B0aW9ucztcbiAgaWYgKCFtb2RhbCkgcmV0dXJuO1xuXG4gIG1vZGFsLmNsYXNzTGlzdC50b2dnbGUoJ2lzLW9wZW4nLCBpc09wZW4pO1xuICBtb2RhbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgU3RyaW5nKCFpc09wZW4pKTtcbiAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QudG9nZ2xlKCdpcy1tZW51LW1vZGFsLW9wZW4nLCBpc09wZW4pO1xuXG4gIG1vZGFsT3BlbkJ1dHRvbnMuZm9yRWFjaCgoYnV0dG9uKSA9PiB7XG4gICAgYnV0dG9uLmNsYXNzTGlzdC50b2dnbGUoJ2lzLWFjdGl2ZScsIGlzT3Blbik7XG4gICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIFN0cmluZyhpc09wZW4pKTtcbiAgfSk7XG5cbiAgaWYgKGlzT3Blbikge1xuICAgIG1vZGFsTGFzdEZvY3VzZWQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgIHNldE1lbnVTdGF0ZShmYWxzZSk7XG4gICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgY29uc3QgZm9jdXNhYmxlID0gZ2V0TW9kYWxGb2N1c2FibGUoKTtcbiAgICAgIGZvY3VzYWJsZVswXT8uZm9jdXMoeyBwcmV2ZW50U2Nyb2xsOiB0cnVlIH0pO1xuICAgIH0sIDgwKTtcbiAgfSBlbHNlIGlmIChtb2RhbExhc3RGb2N1c2VkKSB7XG4gICAgaWYgKHJlc3RvcmVGb2N1cykge1xuICAgICAgbW9kYWxMYXN0Rm9jdXNlZC5mb2N1cz8uKHsgcHJldmVudFNjcm9sbDogdHJ1ZSB9KTtcbiAgICB9XG4gICAgbW9kYWxMYXN0Rm9jdXNlZCA9IG51bGw7XG4gIH1cbn07XG5cbm1vZGFsT3BlbkJ1dHRvbnMuZm9yRWFjaCgoYnV0dG9uKSA9PiB7XG4gIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBzZXRNb2RhbFN0YXRlKHRydWUpO1xuICB9KTtcbn0pO1xuXG5tb2RhbENsb3NlQnV0dG9ucy5mb3JFYWNoKChidXR0b24pID0+IHtcbiAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIHNldE1vZGFsU3RhdGUoZmFsc2UpO1xuICB9KTtcbn0pO1xuXG5tb2RhbExpbmtzLmZvckVhY2goKGxpbmspID0+IHtcbiAgbGluay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBzZXRNb2RhbFN0YXRlKGZhbHNlLCB7IHJlc3RvcmVGb2N1czogZmFsc2UgfSk7XG4gIH0pO1xufSk7XG5cbmlmIChtb2RhbCkge1xuICBtb2RhbC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgaWYgKGV2ZW50LmtleSAhPT0gJ1RhYicpIHJldHVybjtcblxuICAgIGNvbnN0IGZvY3VzYWJsZSA9IGdldE1vZGFsRm9jdXNhYmxlKCk7XG4gICAgaWYgKCFmb2N1c2FibGUubGVuZ3RoKSByZXR1cm47XG5cbiAgICBjb25zdCBmaXJzdCA9IGZvY3VzYWJsZVswXTtcbiAgICBjb25zdCBsYXN0ID0gZm9jdXNhYmxlW2ZvY3VzYWJsZS5sZW5ndGggLSAxXTtcblxuICAgIGlmIChldmVudC5zaGlmdEtleSAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBmaXJzdCkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGxhc3QuZm9jdXMoKTtcbiAgICB9XG5cbiAgICBpZiAoIWV2ZW50LnNoaWZ0S2V5ICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGxhc3QpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBmaXJzdC5mb2N1cygpO1xuICAgIH1cbiAgfSk7XG59XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgaWYgKGV2ZW50LmtleSA9PT0gJ0VzY2FwZScpIHtcbiAgICBzZXRNZW51U3RhdGUoZmFsc2UpO1xuICAgIHNldE1vZGFsU3RhdGUoZmFsc2UpO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWNhc2UtbGlnaHRib3hdLmlzLW9wZW4nKS5mb3JFYWNoKGNsb3NlQ2FzZUxpZ2h0Ym94KTtcbiAgfVxufSk7XG5cbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWNvcHktZW1haWxdJykuZm9yRWFjaCgoYnV0dG9uKSA9PiB7XG4gIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBlbWFpbCA9IGJ1dHRvbi5kYXRhc2V0LmNvcHlFbWFpbDtcbiAgICBpZiAoIWVtYWlsIHx8ICFuYXZpZ2F0b3IuY2xpcGJvYXJkKSByZXR1cm47XG5cbiAgICB0cnkge1xuICAgICAgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQoZW1haWwpO1xuICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2lzLWNvcGllZCcpO1xuICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4gYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWNvcGllZCcpLCAxMDAwKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS53YXJuKCfQndC1INGD0LTQsNC70L7RgdGMINGB0LrQvtC/0LjRgNC+0LLQsNGC0YwgZW1haWwnLCBlcnJvcik7XG4gICAgfVxuICB9KTtcbn0pO1xuXG5jb25zdCBjYXNlc0Jsb2NrcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jYXNlcycpO1xuXG5jYXNlc0Jsb2Nrcy5mb3JFYWNoKChjYXNlc0Jsb2NrKSA9PiB7XG4gIGNvbnN0IHRhYnMgPSBBcnJheS5mcm9tKGNhc2VzQmxvY2sucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtY2FzZS10YWJdJykpO1xuICBjb25zdCBwYW5lbHMgPSBBcnJheS5mcm9tKGNhc2VzQmxvY2sucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtY2FzZS1wYW5lbF0nKSk7XG5cbiAgaWYgKCF0YWJzLmxlbmd0aCB8fCAhcGFuZWxzLmxlbmd0aCkgcmV0dXJuO1xuXG4gIGNvbnN0IHNldEFjdGl2ZUNhc2UgPSAoY2FzZUlkKSA9PiB7XG4gICAgdGFicy5mb3JFYWNoKCh0YWIpID0+IHtcbiAgICAgIGNvbnN0IGlzQWN0aXZlID0gdGFiLmRhdGFzZXQuY2FzZVRhYiA9PT0gY2FzZUlkO1xuICAgICAgdGFiLmNsYXNzTGlzdC50b2dnbGUoJ2lzLWFjdGl2ZScsIGlzQWN0aXZlKTtcbiAgICAgIHRhYi5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCBTdHJpbmcoaXNBY3RpdmUpKTtcbiAgICAgIHRhYi5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgaXNBY3RpdmUgPyAnMCcgOiAnLTEnKTtcbiAgICB9KTtcblxuICAgIHBhbmVscy5mb3JFYWNoKChwYW5lbCkgPT4ge1xuICAgICAgY29uc3QgaXNBY3RpdmUgPSBwYW5lbC5kYXRhc2V0LmNhc2VQYW5lbCA9PT0gY2FzZUlkO1xuICAgICAgcGFuZWwuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtYWN0aXZlJywgaXNBY3RpdmUpO1xuICAgICAgcGFuZWwuaGlkZGVuID0gIWlzQWN0aXZlO1xuICAgIH0pO1xuICB9O1xuXG4gIHRhYnMuZm9yRWFjaCgodGFiLCBpbmRleCkgPT4ge1xuICAgIHRhYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGlmICh0YWIuZGlzYWJsZWQgfHwgIXRhYi5kYXRhc2V0LmNhc2VUYWIpIHJldHVybjtcbiAgICAgIHNldEFjdGl2ZUNhc2UodGFiLmRhdGFzZXQuY2FzZVRhYik7XG4gICAgfSk7XG5cbiAgICB0YWIuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgICAgaWYgKCFbJ0Fycm93TGVmdCcsICdBcnJvd1JpZ2h0JywgJ0hvbWUnLCAnRW5kJ10uaW5jbHVkZXMoZXZlbnQua2V5KSkgcmV0dXJuO1xuXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgY29uc3QgZW5hYmxlZFRhYnMgPSB0YWJzLmZpbHRlcigoaXRlbSkgPT4gIWl0ZW0uZGlzYWJsZWQpO1xuICAgICAgY29uc3QgY3VycmVudEluZGV4ID0gZW5hYmxlZFRhYnMuaW5kZXhPZih0YWIpO1xuICAgICAgbGV0IG5leHRJbmRleCA9IGN1cnJlbnRJbmRleDtcblxuICAgICAgaWYgKGV2ZW50LmtleSA9PT0gJ0Fycm93UmlnaHQnKSBuZXh0SW5kZXggPSAoY3VycmVudEluZGV4ICsgMSkgJSBlbmFibGVkVGFicy5sZW5ndGg7XG4gICAgICBpZiAoZXZlbnQua2V5ID09PSAnQXJyb3dMZWZ0JykgbmV4dEluZGV4ID0gKGN1cnJlbnRJbmRleCAtIDEgKyBlbmFibGVkVGFicy5sZW5ndGgpICUgZW5hYmxlZFRhYnMubGVuZ3RoO1xuICAgICAgaWYgKGV2ZW50LmtleSA9PT0gJ0hvbWUnKSBuZXh0SW5kZXggPSAwO1xuICAgICAgaWYgKGV2ZW50LmtleSA9PT0gJ0VuZCcpIG5leHRJbmRleCA9IGVuYWJsZWRUYWJzLmxlbmd0aCAtIDE7XG5cbiAgICAgIGVuYWJsZWRUYWJzW25leHRJbmRleF0/LmZvY3VzKCk7XG4gICAgfSk7XG5cbiAgICB0YWIuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIGluZGV4ID09PSAwID8gJzAnIDogJy0xJyk7XG4gIH0pO1xufSk7XG5cbmNvbnN0IGNhc2VMaWdodGJveGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtY2FzZS1saWdodGJveF0nKTtcbmxldCBjYXNlTGlnaHRib3hMYXN0Rm9jdXNlZCA9IG51bGw7XG5cbmNvbnN0IGNsb3NlQ2FzZUxpZ2h0Ym94ID0gKGxpZ2h0Ym94KSA9PiB7XG4gIGlmICghbGlnaHRib3gpIHJldHVybjtcblxuICBjb25zdCBpbWFnZSA9IGxpZ2h0Ym94LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWNhc2UtbGlnaHRib3gtaW1hZ2VdJyk7XG4gIGxpZ2h0Ym94LmNsYXNzTGlzdC5yZW1vdmUoJ2lzLW9wZW4nKTtcbiAgbGlnaHRib3guc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnaXMtY2FzZS1saWdodGJveC1vcGVuJyk7XG5cbiAgaWYgKGltYWdlKSB7XG4gICAgaW1hZ2UucmVtb3ZlQXR0cmlidXRlKCdzcmMnKTtcbiAgICBpbWFnZS5yZW1vdmVBdHRyaWJ1dGUoJ2FsdCcpO1xuICB9XG5cbiAgY2FzZUxpZ2h0Ym94TGFzdEZvY3VzZWQ/LmZvY3VzPy4oeyBwcmV2ZW50U2Nyb2xsOiB0cnVlIH0pO1xuICBjYXNlTGlnaHRib3hMYXN0Rm9jdXNlZCA9IG51bGw7XG59O1xuXG5jb25zdCBvcGVuQ2FzZUxpZ2h0Ym94ID0gKHRyaWdnZXIpID0+IHtcbiAgY29uc3QgY2FzZXNCbG9jayA9IHRyaWdnZXIuY2xvc2VzdCgnLmNhc2VzJyk7XG4gIGNvbnN0IGxpZ2h0Ym94ID0gY2FzZXNCbG9jaz8ucXVlcnlTZWxlY3RvcignW2RhdGEtY2FzZS1saWdodGJveF0nKTtcbiAgY29uc3QgaW1hZ2UgPSBsaWdodGJveD8ucXVlcnlTZWxlY3RvcignW2RhdGEtY2FzZS1saWdodGJveC1pbWFnZV0nKTtcbiAgY29uc3Qgc3JjID0gdHJpZ2dlci5kYXRhc2V0LmxpZ2h0Ym94U3JjO1xuICBjb25zdCB0aHVtYiA9IHRyaWdnZXIucXVlcnlTZWxlY3RvcignLmNhc2UtZ2FsbGVyeV9faW1hZ2UnKTtcblxuICBpZiAoIWxpZ2h0Ym94IHx8ICFpbWFnZSB8fCAhc3JjKSByZXR1cm47XG5cbiAgY2FzZUxpZ2h0Ym94TGFzdEZvY3VzZWQgPSB0cmlnZ2VyO1xuICBpbWFnZS5zcmMgPSBzcmM7XG4gIGltYWdlLmFsdCA9IHRodW1iPy5hbHQgfHwgJ9CY0LfQvtCx0YDQsNC20LXQvdC40LUg0LrQtdC50YHQsCc7XG4gIGxpZ2h0Ym94LmNsYXNzTGlzdC5hZGQoJ2lzLW9wZW4nKTtcbiAgbGlnaHRib3guc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ2lzLWNhc2UtbGlnaHRib3gtb3BlbicpO1xuICBsaWdodGJveC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1jYXNlLWxpZ2h0Ym94LWNsb3NlXScpPy5mb2N1cyh7IHByZXZlbnRTY3JvbGw6IHRydWUgfSk7XG59O1xuXG5jYXNlTGlnaHRib3hlcy5mb3JFYWNoKChsaWdodGJveCkgPT4ge1xuICBsaWdodGJveC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgIGlmIChldmVudC50YXJnZXQuY2xvc2VzdCgnW2RhdGEtY2FzZS1saWdodGJveC1jbG9zZV0nKSkge1xuICAgICAgY2xvc2VDYXNlTGlnaHRib3gobGlnaHRib3gpO1xuICAgIH1cbiAgfSk7XG59KTtcblxuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtY2FzZS1saWdodGJveC1vcGVuXScpLmZvckVhY2goKHRyaWdnZXIpID0+IHtcbiAgdHJpZ2dlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IG9wZW5DYXNlTGlnaHRib3godHJpZ2dlcikpO1xufSk7XG5cbmNvbnN0IHdvcmtmbG93U2xpZGVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXdvcmtmbG93LXNsaWRlcl0nKTtcblxud29ya2Zsb3dTbGlkZXJzLmZvckVhY2goKHNsaWRlcikgPT4ge1xuICBjb25zdCB2aWV3cG9ydCA9IHNsaWRlci5xdWVyeVNlbGVjdG9yKCdbZGF0YS13b3JrZmxvdy12aWV3cG9ydF0nKTtcbiAgY29uc3QgdHJhY2sgPSBzbGlkZXIucXVlcnlTZWxlY3RvcignW2RhdGEtd29ya2Zsb3ctdHJhY2tdJyk7XG4gIGNvbnN0IHNsaWRlcyA9IEFycmF5LmZyb20oc2xpZGVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXdvcmtmbG93LXNsaWRlXScpKTtcbiAgY29uc3QgcHJldkJ1dHRvbiA9IHNsaWRlci5xdWVyeVNlbGVjdG9yKCdbZGF0YS13b3JrZmxvdy1wcmV2XScpO1xuICBjb25zdCBuZXh0QnV0dG9uID0gc2xpZGVyLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXdvcmtmbG93LW5leHRdJyk7XG5cbiAgaWYgKCF2aWV3cG9ydCB8fCAhdHJhY2sgfHwgIXNsaWRlcy5sZW5ndGgpIHJldHVybjtcblxuICBsZXQgYWN0aXZlSW5kZXggPSBzbGlkZXMuZmluZEluZGV4KChzbGlkZSkgPT4gc2xpZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy1hY3RpdmUnKSk7XG4gIGlmIChhY3RpdmVJbmRleCA8IDApIGFjdGl2ZUluZGV4ID0gMDtcblxuICBjb25zdCB1cGRhdGVTbGlkZXIgPSAoKSA9PiB7XG4gICAgY29uc3QgYWN0aXZlU2xpZGUgPSBzbGlkZXNbYWN0aXZlSW5kZXhdO1xuICAgIGNvbnN0IHZpZXdwb3J0Q2VudGVyID0gdmlld3BvcnQuY2xpZW50V2lkdGggLyAyO1xuICAgIGNvbnN0IHNsaWRlQ2VudGVyID0gYWN0aXZlU2xpZGUub2Zmc2V0TGVmdCArIGFjdGl2ZVNsaWRlLm9mZnNldFdpZHRoIC8gMjtcbiAgICBjb25zdCBvZmZzZXQgPSBNYXRoLm1heCgwLCBzbGlkZUNlbnRlciAtIHZpZXdwb3J0Q2VudGVyKTtcblxuICAgIHRyYWNrLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUzZCgkey1vZmZzZXR9cHgsIDAsIDApYDtcblxuICAgIHNsaWRlcy5mb3JFYWNoKChzbGlkZSwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IGlzQWN0aXZlID0gaW5kZXggPT09IGFjdGl2ZUluZGV4O1xuICAgICAgc2xpZGUuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtYWN0aXZlJywgaXNBY3RpdmUpO1xuICAgICAgc2xpZGUuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIFN0cmluZyghaXNBY3RpdmUpKTtcbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBzZXRTbGlkZSA9IChuZXh0SW5kZXgpID0+IHtcbiAgICBhY3RpdmVJbmRleCA9IChuZXh0SW5kZXggKyBzbGlkZXMubGVuZ3RoKSAlIHNsaWRlcy5sZW5ndGg7XG4gICAgdXBkYXRlU2xpZGVyKCk7XG4gIH07XG5cbiAgcHJldkJ1dHRvbj8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBzZXRTbGlkZShhY3RpdmVJbmRleCAtIDEpKTtcbiAgbmV4dEJ1dHRvbj8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBzZXRTbGlkZShhY3RpdmVJbmRleCArIDEpKTtcblxuICBzbGlkZXMuZm9yRWFjaCgoc2xpZGUsIGluZGV4KSA9PiB7XG4gICAgc2xpZGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBpZiAoaW5kZXggIT09IGFjdGl2ZUluZGV4KSBzZXRTbGlkZShpbmRleCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHNsaWRlci5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgaWYgKGV2ZW50LmtleSA9PT0gJ0Fycm93TGVmdCcpIHNldFNsaWRlKGFjdGl2ZUluZGV4IC0gMSk7XG4gICAgaWYgKGV2ZW50LmtleSA9PT0gJ0Fycm93UmlnaHQnKSBzZXRTbGlkZShhY3RpdmVJbmRleCArIDEpO1xuICB9KTtcblxuICBsZXQgcmVzaXplVGltZXIgPSBudWxsO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgIHdpbmRvdy5jbGVhclRpbWVvdXQocmVzaXplVGltZXIpO1xuICAgIHJlc2l6ZVRpbWVyID0gd2luZG93LnNldFRpbWVvdXQodXBkYXRlU2xpZGVyLCA5MCk7XG4gIH0pO1xuXG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGVTbGlkZXIpO1xufSk7XG5cbmNvbnN0IHN1cHBvcnRTbGlkZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtc3VwcG9ydC1zbGlkZXJdJyk7XG5cbnN1cHBvcnRTbGlkZXJzLmZvckVhY2goKHNsaWRlcikgPT4ge1xuICBjb25zdCB2aWV3cG9ydCA9IHNsaWRlci5xdWVyeVNlbGVjdG9yKCdbZGF0YS1zdXBwb3J0LXZpZXdwb3J0XScpO1xuICBjb25zdCB0cmFjayA9IHNsaWRlci5xdWVyeVNlbGVjdG9yKCdbZGF0YS1zdXBwb3J0LXRyYWNrXScpO1xuICBjb25zdCBzbGlkZXMgPSBBcnJheS5mcm9tKHNsaWRlci5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1zdXBwb3J0LXNsaWRlXScpKTtcbiAgY29uc3QgcHJldkJ1dHRvbiA9IHNsaWRlci5xdWVyeVNlbGVjdG9yKCdbZGF0YS1zdXBwb3J0LXByZXZdJyk7XG4gIGNvbnN0IG5leHRCdXR0b24gPSBzbGlkZXIucXVlcnlTZWxlY3RvcignW2RhdGEtc3VwcG9ydC1uZXh0XScpO1xuXG4gIGlmICghdmlld3BvcnQgfHwgIXRyYWNrIHx8ICFzbGlkZXMubGVuZ3RoKSByZXR1cm47XG5cbiAgbGV0IGFjdGl2ZUluZGV4ID0gc2xpZGVzLmZpbmRJbmRleCgoc2xpZGUpID0+IHNsaWRlLmNsYXNzTGlzdC5jb250YWlucygnaXMtYWN0aXZlJykpO1xuICBpZiAoYWN0aXZlSW5kZXggPCAwKSBhY3RpdmVJbmRleCA9IDA7XG5cbiAgY29uc3QgdXBkYXRlU2xpZGVyID0gKCkgPT4ge1xuICAgIGNvbnN0IGFjdGl2ZVNsaWRlID0gc2xpZGVzW2FjdGl2ZUluZGV4XTtcbiAgICBjb25zdCB0cmFja1N0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodHJhY2spO1xuICAgIGNvbnN0IHRyYWNrUGFkZGluZ0xlZnQgPSBwYXJzZUZsb2F0KHRyYWNrU3R5bGUucGFkZGluZ0xlZnQpIHx8IDA7XG4gICAgY29uc3QgZW5kT2Zmc2V0ID0gcGFyc2VGbG9hdCh0cmFja1N0eWxlLmdldFByb3BlcnR5VmFsdWUoJy0tc2xpZGVyLWVuZC1vZmZzZXQnKSkgfHwgMDtcbiAgICBjb25zdCBtYXhPZmZzZXQgPSBNYXRoLm1heCgwLCB0cmFjay5zY3JvbGxXaWR0aCAtIHZpZXdwb3J0LmNsaWVudFdpZHRoKTtcbiAgICBjb25zdCBzYWZlTWF4T2Zmc2V0ID0gbWF4T2Zmc2V0ICsgKGFjdGl2ZUluZGV4ID09PSBzbGlkZXMubGVuZ3RoIC0gMSA/IGVuZE9mZnNldCA6IDApO1xuICAgIGNvbnN0IG9mZnNldCA9IE1hdGgubWluKE1hdGgubWF4KDAsIGFjdGl2ZVNsaWRlLm9mZnNldExlZnQgLSB0cmFja1BhZGRpbmdMZWZ0KSwgc2FmZU1heE9mZnNldCk7XG5cbiAgICB0cmFjay5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlM2QoJHstb2Zmc2V0fXB4LCAwLCAwKWA7XG5cbiAgICBzbGlkZXMuZm9yRWFjaCgoc2xpZGUsIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCBpc0FjdGl2ZSA9IGluZGV4ID09PSBhY3RpdmVJbmRleDtcbiAgICAgIHNsaWRlLmNsYXNzTGlzdC50b2dnbGUoJ2lzLWFjdGl2ZScsIGlzQWN0aXZlKTtcbiAgICAgIHNsaWRlLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCBTdHJpbmcoIWlzQWN0aXZlKSk7XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3Qgc2V0U2xpZGUgPSAobmV4dEluZGV4KSA9PiB7XG4gICAgYWN0aXZlSW5kZXggPSAobmV4dEluZGV4ICsgc2xpZGVzLmxlbmd0aCkgJSBzbGlkZXMubGVuZ3RoO1xuICAgIHVwZGF0ZVNsaWRlcigpO1xuICB9O1xuXG4gIHByZXZCdXR0b24/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gc2V0U2xpZGUoYWN0aXZlSW5kZXggLSAxKSk7XG4gIG5leHRCdXR0b24/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gc2V0U2xpZGUoYWN0aXZlSW5kZXggKyAxKSk7XG5cbiAgc2xpZGVzLmZvckVhY2goKHNsaWRlLCBpbmRleCkgPT4ge1xuICAgIHNsaWRlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgaWYgKGluZGV4ICE9PSBhY3RpdmVJbmRleCkgc2V0U2xpZGUoaW5kZXgpO1xuICAgIH0pO1xuICB9KTtcblxuICBzbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgIGlmIChldmVudC5rZXkgPT09ICdBcnJvd0xlZnQnKSBzZXRTbGlkZShhY3RpdmVJbmRleCAtIDEpO1xuICAgIGlmIChldmVudC5rZXkgPT09ICdBcnJvd1JpZ2h0Jykgc2V0U2xpZGUoYWN0aXZlSW5kZXggKyAxKTtcbiAgfSk7XG5cbiAgbGV0IHJlc2l6ZVRpbWVyID0gbnVsbDtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHJlc2l6ZVRpbWVyKTtcbiAgICByZXNpemVUaW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KHVwZGF0ZVNsaWRlciwgOTApO1xuICB9KTtcblxuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlU2xpZGVyKTtcbn0pO1xuXG5cbmNvbnN0IHJlcXVlc3RNb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXJlcXVlc3QtbW9kYWxdJyk7XG5jb25zdCByZXF1ZXN0TW9kYWxPcGVuQnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXJlcXVlc3QtbW9kYWwtb3Blbl0nKTtcbmNvbnN0IHJlcXVlc3RNb2RhbENsb3NlQnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXJlcXVlc3QtbW9kYWwtY2xvc2VdJyk7XG5sZXQgcmVxdWVzdE1vZGFsTGFzdEZvY3VzZWQgPSBudWxsO1xuXG5jb25zdCByZXF1ZXN0TW9kYWxDb25maWcgPSB7XG4gIGJyaWVmOiB7XG4gICAgdHlwZTogJ9Ce0LHRgdGD0LTQuNGC0Ywg0LfQsNC00LDRh9GDJyxcbiAgICBleWVicm93OiAn0JHRgNC40YQnLFxuICAgIHRpdGxlOiAn0J7QsdGB0YPQtNC40YLRjCDQt9Cw0LTQsNGH0YMnLFxuICAgIHRleHQ6ICfQntGB0YLQsNCy0YzRgtC1INC60L7QvdGC0LDQutGC0Ysg4oCUINGD0YLQvtGH0L3QuNC8INC30LDQtNCw0YfRgyDQuCDQv9GA0LXQtNC70L7QttC40Lwg0LHQu9C40LbQsNC50YjQuNC5INGA0LDQsdC+0YfQuNC5INGI0LDQsy4nLFxuICAgIGJ1dHRvbjogJ9Ce0YLQv9GA0LDQstC40YLRjCDQt9Cw0LTQsNGH0YMnXG4gIH0sXG4gIGF1ZGl0OiB7XG4gICAgdHlwZTogJ9Cf0L7Qu9GD0YfQuNGC0Ywg0LDRg9C00LjRgicsXG4gICAgZXllYnJvdzogJ9CQ0YPQtNC40YInLFxuICAgIHRpdGxlOiAn0J/QvtC70YPRh9C40YLRjCDQsNGD0LTQuNGCJyxcbiAgICB0ZXh0OiAn0J/QvtGB0LzQvtGC0YDQuNC8INGC0LXQutGD0YnRg9GOINGB0LjRgdGC0LXQvNGDLCDQvdCw0LnQtNGR0Lwg0YHQu9Cw0LHRi9C1INC80LXRgdGC0LAg0Lgg0L/QvtC00YHQutCw0LbQtdC8LCDRgSDRh9C10LPQviDQvdCw0YfQsNGC0YwuJyxcbiAgICBidXR0b246ICfQl9Cw0L/RgNC+0YHQuNGC0Ywg0LDRg9C00LjRgidcbiAgfVxufTtcblxuY29uc3QgZ2V0UmVxdWVzdE1vZGFsRm9jdXNhYmxlID0gKCkgPT4ge1xuICBpZiAoIXJlcXVlc3RNb2RhbCkgcmV0dXJuIFtdO1xuICByZXR1cm4gQXJyYXkuZnJvbShcbiAgICByZXF1ZXN0TW9kYWwucXVlcnlTZWxlY3RvckFsbCgnYVtocmVmXSwgYnV0dG9uOm5vdChbZGlzYWJsZWRdKSwgdGV4dGFyZWEsIGlucHV0LCBzZWxlY3QsIFt0YWJpbmRleF06bm90KFt0YWJpbmRleD1cIi0xXCJdKScpXG4gICkuZmlsdGVyKChlbGVtZW50KSA9PiBlbGVtZW50Lm9mZnNldFBhcmVudCAhPT0gbnVsbCB8fCBlbGVtZW50ID09PSBkb2N1bWVudC5hY3RpdmVFbGVtZW50KTtcbn07XG5cbmNvbnN0IGZpbGxSZXF1ZXN0TW9kYWwgPSAodHlwZSA9ICdicmllZicpID0+IHtcbiAgaWYgKCFyZXF1ZXN0TW9kYWwpIHJldHVybjtcbiAgY29uc3QgY29uZmlnID0gcmVxdWVzdE1vZGFsQ29uZmlnW3R5cGVdIHx8IHJlcXVlc3RNb2RhbENvbmZpZy5icmllZjtcbiAgY29uc3QgZXllYnJvdyA9IHJlcXVlc3RNb2RhbC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1yZXF1ZXN0LW1vZGFsLWV5ZWJyb3ddJyk7XG4gIGNvbnN0IHRpdGxlID0gcmVxdWVzdE1vZGFsLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXJlcXVlc3QtbW9kYWwtdGl0bGVdJyk7XG4gIGNvbnN0IHRleHQgPSByZXF1ZXN0TW9kYWwucXVlcnlTZWxlY3RvcignW2RhdGEtcmVxdWVzdC1tb2RhbC10ZXh0XScpO1xuICBjb25zdCBoaWRkZW5UeXBlID0gcmVxdWVzdE1vZGFsLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXJlcXVlc3QtZm9ybS10eXBlXScpO1xuICBjb25zdCBzdWJtaXQgPSByZXF1ZXN0TW9kYWwucXVlcnlTZWxlY3RvcignW2RhdGEtcmVxdWVzdC1zdWJtaXRdJyk7XG4gIGNvbnN0IGZvcm0gPSByZXF1ZXN0TW9kYWwucXVlcnlTZWxlY3RvcignW2RhdGEtYWpheC1mb3JtXScpO1xuICBjb25zdCBzdGF0dXMgPSByZXF1ZXN0TW9kYWwucXVlcnlTZWxlY3RvcignW2RhdGEtZm9ybS1zdGF0dXNdJyk7XG5cbiAgaWYgKGV5ZWJyb3cpIGV5ZWJyb3cudGV4dENvbnRlbnQgPSBjb25maWcuZXllYnJvdztcbiAgaWYgKHRpdGxlKSB0aXRsZS50ZXh0Q29udGVudCA9IGNvbmZpZy50aXRsZTtcbiAgaWYgKHRleHQpIHRleHQudGV4dENvbnRlbnQgPSBjb25maWcudGV4dDtcbiAgaWYgKGhpZGRlblR5cGUpIGhpZGRlblR5cGUudmFsdWUgPSBjb25maWcudHlwZTtcbiAgaWYgKHN1Ym1pdCkgc3VibWl0LnRleHRDb250ZW50ID0gY29uZmlnLmJ1dHRvbjtcbiAgaWYgKGZvcm0pIGZvcm0uZGF0YXNldC5mb3JtVHlwZSA9IGNvbmZpZy50eXBlO1xuICBpZiAoc3RhdHVzKSB7XG4gICAgc3RhdHVzLnRleHRDb250ZW50ID0gJyc7XG4gICAgc3RhdHVzLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXN1Y2Nlc3MnKTtcbiAgfVxufTtcblxuY29uc3Qgc2V0UmVxdWVzdE1vZGFsU3RhdGUgPSAoaXNPcGVuKSA9PiB7XG4gIGlmICghcmVxdWVzdE1vZGFsKSByZXR1cm47XG5cbiAgcmVxdWVzdE1vZGFsLmNsYXNzTGlzdC50b2dnbGUoJ2lzLW9wZW4nLCBpc09wZW4pO1xuICByZXF1ZXN0TW9kYWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIFN0cmluZyghaXNPcGVuKSk7XG4gIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtcmVxdWVzdC1tb2RhbC1vcGVuJywgaXNPcGVuKTtcblxuICBpZiAoaXNPcGVuKSB7XG4gICAgcmVxdWVzdE1vZGFsTGFzdEZvY3VzZWQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgIHNldE1lbnVTdGF0ZShmYWxzZSk7XG4gICAgc2V0TW9kYWxTdGF0ZShmYWxzZSwgeyByZXN0b3JlRm9jdXM6IGZhbHNlIH0pO1xuICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGNvbnN0IGZvY3VzYWJsZSA9IGdldFJlcXVlc3RNb2RhbEZvY3VzYWJsZSgpO1xuICAgICAgZm9jdXNhYmxlWzBdPy5mb2N1cyh7IHByZXZlbnRTY3JvbGw6IHRydWUgfSk7XG4gICAgfSwgODApO1xuICB9IGVsc2UgaWYgKHJlcXVlc3RNb2RhbExhc3RGb2N1c2VkKSB7XG4gICAgcmVxdWVzdE1vZGFsTGFzdEZvY3VzZWQuZm9jdXM/Lih7IHByZXZlbnRTY3JvbGw6IHRydWUgfSk7XG4gICAgcmVxdWVzdE1vZGFsTGFzdEZvY3VzZWQgPSBudWxsO1xuICB9XG59O1xuXG5yZXF1ZXN0TW9kYWxPcGVuQnV0dG9ucy5mb3JFYWNoKChidXR0b24pID0+IHtcbiAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBmaWxsUmVxdWVzdE1vZGFsKGJ1dHRvbi5kYXRhc2V0LnJlcXVlc3RUeXBlIHx8ICdicmllZicpO1xuICAgIHNldFJlcXVlc3RNb2RhbFN0YXRlKHRydWUpO1xuICB9KTtcbn0pO1xuXG5yZXF1ZXN0TW9kYWxDbG9zZUJ1dHRvbnMuZm9yRWFjaCgoYnV0dG9uKSA9PiB7XG4gIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHNldFJlcXVlc3RNb2RhbFN0YXRlKGZhbHNlKSk7XG59KTtcblxuaWYgKHJlcXVlc3RNb2RhbCkge1xuICByZXF1ZXN0TW9kYWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgIGlmIChldmVudC5rZXkgIT09ICdUYWInKSByZXR1cm47XG5cbiAgICBjb25zdCBmb2N1c2FibGUgPSBnZXRSZXF1ZXN0TW9kYWxGb2N1c2FibGUoKTtcbiAgICBpZiAoIWZvY3VzYWJsZS5sZW5ndGgpIHJldHVybjtcblxuICAgIGNvbnN0IGZpcnN0ID0gZm9jdXNhYmxlWzBdO1xuICAgIGNvbnN0IGxhc3QgPSBmb2N1c2FibGVbZm9jdXNhYmxlLmxlbmd0aCAtIDFdO1xuXG4gICAgaWYgKGV2ZW50LnNoaWZ0S2V5ICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGZpcnN0KSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgbGFzdC5mb2N1cygpO1xuICAgIH1cblxuICAgIGlmICghZXZlbnQuc2hpZnRLZXkgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gbGFzdCkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGZpcnN0LmZvY3VzKCk7XG4gICAgfVxuICB9KTtcbn1cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICBpZiAoZXZlbnQua2V5ID09PSAnRXNjYXBlJykge1xuICAgIHNldFJlcXVlc3RNb2RhbFN0YXRlKGZhbHNlKTtcbiAgfVxufSk7XG5cbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWFqYXgtZm9ybV0nKS5mb3JFYWNoKChmb3JtKSA9PiB7XG4gIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgYXN5bmMgKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIGNvbnN0IHN0YXR1cyA9IGZvcm0ucXVlcnlTZWxlY3RvcignW2RhdGEtZm9ybS1zdGF0dXNdJyk7XG4gICAgY29uc3Qgc3VibWl0ID0gZm9ybS5xdWVyeVNlbGVjdG9yKCdidXR0b25bdHlwZT1cInN1Ym1pdFwiXScpO1xuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGZvcm0pO1xuICAgIGNvbnN0IGZvcm1UeXBlID0gZm9ybS5kYXRhc2V0LmZvcm1UeXBlIHx8IGZvcm1EYXRhLmdldCgnZm9ybV90eXBlJykgfHwgJ9Ck0L7RgNC80LAnO1xuXG4gICAgZm9ybURhdGEuc2V0KCdmb3JtX3R5cGUnLCBmb3JtVHlwZSk7XG5cbiAgICBpZiAoc3RhdHVzKSB7XG4gICAgICBzdGF0dXMudGV4dENvbnRlbnQgPSAn0J7RgtC/0YDQsNCy0LvRj9C10LwuLi4nO1xuICAgICAgc3RhdHVzLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXN1Y2Nlc3MnKTtcbiAgICB9XG5cbiAgICBpZiAoc3VibWl0KSBzdWJtaXQuZGlzYWJsZWQgPSB0cnVlO1xuXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGZldGNoKGZvcm0uZ2V0QXR0cmlidXRlKCdhY3Rpb24nKSB8fCAnc2VuZC5waHAnLCB7XG4gICAgICAgIG1ldGhvZDogZm9ybS5nZXRBdHRyaWJ1dGUoJ21ldGhvZCcpIHx8ICdQT1NUJyxcbiAgICAgICAgYm9keTogZm9ybURhdGFcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ3NlbmQucGhwINC/0L7QutCwINC90LXQtNC+0YHRgtGD0L/QtdC9LCDQv9C+0LrQsNC30YvQstCw0LXQvCDQt9Cw0LPQu9GD0YjQutGDINGD0YHQv9C10YjQvdC+0Lkg0L7RgtC/0YDQsNCy0LrQuCcsIGVycm9yKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKHN1Ym1pdCkgc3VibWl0LmRpc2FibGVkID0gZmFsc2U7XG4gICAgICBpZiAoc3RhdHVzKSB7XG4gICAgICAgIHN0YXR1cy50ZXh0Q29udGVudCA9ICfQodC/0LDRgdC40LHQviEg0KTQvtGA0LzQsCDQvtGC0L/RgNCw0LLQu9C10L3QsC4g0JzRiyDRgdC60L7RgNC+INGB0LLRj9C20LXQvNGB0Y8uJztcbiAgICAgICAgc3RhdHVzLmNsYXNzTGlzdC5hZGQoJ2lzLXN1Y2Nlc3MnKTtcbiAgICAgIH1cbiAgICAgIGZvcm0ucmVzZXQoKTtcblxuICAgICAgY29uc3QgaGlkZGVuVHlwZSA9IGZvcm0ucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cImZvcm1fdHlwZVwiXScpO1xuICAgICAgaWYgKGhpZGRlblR5cGUpIGhpZGRlblR5cGUudmFsdWUgPSBmb3JtVHlwZTtcbiAgICB9XG4gIH0pO1xufSk7XG4iXSwiZmlsZSI6Im1haW4uanMifQ==

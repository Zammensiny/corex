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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IG5hdlRvZ2dsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idXJnZXInKTtcbmNvbnN0IG5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tYWluLW5hdicpO1xuY29uc3QgbmF2SGlkZGVuVGV4dCA9IG5hdlRvZ2dsZT8ucXVlcnlTZWxlY3RvcignLnZpc3VhbGx5LWhpZGRlbicpO1xuXG5jb25zdCBzZXRNZW51U3RhdGUgPSAoaXNPcGVuKSA9PiB7XG4gIGlmICghbmF2VG9nZ2xlIHx8ICFuYXYpIHJldHVybjtcblxuICBuYXYuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtb3BlbicsIGlzT3Blbik7XG4gIG5hdlRvZ2dsZS5jbGFzc0xpc3QudG9nZ2xlKCdpcy1vcGVuJywgaXNPcGVuKTtcbiAgbmF2VG9nZ2xlLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIFN0cmluZyhpc09wZW4pKTtcblxuICBpZiAobmF2SGlkZGVuVGV4dCkge1xuICAgIG5hdkhpZGRlblRleHQudGV4dENvbnRlbnQgPSBpc09wZW4gPyAn0JfQsNC60YDRi9GC0Ywg0LzQtdC90Y4nIDogJ9Ce0YLQutGA0YvRgtGMINC80LXQvdGOJztcbiAgfVxufTtcblxuaWYgKG5hdlRvZ2dsZSAmJiBuYXYpIHtcbiAgbmF2VG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgc2V0TWVudVN0YXRlKCFuYXYuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy1vcGVuJykpO1xuICB9KTtcblxuICBuYXYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICBpZiAoZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJ2EnKSkge1xuICAgICAgc2V0TWVudVN0YXRlKGZhbHNlKTtcbiAgICB9XG4gIH0pO1xuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgaWYgKCFuYXYuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy1vcGVuJykpIHJldHVybjtcblxuICAgIGNvbnN0IGNsaWNrSW5zaWRlTWVudSA9IG5hdi5jb250YWlucyhldmVudC50YXJnZXQpO1xuICAgIGNvbnN0IGNsaWNrT25Ub2dnbGUgPSBuYXZUb2dnbGUuY29udGFpbnMoZXZlbnQudGFyZ2V0KTtcblxuICAgIGlmICghY2xpY2tJbnNpZGVNZW51ICYmICFjbGlja09uVG9nZ2xlKSB7XG4gICAgICBzZXRNZW51U3RhdGUoZmFsc2UpO1xuICAgIH1cbiAgfSk7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICBpZiAod2luZG93LmlubmVyV2lkdGggPiA5MjApIHtcbiAgICAgIHNldE1lbnVTdGF0ZShmYWxzZSk7XG4gICAgfVxuICB9KTtcbn1cblxuY29uc3QgbW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1tZW51LW1vZGFsXScpO1xuY29uc3QgbW9kYWxPcGVuQnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLW1lbnUtbW9kYWwtb3Blbl0nKTtcbmNvbnN0IG1vZGFsQ2xvc2VCdXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtbWVudS1tb2RhbC1jbG9zZV0nKTtcbmNvbnN0IG1vZGFsTGlua3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1tZW51LW1vZGFsLWxpbmtdJyk7XG5sZXQgbW9kYWxMYXN0Rm9jdXNlZCA9IG51bGw7XG5cbmNvbnN0IGdldE1vZGFsRm9jdXNhYmxlID0gKCkgPT4ge1xuICBpZiAoIW1vZGFsKSByZXR1cm4gW107XG4gIHJldHVybiBBcnJheS5mcm9tKFxuICAgIG1vZGFsLnF1ZXJ5U2VsZWN0b3JBbGwoJ2FbaHJlZl0sIGJ1dHRvbjpub3QoW2Rpc2FibGVkXSksIHRleHRhcmVhLCBpbnB1dCwgc2VsZWN0LCBbdGFiaW5kZXhdOm5vdChbdGFiaW5kZXg9XCItMVwiXSknKVxuICApLmZpbHRlcigoZWxlbWVudCkgPT4gZWxlbWVudC5vZmZzZXRQYXJlbnQgIT09IG51bGwgfHwgZWxlbWVudCA9PT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCk7XG59O1xuXG5jb25zdCBzZXRNb2RhbFN0YXRlID0gKGlzT3BlbikgPT4ge1xuICBpZiAoIW1vZGFsKSByZXR1cm47XG5cbiAgbW9kYWwuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtb3BlbicsIGlzT3Blbik7XG4gIG1vZGFsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCBTdHJpbmcoIWlzT3BlbikpO1xuICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoJ2lzLW1lbnUtbW9kYWwtb3BlbicsIGlzT3Blbik7XG5cbiAgbW9kYWxPcGVuQnV0dG9ucy5mb3JFYWNoKChidXR0b24pID0+IHtcbiAgICBidXR0b24uY2xhc3NMaXN0LnRvZ2dsZSgnaXMtYWN0aXZlJywgaXNPcGVuKTtcbiAgICBidXR0b24uc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgU3RyaW5nKGlzT3BlbikpO1xuICB9KTtcblxuICBpZiAoaXNPcGVuKSB7XG4gICAgbW9kYWxMYXN0Rm9jdXNlZCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgc2V0TWVudVN0YXRlKGZhbHNlKTtcbiAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBjb25zdCBmb2N1c2FibGUgPSBnZXRNb2RhbEZvY3VzYWJsZSgpO1xuICAgICAgZm9jdXNhYmxlWzBdPy5mb2N1cyh7IHByZXZlbnRTY3JvbGw6IHRydWUgfSk7XG4gICAgfSwgODApO1xuICB9IGVsc2UgaWYgKG1vZGFsTGFzdEZvY3VzZWQpIHtcbiAgICBtb2RhbExhc3RGb2N1c2VkLmZvY3VzPy4oeyBwcmV2ZW50U2Nyb2xsOiB0cnVlIH0pO1xuICAgIG1vZGFsTGFzdEZvY3VzZWQgPSBudWxsO1xuICB9XG59O1xuXG5tb2RhbE9wZW5CdXR0b25zLmZvckVhY2goKGJ1dHRvbikgPT4ge1xuICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgc2V0TW9kYWxTdGF0ZSh0cnVlKTtcbiAgfSk7XG59KTtcblxubW9kYWxDbG9zZUJ1dHRvbnMuZm9yRWFjaCgoYnV0dG9uKSA9PiB7XG4gIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBzZXRNb2RhbFN0YXRlKGZhbHNlKTtcbiAgfSk7XG59KTtcblxubW9kYWxMaW5rcy5mb3JFYWNoKChsaW5rKSA9PiB7XG4gIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgc2V0TW9kYWxTdGF0ZShmYWxzZSk7XG4gIH0pO1xufSk7XG5cbmlmIChtb2RhbCkge1xuICBtb2RhbC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgaWYgKGV2ZW50LmtleSAhPT0gJ1RhYicpIHJldHVybjtcblxuICAgIGNvbnN0IGZvY3VzYWJsZSA9IGdldE1vZGFsRm9jdXNhYmxlKCk7XG4gICAgaWYgKCFmb2N1c2FibGUubGVuZ3RoKSByZXR1cm47XG5cbiAgICBjb25zdCBmaXJzdCA9IGZvY3VzYWJsZVswXTtcbiAgICBjb25zdCBsYXN0ID0gZm9jdXNhYmxlW2ZvY3VzYWJsZS5sZW5ndGggLSAxXTtcblxuICAgIGlmIChldmVudC5zaGlmdEtleSAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBmaXJzdCkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGxhc3QuZm9jdXMoKTtcbiAgICB9XG5cbiAgICBpZiAoIWV2ZW50LnNoaWZ0S2V5ICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGxhc3QpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBmaXJzdC5mb2N1cygpO1xuICAgIH1cbiAgfSk7XG59XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgaWYgKGV2ZW50LmtleSA9PT0gJ0VzY2FwZScpIHtcbiAgICBzZXRNZW51U3RhdGUoZmFsc2UpO1xuICAgIHNldE1vZGFsU3RhdGUoZmFsc2UpO1xuICB9XG59KTtcblxuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtY29weS1lbWFpbF0nKS5mb3JFYWNoKChidXR0b24pID0+IHtcbiAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGVtYWlsID0gYnV0dG9uLmRhdGFzZXQuY29weUVtYWlsO1xuICAgIGlmICghZW1haWwgfHwgIW5hdmlnYXRvci5jbGlwYm9hcmQpIHJldHVybjtcblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChlbWFpbCk7XG4gICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnaXMtY29waWVkJyk7XG4gICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiBidXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnaXMtY29waWVkJyksIDEwMDApO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ9Cd0LUg0YPQtNCw0LvQvtGB0Ywg0YHQutC+0L/QuNGA0L7QstCw0YLRjCBlbWFpbCcsIGVycm9yKTtcbiAgICB9XG4gIH0pO1xufSk7XG5cbmNvbnN0IGNhc2VzQmxvY2tzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNhc2VzJyk7XG5cbmNhc2VzQmxvY2tzLmZvckVhY2goKGNhc2VzQmxvY2spID0+IHtcbiAgY29uc3QgdGFicyA9IEFycmF5LmZyb20oY2FzZXNCbG9jay5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1jYXNlLXRhYl0nKSk7XG4gIGNvbnN0IHBhbmVscyA9IEFycmF5LmZyb20oY2FzZXNCbG9jay5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1jYXNlLXBhbmVsXScpKTtcblxuICBpZiAoIXRhYnMubGVuZ3RoIHx8ICFwYW5lbHMubGVuZ3RoKSByZXR1cm47XG5cbiAgY29uc3Qgc2V0QWN0aXZlQ2FzZSA9IChjYXNlSWQpID0+IHtcbiAgICB0YWJzLmZvckVhY2goKHRhYikgPT4ge1xuICAgICAgY29uc3QgaXNBY3RpdmUgPSB0YWIuZGF0YXNldC5jYXNlVGFiID09PSBjYXNlSWQ7XG4gICAgICB0YWIuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtYWN0aXZlJywgaXNBY3RpdmUpO1xuICAgICAgdGFiLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIFN0cmluZyhpc0FjdGl2ZSkpO1xuICAgICAgdGFiLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCBpc0FjdGl2ZSA/ICcwJyA6ICctMScpO1xuICAgIH0pO1xuXG4gICAgcGFuZWxzLmZvckVhY2goKHBhbmVsKSA9PiB7XG4gICAgICBjb25zdCBpc0FjdGl2ZSA9IHBhbmVsLmRhdGFzZXQuY2FzZVBhbmVsID09PSBjYXNlSWQ7XG4gICAgICBwYW5lbC5jbGFzc0xpc3QudG9nZ2xlKCdpcy1hY3RpdmUnLCBpc0FjdGl2ZSk7XG4gICAgICBwYW5lbC5oaWRkZW4gPSAhaXNBY3RpdmU7XG4gICAgfSk7XG4gIH07XG5cbiAgdGFicy5mb3JFYWNoKCh0YWIsIGluZGV4KSA9PiB7XG4gICAgdGFiLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgaWYgKHRhYi5kaXNhYmxlZCB8fCAhdGFiLmRhdGFzZXQuY2FzZVRhYikgcmV0dXJuO1xuICAgICAgc2V0QWN0aXZlQ2FzZSh0YWIuZGF0YXNldC5jYXNlVGFiKTtcbiAgICB9KTtcblxuICAgIHRhYi5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoIVsnQXJyb3dMZWZ0JywgJ0Fycm93UmlnaHQnLCAnSG9tZScsICdFbmQnXS5pbmNsdWRlcyhldmVudC5rZXkpKSByZXR1cm47XG5cbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjb25zdCBlbmFibGVkVGFicyA9IHRhYnMuZmlsdGVyKChpdGVtKSA9PiAhaXRlbS5kaXNhYmxlZCk7XG4gICAgICBjb25zdCBjdXJyZW50SW5kZXggPSBlbmFibGVkVGFicy5pbmRleE9mKHRhYik7XG4gICAgICBsZXQgbmV4dEluZGV4ID0gY3VycmVudEluZGV4O1xuXG4gICAgICBpZiAoZXZlbnQua2V5ID09PSAnQXJyb3dSaWdodCcpIG5leHRJbmRleCA9IChjdXJyZW50SW5kZXggKyAxKSAlIGVuYWJsZWRUYWJzLmxlbmd0aDtcbiAgICAgIGlmIChldmVudC5rZXkgPT09ICdBcnJvd0xlZnQnKSBuZXh0SW5kZXggPSAoY3VycmVudEluZGV4IC0gMSArIGVuYWJsZWRUYWJzLmxlbmd0aCkgJSBlbmFibGVkVGFicy5sZW5ndGg7XG4gICAgICBpZiAoZXZlbnQua2V5ID09PSAnSG9tZScpIG5leHRJbmRleCA9IDA7XG4gICAgICBpZiAoZXZlbnQua2V5ID09PSAnRW5kJykgbmV4dEluZGV4ID0gZW5hYmxlZFRhYnMubGVuZ3RoIC0gMTtcblxuICAgICAgZW5hYmxlZFRhYnNbbmV4dEluZGV4XT8uZm9jdXMoKTtcbiAgICB9KTtcblxuICAgIHRhYi5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgaW5kZXggPT09IDAgPyAnMCcgOiAnLTEnKTtcbiAgfSk7XG59KTtcbiJdLCJmaWxlIjoibWFpbi5qcyJ9

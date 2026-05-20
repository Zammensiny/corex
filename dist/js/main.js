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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IG5hdlRvZ2dsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idXJnZXInKTtcbmNvbnN0IG5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tYWluLW5hdicpO1xuY29uc3QgbmF2SGlkZGVuVGV4dCA9IG5hdlRvZ2dsZT8ucXVlcnlTZWxlY3RvcignLnZpc3VhbGx5LWhpZGRlbicpO1xuXG5pZiAobmF2VG9nZ2xlICYmIG5hdikge1xuICBjb25zdCBzZXRNZW51U3RhdGUgPSAoaXNPcGVuKSA9PiB7XG4gICAgbmF2LmNsYXNzTGlzdC50b2dnbGUoJ2lzLW9wZW4nLCBpc09wZW4pO1xuICAgIG5hdlRvZ2dsZS5jbGFzc0xpc3QudG9nZ2xlKCdpcy1vcGVuJywgaXNPcGVuKTtcbiAgICBuYXZUb2dnbGUuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgU3RyaW5nKGlzT3BlbikpO1xuXG4gICAgaWYgKG5hdkhpZGRlblRleHQpIHtcbiAgICAgIG5hdkhpZGRlblRleHQudGV4dENvbnRlbnQgPSBpc09wZW4gPyAn0JfQsNC60YDRi9GC0Ywg0LzQtdC90Y4nIDogJ9Ce0YLQutGA0YvRgtGMINC80LXQvdGOJztcbiAgICB9XG4gIH07XG5cbiAgbmF2VG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgc2V0TWVudVN0YXRlKCFuYXYuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy1vcGVuJykpO1xuICB9KTtcblxuICBuYXYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICBpZiAoZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJ2EnKSkge1xuICAgICAgc2V0TWVudVN0YXRlKGZhbHNlKTtcbiAgICB9XG4gIH0pO1xuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgaWYgKCFuYXYuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy1vcGVuJykpIHJldHVybjtcblxuICAgIGNvbnN0IGNsaWNrSW5zaWRlTWVudSA9IG5hdi5jb250YWlucyhldmVudC50YXJnZXQpO1xuICAgIGNvbnN0IGNsaWNrT25Ub2dnbGUgPSBuYXZUb2dnbGUuY29udGFpbnMoZXZlbnQudGFyZ2V0KTtcblxuICAgIGlmICghY2xpY2tJbnNpZGVNZW51ICYmICFjbGlja09uVG9nZ2xlKSB7XG4gICAgICBzZXRNZW51U3RhdGUoZmFsc2UpO1xuICAgIH1cbiAgfSk7XG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgIGlmIChldmVudC5rZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICBzZXRNZW51U3RhdGUoZmFsc2UpO1xuICAgIH1cbiAgfSk7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICBpZiAod2luZG93LmlubmVyV2lkdGggPiA5MjApIHtcbiAgICAgIHNldE1lbnVTdGF0ZShmYWxzZSk7XG4gICAgfVxuICB9KTtcbn1cblxuY29uc3QgY2FzZXNCbG9ja3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2FzZXMnKTtcblxuY2FzZXNCbG9ja3MuZm9yRWFjaCgoY2FzZXNCbG9jaykgPT4ge1xuICBjb25zdCB0YWJzID0gQXJyYXkuZnJvbShjYXNlc0Jsb2NrLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWNhc2UtdGFiXScpKTtcbiAgY29uc3QgcGFuZWxzID0gQXJyYXkuZnJvbShjYXNlc0Jsb2NrLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWNhc2UtcGFuZWxdJykpO1xuXG4gIGlmICghdGFicy5sZW5ndGggfHwgIXBhbmVscy5sZW5ndGgpIHJldHVybjtcblxuICBjb25zdCBzZXRBY3RpdmVDYXNlID0gKGNhc2VJZCkgPT4ge1xuICAgIHRhYnMuZm9yRWFjaCgodGFiKSA9PiB7XG4gICAgICBjb25zdCBpc0FjdGl2ZSA9IHRhYi5kYXRhc2V0LmNhc2VUYWIgPT09IGNhc2VJZDtcbiAgICAgIHRhYi5jbGFzc0xpc3QudG9nZ2xlKCdpcy1hY3RpdmUnLCBpc0FjdGl2ZSk7XG4gICAgICB0YWIuc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgU3RyaW5nKGlzQWN0aXZlKSk7XG4gICAgICB0YWIuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIGlzQWN0aXZlID8gJzAnIDogJy0xJyk7XG4gICAgfSk7XG5cbiAgICBwYW5lbHMuZm9yRWFjaCgocGFuZWwpID0+IHtcbiAgICAgIGNvbnN0IGlzQWN0aXZlID0gcGFuZWwuZGF0YXNldC5jYXNlUGFuZWwgPT09IGNhc2VJZDtcbiAgICAgIHBhbmVsLmNsYXNzTGlzdC50b2dnbGUoJ2lzLWFjdGl2ZScsIGlzQWN0aXZlKTtcbiAgICAgIHBhbmVsLmhpZGRlbiA9ICFpc0FjdGl2ZTtcbiAgICB9KTtcbiAgfTtcblxuICB0YWJzLmZvckVhY2goKHRhYiwgaW5kZXgpID0+IHtcbiAgICB0YWIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBpZiAodGFiLmRpc2FibGVkIHx8ICF0YWIuZGF0YXNldC5jYXNlVGFiKSByZXR1cm47XG4gICAgICBzZXRBY3RpdmVDYXNlKHRhYi5kYXRhc2V0LmNhc2VUYWIpO1xuICAgIH0pO1xuXG4gICAgdGFiLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmICghWydBcnJvd0xlZnQnLCAnQXJyb3dSaWdodCcsICdIb21lJywgJ0VuZCddLmluY2x1ZGVzKGV2ZW50LmtleSkpIHJldHVybjtcblxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGNvbnN0IGVuYWJsZWRUYWJzID0gdGFicy5maWx0ZXIoKGl0ZW0pID0+ICFpdGVtLmRpc2FibGVkKTtcbiAgICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IGVuYWJsZWRUYWJzLmluZGV4T2YodGFiKTtcbiAgICAgIGxldCBuZXh0SW5kZXggPSBjdXJyZW50SW5kZXg7XG5cbiAgICAgIGlmIChldmVudC5rZXkgPT09ICdBcnJvd1JpZ2h0JykgbmV4dEluZGV4ID0gKGN1cnJlbnRJbmRleCArIDEpICUgZW5hYmxlZFRhYnMubGVuZ3RoO1xuICAgICAgaWYgKGV2ZW50LmtleSA9PT0gJ0Fycm93TGVmdCcpIG5leHRJbmRleCA9IChjdXJyZW50SW5kZXggLSAxICsgZW5hYmxlZFRhYnMubGVuZ3RoKSAlIGVuYWJsZWRUYWJzLmxlbmd0aDtcbiAgICAgIGlmIChldmVudC5rZXkgPT09ICdIb21lJykgbmV4dEluZGV4ID0gMDtcbiAgICAgIGlmIChldmVudC5rZXkgPT09ICdFbmQnKSBuZXh0SW5kZXggPSBlbmFibGVkVGFicy5sZW5ndGggLSAxO1xuXG4gICAgICBlbmFibGVkVGFic1tuZXh0SW5kZXhdPy5mb2N1cygpO1xuICAgIH0pO1xuXG4gICAgdGFiLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCBpbmRleCA9PT0gMCA/ICcwJyA6ICctMScpO1xuICB9KTtcbn0pO1xuIl0sImZpbGUiOiJtYWluLmpzIn0=

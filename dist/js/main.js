const navToggle = document.querySelector('.burger');
const nav = document.querySelector('.main-nav');

if (navToggle && nav) {
  const setMenuState = (isOpen) => {
    nav.classList.toggle('is-open', isOpen);
    navToggle.classList.toggle('is-open', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IG5hdlRvZ2dsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idXJnZXInKTtcbmNvbnN0IG5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tYWluLW5hdicpO1xuXG5pZiAobmF2VG9nZ2xlICYmIG5hdikge1xuICBjb25zdCBzZXRNZW51U3RhdGUgPSAoaXNPcGVuKSA9PiB7XG4gICAgbmF2LmNsYXNzTGlzdC50b2dnbGUoJ2lzLW9wZW4nLCBpc09wZW4pO1xuICAgIG5hdlRvZ2dsZS5jbGFzc0xpc3QudG9nZ2xlKCdpcy1vcGVuJywgaXNPcGVuKTtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoJ21lbnUtb3BlbicsIGlzT3Blbik7XG4gICAgbmF2VG9nZ2xlLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIFN0cmluZyhpc09wZW4pKTtcbiAgfTtcblxuICBuYXZUb2dnbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBzZXRNZW51U3RhdGUoIW5hdi5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLW9wZW4nKSk7XG4gIH0pO1xuXG4gIG5hdi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgIGlmIChldmVudC50YXJnZXQuY2xvc2VzdCgnYScpKSB7XG4gICAgICBzZXRNZW51U3RhdGUoZmFsc2UpO1xuICAgIH1cbiAgfSk7XG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICBpZiAoIW5hdi5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLW9wZW4nKSkgcmV0dXJuO1xuXG4gICAgY29uc3QgY2xpY2tJbnNpZGVNZW51ID0gbmF2LmNvbnRhaW5zKGV2ZW50LnRhcmdldCk7XG4gICAgY29uc3QgY2xpY2tPblRvZ2dsZSA9IG5hdlRvZ2dsZS5jb250YWlucyhldmVudC50YXJnZXQpO1xuXG4gICAgaWYgKCFjbGlja0luc2lkZU1lbnUgJiYgIWNsaWNrT25Ub2dnbGUpIHtcbiAgICAgIHNldE1lbnVTdGF0ZShmYWxzZSk7XG4gICAgfVxuICB9KTtcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgaWYgKGV2ZW50LmtleSA9PT0gJ0VzY2FwZScpIHtcbiAgICAgIHNldE1lbnVTdGF0ZShmYWxzZSk7XG4gICAgfVxuICB9KTtcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+IDkyMCkge1xuICAgICAgc2V0TWVudVN0YXRlKGZhbHNlKTtcbiAgICB9XG4gIH0pO1xufVxuIl0sImZpbGUiOiJtYWluLmpzIn0=

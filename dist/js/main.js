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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IG5hdlRvZ2dsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idXJnZXInKTtcbmNvbnN0IG5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tYWluLW5hdicpO1xuY29uc3QgbmF2SGlkZGVuVGV4dCA9IG5hdlRvZ2dsZT8ucXVlcnlTZWxlY3RvcignLnZpc3VhbGx5LWhpZGRlbicpO1xuXG5pZiAobmF2VG9nZ2xlICYmIG5hdikge1xuICBjb25zdCBzZXRNZW51U3RhdGUgPSAoaXNPcGVuKSA9PiB7XG4gICAgbmF2LmNsYXNzTGlzdC50b2dnbGUoJ2lzLW9wZW4nLCBpc09wZW4pO1xuICAgIG5hdlRvZ2dsZS5jbGFzc0xpc3QudG9nZ2xlKCdpcy1vcGVuJywgaXNPcGVuKTtcbiAgICBuYXZUb2dnbGUuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgU3RyaW5nKGlzT3BlbikpO1xuXG4gICAgaWYgKG5hdkhpZGRlblRleHQpIHtcbiAgICAgIG5hdkhpZGRlblRleHQudGV4dENvbnRlbnQgPSBpc09wZW4gPyAn0JfQsNC60YDRi9GC0Ywg0LzQtdC90Y4nIDogJ9Ce0YLQutGA0YvRgtGMINC80LXQvdGOJztcbiAgICB9XG4gIH07XG5cbiAgbmF2VG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgc2V0TWVudVN0YXRlKCFuYXYuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy1vcGVuJykpO1xuICB9KTtcblxuICBuYXYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICBpZiAoZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJ2EnKSkge1xuICAgICAgc2V0TWVudVN0YXRlKGZhbHNlKTtcbiAgICB9XG4gIH0pO1xuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgaWYgKCFuYXYuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy1vcGVuJykpIHJldHVybjtcblxuICAgIGNvbnN0IGNsaWNrSW5zaWRlTWVudSA9IG5hdi5jb250YWlucyhldmVudC50YXJnZXQpO1xuICAgIGNvbnN0IGNsaWNrT25Ub2dnbGUgPSBuYXZUb2dnbGUuY29udGFpbnMoZXZlbnQudGFyZ2V0KTtcblxuICAgIGlmICghY2xpY2tJbnNpZGVNZW51ICYmICFjbGlja09uVG9nZ2xlKSB7XG4gICAgICBzZXRNZW51U3RhdGUoZmFsc2UpO1xuICAgIH1cbiAgfSk7XG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgIGlmIChldmVudC5rZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICBzZXRNZW51U3RhdGUoZmFsc2UpO1xuICAgIH1cbiAgfSk7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICBpZiAod2luZG93LmlubmVyV2lkdGggPiA5MjApIHtcbiAgICAgIHNldE1lbnVTdGF0ZShmYWxzZSk7XG4gICAgfVxuICB9KTtcbn1cbiJdLCJmaWxlIjoibWFpbi5qcyJ9

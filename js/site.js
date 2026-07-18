/* ==========================================
   He Rengao - Printmaking Artist
   Site JavaScript
   ========================================== */

(function () {
  const header = document.getElementById('siteHeader');
  const menuBtn = document.getElementById('menuBtn');
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const closeBtn = document.getElementById('drawerClose');

  // Sticky "scrolled" state (subtle)
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile drawer open/close
  let lastFocus = null;

  function openMenu() {
    lastFocus = document.activeElement;
    document.body.setAttribute('data-menu-open', 'true');
    menuBtn.setAttribute('aria-expanded', 'true');

    // focus first link for accessibility
    const firstLink = drawer.querySelector('a');
    if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    document.body.removeAttribute('data-menu-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  menuBtn.addEventListener('click', () => {
    const isOpen = document.body.getAttribute('data-menu-open') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  closeBtn.addEventListener('click', closeMenu);
  backdrop.addEventListener('click', closeMenu);

  // ESC closes menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.getAttribute('data-menu-open') === 'true') {
      closeMenu();
    }
  });

  // Close menu when clicking a link (mobile)
  drawer.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (a) closeMenu();
  });
})();

// Register Service Worker for PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js");
  });
}

/* Shared inner-page menu (work / showreel / contact).
   Toggles body.menu-active and closes on a click outside the links.
   Pages pass optional onOpen / onClose hooks for page-specific behaviour. */
function initMenu(hooks) {
  hooks = hooks || {};

  const button = document.querySelector('.menu-button');
  const overlay = document.querySelector('.menu-overlay');

  if (!button || !overlay) return null;

  let open = false;

  function set(next) {
    if (next === open) return;

    open = next;
    document.body.classList.toggle('menu-active', open);

    if (open && hooks.onOpen) hooks.onOpen();
    if (!open && hooks.onClose) hooks.onClose();
  }

  button.addEventListener('click', () => set(!open));

  overlay.addEventListener('click', (event) => {
    if (!event.target.closest('.menu-links')) set(false);
  });

  return {
    isOpen: () => open,
    open: () => set(true),
    close: () => set(false),
  };
}

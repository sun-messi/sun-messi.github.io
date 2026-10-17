const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav');
if (menuButton && navigation) {
  const closeMenu = () => { navigation.classList.remove('is-open'); menuButton.setAttribute('aria-expanded', 'false'); };
  menuButton.addEventListener('click', () => {
    const open = navigation.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
}

document.querySelectorAll('[data-copy]').forEach(button => {
  button.addEventListener('click', async () => {
    const source = document.getElementById(button.dataset.copy);
    const status = button.closest('.citation-block').querySelector('.copy-status');
    try {
      await navigator.clipboard.writeText(source.textContent.trim());
      button.textContent = 'Copied';
      status.textContent = 'BibTeX copied to clipboard.';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(source);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = 'Citation selected. Press ⌘C or Ctrl+C to copy.';
    }
  });
});

const figures = document.querySelectorAll('[data-lightbox]');
if (figures.length && typeof HTMLDialogElement !== 'undefined') {
  const dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.setAttribute('aria-label', 'Enlarged research figure');
  const close = document.createElement('button');
  close.className = 'lightbox-close';
  close.textContent = 'Close ×';
  close.setAttribute('aria-label', 'Close enlarged figure');
  const image = document.createElement('img');
  dialog.append(close, image);
  document.body.append(dialog);
  let trigger;
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => { document.body.style.overflow = ''; trigger?.focus(); });
  figures.forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    trigger = link;
    image.src = link.href;
    image.alt = link.querySelector('img').alt;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  }));
}

document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const menuButton = document.querySelector("[data-menu-button]");
const navigation = document.querySelector("[data-navigation]");

if (menuButton && navigation) {
  const closeMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    navigation.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

// Native dialog provides keyboard focus management and Escape-to-close support.
const imageViewer = document.createElement('dialog');
imageViewer.className = 'image-viewer';
imageViewer.setAttribute('aria-label', 'Project image');
imageViewer.innerHTML = `<div class="image-viewer-toolbar"><span>Project image</span><button type="button" data-close-viewer>Close <span aria-hidden="true">×</span></button></div><img alt=""><div class="image-viewer-caption"><p></p><a target="_blank" rel="noopener">Open original image ↗</a></div>`;
document.body.append(imageViewer);
let imageOpener;
imageViewer.querySelector('[data-close-viewer]').addEventListener('click', () => imageViewer.close());
imageViewer.addEventListener('click', (event) => {
  if (event.target !== imageViewer) return;
  const bounds = imageViewer.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) imageViewer.close();
});
imageViewer.addEventListener('close', () => {
  document.body.classList.remove('viewer-open');
  imageOpener?.focus({ preventScroll: true });
});
document.querySelectorAll('.case-figure img, .case-cover img, .spot-photo img, .tolerance-case img').forEach((image) => {
  if (image.closest('a, button')) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'image-zoom-button';
  button.setAttribute('aria-label', `Enlarge: ${image.alt || 'project image'}`);
  const hint = document.createElement('span');
  hint.className = 'image-zoom-hint';
  hint.textContent = 'Enlarge image ↗';
  image.replaceWith(button);
  button.append(image, hint);
  button.addEventListener('click', () => {
    imageOpener = button;
    const enlarged = imageViewer.querySelector('img');
    enlarged.src = image.currentSrc || image.src;
    enlarged.alt = image.alt;
    const container = button.closest('figure, article');
    imageViewer.querySelector('.image-viewer-caption p').textContent = container?.querySelector('figcaption')?.textContent || image.alt;
    imageViewer.querySelector('.image-viewer-caption a').href = enlarged.src;
    imageViewer.showModal();
    document.body.classList.add('viewer-open');
  });
});

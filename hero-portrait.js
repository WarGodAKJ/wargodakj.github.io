// The frame stays fixed; only its portrait/project panel turns.
const frame = document.querySelector('[data-portrait-panel]');
if (frame) {
  const hero = frame.closest('.hero');
  const button = frame.querySelector('[data-portrait-flip]');
  const front = frame.querySelector('[data-portrait-front]');
  const back = frame.querySelector('[data-portrait-back]');
  const projects = [...frame.querySelectorAll('[data-portrait-project]')];
  const pause = frame.querySelector('[data-portrait-play]');
  const caption = frame.querySelector('[data-panel-caption]');
  const status = frame.querySelector('[data-portrait-status]');
  const compact = matchMedia('(max-width: 760px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let ready = false, imagesReady = false, showingWork = false, projectIndex = 0;
  let userPaused = false, hovering = false, keyboardFocus = false, inView = true;
  let pointerType = '', switching = false, timer = 0, transitionTimer = 0, touchUntil = 0;

  const stop = () => { clearTimeout(timer); timer = 0; };
  const introDone = () => ['rotating', 'static', 'unavailable'].includes(hero.dataset.gearIntro)
    || !document.documentElement.classList.contains('hero-intro-pending');
  const canPlay = () => ready && !reduced.matches && !userPaused && !hovering
    && !keyboardFocus && inView && !document.hidden && !switching;
  const schedule = () => {
    stop();
    if (!canPlay()) return;
    timer = setTimeout(() => flip(!showingWork, false), Math.max(2000, touchUntil-Date.now()));
  };
  const controls = () => {
    const autoplay = ready && !reduced.matches;
    pause.hidden = !autoplay;
    frame.classList.toggle('has-autoplay', autoplay);
    pause.textContent = userPaused ? 'Play' : 'Pause';
    pause.setAttribute('aria-label', userPaused ? 'Resume automatic portrait flips' : 'Pause automatic portrait flips');
  };
  const render = () => {
    button.classList.toggle('is-projects', showingWork);
    button.dataset.face = showingWork ? 'projects' : 'portrait';
    frame.dataset.project = projects[projectIndex].dataset.projectLabel;
    front.setAttribute('aria-hidden', String(showingWork));
    back.setAttribute('aria-hidden', String(!showingWork));
    projects.forEach((project, index) => {
      project.classList.toggle('is-mobile-project', index === projectIndex);
      project.setAttribute('aria-hidden', String(compact.matches && index !== projectIndex));
    });
    button.setAttribute('aria-label', showingWork ? 'Show portrait of Atharva Joshi' : 'Show selected engineering projects');
    caption.textContent = showingWork
      ? (compact.matches ? projects[projectIndex].dataset.projectLabel : 'Selected projects · flip to portrait')
      : (compact.matches ? 'Portrait' : 'Portrait · flip to projects');
  };
  function flip(target, manual) {
    if (!ready || switching) return;
    stop();
    const wasWork = showingWork;
    if (!target && wasWork && compact.matches) projectIndex = (projectIndex+1)%projects.length;
    showingWork = target;
    switching = !reduced.matches;
    if (manual && pointerType === 'touch') touchUntil = Date.now()+4000;
    render();
    if (manual) status.textContent = showingWork
      ? (compact.matches ? projects[projectIndex].dataset.projectLabel : 'Selected projects: SpotMicro, connector design, and thermal analysis.')
      : 'Portrait of Atharva Joshi.';
    if (reduced.matches) return;
    clearTimeout(transitionTimer);
    transitionTimer = setTimeout(() => { switching = false; schedule(); }, 400);
  }
  button.addEventListener('click', () => flip(!showingWork, true));
  pause.addEventListener('click', () => { userPaused = !userPaused; controls(); schedule(); });
  frame.addEventListener('pointerenter', event => {
    if (event.pointerType === 'touch') return;
    hovering = true; stop();
  });
  frame.addEventListener('pointerleave', event => {
    if (event.pointerType === 'touch') return;
    hovering = false; schedule();
  });
  frame.addEventListener('pointerdown', event => {
    pointerType = event.pointerType;
    // Pointer focus should not keep autoplay stopped after the mouse leaves.
    keyboardFocus = false;
  });
  frame.addEventListener('keydown', () => {
    pointerType = 'keyboard'; keyboardFocus = true; stop();
  });
  frame.addEventListener('focusin', event => {
    keyboardFocus = event.target.matches(':focus-visible');
    if (keyboardFocus) stop();
  });
  frame.addEventListener('focusout', event => {
    if (frame.contains(event.relatedTarget)) return;
    keyboardFocus = false; schedule();
  });
  const startWhenReady = () => {
    if (ready || !imagesReady || !introDone()) return;
    ready = true;
    frame.dataset.flipState = 'ready';
    button.disabled = false;
    button.setAttribute('aria-describedby', 'portrait-flip-help');
    render(); controls(); schedule();
    waitForIntro.disconnect();
  };
  const waitForIntro = new MutationObserver(startWhenReady);
  waitForIntro.observe(hero, {attributes: true, attributeFilter: ['data-gear-intro']});
  waitForIntro.observe(document.documentElement, {attributes: true, attributeFilter: ['class']});
  Promise.all([...back.querySelectorAll('img')].map(image => image.decode())).then(() => {
    imagesReady = true; startWhenReady();
  }).catch(() => {
    frame.dataset.flipState = 'unavailable';
    pause.hidden = true;
    button.disabled = true;
    button.setAttribute('aria-label', 'Portrait of Atharva Joshi');
    waitForIntro.disconnect();
  });
  reduced.addEventListener('change', () => {
    clearTimeout(transitionTimer); switching = false;
    controls(); if (ready) render(); schedule();
  });
  compact.addEventListener('change', () => { if (ready) render(); schedule(); });
  document.addEventListener('visibilitychange', schedule);
  new IntersectionObserver(entries => { inView = entries[0].isIntersecting; schedule(); }, {threshold:.1}).observe(hero);
  frame.dataset.flipState = 'loading';
}

// Draw the decorative gear pair, seat the screws, then start slow rotation.
const root = document.documentElement;
const hero = document.querySelector('.portfolio-home .hero');
if (hero) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 760px)');
  const screws = [...hero.querySelectorAll('.portrait-screw')];
  const rotations = [];
  const assembly = [];
  let stage, art, introComplete = false, inView = true;

  const screwAnimations = () => screws.map((screw, index) => {
    const angle = parseFloat(getComputedStyle(screw).getPropertyValue('--seat-angle')) || 15;
    return screw.animate([
      { opacity: 0, transform: `translateY(-9px) scale(1.65) rotate(${angle-540}deg)`, boxShadow: '0 7px 9px #06151c80' },
      { opacity: 1, offset: .25 },
      { opacity: 1, transform: `translateY(0) scale(1) rotate(${angle}deg)`, boxShadow: '0 1px 2px #06151ccc' }
    ], { duration: 950, delay: 220+index*140, easing: 'cubic-bezier(.22,.65,.3,1)', fill: 'both' });
  });
  const position = () => {
    if (!stage || !art) return;
    const bounds = hero.getBoundingClientRect();
    const photo = hero.querySelector('.hero-portrait').getBoundingClientRect();
    const text = hero.querySelector('.hero-copy').getBoundingClientRect();
    const clearance = compact.matches ? bounds.width : text.right - bounds.left + 40;
    const scale = bounds.width <= 980 ? .75 : 1;
    const radius = 315*scale;
    // Account for the gear's full tooth-tip radius throughout its rotation.
    const centerX = Math.max((photo.left+photo.right)/2-bounds.left+12, clearance+radius+16);
    const centerY = (photo.top+photo.bottom)/2-bounds.top+6;
    stage.style.setProperty('--gears-clearance', `${clearance}px`);
    stage.style.setProperty('--gears-x', `${centerX-clearance-390*scale}px`);
    stage.style.setProperty('--gears-y', `${centerY-500*scale}px`);
    stage.style.setProperty('--gears-width', `${960*scale}px`);
    stage.style.setProperty('--gears-height', `${880*scale}px`);
  };
  const syncPlayback = () => {
    const play = !reduced.matches && !compact.matches && inView && !document.hidden;
    rotations.forEach(animation => play ? animation.play() : animation.pause());
  };
  const startRotation = () => {
    if (!art || reduced.matches || rotations.length) return;
    rotations.push(
      art.querySelector('.gear-large').animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], { duration: 300000, iterations: Infinity }),
      art.querySelector('.gear-small').animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(-360deg)' }], { duration: 120000, iterations: Infinity })
    );
    syncPlayback();
  };
  const finishAssembly = () => {
    if (introComplete) return;
    introComplete = true;
    root.classList.remove('hero-intro-pending');
    // Remove finished effects so the normal final styles remain authoritative.
    assembly.forEach(animation => animation.cancel());
    hero.dataset.gearIntro = reduced.matches ? 'static' : 'rotating';
    startRotation();
  };
  const mount = async () => {
    try {
      const response = await fetch('assets/hero-gears-static.svg');
      if (!response.ok) throw new Error('Gear artwork unavailable');
      const document = new DOMParser().parseFromString(await response.text(), 'image/svg+xml');
      if (document.querySelector('parsererror')) throw new Error('Invalid gear artwork');
      art = document.documentElement;
      art.classList.add('hero-gears-art');
      art.setAttribute('aria-hidden', 'true');
      art.setAttribute('focusable', 'false');
      stage = window.document.createElement('div');
      stage.className = 'hero-gears-stage';
      stage.setAttribute('aria-hidden', 'true');
      stage.append(art);
      hero.prepend(stage);
      const outlines = [...art.querySelectorAll('path,circle')];
      art.querySelectorAll('.gear-large,.gear-small').forEach(gear => { gear.style.transformOrigin = '0px 0px'; });
      outlines.forEach(outline => {
        outline.setAttribute('pathLength', '1');
        outline.style.strokeDasharray = '1';
        outline.style.strokeDashoffset = '0';
      });
      position();
      new ResizeObserver(position).observe(hero);
      window.document.fonts.ready.then(position);
      if (reduced.matches || introComplete) { finishAssembly(); startRotation(); return; }
      hero.dataset.gearIntro = 'drawing';
      for (const outline of outlines) assembly.push(outline.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], {
        duration: 1500, delay: outline.closest('.gear-small') ? 180 : 0,
        easing: 'cubic-bezier(.33,0,.2,1)', fill: 'both'
      }));
      assembly.push(...screwAnimations());
      await Promise.all(assembly.map(animation => animation.finished.catch(() => {})));
      finishAssembly();
    } catch {
      // The portfolio and portrait remain available if decoration cannot load.
      root.classList.remove('hero-intro-pending');
      hero.dataset.gearIntro = 'unavailable';
    }
  };
  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      finishAssembly();
      rotations.forEach(animation => animation.cancel());
      rotations.length = 0;
      hero.dataset.gearIntro = 'static';
    } else if (introComplete) {
      startRotation();
      hero.dataset.gearIntro = 'rotating';
    }
    syncPlayback();
  });
  compact.addEventListener('change', () => { position(); syncPlayback(); });
  window.document.addEventListener('visibilitychange', syncPlayback);
  new IntersectionObserver(entries => { inView = entries[0].isIntersecting; syncPlayback(); }, { threshold: .05 }).observe(hero);
  mount();
}

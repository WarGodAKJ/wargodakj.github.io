// Normal page scrolling drives three decorative gears and the teal transition.
const hero = document.querySelector('.portfolio-home .hero');
const cue = document.querySelector('.hero-scroll');
const transition = document.querySelector('.hero-transition');
const header = document.querySelector('[data-header]');

if (hero && cue && transition && header) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const gears = [...cue.querySelectorAll('[data-scroll-gear]')];
  const joints = [...cue.querySelectorAll('[data-scroll-sparks]')];
  const sparkPaths = [...cue.querySelectorAll('.scroll-spark')];
  let request = 0, lastTime = 0, lastScroll = scrollY, rotation = 0;
  let scrollTravel = 0, lastSpark = -Infinity, nextJoint = 1;
  let visible = false, transitionTop = 0, transitionHeight = 1, lastReveal = -1;
  const stopSparks = () => sparkPaths.forEach(path => path.getAnimations().forEach(animation => animation.cancel()));
  const spark = speed => {
    const joint = joints[nextJoint++ % joints.length];
    joint.querySelectorAll('.scroll-spark').forEach((path, index) => {
      path.getAnimations().forEach(animation => animation.cancel());
      const x = Number(path.dataset.sparkX);
      const y = Number(path.dataset.sparkY) * (1 + speed * .4);
      // Bright short trails accelerate downward; faster scrolls fall farther and quicker.
      const animation = path.animate([
        { opacity: 1, transform: 'translate(0px, 0px)' },
        { opacity: 1, offset: .3, transform: `translate(${x * .4}px, ${y * .24}px)` },
        { opacity: 1, offset: .72, transform: `translate(${x * .78}px, ${y * .7}px)` },
        { opacity: 0, transform: `translate(${x}px, ${y}px)` }
      ], { duration: 230 + index * 7 - speed * 60, easing: 'linear' });
      animation.finished.then(() => animation.cancel()).catch(() => {});
    });
  };
  const schedule = () => { if (!request) request = requestAnimationFrame(update); };
  function update(now) {
    request = 0;
    const distance = scrollY - lastScroll;
    lastScroll = scrollY;
    const reveal = reduced.matches ? 1 : Math.max(0, Math.min(1,
      (scrollY + innerHeight - transitionTop) / transitionHeight));
    if (Math.abs(reveal - lastReveal) > .001) {
      transition.style.setProperty('--hero-reveal', reveal.toFixed(3));
      lastReveal = reveal;
    }
    if (!reduced.matches && visible && !document.hidden) {
      rotation += (lastTime ? Math.min(now - lastTime, 50) * .024 : 0) + distance * .65;
      gears.forEach(gear => gear.setAttribute('transform', `rotate(${(rotation * Number(gear.dataset.gearDirection)).toFixed(2)})`));
      if (distance > 0) {
        scrollTravel += distance;
        if (scrollTravel >= 6 && now - lastSpark >= 140) {
          spark(Math.min(1, distance / 24));
          lastSpark = now;
          scrollTravel %= 6;
        }
      } else if (distance < 0) {
        scrollTravel = 0;
      }
      lastTime = now;
      schedule();
    } else {
      lastTime = 0;
      scrollTravel = 0;
      stopSparks();
    }
  }
  const measure = () => {
    hero.style.setProperty('--hero-header-height', `${header.getBoundingClientRect().height}px`);
    transitionTop = transition.getBoundingClientRect().top + scrollY;
    transitionHeight = transition.offsetHeight;
    schedule();
  };
  const layout = new ResizeObserver(measure);
  layout.observe(header);
  layout.observe(hero);
  layout.observe(transition);
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    cue.classList.toggle('is-out-of-view', !visible);
    lastTime = 0;
    schedule();
  }).observe(cue);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', measure, { passive: true });
  document.addEventListener('visibilitychange', () => { lastTime = 0; schedule(); });
  reduced.addEventListener('change', () => { lastTime = 0; schedule(); });
  document.fonts.ready.then(measure);
  measure();
}

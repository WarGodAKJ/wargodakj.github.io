// Mirrors mixCorrections() from SpotMicro's hardware-tested v3 controller.
export function mixLegCorrections(pitch, roll) {
  const raw = { fl: -pitch - roll, fr: -pitch + roll, rl: pitch - roll, rr: pitch + roll };
  const peak = Math.max(...Object.values(raw).map(Math.abs));
  const scale = peak > 20 ? 20 / peak : 1;
  return { scale, corrections: Object.fromEntries(Object.entries(raw).map(([leg, value]) => [leg, value * scale])) };
}

const legs = {
  fl: { name: 'Front left', x: 277, y: 76, side: -1 },
  fr: { name: 'Front right', x: 448, y: 121, side: 1 },
  rl: { name: 'Rear left', x: 152, y: 139, side: -1 },
  rr: { name: 'Rear right', x: 323, y: 184, side: 1 }
};
const joint = (x, y, radius, className = '') => `<circle cx="${x}" cy="${y}" r="${radius}" class="${className}"/>`;

document.querySelectorAll('[data-leg-mixer]').forEach((mixer, index) => {
  const svgId = `robot-illustration-${index}`;
  mixer.innerHTML = `
    <div class="tilt-visual">
      <div class="tilt-visual-heading"><span>SpotMicro / Balance controller</span><span>Interactive illustration</span></div>
      <svg viewBox="0 0 600 400" role="img" aria-labelledby="${svgId}" class="tilt-robot">
        <title id="${svgId}">A four-legged robot keeps its body level while its legs change length over a tilting board.</title>
        <defs><pattern id="board-grid-${index}" width="24" height="24" patternUnits="userSpaceOnUse" patternTransform="rotate(15)"><path d="M 24 0 L 0 0 0 24" fill="none" stroke="#7e9aa2" stroke-width=".6" opacity=".35"/></pattern></defs>
        <ellipse cx="300" cy="354" rx="210" ry="24" fill="#06151b" opacity=".5"/>
        <polygon data-board-shadow fill="#213b45" stroke="#78909a" stroke-width="1"/>
        <polygon data-board fill="#36515c" stroke="#a0b6be" stroke-width="1.5"/>
        <polygon data-board-grid fill="url(#board-grid-${index})"/>
        <g class="robot-leg" data-drawn-leg="fl"></g><g class="robot-leg" data-drawn-leg="fr"></g>
        <polygon points="152,139 277,76 448,121 323,184" fill="#d6e3e3" stroke="#a2b5bb" stroke-width="2"/>
        <polygon points="152,139 323,184 323,201 152,156" fill="#829da5" stroke="#b7cccf"/>
        <polygon points="323,184 448,121 448,138 323,201" fill="#547a89" stroke="#b7cccf"/>
        <path d="M190 137 L280 93 L409 126 L319 169 Z" fill="#254f54" stroke="#719798"/>
        <path d="M225 131 L283 103 M239 135 L297 107 M253 139 L311 111 M267 143 L325 115" stroke="#bca477" stroke-width="3"/>
        <polygon points="290,128 322,112 358,121 326,138" fill="#0b1b23" stroke="#9db0b4"/>
        <circle cx="355" cy="144" r="3" fill="#efae83"/>
        <path d="M289 101 Q290 37 341 81" fill="none" stroke="#e48e64" stroke-width="3"/>
        <path d="M297 105 Q323 52 355 99" fill="none" stroke="#74bfd1" stroke-width="3"/>
        <g class="robot-leg" data-drawn-leg="rl"></g><g class="robot-leg" data-drawn-leg="rr"></g>
        <path d="M407 65 L435 51 M427 49 L435 51 L432 59" fill="none" stroke="#b9d0d7" stroke-width="1.5"/>
        <text x="441" y="51" class="robot-label">FRONT</text>
        <path d="M92 102 H177" stroke="#edaa81" stroke-width="1" stroke-dasharray="4 4"/>
        <text x="38" y="91" class="robot-label">BODY LEVEL</text>
        <text x="300" y="386" text-anchor="middle" class="robot-label">MOVE THE BOARD. WATCH THE LEGS.</text>
      </svg>
      <div class="tilt-leg-states">${Object.entries(legs).map(([key, leg]) => `<div data-leg="${key}"><span>${leg.name}</span><strong data-motion>Same length</strong><small data-correction>0.0°</small></div>`).join('')}</div>
    </div>
    <div class="tilt-controls">
      <span class="tilt-step">TRY IT</span>
      <h3>Tilt the board.</h3>
      <p>The raised side needs shorter legs. The lower side needs longer legs. That lets the robot keep its body level.</p>
      <div class="tilt-presets" aria-label="Choose how to tilt the board">
        <button type="button" data-preset="-14,0">Front up <span aria-hidden="true">↗</span></button>
        <button type="button" data-preset="0,14">Right side up <span aria-hidden="true">↗</span></button>
        <button type="button" data-preset="-20,20">Front-right corner up <span aria-hidden="true">↗</span></button>
        <button type="button" data-preset="0,0">Back to level <span aria-hidden="true">↺</span></button>
      </div>
      <p class="tilt-explanation" data-explanation role="status">The board is level. All four legs hold the starting stance.</p>
      <div class="tilt-sliders">
        <label>Front / back <output data-pitch-output>Level</output><input type="range" min="-20" max="20" step="1" value="0" data-pitch aria-label="Raise the front or rear of the board"><span class="tilt-endpoints"><span>Front up</span><span>Rear up</span></span></label>
        <label>Left / right <output data-roll-output>Level</output><input type="range" min="-20" max="20" step="1" value="0" data-roll aria-label="Raise the left or right of the board"><span class="tilt-endpoints"><span>Left up</span><span>Right up</span></span></label>
      </div>
      <details class="tilt-details"><summary>How this relates to the real controller</summary><p>The illustration uses the four-leg mixing equations from my v3 controller. The drawing is simplified; slider position does not represent a measured board angle.</p><p data-scale>Corrections stay within ±20° of the base stance.</p><p>The live math below shows the requested corrections and nominal joint commands, before per-servo calibration offsets.</p></details>
    </div>
    <section class="tilt-math" aria-labelledby="math-title-${index}">
      <div class="math-heading"><div><span class="tilt-step">LIVE MATH</span><h3 id="math-title-${index}">Follow one leg.</h3><p>Change the board above; the calculation updates here.</p></div><div class="math-inputs"><div><span>Pitch / P</span><strong data-math-pitch>0.0°</strong></div><div><span>Roll / R</span><strong data-math-roll>0.0°</strong></div></div></div>
      <div class="math-summary"><label>Leg to follow<select data-follow-leg aria-label="Leg to follow">${Object.entries(legs).map(([key,leg])=>`<option value="${key}">${leg.name}</option>`).join('')}</select></label><div><span>Mix pitch and roll</span><code data-summary-equation>0 − 0 = 0°</code></div><div><span>Correction after scaling</span><strong data-summary-correction>0.0°</strong><small data-summary-motion>Starting stance</small></div><div><span>Nominal joints</span><code data-summary-joints>Thigh 115° · Knee 65°</code></div></div>
      <details class="math-expanded"><summary>Show all four leg equations and travel limits</summary>
      <div class="math-scaling"><span class="math-step-number" aria-hidden="true">s</span><div><h4>A shared factor keeps the corrections within the leg travel.</h4><p>Find the largest of the four requests below. If its magnitude exceeds 20°, reduce all four by the same factor. At zero input, use s = 1.</p><code>s = min(1, 20° / largest correction)</code></div><div class="math-scale-result"><span data-math-scale-calculation>No scaling needed</span><strong data-math-scale>1.00×</strong></div></div>
      <div class="math-step-heading"><span class="math-step-number" aria-hidden="true">±</span><div><h4>Each leg mixes the two commands with different signs.</h4><p>Positive correction shortens a leg; negative correction lengthens it.</p></div></div>
      <div class="math-legs">${Object.entries(legs).map(([key, leg]) => `<article data-math-leg="${key}"><h5>${leg.name}</h5><code class="math-symbolic">${({ fl: '−P − R', fr: '−P + R', rl: '+P − R', rr: '+P + R' })[key]}</code><p class="math-substitution" data-substitution>0 − 0 = 0°</p><div class="math-final"><span>After scaling</span><code data-scaled-formula>0° × 1.00</code><strong data-final-correction>0.0°</strong></div><p class="math-movement" data-math-motion>Starting stance</p><div class="math-compression"><span>Base stance + correction</span><code data-compression>25° + 0° = 25°</code></div><dl class="math-joints"><div><dt>Thigh</dt><dd data-thigh>115.0°</dd></div><div><dt>Knee</dt><dd data-knee>65.0°</dd></div></dl></article>`).join('')}</div>
      <p class="math-note">Displayed values are rounded. The 25° base value is a joint-compression parameter, not leg height. Joint commands are shown before per-servo calibration offsets; this illustrates the mixing logic rather than full robot dynamics or measured motion.</p></details>
      <p class="math-note">Joint commands before calibration offsets; simplified controller illustration. Expand the equations for scaling and base-stance details.</p>
    </section>`;

  const pitchInput = mixer.querySelector('[data-pitch]');
  const rollInput = mixer.querySelector('[data-roll]');
  const signed = number => `${number > 0 ? '+' : number < 0 ? '−' : ''}${Math.abs(number).toFixed(1)}°`;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let drawnCorrections = { fl: 0, fr: 0, rl: 0, rr: 0 };
  let frame;
  const drawRobot = corrections => {
    const feet = {};
    for (const [key, correction] of Object.entries(corrections)) {
      const { x, y, side } = legs[key];
      const foot = { x: x + side * 38, y: y + 140 - correction * 1.8 };
      feet[key] = foot;
      const knee = { x: x + side * 54, y: (y + foot.y) / 2 + 4 };
      const color = correction > .05 ? '#efaa81' : correction < -.05 ? '#82c8dc' : '#becdd1';
      mixer.querySelector(`[data-drawn-leg="${key}"]`).innerHTML = `<path d="M${x} ${y + 9} L${knee.x} ${knee.y} L${foot.x} ${foot.y}" fill="none" stroke="#07171f" stroke-width="20" stroke-linejoin="round"/><path d="M${x} ${y + 9} L${knee.x} ${knee.y} L${foot.x} ${foot.y}" fill="none" stroke="${color}" stroke-width="12" stroke-linejoin="round"/>${joint(x, y + 9, 9, 'hip-joint')}${joint(knee.x, knee.y, 9, 'knee-joint')}<ellipse cx="${foot.x}" cy="${foot.y}" rx="14" ry="6" fill="#0b1c24" stroke="${color}" stroke-width="2"/>`;
    }
    const cornerPoints = ['fl', 'fr', 'rr', 'rl'].map(k => `${feet[k].x},${feet[k].y + 4}`).join(' ');
    mixer.querySelector('[data-board]').setAttribute('points', cornerPoints);
    mixer.querySelector('[data-board-grid]').setAttribute('points', cornerPoints);
    mixer.querySelector('[data-board-shadow]').setAttribute('points', ['fl', 'fr', 'rr', 'rl'].map(k => `${feet[k].x},${feet[k].y + 14}`).join(' '));
  };
  const animateRobot = corrections => {
    cancelAnimationFrame(frame);
    if (reduceMotion.matches) {
      drawnCorrections = { ...corrections };
      drawRobot(corrections);
      return;
    }
    const start = { ...drawnCorrections };
    const startTime = performance.now();
    const tick = now => {
      const progress = Math.min(1, (now - startTime) / 360);
      const eased = 1 - Math.pow(1 - progress, 3);
      drawnCorrections = Object.fromEntries(Object.keys(start).map(k => [k, start[k] + (corrections[k] - start[k]) * eased]));
      drawRobot(drawnCorrections);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
  };
  const update = (announce = false) => {
    const pitch = Number(pitchInput.value);
    const roll = Number(rollInput.value);
    const { corrections, scale } = mixLegCorrections(pitch, roll);
    const raw = { fl: -pitch - roll, fr: -pitch + roll, rl: pitch - roll, rr: pitch + roll };
    const peak = Math.max(...Object.values(raw).map(Math.abs));
    const operand = number => `(${number < 0 ? '−' : '+'}${Math.abs(number).toFixed(0)})`;
    const expressions = {
      fl: `−${operand(pitch)} − ${operand(roll)}`,
      fr: `−${operand(pitch)} + ${operand(roll)}`,
      rl: `${operand(pitch)} − ${operand(roll)}`,
      rr: `${operand(pitch)} + ${operand(roll)}`
    };
    mixer.querySelector('[data-math-pitch]').textContent = signed(pitch);
    mixer.querySelector('[data-math-roll]').textContent = signed(roll);
    mixer.querySelector('[data-math-scale]').textContent = `${scale.toFixed(2)}×`;
    mixer.querySelector('[data-math-scale-calculation]').textContent = peak > 20 ? `20° ÷ ${peak.toFixed(0)}° = ${scale.toFixed(2)}` : `Largest request: ${peak.toFixed(0)}° ≤ 20°`;
    for (const [key, correction] of Object.entries(corrections)) {
      const mathLeg = mixer.querySelector(`[data-math-leg="${key}"]`);
      const compression = 25 + correction;
      const right = key === 'fr' || key === 'rr';
      mathLeg.dataset.direction = correction > .05 ? 'compress' : correction < -.05 ? 'extend' : 'neutral';
      mathLeg.querySelector('[data-substitution]').textContent = `${expressions[key]} = ${signed(raw[key])}`;
      mathLeg.querySelector('[data-final-correction]').textContent = signed(correction);
      mathLeg.querySelector('[data-scaled-formula]').textContent = `${signed(raw[key])} × ${scale.toFixed(2)}`;
      mathLeg.querySelector('[data-math-motion]').textContent = correction > .05 ? 'Shorter leg' : correction < -.05 ? 'Longer leg' : 'Starting stance';
      mathLeg.querySelector('[data-compression]').textContent = `25° ${correction < 0 ? '−' : '+'} ${Math.abs(correction).toFixed(1)}° = ${compression.toFixed(1)}°`;
      mathLeg.querySelector('[data-thigh]').textContent = `${(90 + (right ? -compression : compression)).toFixed(1)}°`;
      mathLeg.querySelector('[data-knee]').textContent = `${(90 + (right ? compression : -compression)).toFixed(1)}°`;
    }
    const selected = mixer.querySelector('[data-follow-leg]').value;
    const selectedCorrection = corrections[selected];
    const selectedCompression = 25 + selectedCorrection;
    const selectedRight = selected === 'fr' || selected === 'rr';
    mixer.querySelector('[data-summary-equation]').textContent = `${expressions[selected]} = ${signed(raw[selected])}`;
    mixer.querySelector('[data-summary-correction]').textContent = signed(selectedCorrection);
    mixer.querySelector('[data-summary-motion]').textContent = selectedCorrection > 0 ? 'Shorter leg' : selectedCorrection < 0 ? 'Longer leg' : 'Starting stance';
    mixer.querySelector('[data-summary-joints]').textContent = `Thigh ${(90 + (selectedRight ? -selectedCompression : selectedCompression)).toFixed(1)}° · Knee ${(90 + (selectedRight ? selectedCompression : -selectedCompression)).toFixed(1)}°`;
    mixer.querySelectorAll('[data-leg]').forEach(leg => leg.classList.toggle('is-followed', leg.dataset.leg === selected));
    mixer.querySelector('[data-pitch-output]').textContent = pitch < 0 ? 'Front raised' : pitch > 0 ? 'Rear raised' : 'Level';
    mixer.querySelector('[data-roll-output]').textContent = roll > 0 ? 'Right raised' : roll < 0 ? 'Left raised' : 'Level';
    for (const [key, correction] of Object.entries(corrections)) {
      const element = mixer.querySelector(`[data-leg="${key}"]`);
      element.querySelector('[data-correction]').textContent = signed(correction);
      element.querySelector('[data-motion]').textContent = correction > .05 ? 'Shorter ↓' : correction < -.05 ? 'Longer ↑' : 'Same length';
      element.dataset.direction = correction > .05 ? 'compress' : correction < -.05 ? 'extend' : 'neutral';
    }
    animateRobot(corrections);
    mixer.querySelector('[data-scale]').textContent = scale < 1 ? `The requested corrections exceed the leg travel, so all four are reduced to ${(scale * 100).toFixed(0)}% together.` : 'Corrections stay within ±20° of the base stance.';
    mixer.querySelectorAll('[data-preset]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.preset === `${pitch},${roll}`)));
    if (announce) {
      const shortened = Object.keys(corrections).filter(k => corrections[k] > .05).map(k => legs[k].name.toLowerCase());
      const lengthened = Object.keys(corrections).filter(k => corrections[k] < -.05).map(k => legs[k].name.toLowerCase());
      mixer.querySelector('[data-explanation]').textContent = !pitch && !roll ? 'The board is level. All four legs hold the starting stance.' : `The ${shortened.join(' and ')} ${shortened.length > 1 ? 'legs shorten' : 'leg shortens'}, while the ${lengthened.join(' and ')} ${lengthened.length > 1 ? 'legs extend' : 'leg extends'}.`;
    }
  };
  [pitchInput, rollInput].forEach(input => {
    input.addEventListener('input', () => update());
    input.addEventListener('change', () => update(true));
  });
  mixer.querySelector('[data-follow-leg]').addEventListener('change', () => update());
  mixer.querySelectorAll('[data-preset]').forEach(button => button.addEventListener('click', () => {
    [pitchInput.value, rollInput.value] = button.dataset.preset.split(',');
    update(true);
  }));
  update();
});

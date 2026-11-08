// Mirrors mixCorrections() from SpotMicro's hardware-tested v3 controller.
export function mixLegCorrections(pitch, roll) {
  const raw = { fl: -pitch - roll, fr: -pitch + roll, rl: pitch - roll, rr: pitch + roll };
  const peak = Math.max(...Object.values(raw).map(Math.abs));
  const scale = peak > 20 ? 20 / peak : 1;
  return { scale, corrections: Object.fromEntries(Object.entries(raw).map(([leg, value]) => [leg, value * scale])) };
}

const legs = {
  fl: { name: 'Front left', x: 328, y: 85, side: -1 },
  fr: { name: 'Front right', x: 434, y: 118, side: 1 },
  rl: { name: 'Rear left', x: 142, y: 185, side: -1 },
  rr: { name: 'Rear right', x: 248, y: 218, side: 1 }
};

document.querySelectorAll('[data-leg-mixer]').forEach((mixer, index) => {
  const svgId = `robot-illustration-${index}`;
  mixer.innerHTML = `
    <div class="tilt-visual">
      <div class="tilt-visual-heading"><span>SpotMicro / Balance controller</span><span>Interactive illustration</span></div>
      <svg viewBox="0 0 600 440" role="img" aria-labelledby="${svgId}" class="tilt-robot">
        <title id="${svgId}">Illustrated SpotMicro with an elongated open white frame, blue lower legs, exposed servos, and electronics. Its legs respond to a tilting board.</title>
        <defs><pattern id="board-grid-${index}" width="24" height="24" patternUnits="userSpaceOnUse" patternTransform="rotate(15)"><path d="M 24 0 L 0 0 0 24" fill="none" stroke="#7e9aa2" stroke-width=".6" opacity=".35"/></pattern></defs>
        <ellipse cx="280" cy="395" rx="225" ry="20" fill="#06151b" opacity=".5"/>
        <polygon data-board-shadow fill="#213b45" stroke="#78909a" stroke-width="1"/>
        <polygon data-board fill="#36515c" stroke="#a0b6be" stroke-width="1.5"/>
        <polygon data-board-grid fill="url(#board-grid-${index})"/>
        <g class="robot-leg" data-drawn-leg="fl"></g><g class="robot-leg" data-drawn-leg="rl"></g>
        <g class="spotmicro-frame">
          <path d="M142 185L328 85L434 118L248 218Z" fill="#1a3038" stroke="#b6bdbb"/>
          <path d="M142 185L248 218L248 237L142 204Z" fill="#aaaead" stroke="#d5d7ce"/>
          <path d="M248 218L434 118L434 137L248 237Z" fill="#a4afaf" stroke="#dbdfd8"/>
          <path d="M142 185L328 85L339 90L153 191ZM237 214L423 113L434 118L248 218Z" fill="#eeeae0" stroke="#b7c1be"/>
          <path d="M215 146L225 141L329 174L320 180ZM289 106L299 101L405 134L395 139Z" fill="#dfdfd4" stroke="#9daaa9"/>
          <path d="M328 85L350 70Q406 77 454 103L434 118Z" fill="#2864a2" stroke="#5484b1"/>
          <path d="M350 70Q394 87 454 103M340 78L442 111" fill="none" stroke="#6b9ac5" stroke-width="1.5"/>
          <path d="M144 178L173 163L278 195L249 211Z" fill="#424b50" stroke="#869390"/>
          <path d="M309 94L328 84L434 116L415 127Z" fill="#424b50" stroke="#869390"/>
          <path d="M154 180L247 208M161 176L255 203M169 172L263 199M315 96L416 125M321 92L423 121" stroke="#737b7c" opacity=".45"/>
          <path d="M244 156L278 138L314 150L280 168Z" fill="#205251" stroke="#9aa6a0"/>
          <path d="M257 153L271 146L284 150L270 157Z" fill="#111d25"/>
          <path d="M282 160L316 141L316 162L282 182Z" fill="#285a84" stroke="#8cabae"/>
          <path d="M286 160L313 146M287 166L313 152M288 172L313 158" stroke="#d1ab65" stroke-width="2" stroke-dasharray="1 4"/>
          <path d="M185 178Q221 148 259 153Q288 127 324 129L368 122M189 183Q225 154 263 159Q292 133 328 135L370 128" fill="none" stroke="#17252a" stroke-width="4"/>
          <path d="M185 176Q223 143 260 150Q288 120 323 127L368 121" fill="none" stroke="#b85b52" stroke-width="2.5"/>
          <path d="M207 186Q233 159 279 164Q312 139 337 144" fill="none" stroke="#b9b5a1" stroke-width="2"/>
          <path d="M286 158Q273 119 303 117Q328 118 323 139" fill="none" stroke="#538ca3" stroke-width="2"/>
          <path d="M248 218L248 237M434 118L434 137" stroke="#eef0e5" stroke-width="3"/>
          <g fill="#3f4d51">${[[155,198],[237,223],[283,202],[334,175],[386,147],[426,129]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.4"/>`).join('')}</g>
        </g>
        <g class="robot-leg" data-drawn-leg="fr"></g><g class="robot-leg" data-drawn-leg="rr"></g>
        <path d="M444 76L466 64M458 64L466 64L463 72" fill="none" stroke="#b9d0d7" stroke-width="1.5"/>
        <text x="473" y="65" class="robot-label">FRONT</text>
        <path d="M51 134H146" stroke="#edaa81" stroke-width="1" stroke-dasharray="4 4"/>
        <text x="43" y="123" class="robot-label">BODY LEVEL</text>
        <text x="300" y="430" text-anchor="middle" class="robot-label">MOVE THE BOARD. WATCH THE LEGS.</text>
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
      mixer.querySelector(`[data-drawn-leg="${key}"]`).innerHTML = `<g transform="translate(${x} ${y+9})"><rect x="-15" y="-12" width="30" height="29" rx="3" fill="#1e292f" stroke="#7b8b91"/><path d="M-18-9H-11V12H-18ZM11-9H18V12H11Z" fill="#dcded4" stroke="#aab6b2"/><circle r="9" fill="#e7e6db" stroke="#9ca8a6"/><circle r="3" fill="#3e4a4f"/></g><path d="M${x} ${y+16}L${knee.x} ${knee.y}" fill="none" stroke="#12242d" stroke-width="27" stroke-linecap="round"/><path d="M${x} ${y+16}L${knee.x} ${knee.y}" fill="none" stroke="#e2e2d6" stroke-width="22" stroke-linecap="round"/><path d="M${x-side*4} ${y+19}L${knee.x-side*4} ${knee.y-3}" fill="none" stroke="#b2bcb6" stroke-width="3" stroke-linecap="round"/><path d="M${knee.x} ${knee.y}L${foot.x} ${foot.y-4}" fill="none" stroke="#13293e" stroke-width="22" stroke-linecap="round"/><path d="M${knee.x} ${knee.y}L${foot.x} ${foot.y-4}" fill="none" stroke="#2865a7" stroke-width="16" stroke-linecap="round"/><path d="M${knee.x+side*4} ${knee.y+5}L${foot.x+side*4} ${foot.y-7}" fill="none" stroke="#5a91c5" stroke-width="2"/><g transform="translate(${knee.x} ${knee.y})"><rect x="-12" y="-11" width="24" height="24" rx="3" fill="#202b32" stroke="#8a999f"/><rect x="-10" y="-7" width="20" height="5" fill="#2c6eb2"/><circle r="7" fill="#e3e5db" stroke="#a6b3ae"/><circle r="2.5" fill="#334a5a"/></g><ellipse cx="${foot.x}" cy="${foot.y+1}" rx="15" ry="6" fill="#17252b" stroke="#8f9c9d" stroke-width="2" stroke-dasharray="2 2"/><ellipse cx="${foot.x}" cy="${foot.y-2}" rx="11" ry="4" fill="#2865a7" stroke="${color}" stroke-width="1.5"/>`;
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

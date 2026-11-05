// Mirrors mixCorrections() from SpotMicro's hardware-tested v3 controller.
export function mixLegCorrections(pitch, roll) {
  const raw = { fl: -pitch - roll, fr: -pitch + roll, rl: pitch - roll, rr: pitch + roll };
  const peak = Math.max(...Object.values(raw).map(Math.abs));
  const scale = peak > 20 ? 20 / peak : 1;
  return { scale, corrections: Object.fromEntries(Object.entries(raw).map(([leg, value]) => [leg, value * scale])) };
}

document.querySelectorAll('[data-leg-mixer]').forEach((mixer) => {
  const pitchInput = mixer.querySelector('[data-pitch]');
  const rollInput = mixer.querySelector('[data-roll]');
  const signed = (number, precision = 0) => `${number > 0 ? '+' : number < 0 ? '−' : ''}${Math.abs(number).toFixed(precision)}°`;
  const update = () => {
    const pitch = Number(pitchInput.value);
    const roll = Number(rollInput.value);
    const { corrections, scale } = mixLegCorrections(pitch, roll);
    mixer.querySelector('[data-pitch-output]').textContent = signed(pitch);
    mixer.querySelector('[data-roll-output]').textContent = signed(roll);
    for (const [leg, correction] of Object.entries(corrections)) {
      const element = mixer.querySelector(`[data-leg="${leg}"]`);
      element.querySelector('[data-correction]').textContent = signed(correction, 1);
      element.querySelector('[data-motion]').textContent = correction > 0 ? 'Compress' : correction < 0 ? 'Extend' : 'Base stance';
      element.dataset.direction = correction > 0 ? 'compress' : correction < 0 ? 'extend' : 'neutral';
      element.style.setProperty('--correction', `${50 + correction * 2.5}%`);
    }
    mixer.querySelector('[data-scale]').textContent = scale < 1
      ? `All four corrections scaled to ${(scale * 100).toFixed(0)}% to stay within ±20°.`
      : 'Within the ±20° leg limit.';
  };
  [pitchInput, rollInput].forEach(input => input.addEventListener('input', update));
  mixer.querySelectorAll('[data-preset]').forEach(button => button.addEventListener('click', () => {
    [pitchInput.value, rollInput.value] = button.dataset.preset.split(',');
    update();
  }));
  update();
});

// Stylized Spot silhouette, not the project's measured hardware or firmware IK.
// Shape reference: https://dev.bostondynamics.com/docs/concepts/about_spot.html
// Controller corrections are supplied by leg-mixer.js without alteration.
const hips = {
  fl: { x: 411, y: 119, far: true },
  fr: { x: 474, y: 157, far: false },
  rl: { x: 171, y: 165, far: true },
  rr: { x: 234, y: 202, far: false }
};

export function createSpotScene(index) {
  const id = `spot-model-${index}`;
  return `<svg viewBox="0 0 640 460" role="img" aria-labelledby="${id}" class="tilt-robot" data-robot-model="spot-v3">
    <title id="${id}">Spot-style quadruped with a long yellow body, rounded hip housings, bent articulated legs, and rubber feet. The body stays level as the board tilts.</title>
    <defs>
      <pattern id="board-grid-${index}" width="24" height="24" patternUnits="userSpaceOnUse" patternTransform="rotate(15)"><path d="M24 0H0V24" fill="none" stroke="#90a7b1" stroke-width=".6" opacity=".3"/></pattern>
      <linearGradient id="spot-top-${index}" x1="0" y1="0" x2=".2" y2="1"><stop stop-color="#e1c75c"/><stop offset="1" stop-color="#b99b3b"/></linearGradient>
      <linearGradient id="spot-side-${index}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#d0af43"/><stop offset="1" stop-color="#a4872d"/></linearGradient>
      <linearGradient id="spot-thigh-${index}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#e2c762"/><stop offset=".5" stop-color="#c3a343"/><stop offset="1" stop-color="#a98a32"/></linearGradient>
    </defs>
    <ellipse cx="315" cy="430" rx="226" ry="16" fill="#06151b" opacity=".5"/>
    <polygon data-board-shadow fill="#1c3641" stroke="#637f8b" stroke-width="1"/>
    <polygon data-board fill="#304c59" stroke="#8ca7b3" stroke-width="1.2"/>
    <polygon data-board-grid fill="url(#board-grid-${index})"/>
    <g class="robot-leg is-far" data-drawn-leg="fl"></g>
    <g class="robot-leg is-far" data-drawn-leg="rl"></g>
    <g class="spot-body">
      <!-- Dark lower chassis under the rounded, enclosed upper shell. -->
      <path d="M159 125L218 165L468 117L468 163Q461 175 448 178L238 219Q221 220 207 210L163 179Q154 171 154 157Z" fill="#1b2931" stroke="#0a1a23" stroke-width="2"/>
      <path d="M216 151L468 104L469 151Q469 164 456 169L241 210Q226 213 216 203L200 187Z" fill="url(#spot-side-${index})" stroke="#bfa74b" stroke-width="1.2"/>
      <path d="M160 104L397 60Q408 58 421 65L470 97Q482 106 469 114L232 160Q221 162 211 155L158 120Q148 112 160 104Z" fill="url(#spot-top-${index})" stroke="#e2ce79" stroke-width="1.5"/>
      <path d="M170 106L399 65Q410 64 419 70L457 96L227 141Z" fill="#dec76a" opacity=".45"/>
      <path d="M230 161L456 118" fill="none" stroke="#f2db8c" stroke-width="1" opacity=".65"/>
      <!-- Recessed top deck and two payload rails, instead of a circuit board. -->
      <path d="M207 111L383 78L427 106L251 141Z" fill="#313d41" stroke="#8f8c64"/>
      <path d="M217 111L383 81L414 103L250 135Z" fill="#424b4c"/>
      <path d="M220 114L386 83M244 131L410 100" stroke="#202e36" stroke-width="5" stroke-linecap="round"/>
      <path d="M221 112L386 81M244 129L409 98" stroke="#909993" stroke-width="1.2"/>
      <path d="M267 107L287 103L298 110L278 114ZM342 92L362 88L373 95L353 99Z" fill="#7c8580" stroke="#b1b6a6"/>
      <!-- Low nose and dark sensor inset; no raised head or loose wires. -->
      <path d="M423 67L470 97Q481 104 478 118L468 154Q465 164 453 164L412 136L410 88Q410 72 423 67Z" fill="#2a3940" stroke="#5c7076" stroke-width="1.4"/>
      <path d="M428 80L462 102Q469 106 467 115L461 141L423 119L421 95Q420 85 428 80Z" fill="#101f29" stroke="#697c80"/>
      <ellipse cx="433" cy="103" rx="5" ry="7" transform="rotate(-22 433 103)" fill="#36535e" stroke="#71888f"/>
      <ellipse cx="453" cy="116" rx="5" ry="7" transform="rotate(-22 453 116)" fill="#36535e" stroke="#71888f"/>
      <path d="M431 127L453 140" stroke="#16252d" stroke-width="4"/>
      <path d="M170 117L203 140Q215 148 216 160L216 191L190 179Q168 166 166 150Z" fill="#ac8e34" stroke="#ccaf52"/>
      <path d="M260 177L357 158L357 170L260 188Z" fill="#293b41"/>
      <path d="M270 177L270 183M281 175L281 181M292 173L292 179M303 171L303 177M314 169L314 175M325 167L325 173M336 165L336 171M347 163L347 169" stroke="#758a8d" stroke-width="1"/>
      <g fill="#635b37">${[[243,164],[372,140],[251,199],[393,173]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.8"/>`).join('')}</g>
    </g>
    <g class="robot-leg" data-drawn-leg="fr"></g>
    <g class="robot-leg" data-drawn-leg="rr"></g>
    <path d="M480 69L510 53M502 53L510 53L507 61" fill="none" stroke="#b9d0d7" stroke-width="1.4"/>
    <text x="518" y="54" class="robot-label">FRONT</text>
    <path d="M44 190H118" stroke="#edaa81" stroke-width="1" stroke-dasharray="4 4"/>
    <text x="34" y="179" class="robot-label">BODY LEVEL</text>
  </svg>`;
}

export function drawSpotModel(svg, corrections) {
  const feet = {};
  const index = svg.querySelector('linearGradient').id.replace('spot-top-', '');
  for (const [key, hip] of Object.entries(hips)) {
    const correction = corrections[key];
    const foot = { x: hip.x-8, y: hip.y+178-correction*1.8 };
    feet[key] = foot;
    // Screen-space two-link geometry preserves the silhouette during leveling.
    // This is an illustration, not the robot's measured leg geometry or IK.
    const upperLength=107, lowerLength=121;
    const dx=foot.x-hip.x, dy=foot.y-hip.y;
    const reach=Math.hypot(dx,dy);
    const bend=Math.acos(Math.max(-1,Math.min(1,(upperLength**2+reach**2-lowerLength**2)/(2*upperLength*reach))));
    const angle=Math.atan2(dy,dx)+bend;
    const knee={x:hip.x+upperLength*Math.cos(angle),y:hip.y+upperLength*Math.sin(angle)};
    const upperAngle=angle*180/Math.PI;
    const lowerAngle=Math.atan2(foot.y-knee.y,foot.x-knee.x)*180/Math.PI;
    const lowerSize=Math.hypot(foot.x-knee.x,foot.y-knee.y);
    const highlight=correction>.05?'#efaa81':correction<-.05?'#82c8dc':'#8d9b9e';
    const shade=hip.far?.72:1;
    svg.querySelector(`[data-drawn-leg="${key}"]`).innerHTML=`<g opacity="${shade}">
      <g transform="translate(${hip.x} ${hip.y})">
        <ellipse cx="-5" cy="0" rx="20" ry="24" fill="#14252e" stroke="#6b7d80" stroke-width="1.5"/>
        <ellipse rx="14" ry="20" fill="#354951" stroke="#9aa8a6"/>
        <path d="M-6-12L-6 12" stroke="#8d9e9f"/>
      </g>
      <g transform="translate(${hip.x} ${hip.y}) rotate(${upperAngle})">
        <path d="M-10-18Q6-28 24-17L91-12Q113-10 116 3Q117 18 99 20L26 18Q7 24-8 14Z" fill="#182c34" stroke="#0d202b" stroke-width="3"/>
        <path d="M-10-18Q6-28 24-17L91-12Q113-10 116 3Q117 18 99 20L26 18Q7 24-8 14Z" fill="url(#spot-thigh-${index})" stroke="#ddc56a" stroke-width="1"/>
        <path d="M6-13Q16-17 26-10L89-7" fill="none" stroke="#f1d77b" stroke-width="1.4" opacity=".8"/>
        <path d="M29 13L87 14" stroke="#78652e" stroke-width="1.2"/>
        <circle cx="106" cy="3" r="7" fill="#283c44" stroke="#869b9d"/><circle cx="106" cy="3" r="2.2" fill="#bdc8c7"/>
      </g>
      <g transform="translate(${knee.x} ${knee.y}) rotate(${lowerAngle})">
        <path d="M0-9Q15-12 34-8L${lowerSize-14}-5Q${lowerSize+6}-4 ${lowerSize+7} 2Q${lowerSize+6} 10 ${lowerSize-8} 10L29 11Q10 13 0 8Z" fill="#344851" stroke="#849a9f" stroke-width="1.2"/>
        <path d="M16-4L${lowerSize-15} 0L25 6Z" fill="#132932" stroke="#6d858e" stroke-width=".7"/>
        <path d="M30-2L42 7M54-1L66 7M78 0L89 7" stroke="#6f8790" stroke-width="1"/>
        <circle r="10" fill="#20343d" stroke="#93a5a5" stroke-width="1.5"/><circle r="4" fill="#697e85"/>
      </g>
      <g transform="translate(${foot.x} ${foot.y})">
        <rect x="-9" y="-11" width="18" height="13" rx="6" fill="#18262c" stroke="${highlight}" stroke-width="1.4"/>
        <path d="M-6-7H6M-5-3H5" stroke="#56666a" stroke-width="1"/><ellipse cy="1" rx="7" ry="2.5" fill="#101c22"/>
      </g>
    </g>`;
  }
  const keys=['fl','fr','rr','rl'];
  const points=keys.map(key=>`${feet[key].x},${feet[key].y+3}`).join(' ');
  svg.querySelector('[data-board]').setAttribute('points',points);
  svg.querySelector('[data-board-grid]').setAttribute('points',points);
  svg.querySelector('[data-board-shadow]').setAttribute('points',keys.map(key=>`${feet[key].x},${feet[key].y+13}`).join(' '));
}

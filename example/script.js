const slider = document.querySelector('.slider');
const numTicks = 11;
for (let i = 0; i < numTicks; i++) {
  const tick = document.createElement('div');
  tick.className = 'tick';
  tick.style.top = `${(i / (numTicks - 1)) * 100}%`;
  tick.style.transform = 'translateY(-0.5px)'; // align to center
  slider.appendChild(tick);
}
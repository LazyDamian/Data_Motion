import gsap from 'gsap';

export function initMythbuster() {
  const slider = document.getElementById('myth-slider');
  const value  = document.getElementById('myth-value');
  const btn    = document.getElementById('myth-reveal');
  const result = document.getElementById('myth-result');
  const fill   = document.getElementById('myth-fill');
  const thumb  = document.getElementById('myth-thumb');
  const guessMark = document.getElementById('myth-guess-mark');
  if (!slider) return;

  let revealed = false;

  function update() {
    const v = Number(slider.value);
    value.textContent = `${v}%`;
    fill.style.width = `${v}%`;
    thumb.style.left = `${v}%`;
    guessMark.style.left = `${v}%`;
  }
  slider.addEventListener('input', () => {
    if (revealed) return;
    update();
  });
  update();

  btn.addEventListener('click', () => {
    if (revealed) {
      /* zurücksetzen */
      revealed = false;
      slider.disabled = false;
      btn.textContent = 'Aufdecken';
      result.style.display = 'none';
      guessMark.classList.remove('locked');
      thumb.classList.remove('locked');
      fill.classList.remove('truth');
      update();
      return;
    }

    revealed = true;
    slider.disabled = true;
    btn.textContent = 'Zurücksetzen';
    guessMark.classList.add('locked');
    thumb.classList.add('locked');

    /* Die Forschung fand keinen belastbaren ursächlichen Zusammenhang:
       der Balken sinkt sinnbildlich gegen null */
    fill.classList.add('truth');
    const obj = { v: Number(slider.value) };
    gsap.to(obj, {
      v: 4,
      duration: 1.4,
      ease: 'power3.inOut',
      onUpdate() {
        fill.style.width  = `${obj.v}%`;
        thumb.style.left  = `${obj.v}%`;
        value.textContent = `${Math.round(obj.v)}%`;
      },
    });

    result.style.display = 'block';
    gsap.fromTo(result, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.6, ease: 'power2.out' });
  });
}
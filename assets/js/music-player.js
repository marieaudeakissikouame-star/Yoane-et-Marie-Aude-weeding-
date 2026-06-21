// Player for wedding background music
// Autoplay attempt with muted fallback, plus Play/Pause and Unmute buttons
document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('bg-music');
  const btn = document.getElementById('music-toggle');
  const unmuteBtn = document.getElementById('unmute');

  if (!audio || !btn || !unmuteBtn) return;

  // Attempt autoplay on load
  window.addEventListener('load', async () => {
    try {
      await audio.play();
      btn.textContent = '⏸️ Pause';
    } catch (err) {
      // Autoplay blocked -> try to play muted and show unmute button
      try {
        audio.muted = true;
        await audio.play();
        unmuteBtn.style.display = 'inline-block';
        btn.textContent = '▶️ Lecture (muette)';
      } catch (err2) {
        btn.textContent = '▶️ Lecture';
      }
    }
  });

  // Play / Pause toggle
  btn.addEventListener('click', async () => {
    if (audio.paused) {
      try {
        await audio.play();
        btn.textContent = '⏸️ Pause';
      } catch (err) {
        console.log('Lecture bloquée :', err);
      }
    } else {
      audio.pause();
      btn.textContent = '▶️ Lecture';
    }
  });

  // Unmute (user interaction required)
  unmuteBtn.addEventListener('click', () => {
    audio.muted = false;
    unmuteBtn.style.display = 'none';
    btn.textContent = audio.paused ? '▶️ Lecture' : '⏸️ Pause';
  });
});

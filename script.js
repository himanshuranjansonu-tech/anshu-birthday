const $ = (selector) => document.querySelector(selector);
const scenes = [...document.querySelectorAll('.scene')];
const song = $('#song');
const photos = ['memory-01.JPG','memory-02.JPG','memory-03.JPG','memory-04.jpg','memory-05.jpg','memory-06.jpg','memory-07.jpg','memory-08.jpg','memory-09.jpg','memory-10.jpg','memory-11.jpg','memory-12.JPG'];

function showScene(id) {
  scenes.forEach((scene) => scene.classList.toggle('active', scene.id === id));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function burst(x, y, amount = 42) {
  const colors = ['#ffcb62', '#ff719f', '#bfa3ff', '#8ce4d1', '#fff1f5'];
  for (let i = 0; i < amount; i++) {
    const piece = document.createElement('i'); piece.className = 'burst';
    piece.style.cssText = `--x:${x}px;--y:${y}px;--dx:${(Math.random() - .5) * 380}px;--dy:${(Math.random() - .5) * 370}px;--c:${colors[i % colors.length]}`;
    $('#confetti').append(piece); setTimeout(() => piece.remove(), 1000);
  }
}

$('#candle-button').addEventListener('click', () => {
  const candle = $('#candle-button'); if (candle.classList.contains('blown')) return;
  candle.classList.add('blown'); $('#candle-hint').textContent = 'Your wish is on its way…';
  song.play().catch(() => {}); // User tap permits audio playback.
  burst(innerWidth / 2, innerHeight * .55, 60);
  setTimeout(() => $('#birthday-reveal').classList.add('show'), 650);
});
document.querySelectorAll('[data-go]').forEach((button) => button.addEventListener('click', () => showScene(button.dataset.go)));

let word = 0;
document.querySelectorAll('.balloon').forEach((balloon) => balloon.addEventListener('click', () => {
  const position = Number(balloon.dataset.word);
  if (position !== word) { $('#balloon-hint').textContent = `First, tap balloon ${word + 1} ♡`; return; }
  balloon.classList.add('popped');
  $('#phrase').children[word].classList.add('revealed');
  const rect = balloon.getBoundingClientRect(); burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 22);
  word += 1;
  $('#balloon-hint').textContent = word < 4 ? `Beautiful — now balloon ${word + 1}` : 'YOU ARE MY LIFE ♡';
  if (word === 4) setTimeout(() => showScene('letter'), 1300);
}));

let photo = 0;
function renderMemory() {
  const file = photos[photo], image = $('#memory-image');
  image.style.animation = 'none'; image.offsetHeight; image.style.animation = '';
  image.src = `assets/${file}`; image.alt = `Memory ${photo + 1} of ${photos.length}`;
  $('#memory-count').textContent = `${photo + 1} / ${photos.length}`; $('#progress-bar').style.width = `${(photo + 1) / photos.length * 100}%`;
  $('#memory-caption').textContent = photo === photos.length - 1 ? 'Our last little memory — and the beginning of so many more. ♡' : `Memory ${photo + 1} — tap the photo when you are ready.`;
}
$('#memory-next').addEventListener('click', () => { if (photo < photos.length - 1) { photo += 1; renderMemory(); } else { showScene('final'); burst(innerWidth / 2, innerHeight * .45, 70); } });
renderMemory();

$('#envelope').addEventListener('click', () => {
  const envelope = $('#envelope'); if (envelope.classList.contains('open')) return;
  envelope.classList.add('open'); $('#envelope-hint').textContent = 'A little piece of my heart…';
  setTimeout(() => $('#letter-paper').classList.add('show'), 650);
});
$('#memories-button').addEventListener('click', () => showScene('memories'));
$('#replay').addEventListener('click', () => { word = 0; photo = 0; document.querySelectorAll('.balloon').forEach((b) => b.classList.remove('popped')); document.querySelectorAll('#phrase span').forEach((s) => s.classList.remove('revealed')); $('#balloon-hint').textContent = 'Start with balloon 1'; renderMemory(); showScene('cake'); });

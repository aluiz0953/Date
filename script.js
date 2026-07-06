// ===== Step Navigation =====
function go(step) {
  document.querySelectorAll('.step').forEach(function (s) {
    s.classList.remove('active');
  });
  document.getElementById('s' + step).classList.add('active');
}

// ===== DOM References =====
var noWrap = document.getElementById('no-wrap');
var step2 = document.getElementById('s2');
var nx = 0;
var ny = 0;

// ===== "Sim" checkbox → go to Step 3 =====
document.getElementById('yes').addEventListener('change', function () {
  if (this.checked) go(3);
});

// ===== Block "Não" checkbox from being checked =====
document.getElementById('no').addEventListener('click', function (e) {
  e.preventDefault();
  e.stopPropagation();
  return false;
});

document.getElementById('no-label').addEventListener('click', function (e) {
  e.preventDefault();
  e.stopPropagation();
  return false;
});

document.getElementById('no-label').addEventListener('mousedown', function (e) {
  e.preventDefault();
});

// ===== "Não" Flee — teleport to random position (mobile) =====
function flee() {
  var vw = window.innerWidth;
  var vh = window.innerHeight;
  nx = (Math.random() - 0.5) * vw * 0.6;
  ny = (Math.random() - 0.5) * vh * 0.4;
  noWrap.style.transform = 'translate(' + nx + 'px,' + ny + 'px)';
}

// Mobile: teleport on tap
noWrap.addEventListener('touchstart', function (e) {
  e.preventDefault();
  flee();
}, { passive: false });

noWrap.addEventListener('touchend', function (e) {
  e.preventDefault();
}, { passive: false });

// ===== "Não" Escape — push away from cursor (desktop) =====
step2.addEventListener('mousemove', function (e) {
  var r = noWrap.getBoundingClientRect();
  var cx = r.left + r.width / 2;
  var cy = r.top + r.height / 2;
  var dx = e.clientX - cx;
  var dy = e.clientY - cy;
  var dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < 130) {
    var angle = Math.atan2(dy, dx);
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    nx += -Math.cos(angle) * 90;
    ny += -Math.sin(angle) * 90;
    nx = Math.max(-vw / 3, Math.min(vw / 3, nx));
    ny = Math.max(-vh / 3, Math.min(vh / 3, ny));
    noWrap.style.transform = 'translate(' + nx + 'px,' + ny + 'px)';
  }
});

// Mobile: push away on drag near
step2.addEventListener('touchmove', function (e) {
  var t = e.touches[0];
  var r = noWrap.getBoundingClientRect();
  var cx = r.left + r.width / 2;
  var cy = r.top + r.height / 2;
  var dx = t.clientX - cx;
  var dy = t.clientY - cy;
  var dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < 160) {
    e.preventDefault();
    var angle = Math.atan2(dy, dx);
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    nx += -Math.cos(angle) * 100;
    ny += -Math.sin(angle) * 100;
    nx = Math.max(-vw / 3, Math.min(vw / 3, nx));
    ny = Math.max(-vh / 3, Math.min(vh / 3, ny));
    noWrap.style.transform = 'translate(' + nx + 'px,' + ny + 'px)';
  }
}, { passive: false });

// ===== Form Submission via Fetch =====
document.getElementById('fm').addEventListener('submit', async function (e) {
  e.preventDefault();
  var form = this;
  var data = new FormData(form);
  var btn = form.querySelector('button');

  btn.disabled = true;
  btn.textContent = 'Enviando…';

  try {
    var response = await fetch('https://formspree.io/f/mjgqzgjz', {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      form.style.display = 'none';
      document.getElementById('ok').style.display = 'block';
    } else {
      alert('Erro ao enviar. Tente novamente.');
      btn.disabled = false;
      btn.textContent = 'Confirmar Encontro 💖';
    }
  } catch (err) {
    alert('Erro de conexão. Verifique sua internet.');
    btn.disabled = false;
    btn.textContent = 'Confirmar Encontro 💖';
  }
});

// ===== Floating Hearts Background =====
var heartsContainer = document.getElementById('hearts');
var heartEmojis = ['❤', '💕', '💖', '✨', '💗'];

for (var i = 0; i < 18; i++) {
  var h = document.createElement('div');
  h.className = 'heart';
  h.textContent = heartEmojis[i % heartEmojis.length];
  h.style.left = Math.random() * 100 + '%';
  h.style.animationDuration = (7 + Math.random() * 10) + 's';
  h.style.animationDelay = Math.random() * 6 + 's';
  h.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
  heartsContainer.appendChild(h);
}

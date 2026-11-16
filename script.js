const $ = (id) => document.getElementById(id);
const pad = (n) => String(n).padStart(2, "0");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- Tên & chữ ----------
$("names").innerHTML = `${esc(LOVE.name1)} <span class="amp">❤️</span> ${esc(LOVE.name2)}`;
$("tagline").textContent = LOVE.tagline;
$("reasonsTitle").textContent = LOVE.reasonsTitle;
$("letterTitle").textContent = LOVE.letter.title;
$("footer").textContent = LOVE.footer;
document.title = `${LOVE.name1} & ${LOVE.name2} 💕`;

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// ---------- Bộ đếm ngày yêu ----------
const start = new Date(LOVE.startDate);

function diffYMD(a, b) {
  let y = b.getFullYear() - a.getFullYear();
  let m = b.getMonth() - a.getMonth();
  let d = b.getDate() - a.getDate();
  if (d < 0) { m--; d += new Date(b.getFullYear(), b.getMonth(), 0).getDate(); }
  if (m < 0) { y--; m += 12; }
  return { y, m, d };
}

function tick() {
  const now = new Date();
  const ms = Math.max(0, now - start);
  $("totalDays").textContent = Math.floor(ms / 86400000).toLocaleString("vi-VN");
  $("hh").textContent = pad(Math.floor(ms / 3600000) % 24);
  $("mm").textContent = pad(Math.floor(ms / 60000) % 60);
  $("ss").textContent = pad(Math.floor(ms / 1000) % 60);

  if (now >= start) {
    const { y, m, d } = diffYMD(start, now);
    const parts = [];
    if (y) parts.push(`${y} năm`);
    if (m) parts.push(`${m} tháng`);
    parts.push(`${d} ngày`);
    $("ymd").textContent = parts.join(" ");
  } else {
    $("ymd").textContent = "Chưa tới ngày bắt đầu 😄";
  }
}

function nextAnniversary() {
  const now = new Date();
  let next = new Date(now.getFullYear(), start.getMonth(), start.getDate(), 23, 59, 59);
  if (next < now) next = new Date(now.getFullYear() + 1, start.getMonth(), start.getDate(), 23, 59, 59);
  const years = next.getFullYear() - start.getFullYear();
  const daysLeft = Math.ceil((next - now) / 86400000);
  const isToday =
    now.getDate() === start.getDate() && now.getMonth() === start.getMonth() && years > 0;
  $("nextAnniv").textContent = isToday
    ? `🎉 Hôm nay là kỷ niệm ${years} năm của mình! 🎉`
    : `Còn ${daysLeft} ngày nữa là kỷ niệm ${years} năm 💞`;
}

tick();
nextAnniversary();
setInterval(tick, 1000);

// ---------- Timeline ----------
function fmtDate(s) {
  const d = new Date(s);
  return isNaN(d) ? s : d.toLocaleDateString("vi-VN", { day: "numeric", month: "long", year: "numeric" });
}

LOVE.milestones.forEach((m) => {
  const item = document.createElement("div");
  item.className = "t-item reveal";
  item.innerHTML = `
    <div class="t-card">
      ${m.photo ? `<img src="${esc(m.photo)}" alt="${esc(m.title)}" loading="lazy" />` : ""}
      <div class="t-body">
        <div class="t-date">${esc(fmtDate(m.date))}</div>
        <h3>${esc(m.title)}</h3>
        <p>${esc(m.text)}</p>
      </div>
    </div>`;
  const img = item.querySelector("img");
  if (img) img.addEventListener("error", () => img.remove()); // chưa có ảnh thì ẩn đi
  $("timelineList").appendChild(item);
});

// ---------- Thư viện ảnh + lightbox ----------
LOVE.gallery.forEach((src) => {
  const fig = document.createElement("div");
  fig.className = "g-item reveal";
  const img = new Image();
  img.src = src;
  img.alt = "Kỷ niệm của chúng mình";
  img.loading = "lazy";
  img.addEventListener("load", () => {
    fig.addEventListener("click", () => {
      $("lightboxImg").src = src;
      $("lightbox").classList.remove("hidden");
    });
  });
  img.addEventListener("error", () => {
    fig.style.cursor = "default";
    fig.innerHTML = `<div class="ph"><b>📷</b><span>Thêm ảnh vào<br>${esc(src)}</span></div>`;
  });
  fig.appendChild(img);
  $("galleryGrid").appendChild(fig);
});
$("lightbox").addEventListener("click", () => $("lightbox").classList.add("hidden"));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") $("lightbox").classList.add("hidden"); });

// ---------- Lý do yêu ----------
let lastReason = -1;
$("reasonBtn").addEventListener("click", () => {
  const list = LOVE.reasons;
  if (!list.length) return;
  let i;
  do { i = Math.floor(Math.random() * list.length); } while (list.length > 1 && i === lastReason);
  lastReason = i;
  $("reasonText").textContent = list[i];
  burst(window.innerWidth / 2, window.innerHeight / 2, 10);
});

// ---------- Thư tình (hiệu ứng gõ chữ) ----------
$("letterSign").textContent = "";
let typed = false;
function typeLetter() {
  if (typed) return;
  typed = true;
  const text = LOVE.letter.body;
  if (reduceMotion) {
    $("letterBody").textContent = text;
    $("letterSign").textContent = LOVE.letter.sign;
    return;
  }
  let i = 0;
  const timer = setInterval(() => {
    i += 2;
    $("letterBody").textContent = text.slice(0, i);
    if (i >= text.length) {
      clearInterval(timer);
      $("letterBody").textContent = text;
      $("letterSign").textContent = LOVE.letter.sign;
    }
  }, 30);
}

// ---------- Hiện dần khi cuộn ----------
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("show");
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

const letterObs = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) { typeLetter(); letterObs.disconnect(); }
}, { threshold: 0.35 });
letterObs.observe($("letter"));

// ---------- Tim bay ----------
const HEARTS = ["💗", "💖", "💕", "🌷", "✨", "🌸"];
function spawnHeart() {
  if (document.hidden) return;
  const h = document.createElement("span");
  h.className = "heart";
  h.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
  h.style.left = Math.random() * 100 + "vw";
  h.style.fontSize = 14 + Math.random() * 22 + "px";
  const dur = 7 + Math.random() * 7;
  h.style.animationDuration = dur + "s";
  $("hearts").appendChild(h);
  setTimeout(() => h.remove(), dur * 1000);
}
if (!reduceMotion) setInterval(spawnHeart, 900);

function burst(x, y, n) {
  for (let i = 0; i < n; i++) {
    const b = document.createElement("span");
    b.className = "burst";
    b.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
    b.style.left = x + "px";
    b.style.top = y + "px";
    const a = Math.random() * Math.PI * 2;
    const r = 50 + Math.random() * 90;
    b.style.setProperty("--dx", Math.cos(a) * r + "px");
    b.style.setProperty("--dy", Math.sin(a) * r + "px");
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 900);
  }
}
document.addEventListener("click", (e) => {
  if (reduceMotion || e.target.closest("button, a, .lightbox")) return;
  burst(e.clientX, e.clientY, 6);
});

// ---------- Nhạc nền ----------
if (LOVE.music) {
  const audio = new Audio(LOVE.music);
  audio.loop = true;
  const btn = $("musicBtn");
  btn.classList.remove("hidden");
  btn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().then(() => btn.classList.add("playing")).catch(() => {});
    } else {
      audio.pause();
      btn.classList.remove("playing");
    }
  });
}

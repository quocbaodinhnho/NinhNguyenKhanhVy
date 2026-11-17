const $ = s => document.querySelector(s);
let data = { shop: {}, products: [] }, cat = 'Tất cả', term = '';

const norm = s => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
const money = p => (p == null || p === '') ? 'Liên hệ' : (typeof p === 'number' ? p.toLocaleString('vi-VN') + ' đ' : p);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function renderCats() {
  const list = ['Tất cả', ...new Set(data.products.map(p => p.category).filter(Boolean))];
  $('#cats').innerHTML = list.map(c => `<button type="button" aria-pressed="${c === cat}">${esc(c)}</button>`).join('');
}

function render() {
  const t = norm(term);
  const rows = data.products.filter(p =>
    (cat === 'Tất cả' || p.category === cat) &&
    (!t || norm(p.name + ' ' + p.category + ' ' + p.desc).includes(t)));
  $('#count').textContent = `${rows.length} sản phẩm`;
  $('#grid').innerHTML = rows.length ? rows.map(p => `
    <article class="item">
      <img src="${esc(p.image || 'images/placeholder.svg')}" alt="${esc(p.name)}" loading="lazy" onerror="this.onerror=null;this.src='images/placeholder.svg'">
      <div><small>${esc(p.category)}</small><h3>${esc(p.name)}</h3><p>${esc(p.desc)}</p>
      <span class="price">${money(p.price)}</span>${p.unit && p.price != null ? `<small> / ${esc(p.unit)}</small>` : ''}</div>
    </article>`).join('') : '<p class="empty">Không tìm thấy sản phẩm. Thử từ khóa khác hoặc chọn "Tất cả".</p>';
}

$('#searchForm').addEventListener('submit', e => { e.preventDefault(); term = $('#q').value; render(); });
$('#q').addEventListener('input', e => { term = e.target.value; render(); });
$('#cats').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  cat = b.textContent; renderCats(); render();
});
$('#grid').addEventListener('click', e => {
  if (e.target.tagName !== 'IMG') return;
  const lb = $('#lightbox'); lb.querySelector('img').src = e.target.src; lb.querySelector('p').textContent = e.target.alt; lb.hidden = false;
});
$('#lightbox').addEventListener('click', () => $('#lightbox').hidden = true);
document.addEventListener('keydown', e => { if (e.key === 'Escape') $('#lightbox').hidden = true; });

fetch('products.json').then(r => r.json()).then(d => {
  data = d; const s = d.shop || {};
  $('#shopName').textContent = s.name || 'Thắng Andy';
  $('#tagline').textContent = s.tagline || '';
  $('#contact').innerHTML = `<strong>${esc(s.name)}</strong> – ${esc(s.address)}<br>Điện thoại: <a href="tel:${esc(s.phone)}">${esc(s.phone)}</a> · Zalo: <a href="https://zalo.me/${esc(s.zalo)}">${esc(s.phone)}</a>`;
  renderCats(); render();
}).catch(() => { $('#grid').innerHTML = '<p class="empty">Không tải được products.json. Hãy chạy trên GitHub Pages hoặc một máy chủ cục bộ.</p>'; });

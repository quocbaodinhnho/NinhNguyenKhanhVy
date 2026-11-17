// ====== DỮ LIỆU: sửa tại đây ======
// image: đường dẫn tới ảnh trong thư mục images/ (chưa có ảnh sẽ hiện khung xám)
const PRODUCTS = [
  {name:"Bảng hiệu Alu + Chữ nổi Mica", cat:"Bảng hiệu", price:"Từ 1.500.000đ/m²", image:"images/bang-hieu-alu.jpg"},
  {name:"Hộp đèn Mica hút nổi", cat:"Bảng hiệu", price:"Từ 1.800.000đ/m²", image:"images/hop-den.jpg"},
  {name:"Bảng hiệu Hiflex", cat:"Bảng hiệu", price:"Từ 450.000đ/m²", image:"images/hiflex.jpg"},
  {name:"Chữ nổi Inox", cat:"Bảng hiệu", price:"Liên hệ", image:"images/chu-noi-inox.jpg"},
  {name:"Standee khung chữ X", cat:"In ấn", price:"Từ 120.000đ", image:"images/standee-x.jpg"},
  {name:"Standee cuốn nhôm", cat:"In ấn", price:"Từ 350.000đ", image:"images/standee-cuon.jpg"},
  {name:"Decal dán kính / xe", cat:"In ấn", price:"Từ 90.000đ/m²", image:"images/decal.jpg"},
  {name:"Banner / Backdrop", cat:"In ấn", price:"Từ 60.000đ/m²", image:"images/banner.jpg"},
  {name:"Quạt nhựa PP in logo", cat:"Quạt quảng cáo", price:"Từ 3.500đ/cái", image:"images/quat-nhua.jpg"},
  {name:"Quạt giấy cán nhựa", cat:"Quạt quảng cáo", price:"Từ 2.800đ/cái", image:"images/quat-giay.jpg"},
  {name:"Name card / Tờ rơi", cat:"In ấn", price:"Từ 150.000đ/hộp", image:"images/namecard.jpg"},
  {name:"Áo thun / Nón đồng phục", cat:"Quà tặng", price:"Từ 45.000đ", image:"images/ao-non.jpg"}
];
const PROJECTS = [
  {name:"Bảng hiệu quán cà phê", desc:"Chữ nổi + hộp đèn mặt tiền.", image:"images/du-an-1.jpg"},
  {name:"Bảng hiệu phòng khám", desc:"Alu ốp mặt dựng, đèn led.", image:"images/du-an-2.jpg"},
  {name:"In quạt cho chuỗi quán ăn", desc:"5.000 quạt nhựa PP in 4 màu.", image:"images/du-an-3.jpg"}
];
const SERVICES = [
  {name:"Thiết kế", desc:"Logo, bảng hiệu, ấn phẩm theo yêu cầu."},
  {name:"In ấn", desc:"Standee, decal, banner, tờ rơi, name card."},
  {name:"Thi công bảng hiệu", desc:"Khảo sát, lắp đặt tận nơi."},
  {name:"Sửa chữa, bảo trì", desc:"Thay đèn, thay bạt, làm mới bảng cũ."}
];
const NEWS = [
  {name:"Cách chọn bảng hiệu cho cửa hàng nhỏ", desc:"Chất liệu, màu sắc và ngân sách nên cân nhắc.", image:"images/tin-1.jpg"},
  {name:"Quạt nhựa hay quạt giấy?", desc:"So sánh độ bền và chi phí khi in quảng cáo.", image:"images/tin-2.jpg"},
  {name:"Bảo quản hộp đèn đúng cách", desc:"Mẹo giữ bảng hiệu luôn sáng đẹp.", image:"images/tin-3.jpg"}
];
// ====== HẾT DỮ LIỆU ======

const $ = s => document.querySelector(s);
const norm = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/g,"d");
const img = (src, alt) => `<div class="im"><img src="${src}" alt="${alt}" loading="lazy" onerror="this.remove()"></div>`;

// Sản phẩm: lọc + tìm kiếm
let cat = "Tất cả", q = "";
const cats = ["Tất cả", ...new Set(PRODUCTS.map(p => p.cat))];
function drawCats(){
  $("#cats").innerHTML = cats.map(c => `<button class="${c===cat?"on":""}" data-c="${c}">${c}</button>`).join("");
}
function drawProducts(){
  const list = PRODUCTS.filter(p => (cat==="Tất cả"||p.cat===cat) && norm(p.name+" "+p.cat).includes(norm(q)));
  $("#grid").innerHTML = list.map(p => `<article class="card">${img(p.image,p.name)}<div class="bd"><span class="cat">${p.cat}</span><h3>${p.name}</h3><div class="price">${p.price}</div></div></article>`).join("");
  $("#empty").hidden = list.length > 0;
}
$("#cats").addEventListener("click", e => { if(e.target.dataset.c){ cat = e.target.dataset.c; drawCats(); drawProducts(); }});
$("#search").addEventListener("input", e => { q = e.target.value; $("#searchTop").value = q; drawProducts(); });
$("#searchTop").addEventListener("input", e => { q = e.target.value; $("#search").value = q; drawProducts(); if(q) location.hash = "#products"; });
$("#searchBtn").onclick = () => { $("#searchPop").classList.toggle("open"); $("#searchTop").focus(); };

drawCats(); drawProducts();
$("#projGrid").innerHTML = PROJECTS.map(p => `<article class="card">${img(p.image,p.name)}<div class="bd"><h3>${p.name}</h3><p>${p.desc}</p></div></article>`).join("");
$("#svcGrid").innerHTML = SERVICES.map(s => `<article class="card svc"><h3>${s.name}</h3><p>${s.desc}</p></article>`).join("");
$("#newsGrid").innerHTML = NEWS.map(n => `<article class="card">${img(n.image,n.name)}<div class="bd"><h3>${n.name}</h3><p>${n.desc}</p></div></article>`).join("");

// Slider
const slides = $("#slides"), n = slides.children.length; let i = 0, t;
$("#dots").innerHTML = [...Array(n)].map((_,k) => `<button aria-label="Slide ${k+1}"></button>`).join("");
const dots = [...$("#dots").children];
function go(k){ i = (k+n)%n; slides.style.transform = `translateX(-${i*100}%)`; dots.forEach((d,j) => d.classList.toggle("on", j===i)); }
function auto(){ clearInterval(t); t = setInterval(() => go(i+1), 5000); }
$("#prev").onclick = () => { go(i-1); auto(); };
$("#next").onclick = () => { go(i+1); auto(); };
dots.forEach((d,k) => d.onclick = () => { go(k); auto(); });
go(0); auto();

// Menu mobile, nút Top, năm
$("#burger").onclick = () => $("#nav").classList.toggle("open");
$("#nav").addEventListener("click", () => $("#nav").classList.remove("open"));
const top = $("#totop");
addEventListener("scroll", () => top.classList.toggle("show", scrollY > 400));
top.onclick = () => scrollTo({top:0});
$("#year").textContent = new Date().getFullYear();

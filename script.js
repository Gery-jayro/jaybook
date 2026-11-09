const SETTINGS = {
  storeName: "JayBook",
  whatsapp: "628997465249",
  freeShipping: 100000,
  shippingMin: 10000,
  shippingMax: 50000,
  pickupAddress: "Toko JayBook (batubulan, Tegaltamu, pertigaan patung barong)"
};

const vols = (slug, volumes) => {
  const numbers = Array.isArray(volumes)
    ? volumes
    : Array.from({ length: volumes }, (_, i) => i + 1);

  return numbers.map(n => ({ name: `Vol. ${n}`, image: `images/${slug}-${n}.jpg` }));
};

const books = [
  { id: 1, title: "Kaoru Hana wa Rin to Saku Vol. 1", author: "Saka Mikami", cats: ["Romance"], price: 45000, old: 52000, rating: 4.9, sold: 3120, image: "images/kaoru-hana-1.jpg", volumes: vols("kaoru-hana", 3), colors: ["#f9a8d4", "#fce7f3"] },
  { id: 2, title: "Haimiya Is Scary Cute Vol. 1", author: "Haimiya", cats: ["Romance", "Comedy"], price: 42000, old: 48000, rating: 4.8, sold: 2740, image: "images/haimiya-1.jpg", volumes: vols("haimiya", 4), colors: ["#7c3aed", "#c4b5fd"] },
  { id: 3, title: "My Dress-Up Darling Vol. 1", author: "Shinichi Fukuda", cats: ["Romance", "Comedy"], price: 45000, rating: 4.8, sold: 2480, image: "images/my-dress-up-darling-1.jpg", volumes: vols("my-dress-up-darling", 3), colors: ["#fb7185", "#fecdd3"] },
  { id: 4, title: "Yancha Gal no Anjou-san Vol. 1", author: "Kagiri Araido", cats: ["Romance", "Comedy"], price: 47000, old: 54000, rating: 4.8, sold: 2260, image: "images/yancha-gal-no-anjou-san-1.jpg", volumes: vols("yancha-gal-no-anjou-san", 5), colors: ["#f97316", "#fed7aa"] },
  { id: 5, title: "Please Go Home, Miss Akutsu! Vol. 1", author: "Taichi Nagaoka", cats: ["Romance", "Comedy"], price: 43000, rating: 4.7, sold: 1380, image: "images/please-go-home-miss-akutsu-1.jpg", volumes: vols("please-go-home-miss-akutsu", 2), colors: ["#be185d", "#f9a8d4"] },
  { id: 6, title: "The Dangers in My Heart Vol. 1", author: "Norio Sakurai", cats: ["Romance", "Comedy"], price: 43000, old: 49000, rating: 4.7, sold: 1190, image: "images/the-dangers-in-my-heart-1.jpg", volumes: vols("the-dangers-in-my-heart", 3), colors: ["#60a5fa", "#dbeafe"] },
  { id: 7, title: "Hokkaido Gals Are Super Adorable! Vol. 1", author: "Kai Ikada", cats: ["Romance", "Comedy"], price: 58000, old: 65000, rating: 4.9, sold: 1650, image: "images/hokkaido-gals-are-super-adorable-1.jpg", colors: ["#f59e0b", "#fde68a"] },
  { id: 8, title: "Kubo Won't Let Me Be Invisible Vol. 1", author: "Nene Yukimori", cats: ["Romance", "Comedy"], price: 55000, rating: 4.8, sold: 1020, image: "images/kubo-wont-let-me-be-invisible-1.jpg", colors: ["#a78bfa", "#ede9fe"] },
  { id: 9, title: "Medaka Kuroiwa Is Impervious to My Charms Vol. 1", author: "Ran Kuze", cats: ["Romance", "Comedy"], price: 89000, old: 99000, rating: 4.7, sold: 1540, image: "images/medaka-kuroiwa-is-impervious-to-my-charms-1.jpg", colors: ["#0e7490", "#67e8f9"] },
  { id: 10, title: "Horimiya Vol. 1", author: "HERO & Daisuke Hagiwara", cats: ["Romance"], price: 92000, rating: 4.6, sold: 870, image: "images/horimiya-1.jpg", colors: ["#0f766e", "#99f6e4"] },
  { id: 11, title: "More Than a Married Couple Vol. 1", author: "Yuki Kanamaru", cats: ["Romance", "Comedy"], price: 35000, old: 40000, rating: 4.9, sold: 2900, image: "images/more-than-a-married-couple-1.jpg", volumes: vols("more-than-a-married-couple", 3), colors: ["#db2777", "#fbcfe8"] },
  { id: 12, title: "Komi Can't Communicate Vol. 1", author: "Tomohito Oda", cats: ["Comedy", "Romance"], price: 35000, old: 70000, rating: 4.6, sold: 640, image: "images/komi-cant-communicate-1.jpg", volumes: vols("komi-cant-communicate", [1, 31]), colors: ["#4338ca", "#c7d2fe"] }
];

const CATEGORY_ICONS = { Romance: "💕", Comedy: "😂", Isekai: "🌀", Action: "⚔️", Horror: "👻" };

const $ = id => document.getElementById(id);
const rp = n => "Rp" + n.toLocaleString("id-ID");
const bookById = id => books.find(b => b.id === id);
const categories = [...new Set([...Object.keys(CATEGORY_ICONS), ...books.flatMap(b => b.cats)])];
const activeCategories = () => categories.filter(c => books.some(b => b.cats.includes(c)));
const discOf = b => b.old ? `<span class="disc">${Math.round((1 - b.price / b.old) * 100)}%</span>` : "";
const cartCount = () => cart.reduce((n, i) => n + i.qty, 0);

const load = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch (e) { return fallback; }
};
const store = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
};

let activeCat = "Semua";
let query = "";
let cart = load("jaybook-cart", []).filter(i => bookById(i.id) && Number(i.qty) > 0);
let wish = load("jaybook-wish", []);
let shipMode = "kirim";
try { shipMode = localStorage.getItem("jaybook-ship") === "ambil" ? "ambil" : "kirim"; } catch (e) {}

const HEART = size => `<svg viewBox="0 0 24 24" width="${size}" height="${size}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.2l7.8-7.7 1-1.1a5.5 5.5 0 0 0 0-7.8z"/></svg>`;
const BACK = size => `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>`;

const gradientOf = b => `linear-gradient(160deg,${b.colors[0]},${b.colors[1]})`;

const coverHTML = b => `
  <div class="cover${b.image ? " has-img" : ""}" style="--g:${gradientOf(b)}">
    ${b.image ? `<img src="${b.image}" alt="Sampul ${b.title}" loading="lazy" decoding="async" onerror="this.parentElement.classList.remove('has-img');this.remove()">` : ""}
  </div>`;

const cardHTML = b => `
  <article class="card" data-open="${b.id}">
    <button type="button" class="wish${wish.includes(b.id) ? " on" : ""}" data-wish="${b.id}" aria-label="Simpan ke wishlist">${HEART(22)}</button>
    ${coverHTML(b)}
    <div class="info">
      <span class="rating"><b>★</b> ${b.rating} · ${b.sold.toLocaleString("id-ID")} terjual</span>
      <span class="author">${b.author}</span>
      <h3 class="title">${b.title}</h3>
      <div class="price-row">
        <span class="price">${rp(b.price)}</span>
        ${b.old ? `<span class="old">${rp(b.old)}</span>` : ""}
        ${discOf(b)}
      </div>
    </div>
  </article>`;

function renderFeatured() {

  const n = window.innerWidth < 700 ? 1 : 2;
  const top = [...books].sort((a, b) => b.sold - a.sold).slice(0, 4);
  const half = Array(n).fill(top).flat().map(cardHTML).join("");

  $("featuredGrid").innerHTML = `<div class="marquee-track">${half}${half}</div>`;
}

function renderChips() {
  $("chips").innerHTML = ["Semua", ...activeCategories()].map(c =>
    `<button type="button" class="chip${c === activeCat ? " active" : ""}" data-cat="${c}">${c}</button>`
  ).join("");
}

const SORTS = {
  popular: (a, b) => b.sold - a.sold,
  low: (a, b) => a.price - b.price,
  high: (a, b) => b.price - a.price,
  title: (a, b) => a.title.localeCompare(b.title, "id")
};

function renderGrid() {
  const q = query.trim().toLowerCase();

  const list = books
    .filter(b =>
      (activeCat === "Semua" || b.cats.includes(activeCat)) &&
      (!q || `${b.title} ${b.author} ${b.cats.join(" ")}`.toLowerCase().includes(q))
    )
    .sort(SORTS[$("sortBy").value]);

  $("grid").innerHTML = list.map(cardHTML).join("");
  $("empty").hidden = list.length > 0;
  $("resultInfo").textContent = `${list.length} manga ditemukan`;
}

const goCatalog = () => $("katalog").scrollIntoView({ behavior: "smooth", block: "start" });

function resetSearch() {
  query = "";
  activeCat = "Semua";
  $("searchInput").value = "";
  renderChips();
  renderGrid();
}

const saveCart = () => store("jaybook-cart", cart);

function calcTotals() {
  const subtotal = cart.reduce((sum, i) => sum + bookById(i.id).price * i.qty, 0);

  const free = !subtotal || subtotal >= SETTINGS.freeShipping || shipMode === "ambil";

  return { subtotal, free, total: subtotal };
}

const cartItemHTML = i => {
  const b = bookById(i.id);
  const key = i.id + ":" + (i.vol || 0);
  const image = volOf(b, i).image;

  return `
    <div class="item">
      <div class="item-cover">
        ${image ? `<img src="${image}" alt="Sampul ${itemTitle(b, i)}" decoding="async" onerror="this.style.display='none'">` : ""}
      </div>
      <div>
        <h4>${itemTitle(b, i)}</h4>
        <div class="p">${rp(b.price)}</div>
        <div class="qty">
          <button type="button" data-dec="${key}">−</button>
          <span>${i.qty}</span>
          <button type="button" data-inc="${key}">+</button>
        </div>
        <button type="button" class="remove" data-del="${key}">Hapus</button>
      </div>
    </div>`;
};

const RANGE = `${rp(SETTINGS.shippingMin)} – ${rp(SETTINGS.shippingMax)}`;

const shippingHTML = () => `
  <div class="ship">
    <h4 class="ship-title">Opsi Pengiriman</h4>
    <div class="ship-cards">
      <button type="button" class="ship-card${shipMode === "kirim" ? " on" : ""}" data-ship="kirim">
        <span class="ship-ico">🚚</span>
        <b>Antar ke alamatmu</b>
        <small>Ongkir ${RANGE}, sesuai alamat. Gratis di atas ${rp(SETTINGS.freeShipping)}</small>
      </button>
      <button type="button" class="ship-card${shipMode === "ambil" ? " on" : ""}" data-ship="ambil">
        <span class="ship-ico">🏬</span>
        <b>Ambil di tempat</b>
        <small>Gratis</small>
      </button>
    </div>
    <p class="ship-note">${shipMode === "ambil"
      ? `Ambil langsung di toko (gratis): ${SETTINGS.pickupAddress}`
      : "Alamat lengkap kamu tulis di pesan WhatsApp."}</p>
  </div>`;

function renderCart() {
  const count = cartCount();

  $("cartCount").textContent = count;
  if ($("dCartCount")) $("dCartCount").textContent = count;

  $("cartItems").innerHTML = cart.length
    ? cart.map(cartItemHTML).join("") + shippingHTML()
    : `<div class="cart-empty"><div>🛒</div><p>Keranjangmu masih kosong.<br>Yuk pilih manga favoritmu!</p></div>`;

  const { subtotal, free, total } = calcTotals();
  const ongkir = !subtotal ? "-" : shipMode === "ambil" ? "Ambil di tempat" : free ? "Gratis" : RANGE;

  $("subtotal").textContent = rp(subtotal);
  $("shipping").textContent = ongkir;
  $("total").textContent = subtotal && !free ? `${rp(total)} + ongkir` : rp(total);
  $("checkoutBtn").disabled = !cart.length;
}

function toast(msg) {
  const t = $("toast");

  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => t.classList.remove("show"), 1800);
}

function addToCart(id, vol = 0) {
  const b = bookById(id);
  const item = cart.find(i => i.id === id && (i.vol || 0) === vol);

  if (item) item.qty++;
  else cart.push({ id, vol, qty: 1 });

  saveCart();
  renderCart();

  const badge = $("cartCount");
  badge.classList.remove("bump");
  void badge.offsetWidth;
  badge.classList.add("bump");

  toast("✓ " + itemTitle(b, { vol }) + " ditambahkan");
}

function setCartOpen(open) {
  $("drawer").classList.toggle("open", open);
  $("drawer").setAttribute("aria-hidden", String(!open));
  $("overlay").hidden = !open;
  document.body.style.overflow = open ? "hidden" : "";
  updateNav();
}

const openCart = () => setCartOpen(true);
const closeCart = () => setCartOpen(false);

let detailId = null;
let detailVol = 0;

const starsHTML = rating => Array.from({ length: 5 }, (_, i) => i < Math.round(rating) ? "<i>★</i>" : "★").join("");
const volOf = (b, i) => getVolumes(b)[i.vol || 0] || getVolumes(b)[0];
const itemTitle = (b, i) => b.volumes && b.volumes.length ? b.title.replace(/\s*Vol\.?\s*\d+\s*$/i, "") + " " + volOf(b, i).name : b.title;
const getVolumes = b => b.volumes && b.volumes.length ? b.volumes : [{ name: "Vol. 1", image: b.image }];

function setVol(i, scroll) {
  const vs = getVolumes(bookById(detailId));
  if (i < 0 || i >= vs.length) return;

  detailVol = i;
  $("dVolLabel").textContent = vs[i].name;

  document.querySelectorAll("#dDots span").forEach((dot, n) => dot.classList.toggle("on", n === i));
  document.querySelectorAll("[data-dvol]").forEach((btn, n) => btn.classList.toggle("on", n === i));

  const prev = document.querySelector("[data-dprev]");
  const next = document.querySelector("[data-dnext]");
  if (prev) prev.disabled = i === 0;
  if (next) next.disabled = i === vs.length - 1;

  if (scroll) {
    const g = $("dGallery");
    g.scrollTo({ left: g.clientWidth * i, behavior: "smooth" });
  }
}

function renderDetail(b) {
  const vs = getVolumes(b);
  const baseTitle = b.title.replace(/\s*Vol\.?\s*\d+\s*$/i, "");

  detailId = b.id;
  detailVol = 0;

  const slides = vs.map(v => {
    const label = vs.length > 1 ? `${baseTitle} ${v.name}` : b.title;

    return `
      <div class="d-slide${v.image ? "" : " broken"}" style="--g:${gradientOf(b)}">
        ${v.image ? `<img src="${v.image}" alt="Sampul ${label}" decoding="async" onerror="this.style.display='none';this.parentElement.classList.add('broken')">` : ""}
        <span class="d-noimg">${label}</span>
      </div>`;
  }).join("");

  const many = vs.length > 1;
  const dots = many ? `<div class="d-dots" id="dDots">${vs.map((_, i) => `<span${i ? "" : ' class="on"'}></span>`).join("")}</div>` : "";
  const arrows = many
    ? `<button type="button" class="d-arrow d-prev" data-dprev aria-label="Gambar sebelumnya" disabled>&#10094;</button>
       <button type="button" class="d-arrow d-next" data-dnext aria-label="Gambar berikutnya">&#10095;</button>`
    : "";
  const volItems = vs.map((v, i) => `<button type="button"${i ? "" : ' class="on"'} data-dvol="${i}">${v.name}</button>`).join("");

  $("detail").innerHTML = `
    <div class="d-bar">
      <button type="button" class="d-circle" data-dclose aria-label="Kembali">${BACK(24)}</button>
      <button type="button" class="d-circle" data-dcart aria-label="Buka keranjang">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 4h2l2.4 11h10.2L20 7H6"/><circle cx="9" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/></svg>
        <span class="d-badge" id="dCartCount">${cartCount()}</span>
      </button>
    </div>

    <div class="d-scroll">
      <div class="d-media">
        <div class="d-gallery" id="dGallery">${slides}</div>
        ${arrows}
        ${dots}
      </div>

      <div class="d-body">
        <div class="d-price-row">
          <span class="d-price">${rp(b.price)}</span>
          ${discOf(b)}
          ${b.old ? `<span class="d-old">${rp(b.old)}</span>` : ""}
          <div class="d-actions">
            <button type="button" class="d-icon d-heart${wish.includes(b.id) ? " on" : ""}" data-wish="${b.id}" aria-label="Simpan ke wishlist">${HEART(26)}</button>
            <button type="button" class="d-icon" data-dshare="${b.id}" aria-label="Bagikan">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>
            </button>
          </div>
        </div>

        <p class="d-author">${b.author}</p>
        <h1 class="d-title">${b.title}</h1>

        <div class="d-rating">
          <b>${b.rating}</b>
          <span class="d-stars">${starsHTML(b.rating)}</span>
          <span class="d-sold">${b.sold.toLocaleString("id-ID")} Terjual</span>
        </div>

        <button type="button" class="d-select" data-dvolbtn aria-expanded="false">
          <span>Volume: <b id="dVolLabel">${vs[0].name}</b></span>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </button>
        <div class="d-vollist" id="dVolList" hidden>${volItems}</div>
      </div>
    </div>

    <div class="d-foot">
      <button type="button" class="d-add" data-dadd="${b.id}">+ Keranjang</button>
    </div>`;

  if (many) {
    const g = $("dGallery");

    g.addEventListener("scroll", () => {
      const i = Math.round(g.scrollLeft / g.clientWidth);
      if (i !== detailVol) setVol(i, false);
    }, { passive: true });
  }
}

function openDetail(id) {
  const b = bookById(id);
  if (!b) return;

  renderDetail(b);
  $("detail").classList.add("open");
  $("detail").setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  try { history.pushState({ detail: id }, ""); } catch (e) {}
}

function closeDetail(fromPop) {
  const el = $("detail");
  if (!el.classList.contains("open")) return;

  el.classList.remove("open");
  el.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  if (!fromPop && history.state && history.state.detail) history.back();
}

window.addEventListener("popstate", e => {
  if ($("detail").classList.contains("open")) return closeDetail(true);
  showView((e.state && e.state.view) || "home", false);
});

async function shareBook(id) {
  const b = bookById(id);
  const text = `${b.title} — ${rp(b.price)} di ${SETTINGS.storeName}`;

  try {
    if (navigator.share) {
      await navigator.share({ title: b.title, text, url: location.href });
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(`${text} ${location.href}`);
      toast("Tautan disalin");
    }
  } catch (e) {}
}

let currentView = "home";
let catViewSel = null;

function updateNav() {
  const drawerOpen = $("drawer").classList.contains("open");

  document.querySelectorAll(".mobile-nav [data-nav]").forEach(a =>
    a.classList.toggle("active", a.dataset.nav === (drawerOpen ? "cart" : currentView))
  );
}

function showView(name, push) {
  if (name === currentView) return;

  currentView = name;
  if (name === "kategori") catViewSel = null;

  document.querySelector("main").hidden = name !== "home";
  $("viewCategory").hidden = name !== "kategori";
  $("viewWishlist").hidden = name !== "wishlist";

  if (name === "kategori") renderCategoryView();
  if (name === "wishlist") renderWishlistView();

  updateNav();
  window.scrollTo({ top: 0, behavior: "instant" });

  if (!push) return;

  try {
    const onTab = Boolean(history.state && history.state.view);

    if (name === "home") {
      if (onTab) history.back();
    } else if (onTab) {
      history.replaceState({ view: name }, "");
    } else {
      history.pushState({ view: name }, "");
    }
  } catch (e) {}
}

const gridOrEmpty = (list, icon, title, text, extra = "") => list.length
  ? `<div class="grid">${list.map(cardHTML).join("")}</div>`
  : `<div class="v-empty"><div>${icon}</div><h3>${title}</h3><p>${text}</p>${extra}</div>`;

function renderCategoryView() {
  const el = $("viewCategory");

  if (catViewSel === null) {
    el.innerHTML = `
      <div class="v-head"><h2>Kategori</h2><p>Pilih genre manga favoritmu</p></div>
      <div class="cat-grid">${["Semua", ...categories].map(c => {
        const all = c === "Semua";
        const n = all ? books.length : books.filter(b => b.cats.includes(c)).length;

        return `
          <button type="button" class="cat-card" data-catview="${c}">
            <span class="cat-ico">${all ? "📚" : CATEGORY_ICONS[c] || "📘"}</span>
            <b>${all ? "Semua Manga" : c}</b>
            <small>${n ? n + " manga" : "Segera hadir"}</small>
          </button>`;
      }).join("")}</div>`;
    return;
  }

  const list = books
    .filter(b => catViewSel === "Semua" || b.cats.includes(catViewSel))
    .sort(SORTS.popular);

  el.innerHTML = `
    <div class="v-head v-back">
      <button type="button" class="v-backbtn" data-catback aria-label="Kembali ke kategori">${BACK(22)}</button>
      <div>
        <h2>${catViewSel === "Semua" ? "Semua Manga" : catViewSel}</h2>
        <p>${list.length} manga</p>
      </div>
    </div>
    ${gridOrEmpty(list, "🕘", "Segera hadir", "Manga untuk kategori ini belum tersedia.")}`;
}

function renderWishlistView() {
  const list = books.filter(b => wish.includes(b.id));

  $("viewWishlist").innerHTML = `
    <div class="v-head"><h2>Wishlist</h2><p>${list.length} manga tersimpan</p></div>
    ${gridOrEmpty(list, "🤍", "Wishlist masih kosong", "Ketuk ikon hati pada manga untuk menyimpannya di sini.",
      `<button type="button" class="btn btn-primary" data-nav="home">Cari manga</button>`)}`;
}

function checkoutWhatsApp() {
  if (!cart.length) return toast("Keranjang masih kosong.");
  if (!/^\d{8,15}$/.test(SETTINGS.whatsapp)) return toast("Periksa nomor WhatsApp di SETTINGS.");

  const ambil = shipMode === "ambil";
  const { subtotal, free, total } = calcTotals();

  const items = cart.map((item, n) => {
    const b = bookById(item.id);
    return `${n + 1}. ${itemTitle(b, item)} — ${rp(b.price)} x ${item.qty} = ${rp(b.price * item.qty)}`;
  }).join("\n");

  const message = [
    `Halo ${SETTINGS.storeName}, saya ingin memesan manga berikut:`,
    "",
    items,
    "",
    `Subtotal: ${rp(subtotal)}`,
    `Pengiriman: ${ambil ? "Ambil di tempat" : "Antar ke alamat"}`,
    `Ongkir: ${ambil ? "Gratis (ambil di tempat)" : free ? "Gratis" : RANGE + " (mohon info ongkir sesuai alamat)"}`,
    `Total: ${rp(total)}${ambil || free ? "" : " + ongkir"}`,
    "",
    ambil
      ? `Saya ambil di toko: ${SETTINGS.pickupAddress}`
      : "Alamat pengiriman lengkap:\n(tulis alamat, nama penerima, dan nomor HP di sini)",
    "",
    "Mohon konfirmasi stok dan cara pembayaran. Terima kasih."
  ].join("\n");

  window.open(`https://wa.me/${SETTINGS.whatsapp}?text=${encodeURIComponent(message)}`, "_blank");
}

const findItem = key => {
  const [id, vol] = key.split(":").map(Number);
  return { id, vol, item: cart.find(i => i.id === id && (i.vol || 0) === vol) };
};

const changeQty = (key, step) => {
  const { item } = findItem(key);

  if (item) item.qty += step;
  cart = cart.filter(i => i.qty > 0);
  saveCart();
  renderCart();
};

const ACTIONS = {
  open: id => openDetail(Number(id)),
  dclose: () => closeDetail(),
  dcart: openCart,
  dadd: id => addToCart(Number(id), detailVol),
  dshare: id => shareBook(Number(id)),
  dvol: i => setVol(Number(i), true),
  dprev: () => setVol(detailVol - 1, true),
  dnext: () => setVol(detailVol + 1, true),

  dvolbtn: (_, btn) => {
    const list = $("dVolList");

    list.hidden = !list.hidden;
    btn.setAttribute("aria-expanded", String(!list.hidden));
  },

  nav: (name, _, e) => {
    e.preventDefault();

    if (name === "cart") return openCart();
    if (name !== currentView) return showView(name, true);

    if (name === "kategori" && catViewSel !== null) {
      catViewSel = null;
      renderCategoryView();
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  catview: c => {
    catViewSel = c;
    renderCategoryView();
    window.scrollTo({ top: 0, behavior: "instant" });
  },

  catback: () => {
    catViewSel = null;
    renderCategoryView();
  },

  ship: mode => {
    shipMode = mode === "ambil" ? "ambil" : "kirim";
    try { localStorage.setItem("jaybook-ship", shipMode); } catch (e) {}
    renderCart();
  },

  wish: id => {
    id = Number(id);
    const on = !wish.includes(id);

    wish = on ? [...wish, id] : wish.filter(x => x !== id);
    store("jaybook-wish", wish);

    document.querySelectorAll(`[data-wish="${id}"]`).forEach(btn => btn.classList.toggle("on", on));
    if (currentView === "wishlist") renderWishlistView();
  },

  cat: (c, btn) => {
    activeCat = c;
    query = "";
    $("searchInput").value = "";
    renderChips();
    renderGrid();
    if (!btn.classList.contains("chip")) goCatalog();
  },

  inc: id => changeQty(id, 1),
  dec: id => changeQty(id, -1),
  del: key => {
    const { item } = findItem(key);
    cart = cart.filter(i => i !== item);
    saveCart();
    renderCart();
  }
};

const ACTION_SELECTOR = Object.keys(ACTIONS).map(k => `[data-${k}]`).join(",");

document.addEventListener("click", e => {
  const t = e.target.closest(ACTION_SELECTOR);
  if (!t) return;

  const key = Object.keys(ACTIONS).find(k => k in t.dataset);
  ACTIONS[key](t.dataset[key], t, e);
});

$("searchInput").addEventListener("input", e => {
  query = e.target.value;
  activeCat = "Semua";
  if (currentView !== "home") showView("home", true);
  renderChips();
  renderGrid();
});

$("searchForm").addEventListener("submit", e => {
  e.preventDefault();
  if (currentView !== "home") showView("home", true);
  goCatalog();
});

$("sortBy").addEventListener("change", renderGrid);
$("resetBtn").addEventListener("click", resetSearch);
$("openCart").addEventListener("click", openCart);
$("closeCart").addEventListener("click", closeCart);
$("overlay").addEventListener("click", closeCart);
$("checkoutBtn").addEventListener("click", checkoutWhatsApp);

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    closeCart();
    closeDetail();
  }
});

try { history.replaceState(null, ""); } catch (e) {}

if (window.matchMedia("(max-width: 699px)").matches) {
  $("searchInput").placeholder = "Cari manga atau penulis";
}

renderFeatured();
renderChips();
renderGrid();
renderCart();
updateNav();

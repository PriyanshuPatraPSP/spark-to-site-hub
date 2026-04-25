// ============== The Coffee Hub — Ordering App ==============
// Pure vanilla JS. Manages products, customization, cart, navigation.

const PRODUCTS = [
  {
    id: "caramel-macchiato",
    name: "Caramel Macchiato",
    category: "Espresso",
    badge: "Signature Espresso",
    price: 5.45,
    rating: 4.8,
    reviews: 124,
    desc: "Freshly steamed milk with vanilla-flavored syrup marked with espresso and topped with a caramel drizzle.",
    img: "https://images.unsplash.com/photo-1579888944880-d98341245702?auto=format&fit=crop&w=600&q=80",
    tag: "Signature",
  },
  {
    id: "iced-latte",
    name: "Iced Vanilla Latte",
    category: "Espresso",
    badge: "Cold Classic",
    price: 4.95,
    rating: 4.7,
    reviews: 98,
    desc: "Bold espresso poured over vanilla syrup and creamy cold milk for a smooth, balanced sip.",
    img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80",
    tag: "Iced",
  },
  {
    id: "cappuccino",
    name: "Classic Cappuccino",
    category: "Espresso",
    badge: "Italian Tradition",
    price: 4.50,
    rating: 4.9,
    reviews: 213,
    desc: "Equal parts espresso, steamed milk, and velvety microfoam — a timeless cafe favorite.",
    img: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80",
    tag: "Hot",
  },
  {
    id: "cold-brew",
    name: "24h Cold Brew",
    category: "Cold",
    badge: "Slow Steeped",
    price: 4.25,
    rating: 4.6,
    reviews: 87,
    desc: "Steeped for 24 hours for a smooth, low-acid finish with notes of dark chocolate.",
    img: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80",
    tag: "Cold",
  },
  {
    id: "flat-white",
    name: "Velvet Flat White",
    category: "Espresso",
    badge: "Silky Smooth",
    price: 4.75,
    rating: 4.8,
    reviews: 142,
    desc: "Silky micro-foam poured over a double ristretto for a velvety, intense flavor.",
    img: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=600&q=80",
    tag: "Hot",
  },
  {
    id: "almond-croissant",
    name: "Almond Croissant",
    category: "Pastries",
    badge: "Bakery",
    price: 5.25,
    rating: 4.7,
    reviews: 64,
    desc: "Twice-baked with a house-made frangipane filling, dusted with sliced almonds.",
    img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
    tag: "New",
  },
];

const CATEGORIES = ["All", "Espresso", "Cold", "Pastries"];

const SIZES = [
  { id: "tall", label: "Tall", oz: "12 oz", priceDelta: -0.5, ico: 22 },
  { id: "grande", label: "Grande", oz: "16 oz", priceDelta: 0, ico: 28 },
  { id: "venti", label: "Venti", oz: "20 oz", priceDelta: 0.7, ico: 34 },
];

const MILKS = ["Whole Milk", "2% Milk", "Oatmilk", "Almondmilk"];

const ADDONS = [
  { id: "shot", name: "Extra Espresso Shot", price: 0.8, type: "qty", ico: "water_drop" },
  { id: "drizzle", name: "Extra Caramel Drizzle", price: 0.5, type: "toggle", ico: "opacity" },
];

// ============== State ==============
const state = {
  view: "menu",          // menu | product | cart
  category: "All",
  search: "",
  selectedProduct: null,
  customization: {
    size: "grande",
    milk: "Whole Milk",
    addons: { shot: 1, drizzle: false },
  },
  cart: [],              // {id, name, img, size, milk, addons, unitPrice, qty}
  pickup: "asap",
  payment: "applepay",
};

// ============== Helpers ==============
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function showToast(msg) {
  let t = $(".toast");
  if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._tid);
  t._tid = setTimeout(() => t.classList.remove("show"), 1800);
}

function priceFor(product, custom) {
  const sz = SIZES.find(s => s.id === custom.size);
  let p = product.price + (sz ? sz.priceDelta : 0);
  if (custom.addons.shot) p += custom.addons.shot * ADDONS[0].price;
  if (custom.addons.drizzle) p += ADDONS[1].price;
  return p;
}

function fmt(n) { return `$${n.toFixed(2)}`; }

function cartCount() { return state.cart.reduce((n, i) => n + i.qty, 0); }
function cartSubtotal() { return state.cart.reduce((s, i) => s + i.unitPrice * i.qty, 0); }

function setView(v) {
  state.view = v;
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ============== Rendering ==============
function render() {
  renderAppbar();
  renderViews();
  renderBottomBar();
}

function renderAppbar() {
  const bar = $("#appbar");
  let title = "The Coffee Hub";
  let leftIcon = `<button class="icon-btn iso-raised" aria-label="Menu"><span class="material-symbols-outlined">menu</span></button>`;
  if (state.view === "product") {
    title = state.selectedProduct?.name || "";
    leftIcon = `<button class="icon-btn iso-raised" aria-label="Back" data-action="back"><span class="material-symbols-outlined">arrow_back</span></button>`;
  } else if (state.view === "cart") {
    title = "Review Order";
    leftIcon = `<button class="icon-btn iso-raised" aria-label="Back" data-action="back"><span class="material-symbols-outlined">arrow_back</span></button>`;
  }
  const count = cartCount();
  bar.innerHTML = `
    ${leftIcon}
    <div class="appbar-title">
      ${state.view === "menu" ? `<span class="logo"><span class="material-symbols-outlined" style="font-size:18px">local_cafe</span></span>` : ""}
      <span>${title}</span>
    </div>
    <button class="icon-btn iso-raised" aria-label="Cart" data-action="open-cart">
      <span class="material-symbols-outlined">shopping_bag</span>
      ${count ? `<span class="badge">${count}</span>` : ""}
    </button>
  `;
  bar.querySelector('[data-action="back"]')?.addEventListener("click", () => setView(state.view === "cart" ? "menu" : "menu"));
  bar.querySelector('[data-action="open-cart"]')?.addEventListener("click", () => {
    if (state.cart.length === 0) { showToast("Your cart is empty"); return; }
    setView("cart");
  });
}

function renderViews() {
  const root = $("#views");
  if (state.view === "menu") root.innerHTML = renderMenu();
  else if (state.view === "product") root.innerHTML = renderProduct();
  else if (state.view === "cart") root.innerHTML = renderCart();
  attachViewHandlers();
}

function renderMenu() {
  const filtered = PRODUCTS.filter(p =>
    (state.category === "All" || p.category === state.category) &&
    (!state.search || p.name.toLowerCase().includes(state.search.toLowerCase()))
  );
  return `
    <section class="hero iso-raised">
      <span class="pill">Hand-roasted daily</span>
      <h1>Good morning. <br/>What's brewing?</h1>
      <p>Order ahead, skip the line, and pick up your perfect cup in minutes.</p>
      <span class="bean"></span>
    </section>

    <div class="search iso-recessed">
      <span class="material-symbols-outlined">search</span>
      <input id="search-input" placeholder="Search drinks, pastries..." value="${state.search}" />
    </div>

    <div>
      <div class="categories">
        ${CATEGORIES.map(c => `
          <button class="chip ${state.category === c ? "active iso-raised" : "iso-recessed"}" data-cat="${c}">${c}</button>
        `).join("")}
      </div>
    </div>

    <div>
      <div class="section-title">
        <h2>Today's Picks</h2>
        <a href="#">See all</a>
      </div>
      <div class="product-grid">
        ${filtered.map(p => `
          <article class="product-card iso-raised" data-product="${p.id}">
            <div class="img-wrap"><img src="${p.img}" alt="${p.name}" loading="lazy" /></div>
            <span class="tag">${p.tag}</span>
            <div class="name">${p.name}</div>
            <div class="meta">
              <span class="price">${fmt(p.price)}</span>
              <button class="add" data-add="${p.id}" aria-label="Quick add"><span class="material-symbols-outlined" style="font-size:18px">add</span></button>
            </div>
          </article>
        `).join("") || `<p style="grid-column:1/-1;color:var(--on-surface-variant);text-align:center;padding:24px">No matches.</p>`}
      </div>
    </div>
  `;
}

function renderProduct() {
  const p = state.selectedProduct;
  const c = state.customization;
  const total = priceFor(p, c);
  return `
    <section class="product-hero">
      <div class="img-frame product-image-shadow"><img src="${p.img}" alt="${p.name}" /></div>
      <span class="badge-pill">${p.badge}</span>
      <h1>${p.name}</h1>
      <p class="desc">${p.desc}</p>
    </section>

    <div class="rating-row iso-recessed">
      <div class="left">
        <span class="material-symbols-outlined stars">star</span>
        <span>${p.rating}</span>
        <span class="reviews">(${p.reviews} reviews)</span>
      </div>
      <div class="price">${fmt(total)}</div>
    </div>

    <div class="opt-group">
      <h3>Size</h3>
      <div class="size-grid">
        ${SIZES.map(s => `
          <button class="size-card ${c.size === s.id ? "active iso-raised" : "iso-recessed"}" data-size="${s.id}">
            <span class="material-symbols-outlined ico">local_cafe</span>
            <span class="label">${s.label}</span>
            <span class="oz">${s.oz}</span>
          </button>
        `).join("")}
      </div>
    </div>

    <div class="opt-group">
      <h3>Milk Preference</h3>
      <div class="chip-row">
        ${MILKS.map(m => `
          <button class="opt-chip ${c.milk === m ? "active iso-raised" : "iso-recessed"}" data-milk="${m}">${m}</button>
        `).join("")}
      </div>
    </div>

    <div class="opt-group">
      <h3>Add-ins</h3>
      <div class="addon">
        <div class="addon-row iso-raised">
          <div class="left">
            <div class="ico-circle iso-recessed"><span class="material-symbols-outlined">water_drop</span></div>
            <div>
              <div class="name">Extra Espresso Shot</div>
              <div class="price">+$0.80</div>
            </div>
          </div>
          <div class="qty iso-recessed">
            <button data-qty="shot" data-delta="-1" aria-label="Less">−</button>
            <span class="val">${c.addons.shot}</span>
            <button class="plus iso-raised" data-qty="shot" data-delta="1" aria-label="More">+</button>
          </div>
        </div>
        <div class="addon-row iso-raised">
          <div class="left">
            <div class="ico-circle iso-recessed"><span class="material-symbols-outlined">opacity</span></div>
            <div>
              <div class="name">Extra Caramel Drizzle</div>
              <div class="price">+$0.50</div>
            </div>
          </div>
          <div class="toggle iso-recessed ${c.addons.drizzle ? "on" : ""}" data-toggle="drizzle" role="switch" aria-checked="${c.addons.drizzle}">
            <span class="knob"></span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderCart() {
  if (state.cart.length === 0) {
    return `<div class="cart-section iso-raised" style="text-align:center;padding:48px 24px">
      <span class="material-symbols-outlined" style="font-size:48px;color:var(--on-surface-variant)">shopping_bag</span>
      <h3 style="margin-top:12px">Your cart is empty</h3>
      <p style="color:var(--on-surface-variant);margin-top:8px">Add a drink from the menu to get started.</p>
    </div>`;
  }

  const subtotal = cartSubtotal();
  const tax = +(subtotal * 0.083).toFixed(2);
  const fee = 0.5;
  const total = subtotal + tax + fee;

  const pickupOpts = [
    { id: "asap", label: "ASAP", val: "10–15 min" },
    { id: "soon", label: "Soon", val: "11:30 AM" },
    { id: "later", label: "Later", val: "11:45 AM" },
    { id: "custom", label: "Custom", val: "📅" },
  ];

  return `
    <section class="cart-section iso-raised">
      <h3><span class="material-symbols-outlined">schedule</span> Pickup Time</h3>
      <div class="pickup-grid">
        ${pickupOpts.map(o => `
          <button class="pickup-card ${state.pickup === o.id ? "active iso-raised" : "iso-recessed"}" data-pickup="${o.id}">
            <span class="label">${o.label}</span>
            <span class="val">${o.val}</span>
          </button>
        `).join("")}
      </div>
    </section>

    <section class="cart-section iso-raised">
      <h3><span class="material-symbols-outlined">payments</span> Payment Method</h3>
      <button class="pay-row ${state.payment === "applepay" ? "iso-raised" : "iso-recessed"}" data-pay="applepay">
        <div class="left">
          <span class="material-symbols-outlined">account_balance_wallet</span>
          <div>
            <div>Apple Pay</div>
            <div class="sub">Default payment method</div>
          </div>
        </div>
        <span class="radio ${state.payment === "applepay" ? "on" : "iso-recessed"}">${state.payment === "applepay" ? "✓" : ""}</span>
      </button>
      <button class="pay-row ${state.payment === "card" ? "iso-raised" : "iso-recessed"}" data-pay="card">
        <div class="left">
          <span class="material-symbols-outlined">credit_card</span>
          <div>Visa ending in 4242</div>
        </div>
        <span class="radio ${state.payment === "card" ? "on" : "iso-recessed"}">${state.payment === "card" ? "✓" : ""}</span>
      </button>
      <a class="add-link" href="#"><span class="material-symbols-outlined" style="font-size:18px">add</span> Add new payment method</a>
    </section>

    <section class="cart-section iso-raised">
      <h3>Order Summary</h3>
      ${state.cart.map((i, idx) => `
        <div class="summary-row">
          <img src="${i.img}" alt="${i.name}" />
          <div>
            <div class="name">${i.name}</div>
            <div class="desc">${i.size} • ${i.milk}${i.addons.shot ? ` • ${i.addons.shot}× shot` : ""}${i.addons.drizzle ? " • caramel" : ""}</div>
          </div>
          <div class="price">${fmt(i.unitPrice * i.qty)}</div>
          <button class="icon-btn iso-recessed" style="width:32px;height:32px;margin-left:8px" data-remove="${idx}" aria-label="Remove">
            <span class="material-symbols-outlined" style="font-size:18px">close</span>
          </button>
        </div>
      `).join("")}
      <div class="divider"></div>
      <div class="totals">
        <div class="row"><span>Subtotal</span><span>${fmt(subtotal)}</span></div>
        <div class="row"><span>Tax</span><span>${fmt(tax)}</span></div>
        <div class="row"><span>Service Fee</span><span>${fmt(fee)}</span></div>
        <div class="row total"><span>Total</span><span>${fmt(total)}</span></div>
      </div>
    </section>
  `;
}

function renderBottomBar() {
  const bar = $("#bottom-bar");
  if (state.view === "menu") {
    const count = cartCount();
    const total = cartSubtotal();
    bar.innerHTML = `
      <div class="inner">
        <div class="nav">
          <button class="active" aria-label="Menu"><span class="material-symbols-outlined">local_cafe</span></button>
          <button aria-label="Favorites"><span class="material-symbols-outlined">favorite</span></button>
          <button aria-label="Rewards"><span class="material-symbols-outlined">star</span></button>
        </div>
        <button class="cta iso-button-primary" data-action="open-cart">
          <span class="material-symbols-outlined">shopping_bag</span>
          ${count ? `View Cart (${count})` : "Cart Empty"}
          ${count ? `<span class="dot"></span><span>${fmt(total)}</span>` : ""}
        </button>
      </div>
    `;
    bar.querySelector('[data-action="open-cart"]').addEventListener("click", () => {
      if (state.cart.length === 0) { showToast("Add an item first"); return; }
      setView("cart");
    });
  } else if (state.view === "product") {
    const total = priceFor(state.selectedProduct, state.customization);
    bar.innerHTML = `
      <div class="inner">
        <button class="icon-btn iso-raised" aria-label="Favorite" style="margin-left:6px">
          <span class="material-symbols-outlined">favorite_border</span>
        </button>
        <button class="cta iso-button-primary" data-action="add-to-order">
          Add to Order <span class="dot"></span> ${fmt(total)}
        </button>
      </div>
    `;
    bar.querySelector('[data-action="add-to-order"]').addEventListener("click", addCurrentToCart);
  } else if (state.view === "cart") {
    const total = cartSubtotal() + +(cartSubtotal() * 0.083).toFixed(2) + 0.5;
    bar.innerHTML = `
      <div class="inner">
        <button class="cta iso-button-primary" data-action="checkout">
          Complete Order <span class="dot"></span> ${fmt(state.cart.length ? total : 0)}
        </button>
      </div>
    `;
    bar.querySelector('[data-action="checkout"]').addEventListener("click", () => {
      if (state.cart.length === 0) return;
      showToast("Order placed! ☕ See you soon.");
      state.cart = [];
      setTimeout(() => setView("menu"), 1200);
    });
  }
}

function addCurrentToCart() {
  const p = state.selectedProduct;
  const c = JSON.parse(JSON.stringify(state.customization));
  const unitPrice = priceFor(p, c);
  const sz = SIZES.find(s => s.id === c.size);
  state.cart.push({
    id: p.id + "-" + Date.now(),
    name: p.name,
    img: p.img,
    size: sz.label,
    milk: c.milk,
    addons: c.addons,
    unitPrice,
    qty: 1,
  });
  showToast(`Added ${p.name} to cart`);
  setView("menu");
}

// ============== Event handlers ==============
function attachViewHandlers() {
  // Menu
  $$("[data-cat]").forEach(b => b.addEventListener("click", () => {
    state.category = b.dataset.cat; render();
  }));
  $("#search-input")?.addEventListener("input", e => {
    state.search = e.target.value;
    // Re-render only the grid without losing focus
    const grid = $(".product-grid");
    if (!grid) return;
    const filtered = PRODUCTS.filter(p =>
      (state.category === "All" || p.category === state.category) &&
      (!state.search || p.name.toLowerCase().includes(state.search.toLowerCase()))
    );
    grid.innerHTML = filtered.map(p => `
      <article class="product-card iso-raised" data-product="${p.id}">
        <div class="img-wrap"><img src="${p.img}" alt="${p.name}" /></div>
        <span class="tag">${p.tag}</span>
        <div class="name">${p.name}</div>
        <div class="meta">
          <span class="price">${fmt(p.price)}</span>
          <button class="add" data-add="${p.id}"><span class="material-symbols-outlined" style="font-size:18px">add</span></button>
        </div>
      </article>
    `).join("") || `<p style="grid-column:1/-1;color:var(--on-surface-variant);text-align:center;padding:24px">No matches.</p>`;
    bindProductCards();
  });
  bindProductCards();

  // Product detail
  $$("[data-size]").forEach(b => b.addEventListener("click", () => { state.customization.size = b.dataset.size; render(); }));
  $$("[data-milk]").forEach(b => b.addEventListener("click", () => { state.customization.milk = b.dataset.milk; render(); }));
  $$("[data-qty]").forEach(b => b.addEventListener("click", () => {
    const k = b.dataset.qty; const d = +b.dataset.delta;
    state.customization.addons[k] = Math.max(0, Math.min(5, state.customization.addons[k] + d));
    render();
  }));
  $$("[data-toggle]").forEach(b => b.addEventListener("click", () => {
    const k = b.dataset.toggle;
    state.customization.addons[k] = !state.customization.addons[k];
    render();
  }));

  // Cart
  $$("[data-pickup]").forEach(b => b.addEventListener("click", () => { state.pickup = b.dataset.pickup; render(); }));
  $$("[data-pay]").forEach(b => b.addEventListener("click", () => { state.payment = b.dataset.pay; render(); }));
  $$("[data-remove]").forEach(b => b.addEventListener("click", () => {
    state.cart.splice(+b.dataset.remove, 1);
    render();
  }));
}

function bindProductCards() {
  $$("[data-product]").forEach(card => {
    card.addEventListener("click", e => {
      if (e.target.closest("[data-add]")) return;
      const p = PRODUCTS.find(x => x.id === card.dataset.product);
      if (!p) return;
      state.selectedProduct = p;
      state.customization = { size: "grande", milk: "Whole Milk", addons: { shot: 1, drizzle: false } };
      setView("product");
    });
  });
  $$("[data-add]").forEach(btn => btn.addEventListener("click", e => {
    e.stopPropagation();
    const p = PRODUCTS.find(x => x.id === btn.dataset.add);
    if (!p) return;
    const unitPrice = p.price;
    state.cart.push({
      id: p.id + "-" + Date.now(),
      name: p.name, img: p.img,
      size: "Grande", milk: "Whole Milk",
      addons: { shot: 0, drizzle: false },
      unitPrice, qty: 1,
    });
    showToast(`Added ${p.name}`);
    render();
  }));
}

// ============== Init ==============
document.addEventListener("DOMContentLoaded", render);

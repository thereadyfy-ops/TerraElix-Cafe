// ============================================================
// TerraElix — site interactivity
// ============================================================

const PRODUCTS = [
  {
    id: "house-blend",
    name: "TerraElix House Blend",
    subtitle: "Artisanal Signature Roast",
    price: 18.0,
    image: "https://i.pinimg.com/736x/21/74/32/2174329b8ef1603c1cbc68bd9ef5865a.jpg",
    description: "A premium medium-dark roast combining organic Arabica beans with cocoa and toasted-nut notes for a smooth, balanced everyday cup.",
  },
  {
    id: "single-origin",
    name: "TerraElix Single Origin",
    subtitle: "Ethically Sourced Ethiopian",
    price: 22.0,
    image: "https://i.pinimg.com/736x/1b/5f/61/1b5f6105045f5c88a317f08412da08d3.jpg",
    description: "Light, crisp roast highlighting vibrant notes of jasmine, bergamot, and a clean, floral finish. Roasted in micro-batches.",
  },
  {
    id: "decaf-elixir",
    name: "TerraElix Decaf Elixir",
    subtitle: "Swiss Water Process",
    price: 19.0,
    image: "https://i.pinimg.com/736x/d2/10/ef/d210ef547f8d9348e8a56645f2951312.jpg",
    description: "A rich, comforting caffeine-free experience with hints of velvety dark chocolate, roasted hazelnut, and toasted vanilla.",
  },
  {
    id: "cold-brew",
    name: "TerraElix Cold Brew Concentrate",
    subtitle: "Slow-Steeped 18 Hours",
    price: 16.0,
    image: "https://i.pinimg.com/736x/49/69/f7/4969f7bc5abbec27aa52d539070ac08e.jpg",
    description: "Smooth, low-acidity concentrate steeped for eighteen hours. Just add water or milk over ice for an instant café pour.",
  },
  {
    id: "espresso-roast",
    name: "TerraElix Espresso Roast",
    subtitle: "Dark & Bold Italian Style",
    price: 20.0,
    image: "https://i.pinimg.com/736x/4d/ee/81/4dee81f6a2a2453e061e9352c62f8b78.jpg",
    description: "A dense, syrupy espresso roast built for crema — deep caramelized sugar and dark chocolate carry through every shot.",
  },
  {
    id: "oat-latte-blend",
    name: "TerraElix Oat Latte Blend",
    subtitle: "Barista Formulated",
    price: 17.0,
    image: "https://i.pinimg.com/736x/11/26/e1/1126e14bb7a949f33d45cc13b993222f.jpg",
    description: "Formulated specifically to hold its own against oat milk — nutty, lightly sweet, and never bitter.",
  },
];

const TESTIMONIALS = [
  { name: "Amara O.", role: "Regular, 3 years", quote: "The single origin changed how I think about coffee. Bright, clean, never bitter — and it's the same every single bag." },
  { name: "Devon K.", role: "Roast Club member", quote: "I've tried a dozen subscription roasters. TerraElix is the only one I haven't cancelled. The café itself is just as good." },
  { name: "Priya S.", role: "Local regular", quote: "Staff remembers my order, the space is calm in the mornings, and the decaf actually tastes like coffee. Rare combination." },
];

const CAROUSEL_CARDS = [
  { icon: "coffee", bg: "#4E3629", text: "Savor our freshly roasted micro-batch signature blends" },
  { icon: "compass", bg: "#8C6239", text: "100% organic beans, direct trade & ethically sourced" },
  { icon: "sparkles", bg: "#A07855", text: "Precision roasted to extract full rich flavor oils" },
  { icon: "heart", bg: "#6F4E37", text: "Designed for steady, clean morning energy & focus" },
];

const QUESTIONS = [
  {
    id: "goal",
    question: "What is your preferred taste profile?",
    description: "We roast our beans to highlight specific flavor complexities, from rich chocolate to bright fruits.",
    options: [
      { label: "Balanced, nutty & smooth chocolaty notes", value: "house-blend" },
      { label: "Vibrant, bright & floral citrus notes", value: "single-origin" },
      { label: "Rich, warm cocoa & decaf decadence", value: "decaf-elixir" },
    ],
  },
  {
    id: "brew",
    question: "How do you typically brew your coffee?",
    description: "All our micro-batch roasts can be ordered as whole bean or customized ground profiles.",
    options: [
      { label: "Espresso machine / moka pot", value: "espresso" },
      { label: "Drip / pour over / French press", value: "filter" },
      { label: "Cold brew / automatic brewer", value: "cold" },
    ],
  },
  {
    id: "caffeine",
    question: "What is your daily caffeine tolerance?",
    description: "We match the roast strength and active caffeine factors to your daily wellness routine.",
    options: [
      { label: "Sustained & balanced (standard daily fuel)", value: "balanced" },
      { label: "High octane focus (intense performance)", value: "intense" },
      { label: "Caffeine-free serenity (pure flavor, zero jitters)", value: "none" },
    ],
  },
];

// ---------------- State ----------------
let cartItems = []; // { product, quantity }
let quizStep = 1;
let quizAnswers = {};
let activeCardIdx = 0;
let toastTimer = null;

// ---------------- Helpers ----------------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const fmt = (n) => `$${n.toFixed(2)}`;

function refreshIcons() {
  if (window.lucide) window.lucide.createIcons();
}

function showToast(message) {
  const toast = $("#toast");
  $("#toast-message").textContent = message;
  toast.classList.remove("hidden");
  toast.classList.add("flex");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.add("hidden");
    toast.classList.remove("flex");
  }, 4000);
}

// ---------------- Cart ----------------
function addToCart(product) {
  const existing = cartItems.find((i) => i.product.id === product.id);
  if (existing) {
    existing.quantity += 1;
    showToast(`Increased quantity of ${product.name} in your bag`);
  } else {
    cartItems.push({ product, quantity: 1 });
    showToast(`Added ${product.name} to your bag`);
  }
  renderCart();
}

function updateQty(productId, delta) {
  const item = cartItems.find((i) => i.product.id === productId);
  if (!item) return;
  item.quantity += delta;
  cartItems = cartItems.filter((i) => i.quantity > 0);
  renderCart();
}

function removeItem(productId) {
  const item = cartItems.find((i) => i.product.id === productId);
  if (item) {
    cartItems = cartItems.filter((i) => i.product.id !== productId);
    showToast(`Removed ${item.product.name} from your bag`);
  }
  renderCart();
}

function totalCartCount() {
  return cartItems.reduce((acc, i) => acc + i.quantity, 0);
}

function renderCartBadges() {
  const count = totalCartCount();
  const badge = $("#cart-badge");
  const headerCount = $("#cart-header-count");
  if (count > 0) {
    badge.textContent = count;
    badge.classList.remove("hidden");
    badge.classList.add("flex");
    headerCount.textContent = count;
    headerCount.classList.remove("hidden");
  } else {
    badge.classList.add("hidden");
    badge.classList.remove("flex");
    headerCount.classList.add("hidden");
  }
}

function cartItemRow(item) {
  return `
  <div class="flex gap-4 p-4 rounded-xl bg-white border border-[#E3D9CE] hover:border-[#6F4E37] transition-all">
    <img src="${item.product.image}" alt="${item.product.name}" class="w-16 h-16 sm:w-20 sm:h-20 object-cover bg-[#F4EFEA] rounded-lg p-1 shrink-0 border border-[#E3D9CE]" />
    <div class="flex-1 flex flex-col justify-between">
      <div>
        <div class="flex justify-between items-start gap-2">
          <h4 class="font-dm text-sm sm:text-base font-normal text-[#2E1A12] line-clamp-1">${item.product.name}</h4>
          <span class="font-sans text-sm font-medium text-[#2E1A12] shrink-0">${fmt(item.product.price * item.quantity)}</span>
        </div>
        <span class="text-[10px] font-mono uppercase tracking-wider text-[#6F4E37]">${item.product.subtitle}</span>
      </div>
      <div class="flex justify-between items-center mt-2">
        <div class="flex items-center gap-1 bg-[#FCF9F2] border border-[#E3D9CE] rounded-lg px-1 py-0.5">
          <button data-qty="-1" data-id="${item.product.id}" class="qty-btn p-1 hover:text-[#2E1A12] text-[#2E1A12]/40 transition-colors"><i data-lucide="minus" class="w-3.5 h-3.5"></i></button>
          <span class="w-6 text-center font-sans text-xs sm:text-sm">${item.quantity}</span>
          <button data-qty="1" data-id="${item.product.id}" class="qty-btn p-1 hover:text-[#2E1A12] text-[#2E1A12]/40 transition-colors"><i data-lucide="plus" class="w-3.5 h-3.5"></i></button>
        </div>
        <button data-remove="${item.product.id}" class="remove-btn p-1.5 hover:text-red-600 text-[#2E1A12]/35 transition-colors" aria-label="Remove item"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
      </div>
    </div>
  </div>`;
}

function renderCart() {
  renderCartBadges();
  const body = $("#cart-body");
  const footer = $("#cart-footer");

  if (cartItems.length === 0) {
    body.innerHTML = `
      <div class="flex-1 h-full flex flex-col items-center justify-center p-8 text-center">
        <div class="w-12 h-12 rounded-full bg-[#F4EFEA] flex items-center justify-center mb-4 text-[#2E1A12]/40"><i data-lucide="shopping-bag" class="w-6 h-6"></i></div>
        <p class="font-dm text-lg text-[#2E1A12] mb-1">Your bag is empty</p>
        <p class="text-[#2E1A12]/50 text-xs sm:text-sm max-w-xs">Explore our signature coffee roast selections to begin your morning ritual.</p>
        <button id="btn-continue-browsing" class="mt-6 px-6 py-2.5 bg-[#2E1A12] text-[#FCF9F2] font-sans font-medium text-xs sm:text-sm rounded-lg hover:bg-[#1F110B] transition-colors cursor-pointer">Continue Browsing</button>
      </div>`;
    footer.innerHTML = "";
    $("#btn-continue-browsing")?.addEventListener("click", closeCart);
  } else {
    body.innerHTML = `<div class="p-6 space-y-4">${cartItems.map(cartItemRow).join("")}</div>`;
    const subtotal = cartItems.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
    footer.innerHTML = `
      <div class="p-6 border-t border-[#E3D9CE] bg-[#FCF9F2] space-y-4">
        <div class="space-y-1.5 text-sm sm:text-base">
          <div class="flex justify-between text-[#2E1A12]/70"><span>Subtotal</span><span>${fmt(subtotal)}</span></div>
          <div class="flex justify-between text-[#2E1A12]/70"><span>Shipping</span><span class="text-[#6F4E37] font-medium">Complimentary</span></div>
          <div class="border-t border-[#E3D9CE] my-2 pt-2 flex justify-between font-dm text-lg sm:text-xl text-[#2E1A12]"><span>Estimated Total</span><span>${fmt(subtotal)}</span></div>
        </div>
        <button id="btn-checkout" class="w-full h-12 bg-[#2E1A12] text-[#FCF9F2] hover:bg-[#1F110B] transition-colors font-sans font-medium rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm">
          <span>Secure Checkout</span>
        </button>
        <p class="text-center text-[10px] text-[#2E1A12]/40 tracking-normal leading-relaxed">By clicking secure checkout, you accept our standard premium roasting logistics.</p>
      </div>`;
    $("#btn-checkout")?.addEventListener("click", handleCheckout);
  }

  $$(".qty-btn").forEach((btn) =>
    btn.addEventListener("click", () => updateQty(btn.dataset.id, parseInt(btn.dataset.qty, 10)))
  );
  $$(".remove-btn").forEach((btn) =>
    btn.addEventListener("click", () => removeItem(btn.dataset.remove))
  );

  refreshIcons();
}

function handleCheckout() {
  const footer = $("#cart-footer");
  const body = $("#cart-body");
  footer.innerHTML = "";
  body.innerHTML = `
    <div class="h-full flex flex-col items-center justify-center p-8 text-center">
      <svg class="animate-spin h-8 w-8 text-[#2E1A12] mb-4" viewBox="0 0 24 24" fill="none">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="font-dm text-lg">Securing order...</p>
    </div>`;

  setTimeout(() => {
    body.innerHTML = `
      <div class="h-full flex flex-col items-center justify-center p-8 text-center animate-fade-in">
        <div class="w-16 h-16 bg-[#2E1A12]/5 rounded-full flex items-center justify-center mb-4"><i data-lucide="sparkles" class="w-8 h-8 text-[#A07855] animate-pulse"></i></div>
        <h4 class="font-dm text-2xl font-normal text-[#2E1A12] mb-2">Order Confirmed</h4>
        <p class="text-[#2E1A12]/70 text-sm max-w-xs leading-relaxed">Thank you for choosing TerraElix! Your artisanal roasts are being fresh-roasted and prepared for express dispatch.</p>
        <div class="mt-8 text-xs font-mono tracking-widest text-[#6F4E37] font-semibold">ROASTING &amp; PACKING IN PROGRESS</div>
      </div>`;
    refreshIcons();
    setTimeout(() => {
      cartItems = [];
      renderCart();
      closeCart();
      showToast("Thank you! Order successfully processed.");
    }, 3200);
  }, 1800);
}

function openCart() {
  $("#cart-drawer").classList.remove("hidden");
  $("#cart-drawer").classList.add("flex");
  document.body.style.overflow = "hidden";
}
function closeCart() {
  $("#cart-drawer").classList.add("hidden");
  $("#cart-drawer").classList.remove("flex");
  document.body.style.overflow = "";
}

// ---------------- Products grid ----------------
function productCard(product) {
  return `
  <div class="group bg-[#FCF9F2] border border-[#E3D9CE] rounded-2xl overflow-hidden hover:border-[#6F4E37] transition-all duration-300 flex flex-col">
    <div class="relative aspect-[4/3] overflow-hidden bg-[#EADDC9]/30">
      <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
    </div>
    <div class="p-5 sm:p-6 flex flex-col flex-1">
      <span class="text-[10px] font-mono uppercase tracking-widest text-[#6F4E37] font-semibold">${product.subtitle}</span>
      <h3 class="font-dm text-xl sm:text-2xl font-normal tracking-[-0.03em] mt-1 mb-2">${product.name}</h3>
      <p class="text-[#2E1A12]/65 text-sm leading-relaxed mb-5 flex-1">${product.description}</p>
      <div class="flex items-center justify-between">
        <span class="font-sans text-lg font-medium">${fmt(product.price)}</span>
        <button data-add="${product.id}" class="add-to-cart-btn flex items-center gap-1.5 px-4 py-2 bg-[#2E1A12] text-[#FCF9F2] text-xs sm:text-sm font-sans font-medium rounded-lg hover:bg-[#1F110B] transition-colors cursor-pointer">
          <i data-lucide="shopping-bag" class="w-3.5 h-3.5"></i><span>Add to Bag</span>
        </button>
      </div>
    </div>
  </div>`;
}

function renderProducts() {
  $("#products-grid").innerHTML = PRODUCTS.map(productCard).join("");
  $$(".add-to-cart-btn").forEach((btn) =>
    btn.addEventListener("click", () => {
      const product = PRODUCTS.find((p) => p.id === btn.dataset.add);
      addToCart(product);
    })
  );
  refreshIcons();
}

// ---------------- Testimonials ----------------
function testimonialCard(t) {
  const stars = Array.from({ length: 5 }).map(() => `<i data-lucide="star" class="w-3.5 h-3.5 fill-[#A07855] text-[#A07855]"></i>`).join("");
  return `
  <div class="bg-[#F4EFEA] border border-[#E3D9CE] rounded-2xl p-6 sm:p-7 flex flex-col reveal">
    <div class="flex gap-1 mb-4">${stars}</div>
    <p class="text-[#2E1A12]/80 text-sm sm:text-base leading-relaxed mb-6 flex-1">&ldquo;${t.quote}&rdquo;</p>
    <div>
      <span class="font-dm text-base">${t.name}</span>
      <span class="block text-xs text-[#2E1A12]/50">${t.role}</span>
    </div>
  </div>`;
}
function renderTestimonials() {
  $("#testimonials-grid").innerHTML = TESTIMONIALS.map(testimonialCard).join("");
  refreshIcons();
  observeReveals();
}

// ---------------- Carousel (bottom grid panel 2) ----------------
function renderCarousel() {
  const slidesEl = $("#carousel-slides");
  const indicatorsEl = $("#carousel-indicators");

  slidesEl.innerHTML = CAROUSEL_CARDS.map((card, idx) => `
    <div class="carousel-slide w-full flex items-center gap-4 transition-all duration-700 ease-out ${idx === activeCardIdx ? "opacity-100 translate-y-0 relative z-10" : "opacity-0 translate-y-4 absolute z-0 pointer-events-none"}">
      <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white shrink-0 shadow-xs" style="background:${card.bg}">
        <i data-lucide="${card.icon}" class="w-5 h-5 sm:w-6 sm:h-6"></i>
      </div>
      <p class="font-sans text-sm sm:text-base lg:text-lg text-[#2E1A12] leading-[1.2] tracking-[-0.03em] max-w-[200px]">${card.text}</p>
    </div>
  `).join("");

  indicatorsEl.innerHTML = CAROUSEL_CARDS.map((_, idx) => `
    <button data-slide="${idx}" class="carousel-dot h-0.5 flex-1 rounded-full transition-all duration-300 cursor-pointer" style="background:${idx === activeCardIdx ? "#4E3629" : "rgba(78,54,41,0.2)"}"></button>
  `).join("");

  $$(".carousel-dot").forEach((dot) =>
    dot.addEventListener("click", () => {
      activeCardIdx = parseInt(dot.dataset.slide, 10);
      renderCarousel();
    })
  );
  refreshIcons();
}

setInterval(() => {
  activeCardIdx = (activeCardIdx + 1) % CAROUSEL_CARDS.length;
  renderCarousel();
}, 3500);

// ---------------- Search overlay ----------------
function searchResultRow(product) {
  return `
  <div class="flex gap-4 p-4 rounded-xl bg-[#4E3629]/20 border border-[#4E3629]/40 hover:border-[#A07855]/70 transition-all items-center">
    <img src="${product.image}" alt="${product.name}" class="w-16 h-16 sm:w-20 sm:h-20 object-cover bg-white/10 p-1 rounded-lg shrink-0 border border-[#EADDC9]/10" />
    <div class="flex-1 min-w-0">
      <span class="text-[10px] font-mono uppercase tracking-widest text-[#A07855]">${product.subtitle}</span>
      <h5 class="font-dm text-base sm:text-lg text-[#FCF9F2] font-normal truncate mt-0.5">${product.name}</h5>
      <p class="text-[#EADDC9]/75 text-xs mt-1 line-clamp-1">${product.description}</p>
      <div class="flex items-center justify-between mt-2">
        <span class="text-sm font-sans font-medium text-[#FCF9F2]">${fmt(product.price)}</span>
        <button data-add="${product.id}" class="search-add-btn flex items-center gap-1.5 px-3 py-1 bg-[#FCF9F2] text-[#2E1A12] text-xs font-sans font-medium rounded-md hover:bg-[#EADDC9] transition-colors cursor-pointer">
          <i data-lucide="shopping-bag" class="w-3.5 h-3.5"></i><span>Add</span>
        </button>
      </div>
    </div>
  </div>`;
}

function renderSearchResults(query) {
  const el = $("#search-results");
  const q = query.trim().toLowerCase();

  if (q === "") {
    el.innerHTML = `
      <div>
        <h4 class="text-xs font-mono text-[#EADDC9]/50 uppercase tracking-widest mb-4">Trending Suggestions</h4>
        <div class="flex flex-wrap gap-2">
          ${["House Blend", "Single Origin", "Decaf Elixir", "Cold Brew", "Espresso Roast"].map((tag) => `<button data-tag="${tag}" class="tag-btn px-4 py-2 rounded-full border border-[#4E3629] hover:border-[#EADDC9] text-xs sm:text-sm font-sans text-[#EADDC9]/80 hover:text-[#FCF9F2] bg-[#4E3629]/25 hover:bg-[#4E3629]/50 transition-all cursor-pointer">${tag}</button>`).join("")}
        </div>
      </div>`;
    $$(".tag-btn").forEach((btn) =>
      btn.addEventListener("click", () => {
        $("#search-input").value = btn.dataset.tag;
        renderSearchResults(btn.dataset.tag);
      })
    );
  } else {
    const filtered = PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
    if (filtered.length === 0) {
      el.innerHTML = `
        <div class="py-12 text-center text-[#EADDC9]/50">
          <p class="text-lg font-dm">No roasts found matching "${query}"</p>
          <p class="text-xs sm:text-sm mt-1">Try searching for generic terms like "blend", "origin" or "decaf".</p>
        </div>`;
    } else {
      el.innerHTML = `
        <div>
          <h4 class="text-xs font-mono text-[#EADDC9]/50 uppercase tracking-widest mb-4">Found ${filtered.length} Match${filtered.length > 1 ? "es" : ""}</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">${filtered.map(searchResultRow).join("")}</div>
        </div>`;
      $$(".search-add-btn").forEach((btn) =>
        btn.addEventListener("click", () => {
          const product = PRODUCTS.find((p) => p.id === btn.dataset.add);
          addToCart(product);
          closeSearch();
        })
      );
    }
  }
  refreshIcons();
}

function openSearch() {
  $("#search-overlay").classList.remove("hidden");
  $("#search-overlay").classList.add("flex");
  document.body.style.overflow = "hidden";
  renderSearchResults("");
  setTimeout(() => $("#search-input")?.focus(), 100);
}
function closeSearch() {
  $("#search-overlay").classList.add("hidden");
  $("#search-overlay").classList.remove("flex");
  document.body.style.overflow = "";
}

// ---------------- Assessment quiz ----------------
function renderQuiz() {
  const el = $("#assessment-content");

  if (quizStep <= 3) {
    const q = QUESTIONS[quizStep - 1];
    el.innerHTML = `
      <div class="mb-6">
        <div class="flex justify-between items-center mb-2 text-xs font-mono tracking-widest text-[#2E1A12]/50 uppercase">
          <span>Step ${quizStep} of 3</span>
          <span>${Math.round(((quizStep - 1) / 3) * 100)}% Complete</span>
        </div>
        <div class="h-1 bg-[#2E1A12]/10 rounded-full overflow-hidden">
          <div class="h-full bg-[#6F4E37] transition-all duration-500" style="width:${(quizStep / 3) * 100}%"></div>
        </div>
      </div>
      <div class="min-h-[280px] flex flex-col justify-between">
        <div>
          <h3 class="font-dm text-2xl sm:text-3xl font-normal tracking-tight mb-2">${q.question}</h3>
          <p class="text-[#2E1A12]/70 text-sm sm:text-base font-sans mb-6">${q.description}</p>
          <div class="space-y-3">
            ${q.options.map((opt) => {
              const isSelected = quizAnswers[q.id] === opt.value;
              return `
              <button data-qid="${q.id}" data-value="${opt.value}" class="quiz-option w-full text-left p-4 rounded-xl border font-sans text-sm sm:text-base transition-all duration-300 flex items-center justify-between group cursor-pointer ${isSelected ? "border-[#2E1A12] bg-[#2E1A12]/5 text-[#2E1A12]" : "border-[#E3D9CE] bg-white text-[#2E1A12]/80 hover:border-[#6F4E37] hover:bg-[#F4EFEA]"}">
                <span>${opt.label}</span>
                <span class="w-5 h-5 rounded-full flex items-center justify-center border transition-all ${isSelected ? "border-[#2E1A12] bg-[#2E1A12] text-white" : "border-[#E3D9CE] group-hover:border-[#6F4E37]"}">
                  ${isSelected ? '<i data-lucide="check" class="w-3 h-3"></i>' : '<i data-lucide="arrow-right" class="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"></i>'}
                </span>
              </button>`;
            }).join("")}
          </div>
        </div>
        ${quizStep > 1 ? `<button id="quiz-back" class="mt-6 flex items-center gap-2 text-xs font-mono uppercase text-[#2E1A12]/40 hover:text-[#2E1A12] transition-colors self-start">Back</button>` : ""}
      </div>`;

    $$(".quiz-option").forEach((btn) =>
      btn.addEventListener("click", () => {
        quizAnswers[btn.dataset.qid] = btn.dataset.value;
        quizStep = quizStep < 3 ? quizStep + 1 : 4;
        renderQuiz();
      })
    );
    $("#quiz-back")?.addEventListener("click", () => {
      quizStep -= 1;
      renderQuiz();
    });
  } else {
    const recommendedId = quizAnswers["goal"] || "house-blend";
    const product = PRODUCTS.find((p) => p.id === recommendedId) || PRODUCTS[0];
    el.innerHTML = `
      <div class="text-center animate-fade-in">
        <div class="inline-flex p-3 bg-[#2E1A12]/5 rounded-full mb-4"><i data-lucide="sparkles" class="w-6 h-6 text-[#A07855] animate-pulse"></i></div>
        <h3 class="font-dm text-3xl font-normal tracking-tight mb-2">Your Perfect Match</h3>
        <p class="text-[#2E1A12]/70 text-sm sm:text-base mb-6 max-w-md mx-auto">Based on your custom taste profile and brewing method, we recommend:</p>
        <div class="bg-[#F4EFEA] border border-[#E3D9CE] rounded-2xl p-5 mb-6 text-left flex flex-col sm:flex-row items-center gap-5">
          <img src="${product.image}" alt="${product.name}" class="w-24 h-24 sm:w-28 sm:h-28 object-cover shrink-0 bg-white/50 rounded-xl p-1 shadow-xs border border-[#E3D9CE]" />
          <div>
            <span class="text-[10px] font-mono uppercase tracking-widest text-[#6F4E37] font-semibold">${product.subtitle}</span>
            <h4 class="font-dm text-xl font-normal mt-1">${product.name}</h4>
            <p class="text-[#2E1A12]/70 text-xs sm:text-sm mt-1.5 leading-relaxed">${product.description}</p>
            <div class="mt-3 flex items-center gap-3">
              <span class="text-lg font-sans font-medium">${fmt(product.price)}</span>
              <span class="text-xs text-[#2E1A12]/40 line-through">${fmt(product.price * 1.2)}</span>
            </div>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row gap-3">
          <button id="quiz-add" class="flex-1 bg-[#2E1A12] text-[#FCF9F2] font-sans font-medium h-12 rounded-xl hover:bg-[#1F110B] transition-all flex items-center justify-center gap-2 group cursor-pointer">
            <span>Add to Bag</span><i data-lucide="arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform"></i>
          </button>
          <button id="quiz-retake" class="px-5 border border-[#E3D9CE] hover:border-[#6F4E37] rounded-xl hover:bg-[#F4EFEA] transition-all flex items-center justify-center gap-2 text-[#2E1A12]/70 hover:text-[#2E1A12] cursor-pointer h-12 font-sans">
            <i data-lucide="rotate-ccw" class="w-4 h-4"></i><span>Retake Quiz</span>
          </button>
        </div>
      </div>`;

    $("#quiz-add")?.addEventListener("click", () => {
      addToCart(product);
      closeAssessment();
    });
    $("#quiz-retake")?.addEventListener("click", () => {
      quizStep = 1;
      quizAnswers = {};
      renderQuiz();
    });
  }
  refreshIcons();
}

function openAssessment() {
  quizStep = 1;
  quizAnswers = {};
  renderQuiz();
  $("#assessment-modal").classList.remove("hidden");
  $("#assessment-modal").classList.add("flex");
  document.body.style.overflow = "hidden";
}
function closeAssessment() {
  $("#assessment-modal").classList.add("hidden");
  $("#assessment-modal").classList.remove("flex");
  document.body.style.overflow = "";
}

// ---------------- Promo pop-up banner ----------------
function openPromoPopup() {
  if (sessionStorage.getItem("terraelix_promo_dismissed") === "1") return;
  $("#promo-popup").classList.remove("hidden");
  $("#promo-popup").classList.add("flex");
  document.body.style.overflow = "hidden";
}
function closePromoPopup() {
  $("#promo-popup").classList.add("hidden");
  $("#promo-popup").classList.remove("flex");
  document.body.style.overflow = "";
  sessionStorage.setItem("terraelix_promo_dismissed", "1");
}

// ---------------- Mobile menu ----------------
function openMobileMenu() {
  $("#mobile-menu-overlay").classList.remove("hidden");
  $("#mobile-menu-overlay").classList.add("flex");
  document.body.style.overflow = "hidden";
}
function closeMobileMenu() {
  $("#mobile-menu-overlay").classList.add("hidden");
  $("#mobile-menu-overlay").classList.remove("flex");
  document.body.style.overflow = "";
}

// ---------------- Reset ----------------
function resetAll() {
  cartItems = [];
  quizStep = 1;
  quizAnswers = {};
  renderCart();
  closeCart();
  closeSearch();
  closeAssessment();
  closeMobileMenu();
  window.scrollTo({ top: 0, behavior: "smooth" });
  showToast("Session reset successfully. Cart cleared.");
}

// ---------------- Navbar scroll state ----------------
function handleNavbarScroll() {
  const nav = $("#main-navbar");
  if (window.scrollY > window.innerHeight * 0.75) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
}

// ---------------- Scroll reveal ----------------
function observeReveals() {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  $$(".reveal:not(.is-visible)").forEach((el) => io.observe(el));
}

// ---------------- Init ----------------
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderTestimonials();
  renderCarousel();
  renderCart();
  refreshIcons();
  observeReveals();
  handleNavbarScroll();

  window.addEventListener("scroll", handleNavbarScroll, { passive: true });

  $("#btn-search").addEventListener("click", openSearch);
  $("#btn-close-search").addEventListener("click", closeSearch);
  $("#search-input").addEventListener("input", (e) => renderSearchResults(e.target.value));

  $("#btn-cart").addEventListener("click", openCart);
  $("#btn-close-cart").addEventListener("click", closeCart);
  $("#cart-backdrop").addEventListener("click", closeCart);

  $("#btn-reset").addEventListener("click", resetAll);

  $("#btn-mobile-menu").addEventListener("click", openMobileMenu);
  $("#btn-close-mobile-menu").addEventListener("click", closeMobileMenu);
  $$(".mobile-link").forEach((a) => a.addEventListener("click", closeMobileMenu));

  $("#btn-explore").addEventListener("click", openAssessment);
  $("#btn-explore-2").addEventListener("click", openAssessment);
  $("#btn-assessment-2").addEventListener("click", openAssessment);
  $("#btn-close-assessment").addEventListener("click", closeAssessment);

  $("#btn-copy-code")?.addEventListener("click", () => {
    navigator.clipboard?.writeText("ROASTCLUB20").catch(() => {});
    showToast("Promo code copied: ROASTCLUB20");
  });

  $("#contact-form").addEventListener("submit", (e) => {
    e.preventDefault();
    e.target.reset();
    showToast("Message sent — we'll get back to you shortly.");
  });

  $("#newsletter-form").addEventListener("submit", (e) => {
    e.preventDefault();
    e.target.reset();
    showToast("You're subscribed to the TerraElix newsletter.");
  });

  $("#btn-close-promo").addEventListener("click", closePromoPopup);
  $("#btn-dismiss-promo").addEventListener("click", closePromoPopup);
  $("#promo-popup").addEventListener("click", (e) => {
    if (e.target.id === "promo-popup") closePromoPopup();
  });
  $("#promo-form").addEventListener("submit", (e) => {
    e.preventDefault();
    e.target.reset();
    closePromoPopup();
    showToast("Welcome code sent: WELCOME15");
  });

  // Show the promo pop-up once per session, a couple seconds after arrival
  setTimeout(openPromoPopup, 2500);

  // ESC closes any open overlay
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeCart();
      closeSearch();
      closeAssessment();
      closeMobileMenu();
      closePromoPopup();
    }
  });
});

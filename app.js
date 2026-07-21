const categories = [
  { title: 'Pendants', handle: 'pendants' },
  { title: 'Watches', handle: 'watches' },
  { title: 'Bracelets', handle: 'bracelets' },
  { title: 'Earrings', handle: 'earrings' },
  { title: 'Rings', handle: 'rings' },
  { title: 'Engagement Rings', handle: 'engagement-rings' },
  { title: 'Sets', handle: 'sets' },
  { title: 'Chains', handle: 'chains' },
  { title: 'Misc', handle: 'misc' },
];

const app = document.querySelector('#app');
const searchToggle = document.querySelector('[data-search-toggle]');
const searchForm = document.querySelector('[data-search-form]');
const searchInput = document.querySelector('[data-search-input]');
const shopToggle = document.querySelector('[data-shop-toggle]');
const shopMenu = document.querySelector('[data-shop-menu]');
const mobileToggle = document.querySelector('[data-mobile-toggle]');
const mobileMenu = document.querySelector('[data-mobile-menu]');
const cartDrawer = document.querySelector('[data-cart-drawer]');
const cartClose = document.querySelector('[data-cart-close]');
const checkoutButton = document.querySelector('[data-checkout-button]');
const cartItems = document.querySelector('[data-cart-items]');
const cartTotal = document.querySelector('[data-cart-total]');
const cartCount = document.querySelector('[data-cart-count]');

let currentProducts = [];
let currentRoute = '/';

window.addEventListener('hashchange', renderRoute);
window.addEventListener('DOMContentLoaded', renderRoute);

searchToggle?.addEventListener('click', () => {
  const isOpen = searchForm.classList.toggle('is-open');
  searchToggle.setAttribute('aria-expanded', String(isOpen));
  if (isOpen) searchInput?.focus();
});

searchForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;
  window.location.hash = `#/search/${encodeURIComponent(query)}`;
});

shopToggle?.addEventListener('click', () => {
  const isOpen = shopMenu.classList.toggle('is-open');
  shopToggle.setAttribute('aria-expanded', String(isOpen));
});

mobileToggle?.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('is-open');
  mobileToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.mobile-menu a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('is-open');
    mobileToggle?.setAttribute('aria-expanded', 'false');
  });
});

document.querySelectorAll('[data-cart-button]').forEach((button) => {
  button.addEventListener('click', openCart);
});

document.querySelectorAll('[data-account-button]').forEach((button) => {
  button.addEventListener('click', () => window.IsmaShopify.openCustomerAccount());
});

cartClose?.addEventListener('click', closeCart);
checkoutButton?.addEventListener('click', () => window.IsmaShopify.redirectToCheckout());

async function renderRoute() {
  currentRoute = window.location.hash.replace(/^#/, '') || '/';
  app.innerHTML = '';
  app.focus({ preventScroll: true });

  if (currentRoute === '/') {
    renderHome();
    return;
  }

  if (currentRoute === '/shop') {
    await renderShop();
    return;
  }

  if (currentRoute.startsWith('/shop/')) {
    await renderShop(currentRoute.replace('/shop/', ''));
    return;
  }

  if (currentRoute.startsWith('/product/')) {
    await renderProduct(currentRoute.replace('/product/', ''));
    return;
  }

  if (currentRoute.startsWith('/search/')) {
    await renderSearch(decodeURIComponent(currentRoute.replace('/search/', '')));
    return;
  }

  if (currentRoute === '/custom') {
    renderCustom();
    return;
  }

  if (currentRoute === '/portfolio') {
    renderPortfolio();
    return;
  }

  renderNotFound();
}

function renderHome() {
  app.innerHTML = `
    <section class="hero" aria-label="IsmaTheJeweler hero">
      <div class="blank-media hero-media"><span>Homepage hero image/video placeholder</span></div>
      <div class="hero-content">
        <p>IsmaTheJeweler</p>
        <h1>Luxury Jewelry at Its Finest</h1>
        <a class="button button-light" href="#/shop">Shop All</a>
      </div>
    </section>
    <section class="content-section">
      <div class="section-title">
        <p>Media left blank</p>
        <h2>Featured Spaces</h2>
      </div>
      <div class="media-grid">
        <div class="blank-media"><span>Featured photo placeholder</span></div>
        <div class="blank-media"><span>Featured photo placeholder</span></div>
        <div class="blank-media"><span>Featured photo placeholder</span></div>
      </div>
    </section>
  `;
}

async function renderShop(collectionHandle = '') {
  const category = categories.find((item) => item.handle === collectionHandle);
  const title = category ? category.title : 'Products';
  app.innerHTML = shopTemplate(title);

  const products = collectionHandle
    ? await window.IsmaShopify.fetchProductsByCollection(collectionHandle, 48)
    : await window.IsmaShopify.fetchProducts(48);

  currentProducts = products;
  setupShopControls();
  renderProductGrid(products);
}

async function renderSearch(query) {
  app.innerHTML = shopTemplate(`Search: ${escapeHtml(query)}`);
  const products = await window.IsmaShopify.searchProducts(query, 48);
  currentProducts = products;
  setupShopControls();
  renderProductGrid(products);
}

function shopTemplate(title) {
  return `
    <section class="shop-page">
      <div class="section-title">
        <p>Shopify API ready</p>
        <h1>${title}</h1>
      </div>
      <div class="shop-layout">
        <aside class="filters" aria-label="Product filters">
          <details open>
            <summary>Availability</summary>
            <label class="check-label"><input type="checkbox" data-available-only> In stock only</label>
          </details>
          <details open>
            <summary>Price</summary>
            <label for="min-price">Min price</label>
            <input id="min-price" type="number" min="0" inputmode="decimal" placeholder="0" data-min-price>
            <label for="max-price">Max price</label>
            <input id="max-price" type="number" min="0" inputmode="decimal" placeholder="No limit" data-max-price>
          </details>
        </aside>
        <section>
          <div class="shop-toolbar">
            <span data-product-count>0 products</span>
            <label for="sort-products">Sort</label>
            <select id="sort-products" data-sort-products>
              <option value="az">Alphabetically, A-Z</option>
              <option value="za">Alphabetically, Z-A</option>
              <option value="price-low">Price, low to high</option>
              <option value="price-high">Price, high to low</option>
            </select>
          </div>
          <div class="shop-status" data-shop-status></div>
          <div class="product-grid" data-products></div>
        </section>
      </div>
    </section>
  `;
}

function setupShopControls() {
  app.querySelectorAll('[data-available-only], [data-min-price], [data-max-price], [data-sort-products]').forEach((control) => {
    control.addEventListener('input', applyProductControls);
    control.addEventListener('change', applyProductControls);
  });
}

function applyProductControls() {
  const availableOnly = app.querySelector('[data-available-only]')?.checked;
  const minPrice = Number(app.querySelector('[data-min-price]')?.value || 0);
  const maxPriceValue = app.querySelector('[data-max-price]')?.value;
  const maxPrice = maxPriceValue ? Number(maxPriceValue) : Infinity;
  const sort = app.querySelector('[data-sort-products]')?.value || 'az';

  let products = currentProducts.filter((product) => {
    if (availableOnly && !product.available) return false;
    return product.amount >= minPrice && product.amount <= maxPrice;
  });

  products = products.sort((a, b) => {
    if (sort === 'za') return b.title.localeCompare(a.title);
    if (sort === 'price-low') return a.amount - b.amount;
    if (sort === 'price-high') return b.amount - a.amount;
    return a.title.localeCompare(b.title);
  });

  renderProductGrid(products);
}

function renderProductGrid(products) {
  const grid = app.querySelector('[data-products]');
  const status = app.querySelector('[data-shop-status]');
  const count = app.querySelector('[data-product-count]');
  if (!grid || !status) return;

  grid.innerHTML = '';
  count.textContent = `${products.length} ${products.length === 1 ? 'product' : 'products'}`;

  if (!window.IsmaShopify.isConfigured()) {
    status.innerHTML = 'Add your Shopify Storefront API settings in <strong>shopify-api.js</strong>. Products, prices, inventory, variants, cart, checkout, and login are wired to use Shopify once connected.';
  } else if (!products.length) {
    status.textContent = 'No products found.';
  } else {
    status.textContent = '';
  }

  products.forEach((product) => {
    grid.append(createProductCard(product));
  });
}

function createProductCard(product) {
  const card = document.createElement('article');
  card.className = 'product-card';
  const badge = product.available ? (product.onSale ? 'Sale' : '') : 'Sold Out';
  card.innerHTML = `
    <a href="#/product/${encodeURIComponent(product.handle)}" aria-label="Open ${escapeHtml(product.title)}">
      <div class="product-image ${product.image ? '' : 'blank-media'}">
        ${product.image ? `<img src="${product.image}" alt="${escapeHtml(product.imageAlt || product.title)}">` : '<span>Product photo placeholder</span>'}
        ${badge ? `<b>${badge}</b>` : ''}
      </div>
      <h2>${escapeHtml(product.title)}</h2>
      <p>${priceMarkup(product)}</p>
    </a>
  `;
  return card;
}

async function renderProduct(handle) {
  app.innerHTML = `<section class="content-section"><div class="shop-status">Loading product...</div></section>`;
  const product = await window.IsmaShopify.fetchProductByHandle(handle);

  if (!product) {
    renderNotFound();
    return;
  }

  app.innerHTML = `
    <section class="product-page">
      <div class="product-detail-media ${product.image ? '' : 'blank-media'}">
        ${product.image ? `<img src="${product.image}" alt="${escapeHtml(product.imageAlt || product.title)}">` : '<span>Product photo placeholder</span>'}
      </div>
      <div class="product-detail-info">
        <p class="eyebrow">${product.available ? 'Available' : 'Sold Out'}</p>
        <h1>${escapeHtml(product.title)}</h1>
        <p class="product-price">${priceMarkup(product)}</p>
        <form data-product-form>
          ${variantOptions(product)}
          <label for="quantity">Quantity</label>
          <input id="quantity" type="number" min="1" value="1" data-quantity>
          <button class="button button-dark" type="submit" ${product.available ? '' : 'disabled'}>${product.available ? 'Add to Cart' : 'Sold Out'}</button>
        </form>
        <div class="product-description">${product.descriptionHtml || '<p>Product description will load from Shopify.</p>'}</div>
      </div>
    </section>
  `;

  app.querySelector('[data-product-form]')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const variantSelect = app.querySelector('[data-variant-select]');
    const variantId = variantSelect?.value || product.variantId;
    const quantity = Number(app.querySelector('[data-quantity]')?.value || 1);
    await window.IsmaShopify.addItemToCart(variantId, quantity);
    await openCart();
  });
}

function variantOptions(product) {
  if (!product.variants?.length) return '';
  return `
    <label for="variant">Product option</label>
    <select id="variant" data-variant-select>
      ${product.variants.map((variant) => `<option value="${variant.id}" ${variant.available ? '' : 'disabled'}>${escapeHtml(variant.title)} - ${variant.available ? variant.price : 'Sold Out'}</option>`).join('')}
    </select>
  `;
}

function renderCustom() {
  app.innerHTML = `
    <section class="custom-page">
      <div class="section-title">
        <p>Custom</p>
        <h1>Custom Jewelry Inquiry</h1>
      </div>
      <p class="lead-copy">Enter your idea and budget inside of the comment box below.<br>Custom orders start at $2,000.</p>
      <form class="inquiry-form" data-inquiry-form>
        <div class="form-row">
          <label for="name">Name</label>
          <input id="name" name="name" autocomplete="name" required>
        </div>
        <div class="form-row">
          <label for="email">Email</label>
          <input id="email" name="email" type="email" autocomplete="email" required>
        </div>
        <div class="form-row form-wide">
          <label for="phone">Phone Number</label>
          <input id="phone" name="phone" type="tel" autocomplete="tel">
        </div>
        <div class="form-row form-wide">
          <label for="message">Message</label>
          <textarea id="message" name="message" rows="8" required></textarea>
        </div>
        <button class="button button-dark" type="submit">Send</button>
      </form>
    </section>
  `;

  app.querySelector('[data-inquiry-form]')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const body = encodeURIComponent(form.message.value);
    window.location.href = `mailto:hello@ismathejeweler.com?subject=Custom Jewelry Inquiry&body=${body}`;
  });
}

function renderPortfolio() {
  app.innerHTML = `
    <section class="content-section empty-page">
      <div class="section-title">
        <p>Portfolio</p>
        <h1>Portfolio</h1>
      </div>
      <div class="blank-content">Portfolio content placeholder</div>
    </section>
  `;
}

function renderNotFound() {
  app.innerHTML = `
    <section class="content-section empty-page">
      <div class="section-title">
        <p>Missing page</p>
        <h1>Page Not Found</h1>
      </div>
      <a class="button button-dark" href="#/">Home</a>
    </section>
  `;
}

async function openCart() {
  cartDrawer.classList.add('is-open');
  cartDrawer.setAttribute('aria-hidden', 'false');
  await window.IsmaShopify.createCart();
  renderCart();
}

function closeCart() {
  cartDrawer.classList.remove('is-open');
  cartDrawer.setAttribute('aria-hidden', 'true');
}

function renderCart() {
  const cart = window.IsmaShopify.getCart();
  cartCount.textContent = String(cart?.totalQuantity || 0);

  if (!cart?.lines?.length) {
    cartItems.innerHTML = '<p>Your cart is empty.</p>';
    cartTotal.textContent = window.IsmaShopify.isConfigured() ? '' : 'Connect Shopify in shopify-api.js to use live cart and checkout.';
    return;
  }

  cartItems.innerHTML = cart.lines.map((line) => `
    <article class="cart-line">
      <div>
        <strong>${escapeHtml(line.title)}</strong>
        <p>${line.variantTitle ? escapeHtml(line.variantTitle) : ''}</p>
        <p>${line.price}</p>
      </div>
      <label>
        Qty
        <input type="number" min="0" value="${line.quantity}" data-line-quantity="${line.id}">
      </label>
    </article>
  `).join('');
  cartTotal.textContent = cart.cost || '';

  cartItems.querySelectorAll('[data-line-quantity]').forEach((input) => {
    input.addEventListener('change', async () => {
      await window.IsmaShopify.updateCartQuantity(input.dataset.lineQuantity, Number(input.value));
      renderCart();
    });
  });
}

function priceMarkup(product) {
  if (product.compareAtPrice && product.compareAtAmount > product.amount) {
    const savings = product.compareAtAmount - product.amount;
    return `<s>${product.compareAtPrice}</s> ${product.price} <span class="save">Save ${window.IsmaShopify.formatMoneyValue(savings, product.currencyCode)}</span>`;
  }
  return product.price || '$0.00';
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }[char]));
}

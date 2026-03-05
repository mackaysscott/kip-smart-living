// ============================================
//  KIP SMART LIVING — PRODUCTS ENGINE
// ============================================

const KipProducts = {
  products: [],
  filteredProducts: [],

  // ── FETCH & INIT ─────────────────────────
  async init() {
    try {
      const res = await fetch('./products.json');
      const data = await res.json();
      this.products = data.products;
      this.filteredProducts = [...this.products];
    } catch (err) {
      console.error('Failed to load products:', err);
    }
  },

  // ── FILTER ──────────────────────────────
  filter(category) {
    if (category === 'all') {
      this.filteredProducts = [...this.products];
    } else if (category === 'deals') {
      this.filteredProducts = this.products.filter(p => p.deal);
    } else {
      this.filteredProducts = this.products.filter(p => p.category === category);
    }
    return this.filteredProducts;
  },

  // ── STARS HTML ───────────────────────────
  starsHtml(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    let stars = '';
    for (let i = 0; i < full; i++) stars += '★';
    if (half) stars += '½';
    return stars;
  },

  // ── DISCOUNT CALC ────────────────────────
  getDiscount(price, originalPrice) {
    if (!originalPrice) return null;
    const p = parseFloat(price.replace('$', ''));
    const o = parseFloat(originalPrice.replace('$', ''));
    return Math.round((1 - p / o) * 100);
  },

  // ── BADGE CLASS ──────────────────────────
  getBadgeClass(badge) {
    const map = {
      'Best Seller': 'badge-bestseller',
      'Trending': 'badge-trending',
      'New': 'badge-new',
      'Deal': 'badge-deal'
    };
    return map[badge] || 'badge-new';
  },

  // ── RENDER CARD ──────────────────────────
  renderCard(product, variant = 'default') {
    const discount = this.getDiscount(product.price, product.originalPrice);
    const badgeClass = this.getBadgeClass(product.badge);

    if (variant === 'deal') {
      const soldPct = Math.floor(Math.random() * 40) + 40;
      return `
        <div class="deal-card fade-in">
          <div class="deal-timer">
            🔥 Flash Deal · Ends Tonight
          </div>
          <div class="deal-media">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
          </div>
          <div class="deal-body">
            <div class="deal-name">${product.name}</div>
            <div class="deal-savings">
              <span class="deal-price">${product.price}</span>
              ${product.originalPrice ? `<span class="deal-original">${product.originalPrice}</span>` : ''}
              ${discount ? `<span class="deal-discount">-${discount}%</span>` : ''}
            </div>
            <div class="deal-progress">
              <div class="progress-label">
                <span>🔥 ${soldPct}% claimed</span>
                <span>${100 - soldPct} left</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width:${soldPct}%"></div>
              </div>
            </div>
            <a href="${product.link}" target="_blank" rel="nofollow noopener" class="btn btn-amazon">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.23 10.56V10c-1.94 0-3.99.39-3.99 2.67 0 1.15.6 1.93 1.62 1.93.75 0 1.41-.46 1.84-1.22.52-.93.53-1.8.53-2.82zm1.43 3.47c-.05.44-.26.66-.62.66-.12 0-.58-.06-.58-.68V10.4c0-.93.02-1.79-.62-2.43-.56-.56-1.48-.75-2.19-.75-1.48 0-3.13.55-3.47 2.37-.04.2.1.3.22.33l1.85.2c.17-.01.3-.18.33-.34.16-.7.7-1.04 1.37-1.04.35 0 .75.13.95.44.24.35.21.82.21 1.22v.22c-1.01.11-2.33.19-3.28.61-.98.44-1.66 1.34-1.66 2.66 0 1.69 1.06 2.54 2.42 2.54 1.15 0 1.78-.27 2.67-1.17.29.42.39.63.93 1.08.12.06.27.05.37-.04l.01-.01c.31-.28 1.76-1.55 1.76-1.55a.27.27 0 0 0-.07-.4zM21.41 20.5c-1.93 1.35-4.72 2.07-7.12 2.07-3.37 0-6.4-1.25-8.69-3.32-.18-.16-.02-.38.2-.26 2.47 1.44 5.53 2.3 8.69 2.3 2.13 0 4.47-.44 6.62-1.36.32-.14.59.21.3.57zm.86-1.03c-.25-.32-1.64-.15-2.26-.08-.19.02-.22-.14-.05-.27 1.1-.77 2.91-.55 3.12-.29.21.27-.06 2.08-1.09 2.94-.16.14-.31.06-.24-.11.24-.57.77-1.86.52-2.19z"/></svg>
              Buy on ${product.store || 'Amazon'}
            </a>
          </div>
        </div>`;
    }

    return `
      <div class="product-card fade-in" data-id="${product.id}">
        <div class="product-media">
          <img class="product-img" src="${product.image}" alt="${product.name}" loading="lazy">
          ${product.video ? `<video class="product-video" src="${product.video}" muted loop playsinline></video>` : ''}
          ${product.badge ? `<span class="product-badge ${badgeClass}">${product.badge}</span>` : ''}
          <button class="wishlist-btn" title="Save for later" onclick="toggleWishlist(${product.id}, this)">🤍</button>
        </div>
        <div class="product-body">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-desc">${product.description}</p>
          <div class="product-rating">
            <span class="stars">${this.starsHtml(parseFloat(product.rating))}</span>
            <span class="reviews">(${Number(product.reviews).toLocaleString()})</span>
          </div>
          <div class="product-pricing">
            <span class="price">${product.price}</span>
            ${product.originalPrice ? `<span class="price-original">${product.originalPrice}</span>` : ''}
            ${discount ? `<span class="price-save">Save ${discount}%</span>` : ''}
          </div>
          <a href="${product.link}" target="_blank" rel="nofollow noopener" class="btn btn-amazon">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.23 10.56V10c-1.94 0-3.99.39-3.99 2.67 0 1.15.6 1.93 1.62 1.93.75 0 1.41-.46 1.84-1.22.52-.93.53-1.8.53-2.82zm1.43 3.47c-.05.44-.26.66-.62.66-.12 0-.58-.06-.58-.68V10.4c0-.93.02-1.79-.62-2.43-.56-.56-1.48-.75-2.19-.75-1.48 0-3.13.55-3.47 2.37-.04.2.1.3.22.33l1.85.2c.17-.01.3-.18.33-.34.16-.7.7-1.04 1.37-1.04.35 0 .75.13.95.44.24.35.21.82.21 1.22v.22c-1.01.11-2.33.19-3.28.61-.98.44-1.66 1.34-1.66 2.66 0 1.69 1.06 2.54 2.42 2.54 1.15 0 1.78-.27 2.67-1.17.29.42.39.63.93 1.08.12.06.27.05.37-.04l.01-.01c.31-.28 1.76-1.55 1.76-1.55a.27.27 0 0 0-.07-.4zM21.41 20.5c-1.93 1.35-4.72 2.07-7.12 2.07-3.37 0-6.4-1.25-8.69-3.32-.18-.16-.02-.38.2-.26 2.47 1.44 5.53 2.3 8.69 2.3 2.13 0 4.47-.44 6.62-1.36.32-.14.59.21.3.57zm.86-1.03c-.25-.32-1.64-.15-2.26-.08-.19.02-.22-.14-.05-.27 1.1-.77 2.91-.55 3.12-.29.21.27-.06 2.08-1.09 2.94-.16.14-.31.06-.24-.11.24-.57.77-1.86.52-2.19z"/></svg>
            View on ${product.store || 'Amazon'}
          </a>
        </div>
      </div>`;
  },

  // ── RENDER GRID ──────────────────────────
  renderGrid(containerId, category = 'all', variant = 'default', limit = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const prods = this.filter(category);
    const displayed = limit ? prods.slice(0, limit) : prods;

    if (displayed.length === 0) {
      container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-muted)">No products found in this category.</div>`;
      return;
    }

    container.innerHTML = displayed.map(p => this.renderCard(p, variant)).join('');

    // Wire up hover-to-play videos
    container.querySelectorAll('.product-card').forEach(card => {
      const video = card.querySelector('.product-video');
      if (!video) return;

      card.addEventListener('mouseenter', () => {
        video.currentTime = 0;
        video.play().catch(() => {});
      });
      card.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0;
      });

      // Mobile tap
      card.addEventListener('touchstart', () => {
        if (video.paused) {
          video.currentTime = 0;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }, { passive: true });
    });

    // Trigger fade-in
    this.observeFadeIn(container);
  }
  ,

  // ── OBSERVE FADE IN ──────────────────────
  observeFadeIn(root = document) {
    const els = root.querySelectorAll('.fade-in');
    const obs = new IntersectionObserver(entries => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 80);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
  }
};

// ── WISHLIST ─────────────────────────────────
function toggleWishlist(id, btn) {
  let wl = JSON.parse(localStorage.getItem('kip-wishlist') || '[]');
  if (wl.includes(id)) {
    wl = wl.filter(i => i !== id);
    btn.textContent = '🤍';
  } else {
    wl.push(id);
    btn.textContent = '❤️';
  }
  localStorage.setItem('kip-wishlist', JSON.stringify(wl));
}

// ── GLOBAL INIT ───────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  await KipProducts.init();
  KipProducts.observeFadeIn();
});

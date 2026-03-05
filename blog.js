// ============================================
//  KIP SMART LIVING — BLOG ENGINE
// ============================================

const KipBlog = {
  posts: [],

  async init() {
    try {
      const res = await fetch('./products.json');
      const data = await res.json();
      this.posts = data.blogPosts || [];
    } catch (err) {
      console.error('Blog init failed:', err);
    }
  },

  renderPreview(containerId, limit = 3) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const posts = this.posts.slice(0, limit);
    container.innerHTML = posts.map(post => `
      <article class="blog-card fade-in">
        <div class="blog-img">
          <img src="${post.image}" alt="${post.title}" loading="lazy">
        </div>
        <div class="blog-body">
          <span class="blog-cat">${post.category}</span>
          <h3 class="blog-title">${post.title}</h3>
          <p class="blog-excerpt">${post.excerpt}</p>
          <div class="blog-meta">
            <span>📅 ${post.date} · ⏱ ${post.readTime}</span>
            <a href="post.html?slug=${post.slug}" class="read-more">Read more →</a>
          </div>
        </div>
      </article>`).join('');

    KipProducts.observeFadeIn(container);
  },

  renderAll(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = this.posts.map(post => `
      <article class="blog-card fade-in">
        <div class="blog-img">
          <img src="${post.image}" alt="${post.title}" loading="lazy">
        </div>
        <div class="blog-body">
          <span class="blog-cat">${post.category}</span>
          <h3 class="blog-title">${post.title}</h3>
          <p class="blog-excerpt">${post.excerpt}</p>
          <div class="blog-meta">
            <span>📅 ${post.date} · ⏱ ${post.readTime}</span>
            <a href="post.html?slug=${post.slug}" class="read-more">Read more →</a>
          </div>
        </div>
      </article>`).join('');

    KipProducts.observeFadeIn(container);
  }
};

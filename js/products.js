// Products management JavaScript

// Internal: build JSON URL that works on GitHub Pages and locally
function getJsonUrl() {
    const isGhPages = window.location.hostname.endsWith('github.io');
    if (isGhPages) {
        const segs = window.location.pathname.split('/').filter(Boolean);
        const repo = segs[0] || '';
        const base = `/${repo}/`;
        return `${base}data/products.json`;
    } else {
        const path = window.location.pathname;
        const parts = path.split('/').filter(Boolean);
        const last = parts[parts.length - 1] || '';
        const isFile = last.includes('.');
        const upLevels = Math.max(0, parts.length - (isFile ? 1 : 0));
        const prefix = upLevels > 0 ? '../'.repeat(upLevels) : '';
        return `${prefix}data/products.json`;
    }
}

// Load products from JSON (works from root and nested pages)
async function loadProducts() {
    try {
        const url = getJsonUrl();
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${url} (${response.status})`);
        const data = await response.json();
        return data.products;
    } catch (error) {
        console.error('Error loading products:', error);
        return [];
    }
}

// Load full catalog (products + categories)
async function loadCatalog() {
    try {
        const url = getJsonUrl();
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${url} (${response.status})`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading catalog:', error);
        return { products: [], categories: [] };
    }
}

// Removed older grid renderers for home/products pages (unused)

// Display products in footer
async function displayFooterProducts() {
    const footerProducts = document.getElementById('footerProducts');
    if (!footerProducts) return;

    const products = await loadProducts();
    // Build links that work from any nesting level and on GitHub Pages
    const isGhPages = window.location.hostname.endsWith('github.io');
    let prefix;
    if (isGhPages) {
        const segs = window.location.pathname.split('/').filter(Boolean);
        const repo = segs[0] || '';
        // Force same-origin absolute links to avoid unwanted domain redirects
        prefix = `${window.location.origin}/${repo}/`;
    } else {
        const path = window.location.pathname;
        const parts = path.split('/').filter(Boolean);
        const last = parts[parts.length - 1] || '';
        const isFile = last.includes('.');
        const upLevels = Math.max(0, parts.length - (isFile ? 1 : 0));
        prefix = upLevels > 0 ? '../'.repeat(upLevels) : '';
    }

    footerProducts.innerHTML = products.map(product =>
        `<li><a href="${prefix}products/${product.slug}/">${product.name}</a></li>`
    ).join('');
}

// Initialize products display
document.addEventListener('DOMContentLoaded', function() {
    // Prefer category sections if a scroller exists on page
    displayCategorySections();
    displayFooterProducts();
});

// New: simple list of product names linking to detail pages
async function displayProductsList() {
    // Preferred: horizontal scroller with image + name
    const scroller = document.getElementById('productScroller');
    const listEl = document.getElementById('productList'); // legacy fallback
    if (!scroller && !listEl) return;
    const products = await loadProducts();
    if (products.length === 0) {
        if (scroller) scroller.innerHTML = '<p class="no-products">No products available.</p>';
        if (listEl) listEl.innerHTML = '<li>No products available.</li>';
        return;
    }
    if (scroller) {
        scroller.innerHTML = products.map(p => {
            const imageUrl = (p.images && p.images.length ? p.images[0] : (p.image || 'assets/images/placeholder.jpg'));
            const isGhPages = window.location.hostname.endsWith('github.io');
            let href;
            if (isGhPages) {
                const segs = window.location.pathname.split('/').filter(Boolean);
                const repo = segs[0] || '';
                const base = `${window.location.origin}/${repo}/`;
                href = `${base}products/${p.slug}/`;
            } else {
                href = `products/${p.slug}/`;
            }
            return `
            <div class="product-tile">
                <a href="${href}" aria-label="${p.name}">
                    <img class="product-thumb" src="${imageUrl}" alt="${p.name}" loading="lazy" decoding="async" onerror="this.onerror=null; this.src='assets/images/placeholder.jpg';">
                    <div class="product-title">${p.name}</div>
                </a>
            </div>`;
        }).join('');

        // Enable arrow controls
        const wrapper = scroller.closest('.scroller-wrapper');
        const prevBtn = wrapper ? wrapper.querySelector('.scroller-btn.prev') : null;
        const nextBtn = wrapper ? wrapper.querySelector('.scroller-btn.next') : null;

        // Page size: exactly 3 tiles per view
        const pageAmount = () => {
            const tile = scroller.querySelector('.product-tile');
            if (!tile) return scroller.clientWidth;
            const styles = getComputedStyle(scroller);
            const gap = parseFloat(styles.columnGap || styles.gap || 0);
            return tile.offsetWidth * 3 + gap * 2; // 3 tiles + two gaps
        };
        const atStart = () => scroller.scrollLeft <= 0;
        const atEnd = () => scroller.scrollLeft >= scroller.scrollWidth - scroller.clientWidth - 1;
        const updateButtons = () => {
            if (!prevBtn || !nextBtn) return;
            prevBtn.disabled = atStart();
            nextBtn.disabled = atEnd();
        };

        if (prevBtn) prevBtn.addEventListener('click', () => { scroller.scrollBy({left: -pageAmount(), behavior: 'smooth'}); });
        if (nextBtn) nextBtn.addEventListener('click', () => { scroller.scrollBy({left:  pageAmount(), behavior: 'smooth'}); });
        scroller.addEventListener('scroll', updateButtons, {passive:true});
        // Ensure layout complete before first state calc
        requestAnimationFrame(updateButtons);

        // Drag-to-scroll for desktop
        let isDown = false; let startX = 0; let startLeft = 0;
        const onDown = (e) => { isDown = true; scroller.classList.add('dragging'); startX = (e.pageX || e.touches?.[0]?.pageX || 0); startLeft = scroller.scrollLeft; };
        const onMove = (e) => { if(!isDown) return; const x = (e.pageX || e.touches?.[0]?.pageX || 0); scroller.scrollLeft = startLeft - (x - startX); };
        const onUp = () => { isDown = false; scroller.classList.remove('dragging'); };
        scroller.addEventListener('mousedown', onDown);
        scroller.addEventListener('mousemove', onMove);
        scroller.addEventListener('mouseleave', onUp);
        scroller.addEventListener('mouseup', onUp);
        scroller.addEventListener('touchstart', onDown, {passive:true});
        scroller.addEventListener('touchmove', onMove, {passive:true});
        scroller.addEventListener('touchend', onUp);
    }

    // Keep supporting the legacy vertical list if present on any page
    if (listEl) {
        listEl.innerHTML = products.map(p => `<li class="product-list-item"><a href="products/${p.slug}/" class="product-link">${p.name}</a></li>`).join('');
    }
}

// Helper: build href to product detail respecting GH Pages or local
function hrefForProduct(p) {
    const isGhPages = window.location.hostname.endsWith('github.io');
    if (isGhPages) {
        const segs = window.location.pathname.split('/').filter(Boolean);
        const repo = segs[0] || '';
        const base = `${window.location.origin}/${repo}/`;
        return `${base}products/${p.slug}/`;
    } else {
        return `products/${p.slug}/`;
    }
}

// Setup controls and drag-to-scroll for a given scroller element
function setupScroller(scroller) {
    const wrapper = scroller.closest('.scroller-wrapper');
    const prevBtn = wrapper ? wrapper.querySelector('.scroller-btn.prev') : null;
    const nextBtn = wrapper ? wrapper.querySelector('.scroller-btn.next') : null;

    const pageAmount = () => {
        const tile = scroller.querySelector('.product-tile');
        if (!tile) return scroller.clientWidth;
        const styles = getComputedStyle(scroller);
        const gap = parseFloat(styles.columnGap || styles.gap || 0);
        return tile.offsetWidth * 3 + gap * 2; // 3 tiles + two gaps
    };
    const atStart = () => scroller.scrollLeft <= 0;
    const atEnd = () => scroller.scrollLeft >= scroller.scrollWidth - scroller.clientWidth - 1;
    const updateButtons = () => {
        if (!prevBtn || !nextBtn) return;
        prevBtn.disabled = atStart();
        nextBtn.disabled = atEnd();
    };

    if (prevBtn) prevBtn.addEventListener('click', () => { scroller.scrollBy({left: -pageAmount(), behavior: 'smooth'}); });
    if (nextBtn) nextBtn.addEventListener('click', () => { scroller.scrollBy({left:  pageAmount(), behavior: 'smooth'}); });
    scroller.addEventListener('scroll', updateButtons, {passive:true});
    requestAnimationFrame(updateButtons);

    let isDown = false; let startX = 0; let startLeft = 0;
    const onDown = (e) => { isDown = true; scroller.classList.add('dragging'); startX = (e.pageX || e.touches?.[0]?.pageX || 0); startLeft = scroller.scrollLeft; };
    const onMove = (e) => { if(!isDown) return; const x = (e.pageX || e.touches?.[0]?.pageX || 0); scroller.scrollLeft = startLeft - (x - startX); };
    const onUp = () => { isDown = false; scroller.classList.remove('dragging'); };
    scroller.addEventListener('mousedown', onDown);
    scroller.addEventListener('mousemove', onMove);
    scroller.addEventListener('mouseleave', onUp);
    scroller.addEventListener('mouseup', onUp);
    scroller.addEventListener('touchstart', onDown, {passive:true});
    scroller.addEventListener('touchmove', onMove, {passive:true});
    scroller.addEventListener('touchend', onUp);
}

// Display products grouped by categories, replacing the single scroller if present
async function displayCategorySections() {
    const existingWrapper = document.querySelector('.scroller-wrapper');
    const targetContainer = existingWrapper ? existingWrapper.parentElement : null;
    if (!targetContainer) {
        // Fallback to legacy single scroller rendering
        return displayProductsList();
    }

    const catalog = await loadCatalog();
    const products = catalog.products || [];
    const categories = catalog.categories || [];
    if (products.length === 0) {
        const scroller = document.getElementById('productScroller');
        if (scroller) scroller.innerHTML = '<p class="no-products">No products available.</p>';
        return;
    }

    const categoryIdMap = {
        'Frozen Vegetables': 'frozen-vegetables',
        'Frozen Pulps': 'frozen-pulps'
    };

    const sectionsHtml = categories.map(cat => {
        // Map products by our simple category label → category id
        const catId = cat.id;
        const filtered = products.filter(p => categoryIdMap[p.category] === catId);
        if (filtered.length === 0) return '';
        const tiles = filtered.map(p => {
            const imageUrl = (p.images && p.images.length ? p.images[0] : (p.image || 'assets/images/placeholder.jpg'));
            const href = hrefForProduct(p);
            return `
            <div class="product-tile">
                <a href="${href}" aria-label="${p.name}">
                    <img class="product-thumb" src="${imageUrl}" alt="${p.name}" loading="lazy" decoding="async" onerror="this.onerror=null; this.src='assets/images/placeholder.jpg';">
                    <div class="product-title">${p.name}</div>
                </a>
            </div>`;
        }).join('');

        return `
        <div class="category-section">
            <div class="section-header">
                <h2>${cat.name}</h2>
                <div class="divider"></div>
            </div>
            <div class="scroller-wrapper">
                <button class="scroller-btn prev" aria-label="Scroll left" type="button"><i class="fas fa-chevron-left"></i></button>
                <div class="product-scroller" aria-label="${cat.name}">${tiles}</div>
                <button class="scroller-btn next" aria-label="Scroll right" type="button"><i class="fas fa-chevron-right"></i></button>
            </div>
        </div>`;
    }).join('');

    // Replace single scroller area with category sections
    existingWrapper.outerHTML = sectionsHtml || existingWrapper.outerHTML;

    // Setup each new scroller controls
    document.querySelectorAll('.product-scroller').forEach(setupScroller);
}

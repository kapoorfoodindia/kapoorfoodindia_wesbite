// Products management JavaScript

// Load products from JSON
async function loadProducts() {
    try {
        const response = await fetch('data/products.json');
        const data = await response.json();
        return data.products;
    } catch (error) {
        console.error('Error loading products:', error);
        return [];
    }
}

// Display products on homepage
async function displayHomeProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    const products = await loadProducts();
    
    if (products.length === 0) {
        productsGrid.innerHTML = '<p class="no-products">No products available at the moment.</p>';
        return;
    }

    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <div class="image-placeholder">
                    <i class="fas fa-box-open"></i>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description.substring(0, 100)}...</p>
                <div class="product-features">
                    ${product.features.slice(0, 2).map(feature => 
                        `<span class="feature-tag"><i class="fas fa-check"></i> ${feature}</span>`
                    ).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

// Display products on products page
async function displayProductsPage() {
    const productsGrid = document.getElementById('productsPageGrid');
    if (!productsGrid) return;

    const products = await loadProducts();
    
    if (products.length === 0) {
        productsGrid.innerHTML = '<p class="no-products">No products available at the moment.</p>';
        return;
    }

    productsGrid.innerHTML = products.map(product => `
        <div class="product-card large">
            <div class="product-image">
                <div class="image-placeholder">
                    <i class="fas fa-box-open"></i>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-features">
                    ${product.features.map(feature => 
                        `<span class="feature-tag"><i class="fas fa-check"></i> ${feature}</span>`
                    ).join('')}
                </div>
                <div class="product-status">
                    ${product.available ? 
                        '<span class="status-badge available"><i class="fas fa-check-circle"></i> Available</span>' : 
                        '<span class="status-badge unavailable"><i class="fas fa-times-circle"></i> Out of Stock</span>'
                    }
                </div>
            </div>
        </div>
    `).join('');
}

// Display products in footer
async function displayFooterProducts() {
    const footerProducts = document.getElementById('footerProducts');
    if (!footerProducts) return;

    const products = await loadProducts();
    
    footerProducts.innerHTML = products.map(product => 
        `<li><a href="products.html">${product.name}</a></li>`
    ).join('');
}

// Initialize products display
document.addEventListener('DOMContentLoaded', function() {
    displayHomeProducts();
    displayProductsPage();
    displayFooterProducts();
});

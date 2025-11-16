// Admin Portal JavaScript

// Authentication
const defaultCredentials = {
    username: 'admin',
    password: 'admin123'
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    initializeEventListeners();
});

// Check authentication
function checkAuth() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isLoggedIn === 'true') {
        showDashboard();
        loadDashboardData();
    }
}

// Event Listeners
function initializeEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            switchPage(page);
        });
    });

    // Add product button
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => openProductModal());
    }

    // Product form
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', handleProductSubmit);
    }

    // Modal close
    const modalClose = document.querySelector('.modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Click outside modal to close
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }

    // Settings form
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', handleSettingsSave);
    }
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === defaultCredentials.username && password === defaultCredentials.password) {
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminUsername', username);
        showDashboard();
        loadDashboardData();
        showAdminNotification('Login successful!', 'success');
    } else {
        showAdminNotification('Invalid credentials. Try admin/admin123', 'error');
    }
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUsername');
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
    showAdminNotification('Logged out successfully', 'success');
}

// Show dashboard
function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'flex';
    const username = localStorage.getItem('adminUsername') || 'Admin';
    document.getElementById('adminUsername').textContent = username;
}

// Switch pages
function switchPage(pageName) {
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-page="${pageName}"]`).classList.add('active');

    // Update pages
    document.querySelectorAll('.admin-page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(`${pageName}Page`).classList.add('active');

    // Update title
    const titles = {
        'dashboard': 'Dashboard',
        'products': 'Products Management',
        'contacts': 'Contact Messages',
        'settings': 'Settings'
    };
    document.getElementById('pageTitle').textContent = titles[pageName] || pageName;

    // Load page data
    if (pageName === 'products') {
        loadProducts();
    } else if (pageName === 'contacts') {
        loadContacts();
    } else if (pageName === 'dashboard') {
        loadDashboardData();
    }
}

// Load dashboard data
async function loadDashboardData() {
    try {
        const response = await fetch('../data/products.json');
        const data = await response.json();
        const products = data.products;
        
        // Update stats
        document.getElementById('totalProducts').textContent = products.length;
        document.getElementById('availableProducts').textContent = 
            products.filter(p => p.available).length;
        
        const messages = JSON.parse(localStorage.getItem('contacts') || '[]');
        document.getElementById('totalMessages').textContent = messages.length;
        
        document.getElementById('lastUpdate').textContent = 
            new Date(data.lastUpdated).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });

        // Load recent products
        const recentProducts = document.getElementById('recentProducts');
        if (products.length === 0) {
            recentProducts.innerHTML = '<div class="empty-state"><i class="fas fa-box"></i><p>No products yet</p></div>';
        } else {
            recentProducts.innerHTML = products.map(product => `
                <div class="recent-item">
                    <div class="recent-item-info">
                        <h4>${product.name}</h4>
                        <p>${product.category}</p>
                    </div>
                    <span class="status-badge ${product.available ? 'available' : 'unavailable'}">
                        ${product.available ? 'Available' : 'Out of Stock'}
                    </span>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Load products
async function loadProducts() {
    try {
        const response = await fetch('../data/products.json');
        const data = await response.json();
        const products = data.products;
        
        const tbody = document.getElementById('productsTableBody');
        if (products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="empty-state"><i class="fas fa-box"></i><p>No products yet</p></td></tr>';
        } else {
            tbody.innerHTML = products.map(product => `
                <tr>
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.category}</td>
                    <td>
                        <span class="status-badge ${product.available ? 'available' : 'unavailable'}">
                            ${product.available ? 'Available' : 'Out of Stock'}
                        </span>
                    </td>
                    <td>
                        <div class="table-actions">
                            <button class="btn-icon btn-edit" onclick="editProduct(${product.id})" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-icon btn-delete" onclick="deleteProduct(${product.id})" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Open product modal
function openProductModal(productId = null) {
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');
    const title = document.getElementById('modalTitle');
    
    form.reset();
    
    if (productId) {
        title.textContent = 'Edit Product';
        // Load product data
        fetch('../data/products.json')
            .then(res => res.json())
            .then(data => {
                const product = data.products.find(p => p.id === productId);
                if (product) {
                    document.getElementById('productId').value = product.id;
                    document.getElementById('productName').value = product.name;
                    document.getElementById('productCategory').value = product.category;
                    document.getElementById('productDescription').value = product.description;
                    document.getElementById('productFeatures').value = product.features.join(', ');
                    document.getElementById('productAvailable').checked = product.available;
                }
            });
    } else {
        title.textContent = 'Add New Product';
        document.getElementById('productId').value = '';
    }
    
    modal.classList.add('active');
}

// Close modal
function closeModal() {
    document.getElementById('productModal').classList.remove('active');
}

// Handle product submit
async function handleProductSubmit(e) {
    e.preventDefault();
    
    const productId = document.getElementById('productId').value;
    const productData = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        description: document.getElementById('productDescription').value,
        features: document.getElementById('productFeatures').value
            .split(',')
            .map(f => f.trim())
            .filter(f => f),
        available: document.getElementById('productAvailable').checked,
        image: 'assets/images/product-placeholder.jpg'
    };

    try {
        const response = await fetch('../data/products.json');
        const data = await response.json();
        let products = data.products;

        if (productId) {
            // Update existing product
            const index = products.findIndex(p => p.id === parseInt(productId));
            if (index !== -1) {
                products[index] = { ...products[index], ...productData };
            }
        } else {
            // Add new product
            const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
            products.push({ id: newId, ...productData });
        }

        // Update data
        data.products = products;
        data.lastUpdated = new Date().toISOString().split('T')[0];

        // In a real application, you would send this to a server
        // For now, we'll store it in localStorage and update the file
        localStorage.setItem('productsData', JSON.stringify(data));
        
        // Note to user: The changes are stored in localStorage
        // To persist them in the JSON file, you need a backend server
        
        showAdminNotification(
            productId ? 'Product updated successfully!' : 'Product added successfully!',
            'success'
        );
        
        closeModal();
        loadProducts();
        loadDashboardData();
        
        // Show instruction
        if (!localStorage.getItem('shownProductInstructions')) {
            showAdminNotification(
                'Note: Changes are stored in localStorage. For GitHub Pages deployment, you\'ll need to update the products.json file manually or use a backend service.',
                'info'
            );
            localStorage.setItem('shownProductInstructions', 'true');
        }
    } catch (error) {
        console.error('Error saving product:', error);
        showAdminNotification('Error saving product', 'error');
    }
}

// Edit product
function editProduct(productId) {
    openProductModal(productId);
}

// Delete product
async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }

    try {
        const response = await fetch('../data/products.json');
        const data = await response.json();
        
        data.products = data.products.filter(p => p.id !== productId);
        data.lastUpdated = new Date().toISOString().split('T')[0];
        
        localStorage.setItem('productsData', JSON.stringify(data));
        
        showAdminNotification('Product deleted successfully!', 'success');
        loadProducts();
        loadDashboardData();
    } catch (error) {
        console.error('Error deleting product:', error);
        showAdminNotification('Error deleting product', 'error');
    }
}

// Load contacts
function loadContacts() {
    const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
    const container = document.getElementById('contactsList');
    
    if (contacts.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-envelope"></i><p>No messages yet</p></div>';
        return;
    }
    
    container.innerHTML = contacts.reverse().map((contact, index) => `
        <div class="contact-card">
            <div class="contact-header">
                <div class="contact-info">
                    <h3>${contact.name}</h3>
                    <div class="contact-meta">
                        <span><i class="fas fa-envelope"></i> ${contact.email}</span>
                        ${contact.phone ? `<span><i class="fas fa-phone"></i> ${contact.phone}</span>` : ''}
                        <span><i class="fas fa-clock"></i> ${new Date(contact.timestamp).toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </div>
            <div class="contact-subject">
                <strong>Subject:</strong> ${getSubjectLabel(contact.subject)}
            </div>
            <div class="contact-message">
                ${contact.message}
            </div>
            <div class="contact-actions">
                <button class="btn btn-secondary" onclick="deleteContact(${contacts.length - 1 - index})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Get subject label
function getSubjectLabel(value) {
    const labels = {
        'product-inquiry': 'Product Inquiry',
        'order': 'Place an Order',
        'distributor': 'Become a Distributor',
        'feedback': 'Feedback',
        'other': 'Other'
    };
    return labels[value] || value;
}

// Delete contact
function deleteContact(index) {
    if (!confirm('Are you sure you want to delete this message?')) {
        return;
    }
    
    const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
    contacts.splice(index, 1);
    localStorage.setItem('contacts', JSON.stringify(contacts));
    
    loadContacts();
    loadDashboardData();
    showAdminNotification('Message deleted successfully!', 'success');
}

// Clear all messages
function clearMessages() {
    if (!confirm('Are you sure you want to delete all messages? This action cannot be undone.')) {
        return;
    }
    
    localStorage.setItem('contacts', JSON.stringify([]));
    loadContacts();
    loadDashboardData();
    showAdminNotification('All messages deleted successfully!', 'success');
}

// Handle settings save
function handleSettingsSave(e) {
    e.preventDefault();
    
    const settings = {
        siteName: document.getElementById('siteName').value,
        siteTagline: document.getElementById('siteTagline').value,
        contactEmail: document.getElementById('contactEmail').value,
        contactPhone: document.getElementById('contactPhone').value,
        address: document.getElementById('address').value
    };
    
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    showAdminNotification('Settings saved successfully!', 'success');
}

// Export data
function exportData() {
    const data = {
        products: JSON.parse(localStorage.getItem('productsData') || '{"products": []}'),
        contacts: JSON.parse(localStorage.getItem('contacts') || '[]'),
        settings: JSON.parse(localStorage.getItem('siteSettings') || '{}'),
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kapoor-food-india-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    showAdminNotification('Data exported successfully!', 'success');
}

// Show admin notification
function showAdminNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

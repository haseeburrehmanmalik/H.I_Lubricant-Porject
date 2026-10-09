// ====== PRODUCTS DATA ======
// Edit this array to update products – no need to touch HTML/CSS.

const productsData = [
    {
        id: 1,
        name: ' Engine Oil 20W-40',
        brand: 'Caltex',
        category: 'Engine Oil',
        price: ,
        rating: 4.8,
        image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIBcLjdx7_UNlqf2a46nGW-rYDy__Hb33_Q7cJDPh8Xw&s=10',
        description: 'High-performance fully synthetic engine oil for maximum protection and fuel economy.',
        stock: true,
        popular: true,
        dateAdded: '2026-07-24'
    },
    {
        id: 2,
        name: 'Heavy Duty Synthatic Oil 5W-30',
        brand: 'Caltex',
        category: 'Heavy Duty Oil',
        price: ,
        rating: 4.9,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI1jZ24Y6WlU8zNq0Tt1XRAF0uZ8HzpE_t66N2RIJ9fw&s=10',
        description: 'Premium Motor engine oil for trucks, buses, and construction equipment.',
        stock: true,
        popular: true,
        dateAdded: '2025-05-15'
    },
    {
        id: 3,
        name: 'Motor Oil 20W-50',
        brand: 'Caltex',
        category: 'Hydraulic Oil',
        price: ,
        rating: 4.7,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNnvFiX5z65pWv87J6cI0Ca9Epom8-BJhVGOdD8zyOVA&s=10',
        description: 'Anti-wear hydraulic oil for industrial machinery and mobile equipment.',
        stock: true,
        popular: false,
        dateAdded: '2025-04-20'
    },
    {
        id: 4,
        name: 'Motor Oil 20W-50',
        brand: 'PSO',
        category: 'Gear Oil',
        price: ,
        rating: 4.6,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSURBJCxRQNeYGPvEAzvxyoesb-vM2Sp--ROXHP89rQRA&s=10',
        description: 'High-performance synthetic gear oil for manual transmissions and differentials.',
        stock: true,
        popular: false,
        dateAdded: '2025-06-10'
    },
    {
        id: 5,
        name: 'Synthetic Motor Oil 5W-30',
        brand: 'PSO',
        category: 'ATF',
        price: ,
        rating: 4.5,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUmcN_VArjR1UgC_ZxbyQUNjp9eXl4cZJi4wqQSBm64g&s=10',
        description: 'Premium automatic transmission fluid for smooth shifting and extended life.',
        stock: true,
        popular: false,
        dateAdded: '2025-05-28'
    },
    {
        id: 6,
        name: 'Synthetic Motor Oil 0W-30',
        brand: 'ZIC',
        category: 'Grease',
        price: ,
        rating: 4.4,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKXD60BILwq_EZZ8KvZMXD-GyBtyAfov6DelZ9SQrnqw&s=10',
        description: 'Extreme pressure lithium grease for heavy-duty industrial applications.',
        stock: true,
        popular: false,
        dateAdded: '2025-04-05'
    },
    {
        id: 7,
        name: 'ATF Motor Oil 10W-40',
        brand: 'ZIC',
        category: 'Motorcycle Oil',
        price: ,
        rating: 4.7,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSEGHO6Vcj5gyEbcxHYQzmLWBPn_oPB4ugaBMgxGJ_tg&s=10',
        description: 'High-quality 4-stroke motorcycle oil for superior engine protection.',
        stock: true,
        popular: true,
        dateAdded: '2025-06-18'
    },
    {
        id: 8,
        name: 'Motor Oil 10W-40',
        brand: 'ZIC',
        category: 'Coolant',
        price: ,
        rating: 4.3,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQybm4ShcOdMPnW5AfdfEblitAww3tTyX4NgyN4OcxuIw&s=10',
        description: 'Ethylene glycol-based coolant for all engine types, protects against corrosion.',
        stock: true,
        popular: false,
        dateAdded: '2025-05-01'
    },
];

// ====== RENDER PRODUCTS ======
let currentProducts = [...productsData];
let currentPage = 1;
const perPage = 8;

function renderProducts(products = currentProducts, page = 1) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';

    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginated = products.slice(start, end);

    if (paginated.length === 0) {
        grid.innerHTML = '<p style="text-align:center;color:var(--gray-400);">No products found.</p>';
        return;
    }

    paginated.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card fade-in';
        card.dataset.id = product.id;
        const stockColor = product.stock ? 'var(--yellow)' : '#ff4444';
        const stockText = product.stock ? 'In Stock' : 'Out of Stock';
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy" />
                <span class="product-badge" style="background:${stockColor};">${stockText}</span>
                <div class="product-actions">
                    <button class="quick-view" data-id="${product.id}" title="Quick View"><i class="fas fa-eye"></i></button>
                    <button class="add-to-cart-btn" data-id="${product.id}" title="Add to Cart"><i class="fas fa-cart-plus"></i></button>
                </div>
            </div>
            <div class="product-info">
                <h4 class="product-name">${product.name}</h4>
                <div class="product-brand">${product.brand}</div>
                <p class="product-desc">${product.description}</p>
                <div class="product-price">PKR ${product.price.toLocaleString()}</div>
                <div class="product-rating">
                    ${'★'.repeat(Math.floor(product.rating))}${product.rating % 1 >= 0.5 ? '★' : ''}
                    <span>(${product.rating})</span>
                </div>
                <div class="product-footer">
                    <button class="btn btn-primary order-now-btn" data-id="${product.id}"><i class="fas fa-shopping-bag"></i> Order</button>
                    <button class="btn btn-secondary add-to-cart-btn" data-id="${product.id}"><i class="fas fa-cart-plus"></i></button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    // Event listeners
    document.querySelectorAll('.order-now-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            const product = productsData.find(p => p.id === id);
            if (product && typeof window.openOrderModal === 'function') {
                window.openOrderModal(product);
            }
        });
    });

    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            const product = productsData.find(p => p.id === id);
            if (product && typeof window.addToCart === 'function') {
                window.addToCart(product);
            }
        });
    });

    document.querySelectorAll('.quick-view').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const product = productsData.find(p => p.id === id);
            alert(`Quick View: ${product.name}\nBrand: ${product.brand}\nPrice: PKR ${product.price}\nDescription: ${product.description}`);
        });
    });

    const loadMoreBtn = document.getElementById('loadMoreProducts');
    if (end >= products.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'inline-flex';
    }
}

document.getElementById('loadMoreProducts').addEventListener('click', () => {
    currentPage++;
    renderProducts(currentProducts, currentPage);
});

// ====== FILTERS & SEARCH ======
function populateFilters() {
    const categorySelect = document.getElementById('filterCategory');
    const brandSelect = document.getElementById('filterBrand');

    const categories = [...new Set(productsData.map(p => p.category))];
    const brands = [...new Set(productsData.map(p => p.brand))];

    categories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        categorySelect.appendChild(opt);
    });

    brands.forEach(brand => {
        const opt = document.createElement('option');
        opt.value = brand;
        opt.textContent = brand;
        brandSelect.appendChild(opt);
    });
}

function applyFilters() {
    const searchTerm = document.getElementById('productSearch').value.toLowerCase().trim();
    const category = document.getElementById('filterCategory').value;
    const brand = document.getElementById('filterBrand').value;
    const sort = document.getElementById('sortProducts').value;

    let filtered = productsData.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(searchTerm) || p.brand.toLowerCase().includes(searchTerm) || p.category.toLowerCase().includes(searchTerm);
        const matchCategory = category === 'all' || p.category === category;
        const matchBrand = brand === 'all' || p.brand === brand;
        return matchSearch && matchCategory && matchBrand;
    });

    switch (sort) {
        case 'price-low':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            filtered.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
            break;
        case 'popular':
        default:
            filtered.sort((a, b) => b.rating - a.rating);
            break;
    }

    currentProducts = filtered;
    currentPage = 1;
    renderProducts(currentProducts, currentPage);
}

document.getElementById('productSearch').addEventListener('input', applyFilters);
document.getElementById('filterCategory').addEventListener('change', applyFilters);
document.getElementById('filterBrand').addEventListener('change', applyFilters);
document.getElementById('sortProducts').addEventListener('change', applyFilters);

// Initialize
populateFilters();
renderProducts(currentProducts, currentPage);

window.productsData = productsData;
window.applyFilters = applyFilters;
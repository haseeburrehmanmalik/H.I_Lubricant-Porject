// ====== CART ======

let cart = JSON.parse(localStorage.getItem('hiLubricantCart')) || [];

function saveCart() {
    localStorage.setItem('hiLubricantCart', JSON.stringify(cart));
    updateCartUI();
}

function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    showToast(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
}

function updateQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
        }
    }
}

function getCartTotal() {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax;
    return { subtotal, tax, total };
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItemsContainer = document.getElementById('cartItems');
    const subtotalEl = document.getElementById('cartSubtotal');
    const taxEl = document.getElementById('cartTax');
    const totalEl = document.getElementById('cartTotal');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
        subtotalEl.textContent = 'PKR 0';
        taxEl.textContent = 'PKR 0';
        totalEl.textContent = 'PKR 0';
        return;
    }

    let html = '';
    cart.forEach(item => {
        html += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" />
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>PKR ${item.price.toLocaleString()} × ${item.quantity}</p>
                </div>
                <div class="cart-item-actions">
                    <button class="cart-qty-btn" data-id="${item.id}" data-delta="-1">-</button>
                    <span>${item.quantity}</span>
                    <button class="cart-qty-btn" data-id="${item.id}" data-delta="1">+</button>
                    <button class="cart-item-remove" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    });
    cartItemsContainer.innerHTML = html;

    document.querySelectorAll('.cart-qty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const delta = parseInt(btn.dataset.delta);
            updateQuantity(id, delta);
        });
    });
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            removeFromCart(id);
        });
    });

    const totals = getCartTotal();
    subtotalEl.textContent = `PKR ${totals.subtotal.toLocaleString()}`;
    taxEl.textContent = `PKR ${totals.tax.toLocaleString()}`;
    totalEl.textContent = `PKR ${totals.total.toLocaleString()}`;
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
        background: var(--dark-gray); color: white; padding: 14px 28px;
        border-radius: 50px; border: 1px solid var(--yellow);
        font-weight: 500; z-index: 3000; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        transition: opacity 0.4s ease; max-width: 90%;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
    }, 2500);
}

document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (cart.length === 0) {
        showToast('Your cart is empty!');
        return;
    }
    const totals = getCartTotal();
    if (confirm(`Proceed to checkout?\nTotal: PKR ${totals.total.toLocaleString()}`)) {
        // Open order modal with first product or summary
        if (typeof window.openOrderModal === 'function' && cart.length > 0) {
            window.openOrderModal(cart[0]);
        } else {
            cart = [];
            saveCart();
            showToast('Order placed successfully! We will contact you shortly.');
        }
    }
});

updateCartUI();

window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.getCartTotal = getCartTotal;
// ====== ORDER MODAL ======

const orderModal = document.getElementById('orderModal');
const orderModalClose = document.getElementById('orderModalClose');
const orderForm = document.getElementById('orderForm');

function openOrderModal(product) {
    document.getElementById('orderProductId').value = product.id;
    document.getElementById('orderProduct').value = product.name;
    orderModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

orderModalClose.addEventListener('click', () => {
    orderModal.classList.remove('active');
    document.body.style.overflow = '';
});
orderModal.addEventListener('click', (e) => {
    if (e.target === orderModal) {
        orderModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

window.openOrderModal = openOrderModal;

orderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const orderData = {
        name: document.getElementById('orderName').value.trim(),
        email: document.getElementById('orderEmail').value.trim(),
        phone: document.getElementById('orderPhone').value.trim(),
        productId: document.getElementById('orderProductId').value,
        productName: document.getElementById('orderProduct').value,
        quantity: parseInt(document.getElementById('orderQuantity').value) || 1,
        city: document.getElementById('orderCity').value.trim(),
        address: document.getElementById('orderAddress').value.trim(),
        notes: document.getElementById('orderNotes').value.trim(),
        orderId: 'ORD-' + Date.now().toString().slice(-8),
        date: new Date().toLocaleString()
    };

    if (!orderData.name || !orderData.email || !orderData.phone || !orderData.address) {
        alert('Please fill in all required fields.');
        return;
    }

    if (typeof window.sendOrderEmail === 'function') {
        window.sendOrderEmail(orderData).then(() => {
            alert('Order submitted successfully! We will contact you shortly.');
            orderModal.classList.remove('active');
            document.body.style.overflow = '';
            orderForm.reset();
        }).catch((err) => {
            alert('There was an error submitting your order. Please try again later.');
            console.error(err);
        });
    } else {
        alert('Order submitted (demo). Check console for details.\n' + JSON.stringify(orderData, null, 2));
        console.log('Order Data:', orderData);
        orderModal.classList.remove('active');
        document.body.style.overflow = '';
        orderForm.reset();
    }
});
// ====== SEARCH ======
// Search is integrated into products.js via applyFilters()
// This file is kept for modularity.

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('productSearch');
    if (searchInput && typeof window.applyFilters === 'function') {
        searchInput.addEventListener('input', () => {
            window.applyFilters();
        });
    }
});
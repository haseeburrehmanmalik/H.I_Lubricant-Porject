import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  RotateCcw,
  Sparkles,
  PackageX,
  Check,
} from 'lucide-react';
import { productService } from '../services/productService';
import ProductCard from '../components/shop/ProductCard';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || 'all');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedViscosity, setSelectedViscosity] = useState(searchParams.get('viscosity') || 'all');
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('inStock') === 'true');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const brandsList = ['All', 'Shell', 'Caltex', 'PSO', 'Honda', 'Blaze', 'ZIC', 'Total'];
  const categoriesList = [
    'All',
    'Passenger Car Motor Oil',
    'Heavy Duty Diesel Oil',
    'Motorcycle & 4T Oils',
    'Gear & Transmission Oil',
    'Coolants & Brake Fluids',
  ];
  const viscositiesList = ['All', '0W-20', '5W-30', '10W-30', '5W-40', '10W-40', '15W-40', '20W-50', 'ATF Synthetic'];

  // Sync state if URL changes
  useEffect(() => {
    const brandParam = searchParams.get('brand');
    const viscParam = searchParams.get('viscosity');
    const catParam = searchParams.get('category');
    if (brandParam) setSelectedBrand(brandParam);
    if (viscParam) setSelectedViscosity(viscParam);
    if (catParam) setSelectedCategory(catParam);
  }, [searchParams]);

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 12,
        sort: sortBy,
      };

      if (search.trim()) params.search = search.trim();
      if (selectedBrand !== 'all' && selectedBrand !== 'All') params.brand = selectedBrand;
      if (selectedCategory !== 'all' && selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedViscosity !== 'all' && selectedViscosity !== 'All') params.viscosity = selectedViscosity;
      if (inStockOnly) params.inStock = 'true';

      const data = await productService.getProducts(params);
      if (data.success) {
        setProducts(data.products || []);
        setTotal(data.total || 0);
        setPages(data.pages || 1);
        setCurrentPage(data.currentPage || 1);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts(1);
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [search, selectedBrand, selectedCategory, selectedViscosity, inStockOnly, sortBy]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedBrand('all');
    setSelectedCategory('all');
    setSelectedViscosity('all');
    setInStockOnly(false);
    setSortBy('newest');
    setSearchParams({});
  };

  const hasActiveFilters =
    search.trim() !== '' ||
    (selectedBrand !== 'all' && selectedBrand !== 'All') ||
    (selectedCategory !== 'all' && selectedCategory !== 'All') ||
    (selectedViscosity !== 'all' && selectedViscosity !== 'All') ||
    inStockOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title & Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#292722]">
        <div>
          <h1 className="text-3xl font-extrabold text-[#F5F2EA] tracking-tight">
            Lubricant Product Catalog
          </h1>
          <p className="text-xs text-[#A5A19A] mt-1">
            Browse 100% authentic motor oils, transmission fluids, and lubricants in Hyderabad.
          </p>
        </div>

        {/* Search Bar Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A5A19A]" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, brand, viscosity..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141414] border border-[#292722] text-xs text-[#F5F2EA] placeholder-[#A5A19A] focus:outline-none focus:border-[#D7AD55] transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A5A19A] hover:text-[#F5F2EA]"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* DESKTOP FILTER SIDEBAR */}
        <div className="hidden lg:block p-6 rounded-2xl bg-[#141414] border border-[#292722] space-y-6 sticky top-24">
          <div className="flex items-center justify-between pb-4 border-b border-[#292722]">
            <span className="font-bold text-sm text-[#F5F2EA] flex items-center space-x-2">
              <SlidersHorizontal size={16} className="text-[#D7AD55]" />
              <span>Filters</span>
            </span>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-[#D7AD55] hover:underline flex items-center space-x-1"
              >
                <RotateCcw size={11} />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Filter: Brands */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#A5A19A] block">
              Brands
            </label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {brandsList.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand.toLowerCase() === 'all' ? 'all' : brand)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium text-left transition-colors ${
                    (brand.toLowerCase() === 'all' && (selectedBrand === 'all' || selectedBrand === 'All')) ||
                    selectedBrand.toLowerCase() === brand.toLowerCase()
                      ? 'bg-[#191919] text-[#D7AD55] border border-[#D7AD55]/40 font-bold'
                      : 'text-[#A5A19A] hover:text-[#F5F2EA] hover:bg-[#191919]/60'
                  }`}
                >
                  <span>{brand}</span>
                  {((brand.toLowerCase() === 'all' && (selectedBrand === 'all' || selectedBrand === 'All')) ||
                    selectedBrand.toLowerCase() === brand.toLowerCase()) && <Check size={12} />}
                </button>
              ))}
            </div>
          </div>

          {/* Filter: Categories */}
          <div className="space-y-3 pt-3 border-t border-[#292722]">
            <label className="text-xs font-bold uppercase tracking-wider text-[#A5A19A] block">
              Category
            </label>
            <div className="space-y-1.5">
              {categoriesList.map((category) => (
                <button
                  key={category}
                  onClick={() =>
                    setSelectedCategory(category.toLowerCase() === 'all' ? 'all' : category)
                  }
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium text-left transition-colors ${
                    (category.toLowerCase() === 'all' &&
                      (selectedCategory === 'all' || selectedCategory === 'All')) ||
                    selectedCategory.toLowerCase() === category.toLowerCase()
                      ? 'bg-[#191919] text-[#D7AD55] border border-[#D7AD55]/40 font-bold'
                      : 'text-[#A5A19A] hover:text-[#F5F2EA] hover:bg-[#191919]/60'
                  }`}
                >
                  <span className="truncate">{category}</span>
                  {((category.toLowerCase() === 'all' &&
                    (selectedCategory === 'all' || selectedCategory === 'All')) ||
                    selectedCategory.toLowerCase() === category.toLowerCase()) && <Check size={12} />}
                </button>
              ))}
            </div>
          </div>

          {/* Filter: Viscosity Grade */}
          <div className="space-y-3 pt-3 border-t border-[#292722]">
            <label className="text-xs font-bold uppercase tracking-wider text-[#A5A19A] block">
              Viscosity Grade
            </label>
            <div className="flex flex-wrap gap-1.5">
              {viscositiesList.map((grade) => (
                <button
                  key={grade}
                  onClick={() =>
                    setSelectedViscosity(grade.toLowerCase() === 'all' ? 'all' : grade)
                  }
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                    (grade.toLowerCase() === 'all' &&
                      (selectedViscosity === 'all' || selectedViscosity === 'All')) ||
                    selectedViscosity.toLowerCase() === grade.toLowerCase()
                      ? 'bg-[#D7AD55] text-[#090909]'
                      : 'bg-[#191919] text-[#A5A19A] hover:text-[#F5F2EA] border border-[#292722]'
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>

          {/* Filter: In Stock Only Switch */}
          <div className="pt-3 border-t border-[#292722]">
            <label className="flex items-center space-x-2 text-xs font-medium text-[#F5F2EA] cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded bg-[#191919] border-[#292722] text-[#D7AD55] focus:ring-0 accent-[#D7AD55]"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </div>

        {/* PRODUCTS AREA */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Bar with Sort & Mobile Filter Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#141414] border border-[#292722]">
            <div className="text-xs text-[#A5A19A]">
              Showing <span className="text-[#F5F2EA] font-bold">{products.length}</span> of{' '}
              <span className="text-[#F5F2EA] font-bold">{total}</span> authentic lubricants
            </div>

            <div className="flex items-center space-x-3">
              {/* Mobile Filter Toggle Button */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden px-3 py-1.5 rounded-lg bg-[#191919] border border-[#292722] text-xs font-semibold text-[#F5F2EA] flex items-center space-x-1.5"
              >
                <SlidersHorizontal size={13} className="text-[#D7AD55]" />
                <span>Filters {hasActiveFilters && '•'}</span>
              </button>

              {/* Sort Selector */}
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-[#A5A19A] hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-[#191919] border border-[#292722] text-xs text-[#F5F2EA] focus:outline-none focus:border-[#D7AD55]"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                  <option value="name_desc">Name: Z to A</option>
                  <option value="featured">Featured First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Badges */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[#A5A19A]">Active Filters:</span>
              {search && (
                <span className="px-2.5 py-1 rounded-md bg-[#191919] border border-[#292722] text-[#F5F2EA] flex items-center space-x-1">
                  <span>Search: "{search}"</span>
                  <button onClick={() => setSearch('')}>
                    <X size={12} className="text-[#A5A19A] hover:text-white" />
                  </button>
                </span>
              )}
              {selectedBrand !== 'all' && selectedBrand !== 'All' && (
                <span className="px-2.5 py-1 rounded-md bg-[#191919] border border-[#292722] text-[#F5F2EA] flex items-center space-x-1">
                  <span>Brand: {selectedBrand}</span>
                  <button onClick={() => setSelectedBrand('all')}>
                    <X size={12} className="text-[#A5A19A] hover:text-white" />
                  </button>
                </span>
              )}
              {selectedCategory !== 'all' && selectedCategory !== 'All' && (
                <span className="px-2.5 py-1 rounded-md bg-[#191919] border border-[#292722] text-[#F5F2EA] flex items-center space-x-1">
                  <span>Category: {selectedCategory}</span>
                  <button onClick={() => setSelectedCategory('all')}>
                    <X size={12} className="text-[#A5A19A] hover:text-white" />
                  </button>
                </span>
              )}
              {selectedViscosity !== 'all' && selectedViscosity !== 'All' && (
                <span className="px-2.5 py-1 rounded-md bg-[#191919] border border-[#292722] text-[#F5F2EA] flex items-center space-x-1">
                  <span>Viscosity: {selectedViscosity}</span>
                  <button onClick={() => setSelectedViscosity('all')}>
                    <X size={12} className="text-[#A5A19A] hover:text-white" />
                  </button>
                </span>
              )}
              {inStockOnly && (
                <span className="px-2.5 py-1 rounded-md bg-[#191919] border border-[#292722] text-[#F5F2EA] flex items-center space-x-1">
                  <span>In Stock Only</span>
                  <button onClick={() => setInStockOnly(false)}>
                    <X size={12} className="text-[#A5A19A] hover:text-white" />
                  </button>
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="text-xs text-[#D7AD55] hover:underline font-semibold ml-2"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-96 rounded-xl bg-[#191919] border border-[#292722] animate-pulse"
                ></div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="p-12 text-center rounded-2xl bg-[#141414] border border-[#292722] space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#191919] border border-[#292722] flex items-center justify-center mx-auto text-[#A5A19A]">
                <PackageX size={28} />
              </div>
              <h3 className="text-lg font-bold text-[#F5F2EA]">No Lubricants Found</h3>
              <p className="text-xs text-[#A5A19A] max-w-sm mx-auto">
                No products match your current search and filter settings. Try adjusting your criteria or clearing filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2 rounded-lg btn-gold text-xs font-bold"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {pages > 1 && (
            <div className="pt-6 flex justify-center items-center space-x-2">
              <button
                onClick={() => fetchProducts(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-3.5 py-2 rounded-lg bg-[#141414] border border-[#292722] text-xs font-bold text-[#F5F2EA] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#D7AD55]"
              >
                Previous
              </button>

              {Array.from({ length: pages }, (_, idx) => idx + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => fetchProducts(p)}
                  className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                    currentPage === p
                      ? 'bg-[#D7AD55] text-[#090909]'
                      : 'bg-[#141414] border border-[#292722] text-[#F5F2EA] hover:border-[#D7AD55]'
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => fetchProducts(currentPage + 1)}
                disabled={currentPage >= pages}
                className="px-3.5 py-2 rounded-lg bg-[#141414] border border-[#292722] text-xs font-bold text-[#F5F2EA] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#D7AD55]"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE FILTER MODAL DRAWER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/80 backdrop-blur-sm lg:hidden">
          <div className="ml-auto w-full max-w-xs h-full bg-[#141414] border-l border-[#292722] p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#292722]">
              <span className="font-bold text-sm text-[#F5F2EA]">Filter Products</span>
              <button onClick={() => setMobileFilterOpen(false)}>
                <X size={18} className="text-[#A5A19A]" />
              </button>
            </div>

            {/* Brands in Mobile */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#A5A19A] uppercase tracking-wider block">
                Brand
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#191919] border border-[#292722] text-xs text-[#F5F2EA]"
              >
                {brandsList.map((b) => (
                  <option key={b} value={b.toLowerCase() === 'all' ? 'all' : b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Category in Mobile */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#A5A19A] uppercase tracking-wider block">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#191919] border border-[#292722] text-xs text-[#F5F2EA]"
              >
                {categoriesList.map((c) => (
                  <option key={c} value={c.toLowerCase() === 'all' ? 'all' : c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Viscosity in Mobile */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#A5A19A] uppercase tracking-wider block">
                Viscosity Grade
              </label>
              <select
                value={selectedViscosity}
                onChange={(e) => setSelectedViscosity(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#191919] border border-[#292722] text-xs text-[#F5F2EA]"
              >
                {viscositiesList.map((v) => (
                  <option key={v} value={v.toLowerCase() === 'all' ? 'all' : v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            {/* Apply & Close */}
            <div className="pt-4 space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 rounded-lg btn-gold text-xs font-bold"
              >
                Apply Filters
              </button>
              <button
                onClick={handleResetFilters}
                className="w-full py-2.5 rounded-lg bg-[#191919] border border-[#292722] text-xs font-semibold text-[#A5A19A]"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;

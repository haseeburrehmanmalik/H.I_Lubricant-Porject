import React, { useState, useEffect } from 'react';
import {
  Calculator,
  Droplets,
  Check,
  ShoppingCart,
  Layers,
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle2,
  RefreshCw,
  Plus,
  Minus,
  Search,
} from 'lucide-react';
import { converterService } from '../../services/converterService';
import { useCart } from '../../context/CartContext';

const OilQuantityCalculator = ({ title, subtitle, showAllByDefault = false }) => {
  const [converters, setConverters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConverter, setSelectedConverter] = useState(null);
  const [unit, setUnit] = useState('L'); // 'L' or 'ml'
  const [quantityInput, setQuantityInput] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const { addCustomOilToCart } = useCart();

  const fetchConverters = async () => {
    try {
      setLoading(true);
      const res = await converterService.getPublicConverters();
      if (res.success && res.converters) {
        setConverters(res.converters);
        if (res.converters.length > 0 && !selectedConverter) {
          setSelectedConverter(res.converters[0]);
          setQuantityInput(res.converters[0].minimumQuantity || 1);
        }
      }
    } catch (err) {
      console.error('Failed to load oil converters:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConverters();
  }, []);

  const handleSelectConverter = (conv) => {
    setSelectedConverter(conv);
    setAddedSuccess(false);
    if (unit === 'ml') {
      setQuantityInput((conv.minimumQuantity || 1) * 1000);
    } else {
      setQuantityInput(conv.minimumQuantity || 1);
    }
  };

  // Unit conversion calculations
  const numericInput = Math.max(0, parseFloat(quantityInput) || 0);
  const calculatedLitres = unit === 'ml' ? numericInput / 1000 : numericInput;
  const pricePerLitre = selectedConverter ? selectedConverter.pricePerLitre : 0;
  const totalPrice = Math.round(calculatedLitres * pricePerLitre);

  // Stepper handlers
  const handleStep = (direction) => {
    const step = unit === 'ml' ? 250 : selectedConverter?.quantityIncrement || 0.5;
    const current = parseFloat(quantityInput) || 0;
    const nextVal = direction === 'up' ? current + step : Math.max(step, current - step);
    setQuantityInput(Math.round(nextVal * 100) / 100);
  };

  const handlePreset = (litresAmount) => {
    if (unit === 'ml') {
      setQuantityInput(litresAmount * 1000);
    } else {
      setQuantityInput(litresAmount);
    }
  };

  const handleUnitToggle = (newUnit) => {
    if (newUnit === unit) return;
    if (newUnit === 'ml') {
      setQuantityInput(Math.round(numericInput * 1000));
    } else {
      setQuantityInput(Math.round((numericInput / 1000) * 100) / 100);
    }
    setUnit(newUnit);
  };

  const handleAddToCart = () => {
    if (!selectedConverter) return;
    const success = addCustomOilToCart(
      selectedConverter,
      calculatedLitres,
      unit,
      numericInput
    );
    if (success) {
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2500);
    }
  };

  // Filter converters based on customer search and brand
  const filteredConverters = converters.filter((c) => {
    const matchesBrand =
      selectedBrand === 'All' || c.brand?.toLowerCase() === selectedBrand.toLowerCase();
    const matchesSearch =
      !customerSearch.trim() ||
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.brand.toLowerCase().includes(customerSearch.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(customerSearch.toLowerCase()));
    return matchesBrand && matchesSearch;
  });

  // Extract unique brands
  const brandsList = ['All', ...new Set(converters.map((c) => c.brand).filter(Boolean))];

  if (loading) {
    return (
      <div className="w-full p-8 rounded-3xl bg-[#141414] border border-[#292722] text-center">
        <div className="w-8 h-8 border-2 border-[#D7AD55] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs text-[#A5A19A]">Loading Smart Oil Converters from database...</p>
      </div>
    );
  }

  if (converters.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#191919] border border-[#D7AD55]/30 text-[#D7AD55] text-xs font-bold uppercase tracking-wider mb-3">
          <Droplets size={14} />
          <span>Dynamic Open Oil Measurement</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F5F2EA] tracking-tight">
          {title || 'SMART OIL QUANTITY CONVERTERS'}
        </h2>
        <p className="text-xs sm:text-sm text-[#A5A19A] mt-2 leading-relaxed">
          {subtitle ||
            'Choose your preferred oil converter, enter your required quantity and instantly calculate the price in PKR.'}
        </p>
      </div>

      {/* Main Grid: Converters Cards (Left) + Calculator Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start px-2 sm:px-0">
        {/* 1. Converter Selection Cards (Grid of active converters) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Filter & Search Bar */}
          <div className="p-3 rounded-2xl bg-[#141414] border border-[#292722] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            {/* Search */}
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A5A19A]" size={14} />
              <input
                type="text"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                placeholder="Search converter or grade..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#191919] border border-[#292722] text-xs text-[#F5F2EA] placeholder-[#A5A19A] focus:outline-none focus:border-[#D7AD55]"
              />
            </div>

            {/* Brand Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {brandsList.slice(0, 5).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setSelectedBrand(b)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    selectedBrand === b
                      ? 'bg-[#D7AD55] text-black font-bold'
                      : 'bg-[#191919] border border-[#292722] text-[#A5A19A] hover:text-[#F5F2EA]'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pb-1 text-xs">
            <span className="font-bold text-[#F5F2EA] uppercase tracking-wider text-[11px]">
              Available Converters ({filteredConverters.length} Active)
            </span>
            <span className="text-[#A5A19A] text-[11px]">Select any card to calculate</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[640px] overflow-y-auto pr-1">
            {filteredConverters.length > 0 ? (
              filteredConverters.map((conv) => {
                const isSelected = selectedConverter && selectedConverter._id === conv._id;
                return (
                  <div
                    key={conv._id}
                    onClick={() => handleSelectConverter(conv)}
                    className={`p-4 rounded-2xl cursor-pointer transition-all border text-left relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gradient-to-br from-[#1c1a16] to-[#141414] border-[#D7AD55] shadow-gold-sm ring-1 ring-[#D7AD55]/40'
                        : 'bg-[#141414] border-[#292722] hover:border-[#D7AD55]/60 hover:bg-[#191919]'
                    }`}
                  >
                    {/* Top Bar: Slot # + Brand Badge */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-[#090909] text-[#D7AD55] border border-[#292722]">
                        Slot #{conv.converterNumber < 10 ? `0${conv.converterNumber}` : conv.converterNumber}
                      </span>
                      <span className="text-[10px] font-bold text-[#A5A19A] truncate max-w-[120px]">
                        {conv.brand}
                      </span>
                    </div>

                    {/* Converter Name */}
                    <h4 className="font-bold text-sm text-[#F5F2EA] mb-1 line-clamp-1">
                      {conv.name}
                    </h4>

                    {/* Description */}
                    <p className="text-[11px] text-[#A5A19A] line-clamp-2 mb-3 leading-relaxed">
                      {conv.description || 'Authentic bulk engine oil measured by exact customer requirement.'}
                    </p>

                    {/* Pricing & Stock Footer */}
                    <div className="pt-2 border-t border-[#292722]/80 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-[#A5A19A] block">Rate:</span>
                        <strong className="text-[#D7AD55] font-extrabold">
                          Rs. {conv.pricePerLitre.toLocaleString()} <span className="text-[10px] text-[#A5A19A] font-normal">/ L</span>
                        </strong>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-[#A5A19A] block">Stock:</span>
                        <span className="text-[11px] text-[#F5F2EA] font-semibold">
                          {conv.availableLitres} L
                        </span>
                      </div>
                    </div>

                    {/* Selected Indicator */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#D7AD55] animate-ping"></div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="sm:col-span-2 p-8 text-center text-xs text-[#A5A19A] bg-[#141414] border border-[#292722] rounded-2xl">
                No active converters match your filter.
              </div>
            )}
          </div>
        </div>

        {/* 2. Interactive Calculator Display Panel */}
        <div className="lg:col-span-5">
          {selectedConverter ? (
            <div className="p-6 sm:p-7 rounded-3xl bg-[#141414] border border-[#D7AD55]/40 shadow-xl space-y-6 sticky top-28">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#292722]">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-[#191919] text-[#D7AD55] border border-[#292722]">
                      Slot #{selectedConverter.converterNumber}
                    </span>
                    <span className="text-xs font-semibold text-[#A5A19A]">
                      {selectedConverter.brand}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-[#F5F2EA] mt-1">
                    {selectedConverter.name}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-[#A5A19A] block">Unit Price</span>
                  <span className="text-sm font-extrabold text-[#D7AD55]">
                    Rs. {selectedConverter.pricePerLitre.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-[#A5A19A] block">per Litre</span>
                </div>
              </div>

              {/* Unit Switcher */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#A5A19A] block">
                  Select Measurement Unit:
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#090909] border border-[#292722]">
                  <button
                    type="button"
                    onClick={() => handleUnitToggle('L')}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${
                      unit === 'L'
                        ? 'bg-[#D7AD55] text-black shadow-sm'
                        : 'text-[#A5A19A] hover:text-[#F5F2EA]'
                    }`}
                  >
                    Litres (L)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUnitToggle('ml')}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${
                      unit === 'ml'
                        ? 'bg-[#D7AD55] text-black shadow-sm'
                        : 'text-[#A5A19A] hover:text-[#F5F2EA]'
                    }`}
                  >
                    Millilitres (ml)
                  </button>
                </div>
              </div>

              {/* Quantity Stepper & Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-semibold text-[#A5A19A]">Required Quantity:</label>
                  <span className="text-[11px] text-[#D7AD55]">
                    Available: {selectedConverter.availableLitres} Litres
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleStep('down')}
                    className="w-12 h-12 rounded-xl bg-[#191919] border border-[#292722] hover:border-[#D7AD55] text-[#F5F2EA] flex items-center justify-center shrink-0 text-base font-bold active:scale-95 transition-all"
                  >
                    <Minus size={16} />
                  </button>

                  <div className="relative flex-1">
                    <input
                      type="number"
                      step={unit === 'ml' ? '50' : '0.1'}
                      min={unit === 'ml' ? '50' : '0.05'}
                      max={unit === 'ml' ? selectedConverter.availableLitres * 1000 : selectedConverter.availableLitres}
                      value={quantityInput}
                      onChange={(e) => setQuantityInput(e.target.value)}
                      className="w-full py-3 px-4 rounded-xl bg-[#090909] border border-[#292722] text-center font-extrabold text-lg text-[#F5F2EA] focus:outline-none focus:border-[#D7AD55]"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#A5A19A]">
                      {unit}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleStep('up')}
                    className="w-12 h-12 rounded-xl bg-[#191919] border border-[#292722] hover:border-[#D7AD55] text-[#F5F2EA] flex items-center justify-center shrink-0 text-base font-bold active:scale-95 transition-all"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] text-[#A5A19A] self-center mr-1">Presets:</span>
                  {[0.5, 0.7, 1.0, 1.5, 3.0, 4.0].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handlePreset(preset)}
                      className="px-2 py-1 rounded-lg bg-[#191919] border border-[#292722] hover:border-[#D7AD55] text-[11px] font-semibold text-[#A5A19A] hover:text-[#D7AD55] transition-all"
                    >
                      {preset} L
                    </button>
                  ))}
                </div>
              </div>

              {/* Automatic Conversion Notice Box */}
              <div className="p-3.5 rounded-xl bg-[#090909] border border-[#292722] flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-[#A5A19A]">
                  <RefreshCw size={14} className="text-[#D7AD55]" />
                  <span>Equivalent Volume:</span>
                </div>
                <strong className="text-[#F5F2EA]">
                  {unit === 'ml'
                    ? `${calculatedLitres} Litres (L)`
                    : `${Math.round(calculatedLitres * 1000)} Millilitres (ml)`}
                </strong>
              </div>

              {/* LIVE PKR CALCULATION DISPLAY */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#191919] to-[#090909] border border-[#D7AD55]/50 shadow-gold-sm space-y-2">
                <div className="flex justify-between items-center text-xs text-[#A5A19A]">
                  <span>Formula: {calculatedLitres} L × Rs. {pricePerLitre.toLocaleString()}</span>
                  <span className="text-emerald-400 font-semibold text-[11px]">Instant PKR Calculation</span>
                </div>
                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-xs uppercase font-bold text-[#A5A19A]">Total Amount:</span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#D7AD55]">
                    Rs. {totalPrice.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Add to Cart CTA */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={calculatedLitres <= 0 || calculatedLitres > selectedConverter.availableLitres}
                className={`w-full py-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-all shadow-gold-md disabled:opacity-40 disabled:cursor-not-allowed ${
                  addedSuccess ? 'bg-emerald-600 text-white' : 'btn-gold'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Added to Cart Successfully!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={16} />
                    <span>Add {calculatedLitres} Litres to Cart</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-[#A5A19A] text-center leading-relaxed">
                Measured from verified factory drums. 100% genuine formulation guaranteed by H.I Lubricant.
              </p>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-[#141414] border border-[#292722] text-center text-xs text-[#A5A19A]">
              Select an oil converter on the left to begin instant calculation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OilQuantityCalculator;

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const Product = require('../models/Product');
const Order = require('../models/Order');
const InventoryTransaction = require('../models/InventoryTransaction');
const Customer = require('../models/Customer');
const StoreSettings = require('../models/StoreSettings');
const OilConverter = require('../models/OilConverter');

const seedData = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    console.log('[Seeder] Connected to database. Clearing old collections...');

    await User.deleteMany();
    await Category.deleteMany();
    await Brand.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await InventoryTransaction.deleteMany();
    await Customer.deleteMany();
    await StoreSettings.deleteMany();

    console.log('[Seeder] Cleared collections.');

    // 1. Store Settings
    const storeSettings = await StoreSettings.create({
      businessName: 'H.I Lubricant',
      tagline: 'POWER YOUR JOURNEY.',
      heroHeadline: 'Every Journey Deserves Better Oil.',
      phone: '+92 3113728228',
      whatsappNumber: '+92 3113728228',
      email: 'malikimranali42@yahoo.com',
      address: 'Near Gari Khata, Tulsi Daas Road, Amma Ayesha Hospital, Hyderabad, Sindh, Pakistan.',
      city: 'Hyderabad, Sindh',
      country: 'Pakistan',
      currency: 'PKR',
      currencySymbol: 'Rs.',
      standardDeliveryFee: 250,
      freeDeliveryThreshold: 8000,
      businessHours: 'Monday – Saturday: 9:00 AM – 9:00 PM (Friday break: 1:00 PM – 2:30 PM)',
      announcement: '100% Original Genuine Engine Oils & Lubricants in Hyderabad. Fast delivery across Sindh & Pakistan!',
    });
    console.log('[Seeder] Store Settings created.');

    // 2. Admin User
    const adminUser = await User.create({
      name: 'Malik Imran Ali',
      email: process.env.ADMIN_DEFAULT_EMAIL || 'admin@hilubricant.com',
      password: process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@123456',
      role: 'admin',
      phone: '+92 3113728228',
      isActive: true,
    });
    console.log(`[Seeder] Admin user created (${adminUser.email}).`);

    // 3. Brands
    const brands = await Brand.insertMany([
      {
        name: 'Shell',
        slug: 'shell',
        logo: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=400&q=80',
        description: 'World-renowned Helix & Rimula engine oils with PurePlus Technology.',
        origin: 'United Kingdom / Global',
      },
      {
        name: 'Caltex',
        slug: 'caltex',
        logo: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80',
        description: 'Havoline and Delo lubricants powered by Chevron advanced deposit shield technology.',
        origin: 'Chevron / Global',
      },
      {
        name: 'PSO',
        slug: 'pso',
        logo: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=400&q=80',
        description: 'Pakistan State Oil premier Carient and DEO lubricants engineered for local climates.',
        origin: 'Pakistan',
      },
      {
        name: 'Honda',
        slug: 'honda',
        logo: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=400&q=80',
        description: 'Genuine OEM Engine Oils precision formulated for Honda VTEC, i-DCD, and Turbo engines.',
        origin: 'Japan / OEM',
      },
      {
        name: 'Blaze',
        slug: 'blaze',
        logo: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=400&q=80',
        description: 'High-thermal endurance performance motor oils for heavy and urban traffic conditions.',
        origin: 'Pakistan / International',
      },
      {
        name: 'ZIC',
        slug: 'zic',
        logo: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=400&q=80',
        description: 'SK Lubricants YUBASE Group III synthetic motor oils with ultimate wear protection.',
        origin: 'South Korea',
      },
      {
        name: 'Total',
        slug: 'total',
        logo: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&w=400&q=80',
        description: 'Quartz series lubricants with Age Resistance Technology for extended engine life.',
        origin: 'France / Global',
      },
    ]);
    console.log(`[Seeder] ${brands.length} Brands created.`);

    // 4. Categories
    const categories = await Category.insertMany([
      {
        name: 'Passenger Car Motor Oil',
        slug: 'passenger-car-motor-oil',
        description: 'Full synthetic, semi-synthetic, and premium mineral engine oils for petrol & hybrid cars.',
        displayOrder: 1,
      },
      {
        name: 'Heavy Duty Diesel Oil',
        slug: 'heavy-duty-diesel-oil',
        description: 'Commercial vehicle and turbo diesel engine lubricants for trucks, pickups, and fleets.',
        displayOrder: 2,
      },
      {
        name: 'Motorcycle & 4T Oils',
        slug: 'motorcycle-4t-oils',
        description: 'High-revving motorcycle 4-stroke engine oils and wet-clutch compatible formulas.',
        displayOrder: 3,
      },
      {
        name: 'Gear & Transmission Oil',
        slug: 'gear-transmission-oil',
        description: 'Automatic transmission fluids (ATF, CVT) and hypoid differential manual gear oils.',
        displayOrder: 4,
      },
      {
        name: 'Coolants & Brake Fluids',
        slug: 'coolants-brake-fluids',
        description: 'Heavy duty radiator long-life coolants and DOT-3, DOT-4 synthetic brake fluids.',
        displayOrder: 5,
      },
    ]);
    console.log(`[Seeder] ${categories.length} Categories created.`);

    // 5. Products (16 rich automotive lubricant products)
    const rawProducts = [
      {
        name: 'Shell Helix Ultra Fully Synthetic',
        brand: 'Shell',
        category: 'Passenger Car Motor Oil',
        viscosity: '5W-40',
        volume: '4 Litres',
        price: 9800,
        originalPrice: 10500,
        stock: 35,
        lowStockThreshold: 6,
        featured: true,
        images: [
          'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80',
        ],
        description:
          'Shell Helix Ultra 5W-40 uses PurePlus Technology - gas-to-liquid synthesis producing 99.5% pure base oil with virtually zero impurities. Delivers superior piston cleanliness, extreme thermal stability, and maximum fuel economy for modern luxury and high-performance engines.',
        specifications: {
          apiRating: 'API SP / CF',
          baseOil: 'PurePlus Fully Synthetic',
          vehicleType: 'Petrol, Diesel, Hybrid Vehicles',
          density: '0.84 g/cm3',
        },
        keyBenefits: [
          'Gas-to-liquid synthesis with 99.5% pure base oil',
          'Unsurpassed sludge protection and active cleansing',
          'Exceptional low-temperature fluidity for fast engine start',
          'Recommended for turbocharged and supercharged engines',
        ],
      },
      {
        name: 'Shell Helix HX7 Synthetic Technology',
        brand: 'Shell',
        category: 'Passenger Car Motor Oil',
        viscosity: '10W-40',
        volume: '4 Litres',
        price: 6800,
        originalPrice: 7200,
        stock: 45,
        lowStockThreshold: 8,
        featured: true,
        images: [
          'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
        ],
        description:
          'Shell Helix HX7 helps keep modern engines clean and running smoothly by actively preventing sludge and deposits from forming. Suitable for a wide range of everyday driving conditions in warm climates like Sindh.',
        specifications: {
          apiRating: 'API SN PLUS',
          baseOil: 'Synthetic Technology',
          vehicleType: 'Sedans, Hatchbacks, SUVs',
          density: '0.86 g/cm3',
        },
        keyBenefits: [
          'Active Cleansing Technology keeps engines factory-clean',
          'Prolongs engine lifespan in dusty and high-temperature environments',
          'Enhanced low-volatility oil consumption reduction',
        ],
      },
      {
        name: 'Caltex Havoline ProDS Fully Synthetic',
        brand: 'Caltex',
        category: 'Passenger Car Motor Oil',
        viscosity: '0W-20',
        volume: '4 Litres',
        price: 9200,
        originalPrice: 9900,
        stock: 28,
        lowStockThreshold: 5,
        featured: true,
        images: [
          'https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&w=800&q=80',
        ],
        description:
          'Caltex Havoline ProDS 0W-20 features Deposit Shield Technology that forms an ultra-thin, tough protective barrier across high-pressure engine surfaces. Ideal for modern hybrid and eco-boost Japanese and local vehicles.',
        specifications: {
          apiRating: 'API SP / ILSAC GF-6A',
          baseOil: 'Fully Synthetic ProDS',
          vehicleType: 'Japanese Hybrids, Corollas, Civics, Alto 660cc',
          density: '0.83 g/cm3',
        },
        keyBenefits: [
          'Maximum fuel economy enhancement (ILSAC GF-6A)',
          'Protection against Low-Speed Pre-Ignition (LSPI) in turbo engines',
          'Effortless cold starts with instantaneous lubrication',
        ],
      },
      {
        name: 'Caltex Havoline Formula SAE 20W-50',
        brand: 'Caltex',
        category: 'Passenger Car Motor Oil',
        viscosity: '20W-50',
        volume: '4 Litres',
        price: 5400,
        originalPrice: 5800,
        stock: 50,
        lowStockThreshold: 10,
        featured: false,
        images: [
          'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
        ],
        description:
          'High quality, multigrade engine oil designed for older engines and high mileage vehicles operating in warm climatic conditions. Provides high film strength under heavy load and severe highway driving.',
        specifications: {
          apiRating: 'API SG/CD',
          baseOil: 'Premium Mineral',
          vehicleType: 'Classic Cars, High Mileage Sedans, Light Trucks',
          density: '0.88 g/cm3',
        },
        keyBenefits: [
          'Thick lubricating film minimizes oil leakage and oil burning',
          'Excellent anti-wear protection for older valvetrains',
          'Heavy thermal resistance in scorching Hyderabad summers',
        ],
      },
      {
        name: 'PSO Carient Fully Synthetic S-Pro',
        brand: 'PSO',
        category: 'Passenger Car Motor Oil',
        viscosity: '5W-30',
        volume: '4 Litres',
        price: 7600,
        originalPrice: 8200,
        stock: 30,
        lowStockThreshold: 6,
        featured: true,
        images: [
          'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80',
        ],
        description:
          'PSO Carient S-Pro 5W-30 is Pakistan State Oil premier fully synthetic passenger car motor oil. Formulated with cutting-edge additives to deliver unmatched fuel efficiency and long drain intervals for city and highway commuting.',
        specifications: {
          apiRating: 'API SP / RC',
          baseOil: 'Fully Synthetic',
          vehicleType: 'Yaris, City, Swift, Sportage, Elantra',
          density: '0.85 g/cm3',
        },
        keyBenefits: [
          'Engineered specifically for Pakistani driving and climate conditions',
          'Prevents chain wear and turbocharger deposits',
          'High thermal endurance and smooth accelerator response',
        ],
      },
      {
        name: 'PSO Carient Plus Motor Oil',
        brand: 'PSO',
        category: 'Passenger Car Motor Oil',
        viscosity: '20W-50',
        volume: '4 Litres',
        price: 4900,
        originalPrice: 5200,
        stock: 60,
        lowStockThreshold: 10,
        featured: false,
        images: [
          'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
        ],
        description:
          'PSO Carient Plus 20W-50 is a trusted multigrade mineral engine oil engineered with detergent dispersants that prevent carbon deposits and provide steady viscosity under high temperatures.',
        specifications: {
          apiRating: 'API SL/CF',
          baseOil: 'Refined Mineral',
          vehicleType: 'Cultus, Mehran, Bolan, WagonR, Old Corollas',
          density: '0.88 g/cm3',
        },
        keyBenefits: [
          'Economical and highly reliable daily protection',
          'Robust film strength resisting thermal breakdown',
          'Proven heritage in Pakistani transport circles',
        ],
      },
      {
        name: 'Honda Genuine Engine Oil SM/GF-4',
        brand: 'Honda',
        category: 'Passenger Car Motor Oil',
        viscosity: '0W-20',
        volume: '3.7 Litres',
        price: 8900,
        originalPrice: 9500,
        stock: 22,
        lowStockThreshold: 5,
        featured: true,
        images: [
          'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80',
        ],
        description:
          'Official Genuine Honda Engine Oil engineered and validated specifically by Honda R&D for Honda Civic, City, BR-V, HR-V, and Vezel. Formulated with low-viscosity synthetic base to optimize VTEC performance.',
        specifications: {
          apiRating: 'API SM / ILSAC GF-4',
          baseOil: 'OEM Fully Synthetic',
          vehicleType: 'Honda Civic, City, Accord, Vezel, Fit',
          density: '0.84 g/cm3',
        },
        keyBenefits: [
          '100% Genuine OEM formulation authorized by Honda',
          'Prevents varnish and friction in high-precision VTEC engines',
          'Zero cold start friction for instant acceleration',
        ],
      },
      {
        name: 'Honda Genuine SN Engine Oil',
        brand: 'Honda',
        category: 'Passenger Car Motor Oil',
        viscosity: '10W-30',
        volume: '3.7 Litres',
        price: 6400,
        originalPrice: 6800,
        stock: 32,
        lowStockThreshold: 7,
        featured: false,
        images: [
          'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80',
        ],
        description:
          'Authentic Honda 10W-30 mineral-synthetic blend oil engineered for reliable protection in hot climates. Maintains engine cleanliness and smooth shifting on Honda manual and automatic systems.',
        specifications: {
          apiRating: 'API SN',
          baseOil: 'OEM Synthetic Blend',
          vehicleType: 'Honda City, Civic Reborn / Prosmatec, CR-V',
          density: '0.86 g/cm3',
        },
        keyBenefits: [
          'Original Honda OEM specification oil',
          'Extended catalytic converter and oxygen sensor life',
          'Exceptional shear stability against mechanical breakdown',
        ],
      },
      {
        name: 'Blaze ProSyn Ultra Performance Oil',
        brand: 'Blaze',
        category: 'Passenger Car Motor Oil',
        viscosity: '5W-30',
        volume: '4 Litres',
        price: 7200,
        originalPrice: 7800,
        stock: 4, // Intentionally low stock to demo alert!
        lowStockThreshold: 5,
        featured: true,
        images: [
          'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
        ],
        description:
          'Blaze ProSyn 5W-30 is a high-octane fully synthetic motor oil packed with thermal endurance compounds for prolonged stop-and-go city traffic and hot highway sprints.',
        specifications: {
          apiRating: 'API SP / SN PLUS',
          baseOil: 'Advanced Synthetic',
          vehicleType: 'Turbocharged Petrol & Diesel Cars',
          density: '0.85 g/cm3',
        },
        keyBenefits: [
          'Extreme resistance against oxidation in hot traffic jams',
          'Rapid lubrication on initial cold key turn',
          'Super clean combustion chambers and valves',
        ],
      },
      {
        name: 'Blaze TurboMax Diesel Extra',
        brand: 'Blaze',
        category: 'Heavy Duty Diesel Oil',
        viscosity: '15W-40',
        volume: '10 Litres',
        price: 13500,
        originalPrice: 14500,
        stock: 18,
        lowStockThreshold: 4,
        featured: false,
        images: [
          'https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&w=800&q=80',
        ],
        description:
          'High-performance heavy-duty diesel engine oil for turbocharged commercial vehicles, buses, and heavy machinery operating in long haul operations across Pakistan.',
        specifications: {
          apiRating: 'API CI-4 / SL',
          baseOil: 'Heavy-Duty Mineral',
          vehicleType: 'Hino, Isuzu, Bedford, Generators, Tractors',
          density: '0.88 g/cm3',
        },
        keyBenefits: [
          'Controls soot dispersion and stops abrasive cylinder wear',
          'Protects bearings from corrosive acidic blow-by gases',
          'Proven for long highway hauls from Karachi to Peshawar',
        ],
      },
      {
        name: 'Caltex Delo 400 MGX Diesel Oil',
        brand: 'Caltex',
        category: 'Heavy Duty Diesel Oil',
        viscosity: '15W-40',
        volume: '5 Litres',
        price: 7800,
        originalPrice: 8400,
        stock: 3, // Low stock demo
        lowStockThreshold: 5,
        featured: true,
        images: [
          'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
        ],
        description:
          'Caltex Delo 400 MGX with ISOSYN Advanced Technology is designed for heavy-duty on-highway and off-highway applications using both high and ultra-low sulfur diesel fuels.',
        specifications: {
          apiRating: 'API CJ-4 / CI-4 PLUS',
          baseOil: 'ISOSYN Heavy-Duty Formula',
          vehicleType: 'Hilux Revo, D-Max, Fortuner Diesel, Trucks',
          density: '0.87 g/cm3',
        },
        keyBenefits: [
          'ISOSYN technology matches synthetic performance',
          'Superior soot handling prevents filter plugging',
          'Protects high-pressure common rail fuel systems',
        ],
      },
      {
        name: 'Shell Rimula R4 X Heavy Duty Engine Oil',
        brand: 'Shell',
        category: 'Heavy Duty Diesel Oil',
        viscosity: '15W-40',
        volume: '4 Litres',
        price: 6200,
        originalPrice: 6600,
        stock: 40,
        lowStockThreshold: 8,
        featured: false,
        images: [
          'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
        ],
        description:
          'Shell Rimula R4 X features triple protection technology: controls acid, deposits, and wear to help prolong engine life for trucks, pickups, and diesel fleets.',
        specifications: {
          apiRating: 'API CI-4 / CH-4 / SL',
          baseOil: 'Refined Mineral Plus',
          vehicleType: 'Diesel Pickups, Vans, Trucks, Agricultural',
          density: '0.88 g/cm3',
        },
        keyBenefits: [
          'Triple protection against acid, deposit, and component wear',
          'Proven high TBN retention neutralizing combustion acids',
          'Trusted global reliability for heavy commercial duty',
        ],
      },
      {
        name: 'ZIC X7 5W-30 Fully Synthetic',
        brand: 'ZIC',
        category: 'Passenger Car Motor Oil',
        viscosity: '5W-30',
        volume: '4 Litres',
        price: 8400,
        originalPrice: 8900,
        stock: 25,
        lowStockThreshold: 5,
        featured: true,
        images: [
          'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
        ],
        description:
          'ZIC X7 5W-30 is a 100% synthetic motor oil engineered with SK YUBASE synthetic base oil. Provides maximum fuel economy and prevents low-speed pre-ignition in modern direct-injected engines.',
        specifications: {
          apiRating: 'API SP / ILSAC GF-6',
          baseOil: 'YUBASE Fully Synthetic',
          vehicleType: 'Hyundai, Kia, Toyota, Suzuki, Changan',
          density: '0.84 g/cm3',
        },
        keyBenefits: [
          'Renowned YUBASE Group III base stock with zero volatility',
          'Approved for timing chain wear prevention',
          'Outstanding fuel economy and instant engine responsiveness',
        ],
      },
      {
        name: 'Total Quartz 9000 Future FGC',
        brand: 'Total',
        category: 'Passenger Car Motor Oil',
        viscosity: '5W-30',
        volume: '4 Litres',
        price: 8600,
        originalPrice: 9100,
        stock: 20,
        lowStockThreshold: 5,
        featured: false,
        images: [
          'https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&w=800&q=80',
        ],
        description:
          'Advanced synthetic technology engine oil providing the best protection against wear and deposits. Its new enhanced formulation helps fight against Low Speed Pre-Ignition (LSPI).',
        specifications: {
          apiRating: 'API SP / ILSAC GF-6A',
          baseOil: 'Total Synthetic Technology',
          vehicleType: 'Downsized Turbocharged Petrol Engines',
          density: '0.85 g/cm3',
        },
        keyBenefits: [
          'Age Resistance Technology (ART) protects under high pressure',
          'Extends oil drain intervals without degradation',
          'Substantial CO2 emissions and fuel burn reduction',
        ],
      },
      {
        name: 'Shell Advance 4T Ultra Motorcycle Oil',
        brand: 'Shell',
        category: 'Motorcycle & 4T Oils',
        viscosity: '10W-40',
        volume: '1 Litre',
        price: 2400,
        originalPrice: 2600,
        stock: 65,
        lowStockThreshold: 12,
        featured: true,
        images: [
          'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
        ],
        description:
          'Shell Advance 4T Ultra 10W-40 is a fully synthetic motorcycle lubricant engineered with Shell PurePlus Technology. Provides optimum power, smooth clutch engagement, and vibration dampening for sports and commuter bikes.',
        specifications: {
          apiRating: 'API SN / JASO MA2',
          baseOil: 'PurePlus Synthetic 4T',
          vehicleType: 'Suzuki GSX/GR, Yamaha YBR, Honda CBF, Heavy Bikes',
          density: '0.85 g/cm3',
        },
        keyBenefits: [
          'JASO MA2 certification for anti-clutch slip performance',
          'Smooth and precise gear shift feeling',
          'Vibration absorption and reduced motorcycle engine noise',
        ],
      },
      {
        name: 'Caltex Havoline Super 4T Motorcycle Oil',
        brand: 'Caltex',
        category: 'Motorcycle & 4T Oils',
        viscosity: '20W-40',
        volume: '0.7 Litres',
        price: 1100,
        originalPrice: 1250,
        stock: 90,
        lowStockThreshold: 15,
        featured: false,
        images: [
          'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
        ],
        description:
          'Premium multigrade 4-stroke motorcycle engine oil formulated with Havoline Shield Technology. Specially developed for 70cc to 125cc commuter bikes operating daily in intense summer heat.',
        specifications: {
          apiRating: 'API SL / JASO MA2',
          baseOil: 'Premium Mineral 4T',
          vehicleType: 'Honda CD70, CG125, Road Prince, United',
          density: '0.88 g/cm3',
        },
        keyBenefits: [
          'Economical and highly durable commuter bike oil',
          'Prevents clutch slippage under stop-and-go load',
          'High thermal protection in intense urban heat',
        ],
      },
      {
        name: 'Shell Spirax S4 ATF HDX Automatic Transmission Fluid',
        brand: 'Shell',
        category: 'Gear & Transmission Oil',
        viscosity: 'ATF Synthetic',
        volume: '1 Litre',
        price: 2800,
        originalPrice: 3100,
        stock: 35,
        lowStockThreshold: 6,
        featured: false,
        images: [
          'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80',
        ],
        description:
          'Advanced synthetic technology heavy-duty automatic transmission fluid delivering exceptional anti-shudder and thermal durability for modern automatic gearboxes and power steering systems.',
        specifications: {
          apiRating: 'Dexron III-H / Mercon',
          baseOil: 'Synthetic ATF',
          vehicleType: 'Automatic Cars, Power Steering, Hydraulic Units',
          density: '0.85 g/cm3',
        },
        keyBenefits: [
          'Silky smooth gear shifts without shudder',
          'High shear stability under extreme torque',
          'Protects copper and brass transmission bushings',
        ],
      },
      {
        name: 'Caltex Delo Extended Life Heavy Duty Coolant',
        brand: 'Caltex',
        category: 'Coolants & Brake Fluids',
        viscosity: '50/50 Premix',
        volume: '4 Litres',
        price: 3600,
        originalPrice: 3900,
        stock: 40,
        lowStockThreshold: 8,
        featured: false,
        images: [
          'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
        ],
        description:
          'Heavy duty premixed 50/50 ethylene glycol radiator coolant formulated with patented carboxylate aliphatic organic acid technology (OAT). Guaranteed protection up to 5 years or 250,000 km.',
        specifications: {
          apiRating: 'ASTM D6210 / D3306',
          baseOil: 'Organic Acid Technology (OAT)',
          vehicleType: 'All Cars, Commercial Fleets, Heavy Equipment',
          density: '1.07 g/cm3',
        },
        keyBenefits: [
          'Boil-over protection up to 129°C in hot Sindh weather',
          'Stops water pump seal failure and cylinder liner pitting',
          'Premixed with deionized water - ready to pour without dilution',
        ],
      },
    ];

    const slugify = (text) =>
      text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');

    const createdProducts = [];
    for (const p of rawProducts) {
      const slug = slugify(`${p.brand}-${p.name}-${p.viscosity}`);
      const product = await Product.create({
        ...p,
        slug,
      });
      createdProducts.push(product);

      // Inventory transaction for initial seed
      await InventoryTransaction.create({
        product: product._id,
        productName: product.name,
        transactionType: 'initial_seed',
        quantity: product.stock,
        previousStock: 0,
        newStock: product.stock,
        reference: 'Initial Stock Intake',
        notes: `Inventory onboarded for ${product.name}`,
      });
    }
    console.log(`[Seeder] ${createdProducts.length} Products created and inventory logged.`);

    // 6. Customers
    const sampleCustomers = [
      {
        name: 'Tariq Mehmood',
        phone: '+92 300 1234567',
        email: 'tariq.mehmood@gmail.com',
        address: 'House # 42, Block B, Qasimabad',
        city: 'Hyderabad',
        totalOrders: 3,
        totalSpent: 26400,
      },
      {
        name: 'Kashif Ali Memon',
        phone: '+92 312 9876543',
        email: 'kashif.memon@yahoo.com',
        address: 'Shop # 14, Auto Market, Gari Khata',
        city: 'Hyderabad',
        totalOrders: 2,
        totalSpent: 16800,
      },
      {
        name: 'Muhammad Usman',
        phone: '+92 333 4567890',
        email: 'usman.autos@outlook.com',
        address: 'Plot 18, Phase 2, Saddar Cantt',
        city: 'Hyderabad',
        totalOrders: 1,
        totalSpent: 9800,
      },
      {
        name: 'Raza Shah',
        phone: '+92 345 6789012',
        email: 'raza.shah@hotmail.com',
        address: 'Street 4, Latifabad Unit 7',
        city: 'Hyderabad',
        totalOrders: 1,
        totalSpent: 7200,
      },
    ];
    await Customer.insertMany(sampleCustomers);
    console.log(`[Seeder] Sample customers seeded.`);

    // 7. Sample Orders for Dashboard Analytics & Tracking
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;

    const sampleOrders = [
      {
        orderNumber: 'HI-2026-10492',
        customer: {
          name: 'Tariq Mehmood',
          phone: '+92 300 1234567',
          email: 'tariq.mehmood@gmail.com',
          city: 'Hyderabad',
          address: 'House # 42, Block B, Qasimabad, Hyderabad',
        },
        items: [
          {
            product: createdProducts[0]._id,
            name: createdProducts[0].name,
            price: createdProducts[0].price,
            quantity: 1,
            image: createdProducts[0].images[0],
            viscosity: createdProducts[0].viscosity,
            volume: createdProducts[0].volume,
            subtotal: createdProducts[0].price * 1,
          },
        ],
        subtotal: 9800,
        discount: 0,
        deliveryCharges: 0,
        total: 9800,
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'Paid',
        orderStatus: 'Delivered',
        estimatedDeliveryDate: new Date(now - 1 * day),
        trackingNotes: 'Successfully delivered to customer in Qasimabad Hyderabad.',
        trackingHistory: [
          {
            status: 'Pending',
            notes: 'Order received via online store',
            updatedBy: 'Customer',
            updatedAt: new Date(now - 5 * day),
          },
          {
            status: 'Confirmed',
            notes: 'Order confirmed by sales team after verification call',
            updatedBy: 'Malik Imran Ali',
            updatedAt: new Date(now - 4 * day),
          },
          {
            status: 'Processing',
            notes: 'Products picked from warehouse and quality checked',
            updatedBy: 'Malik Imran Ali',
            updatedAt: new Date(now - 3 * day),
          },
          {
            status: 'Packed',
            notes: 'Package sealed with tamper-evident tape',
            updatedBy: 'Warehouse Staff',
            updatedAt: new Date(now - 2 * day),
          },
          {
            status: 'Shipped',
            notes: 'Dispatched with Hyderabad express delivery courier',
            updatedBy: 'Dispatch Dept',
            updatedAt: new Date(now - 2 * day + 3600000),
          },
          {
            status: 'Out for Delivery',
            notes: 'Rider is on the way to Qasimabad',
            updatedBy: 'Rider Aslam',
            updatedAt: new Date(now - 1 * day),
          },
          {
            status: 'Delivered',
            notes: 'Order handed over to customer. Cash collected.',
            updatedBy: 'Rider Aslam',
            updatedAt: new Date(now - 1 * day + 7200000),
          },
        ],
        inventoryDeducted: true,
        inventoryRestored: false,
        notes: 'Call before delivery.',
        createdAt: new Date(now - 5 * day),
      },
      {
        orderNumber: 'HI-2026-10493',
        customer: {
          name: 'Kashif Ali Memon',
          phone: '+92 312 9876543',
          email: 'kashif.memon@yahoo.com',
          city: 'Hyderabad',
          address: 'Shop # 14, Auto Market, Gari Khata, Hyderabad',
        },
        items: [
          {
            product: createdProducts[2]._id,
            name: createdProducts[2].name,
            price: createdProducts[2].price,
            quantity: 1,
            image: createdProducts[2].images[0],
            viscosity: createdProducts[2].viscosity,
            volume: createdProducts[2].volume,
            subtotal: createdProducts[2].price * 1,
          },
          {
            product: createdProducts[4]._id,
            name: createdProducts[4].name,
            price: createdProducts[4].price,
            quantity: 1,
            image: createdProducts[4].images[0],
            viscosity: createdProducts[4].viscosity,
            volume: createdProducts[4].volume,
            subtotal: createdProducts[4].price * 1,
          },
        ],
        subtotal: 16800,
        discount: 0,
        deliveryCharges: 0,
        total: 16800,
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'Paid',
        orderStatus: 'Shipped',
        estimatedDeliveryDate: new Date(now + 1 * day),
        trackingNotes: 'In transit to Gari Khata workshop area.',
        trackingHistory: [
          {
            status: 'Pending',
            notes: 'Order received via online checkout',
            updatedBy: 'Customer',
            updatedAt: new Date(now - 3 * day),
          },
          {
            status: 'Confirmed',
            notes: 'Order verified with customer workshop',
            updatedBy: 'Malik Imran Ali',
            updatedAt: new Date(now - 2 * day),
          },
          {
            status: 'Processing',
            notes: 'Engine oils pulled from central rack',
            updatedBy: 'Warehouse Staff',
            updatedAt: new Date(now - 1 * day),
          },
          {
            status: 'Packed',
            notes: 'Cans wrapped in safety bubble wrap',
            updatedBy: 'Warehouse Staff',
            updatedAt: new Date(now - 18 * 3600000),
          },
          {
            status: 'Shipped',
            notes: 'Dispatched for local workshop delivery',
            updatedBy: 'Dispatch Dept',
            updatedAt: new Date(now - 6 * 3600000),
          },
        ],
        inventoryDeducted: true,
        inventoryRestored: false,
        notes: 'Urgent delivery needed for customer workshop car.',
        createdAt: new Date(now - 3 * day),
      },
      {
        orderNumber: 'HI-2026-10494',
        customer: {
          name: 'Muhammad Usman',
          phone: '+92 333 4567890',
          email: 'usman.autos@outlook.com',
          city: 'Hyderabad',
          address: 'Plot 18, Phase 2, Saddar Cantt, Hyderabad',
        },
        items: [
          {
            product: createdProducts[6]._id,
            name: createdProducts[6].name,
            price: createdProducts[6].price,
            quantity: 1,
            image: createdProducts[6].images[0],
            viscosity: createdProducts[6].viscosity,
            volume: createdProducts[6].volume,
            subtotal: 8900,
          },
        ],
        subtotal: 8900,
        discount: 0,
        deliveryCharges: 0,
        total: 8900,
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'Unpaid',
        orderStatus: 'Processing',
        estimatedDeliveryDate: new Date(now + 2 * day),
        trackingNotes: 'Honda OEM oil batch allocated from fresh stock.',
        trackingHistory: [
          {
            status: 'Pending',
            notes: 'Order submitted by customer',
            updatedBy: 'Customer',
            updatedAt: new Date(now - 1 * day),
          },
          {
            status: 'Confirmed',
            notes: 'Payment and delivery address verified',
            updatedBy: 'Malik Imran Ali',
            updatedAt: new Date(now - 12 * 3600000),
          },
          {
            status: 'Processing',
            notes: 'Allocating verified bottle with hologram seal',
            updatedBy: 'Warehouse Staff',
            updatedAt: new Date(now - 4 * 3600000),
          },
        ],
        inventoryDeducted: true,
        inventoryRestored: false,
        notes: 'Please verify original seal packaging.',
        createdAt: new Date(now - 1 * day),
      },
      {
        orderNumber: 'HI-2026-10495',
        customer: {
          name: 'Raza Shah',
          phone: '+92 345 6789012',
          email: 'raza.shah@hotmail.com',
          city: 'Hyderabad',
          address: 'Street 4, Latifabad Unit 7, Hyderabad',
        },
        items: [
          {
            product: createdProducts[1]._id,
            name: createdProducts[1].name,
            price: createdProducts[1].price,
            quantity: 1,
            image: createdProducts[1].images[0],
            viscosity: createdProducts[1].viscosity,
            volume: createdProducts[1].volume,
            subtotal: 6800,
          },
        ],
        subtotal: 6800,
        discount: 0,
        deliveryCharges: 250,
        total: 7050,
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'Unpaid',
        orderStatus: 'Pending',
        estimatedDeliveryDate: new Date(now + 2 * day),
        trackingNotes: 'Order received. Awaiting dispatch confirmation.',
        trackingHistory: [
          {
            status: 'Pending',
            notes: 'Order placed by customer via web platform',
            updatedBy: 'Customer',
            updatedAt: new Date(now - 2 * 3600000),
          },
        ],
        inventoryDeducted: true,
        inventoryRestored: false,
        notes: 'Delivery in evening after 6 PM.',
        createdAt: new Date(now - 2 * 3600000),
      },
      {
        orderNumber: 'HI-2026-10496',
        customer: {
          name: 'Naveed Akhtar',
          phone: '+92 321 5556677',
          city: 'Kotri',
          address: 'Industrial Area, Kotri Sindh',
        },
        items: [
          {
            product: createdProducts[3]._id,
            name: createdProducts[3].name,
            price: createdProducts[3].price,
            quantity: 1,
            image: createdProducts[3].images[0],
            viscosity: createdProducts[3].viscosity,
            volume: createdProducts[3].volume,
            subtotal: 5400,
          },
        ],
        subtotal: 5400,
        discount: 0,
        deliveryCharges: 250,
        total: 5650,
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'Unpaid',
        orderStatus: 'Cancelled',
        trackingNotes: 'Order cancelled by customer. Inventory returned.',
        trackingHistory: [
          {
            status: 'Pending',
            notes: 'Order initiated',
            updatedBy: 'Customer',
            updatedAt: new Date(now - 2 * day),
          },
          {
            status: 'Cancelled',
            notes: 'Customer requested cancellation due to wrong viscosity selection. Stock restored.',
            updatedBy: 'Malik Imran Ali',
            updatedAt: new Date(now - 2 * day + 7200000),
          },
        ],
        inventoryDeducted: true,
        inventoryRestored: true,
        adminNotes: 'Customer cancelled due to incorrect viscosity choice.',
        createdAt: new Date(now - 2 * day),
      },
    ];

    await Order.insertMany(sampleOrders);
    console.log(`[Seeder] ${sampleOrders.length} Sample orders created with real metrics.`);

    // Seed 10 Dynamic Oil Converters
    await OilConverter.ensureTenSlots();
    console.log('[Seeder] 10 Dynamic Oil Converters verified/initialized.');

    console.log('==================================================');
    console.log('  H.I LUBRICANT DATABASE SEEDING COMPLETED SUCCESS  ');
    console.log('==================================================');
    console.log(`Admin Login Email: ${adminUser.email}`);
    console.log(`Admin Password:    Admin@12345`);
    console.log('Products Seeded:   18');
    console.log('Brands Seeded:     7');
    console.log('Orders Seeded:     5');
    console.log('==================================================');

    return true;
  } catch (error) {
    console.error('[Seeder Error] Failed to seed database:', error);
    throw error;
  }
};

if (require.main === module) {
  seedData()
    .then(() => {
      console.log('Seeder finished. Exiting...');
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = seedData;

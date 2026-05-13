// data/products.ts

export type Condition = 'new' | 'used' | 'refurbished';

export interface Product {
  id: string;
  name: string;
  category: 'phones' | 'laptops' | 'monitors' | 'tablets' | 'desk-accessories';
  price: number;
  condition: Condition;
  rating: number;
  description: string;
  // 3 placeholder image URLs (we'll generate simple placeholders with category-specific gradients)
  images: string[];
  // Category-specific specs
  specs: Record<string, string>;
  seller: {
    name: string;
    verified: boolean;
    responseTime: string; // e.g., "Usually replies within 1 hour"
  };
}

export const products: Product[] = [
  // Phones
  {
    id: 'p1',
    name: 'iPhone 15 Pro Max',
    category: 'phones',
    price: 999,
    condition: 'new',
    rating: 4.8,
    description:
      'The most powerful iPhone ever. A17 Pro chip, 48MP camera, titanium design, and USB-C. This is the ultimate smartphone for creators, gamers, and anyone who demands the best.',
    images: [
      '/images/iphone15-1.jpg',  // we'll use placeholder handling later; you can put colored gradients
      '/images/iphone15-2.jpg',
      '/images/iphone15-3.jpg',
    ],
    specs: {
      Display: '6.7" Super Retina XDR',
      Chip: 'A17 Pro',
      Camera: '48MP Main + 12MP Ultra Wide + 12MP Telephoto',
      Battery: '4422 mAh, up to 29h video playback',
      Storage: '256GB / 512GB / 1TB',
      OS: 'iOS 17',
    },
    seller: {
      name: 'TechVault',
      verified: true,
      responseTime: 'Usually replies within 1 hour',
    },
  },
  {
    id: 'p2',
    name: 'Samsung Galaxy S24 Ultra',
    category: 'phones',
    price: 1099,
    condition: 'new',
    rating: 4.7,
    description:
      'Epic intelligence meets epic zoom. The Galaxy S24 Ultra features a built‑in S Pen, 200MP camera, and Galaxy AI. Redefine what a phone can do.',
    images: ['/images/s24ultra-1.jpg', '/images/s24ultra-2.jpg', '/images/s24ultra-3.jpg'],
    specs: {
      Display: '6.8" Dynamic AMOLED 2X, 120Hz',
      Chip: 'Snapdragon 8 Gen 3',
      Camera: '200MP Main + 12MP Ultra Wide + 50MP Telephoto',
      Battery: '5000 mAh',
      Storage: '256GB / 512GB / 1TB',
      OS: 'Android 14, One UI 6.1',
    },
    seller: {
      name: 'GadgetHub',
      verified: true,
      responseTime: 'Usually replies within 30 min',
    },
  },
  {
    id: 'p3',
    name: 'Google Pixel 8 Pro',
    category: 'phones',
    price: 799,
    condition: 'used',
    rating: 4.5,
    description:
      'Pixel 8 Pro brings Google AI to your pocket. Magic Eraser, Best Take, and a stunning 6.7" LTPO display. This unit is gently used, fully tested.',
    images: ['/images/pixel8-1.jpg', '/images/pixel8-2.jpg', '/images/pixel8-3.jpg'],
    specs: {
      Display: '6.7" LTPO OLED, 120Hz',
      Chip: 'Google Tensor G3',
      Camera: '50MP Main + 48MP Telephoto + 48MP Ultra Wide',
      Battery: '5050 mAh',
      Storage: '128GB / 256GB',
      OS: 'Android 14',
    },
    seller: {
      name: 'PreLoved Tech',
      verified: false,
      responseTime: 'Replies within a few hours',
    },
  },

  // Laptops
  {
    id: 'p4',
    name: 'MacBook Pro 16" M3 Max',
    category: 'laptops',
    price: 3499,
    condition: 'new',
    rating: 4.9,
    description:
      'Mind-blowing performance for the most intensive workflows. M3 Max chip, Liquid Retina XDR display, and up to 22 hours battery. The pro laptop, unleashed.',
    images: ['/images/mbp16-1.jpg', '/images/mbp16-2.jpg', '/images/mbp16-3.jpg'],
    specs: {
      Processor: 'Apple M3 Max (16‑core CPU, 40‑core GPU)',
      RAM: '36GB / 96GB unified memory',
      Storage: '1TB SSD',
      Display: '16.2" Liquid Retina XDR, 3456 x 2234',
      Battery: 'Up to 22 hours',
      Weight: '2.1 kg (4.8 lbs)',
    },
    seller: {
      name: 'Apple Universe',
      verified: true,
      responseTime: 'Usually replies within 2 hours',
    },
  },
  {
    id: 'p5',
    name: 'Dell XPS 15',
    category: 'laptops',
    price: 1899,
    condition: 'refurbished',
    rating: 4.4,
    description:
      'A near-bezel-less masterpiece. 13th Gen Intel Core i7, 3.5K OLED touchscreen, and NVIDIA GeForce RTX 4060. Certified refurbished with full warranty.',
    images: ['/images/xps15-1.jpg', '/images/xps15-2.jpg', '/images/xps15-3.jpg'],
    specs: {
      Processor: 'Intel Core i7‑13700H',
      RAM: '16GB DDR5',
      Storage: '512GB SSD',
      Display: '15.6" 3.5K OLED, 400 nits',
      GPU: 'NVIDIA GeForce RTX 4060',
      Battery: 'Up to 8 hours',
    },
    seller: {
      name: 'Refurb kings',
      verified: true,
      responseTime: 'Usually replies within 1 hour',
    },
  },
  {
    id: 'p6',
    name: 'ASUS ROG Zephyrus G14',
    category: 'laptops',
    price: 1599,
    condition: 'new',
    rating: 4.6,
    description:
      'Play every game, create everywhere. Ryzen 9 7940HS, GeForce RTX 4060, and a 165Hz QHD display in a compact 14‑inch body. Portable power.',
    images: ['/images/rog14-1.jpg', '/images/rog14-2.jpg', '/images/rog14-3.jpg'],
    specs: {
      Processor: 'AMD Ryzen 9 7940HS',
      RAM: '16GB DDR5',
      Storage: '1TB SSD',
      Display: '14" QHD+ 165Hz',
      GPU: 'NVIDIA GeForce RTX 4060',
      Battery: 'Up to 10 hours',
    },
    seller: {
      name: 'GameGear Store',
      verified: true,
      responseTime: 'Usually replies within 15 min',
    },
  },

  // Monitors
  {
    id: 'p7',
    name: 'LG UltraGear 27GP850',
    category: 'monitors',
    price: 699,
    condition: 'new',
    rating: 4.7,
    description:
      '27” Nano IPS, 165Hz (O.C. 180Hz), 1ms, G‑Sync Compatible, HDR10. Your competitive edge starts here.',
    images: ['/images/lg27-1.jpg', '/images/lg27-2.jpg', '/images/lg27-3.jpg'],
    specs: {
      Panel: 'Nano IPS',
      Resolution: '2560 x 1440',
      Refresh: '165Hz (O.C. 180Hz)',
      Response: '1ms (GTG)',
      HDR: 'VESA DisplayHDR 400',
      Connectivity: 'DisplayPort 1.4, HDMI 2.0 x2, USB 3.0 Hub',
    },
    seller: {
      name: 'PixelPro',
      verified: true,
      responseTime: 'Usually replies within 1 hour',
    },
  },
  {
    id: 'p8',
    name: 'Samsung Odyssey G9',
    category: 'monitors',
    price: 1399,
    condition: 'new',
    rating: 4.5,
    description:
      '49” Dual QHD 240Hz curved gaming monitor. 1000R curve wraps your field of view. Quantum Mini LED, HDR2000. The ultimate immersive experience.',
    images: ['/images/odyg9-1.jpg', '/images/odyg9-2.jpg', '/images/odyg9-3.jpg'],
    specs: {
      Panel: 'VA (Quantum Mini LED)',
      Resolution: '5120 x 1440 (Dual QHD)',
      Refresh: '240Hz',
      Response: '1ms (GTG)',
      HDR: 'VESA DisplayHDR 2000',
      Curve: '1000R',
    },
    seller: {
      name: 'GamerzDen',
      verified: true,
      responseTime: 'Usually replies within 2 hours',
    },
  },
  {
    id: 'p9',
    name: 'Dell UltraSharp U2723QE',
    category: 'monitors',
    price: 579,
    condition: 'used',
    rating: 4.3,
    description:
      '27” 4K IPS Black monitor with USB-C hub. Exceptional color accuracy (ΔE < 2), ideal for creatives. Lightly used, like new.',
    images: ['/images/dell27-1.jpg', '/images/dell27-2.jpg', '/images/dell27-3.jpg'],
    specs: {
      Panel: 'IPS Black',
      Resolution: '3840 x 2160 (4K)',
      Refresh: '60Hz',
      Response: '5ms (GTG)',
      Color: '100% sRGB, 98% DCI‑P3',
      USB: 'USB-C 90W PD, built‑in KVM',
    },
    seller: {
      name: 'OfficeClearance',
      verified: false,
      responseTime: 'Replies within a few hours',
    },
  },

  // Tablets
  {
    id: 'p10',
    name: 'iPad Pro M2 12.9"',
    category: 'tablets',
    price: 1099,
    condition: 'new',
    rating: 4.8,
    description:
      'The ultimate iPad experience. M2 chip, Liquid Retina XDR display, Apple Pencil hover, and blazing‑fast Wi‑Fi 6E. A creative powerhouse.',
    images: ['/images/ipadpro-1.jpg', '/images/ipadpro-2.jpg', '/images/ipadpro-3.jpg'],
    specs: {
      Display: '12.9" Liquid Retina XDR, 120Hz ProMotion',
      Chip: 'Apple M2',
      Storage: '128GB / 256GB / 512GB / 1TB',
      Camera: '12MP Wide + 10MP Ultra Wide + LiDAR',
      Battery: 'Up to 10 hours',
      OS: 'iPadOS 17',
    },
    seller: {
      name: 'iStock',
      verified: true,
      responseTime: 'Usually replies within 1 hour',
    },
  },
  {
    id: 'p11',
    name: 'Samsung Galaxy Tab S9+',
    category: 'tablets',
    price: 899,
    condition: 'new',
    rating: 4.6,
    description:
      '12.4" Dynamic AMOLED 2X, 120Hz, IP68 water/dust resistance, included S Pen. Entertainment and productivity, on the go.',
    images: ['/images/tabs9-1.jpg', '/images/tabs9-2.jpg', '/images/tabs9-3.jpg'],
    specs: {
      Display: '12.4" Dynamic AMOLED 2X, 120Hz',
      Chip: 'Snapdragon 8 Gen 2',
      Storage: '256GB + microSD',
      Battery: '10090 mAh',
      Camera: '13MP + 8MP UW',
      OS: 'Android 13, One UI 5.1',
      IP: 'IP68',
    },
    seller: {
      name: 'GadgetHub',
      verified: true,
      responseTime: 'Usually replies within 30 min',
    },
  },
  {
    id: 'p12',
    name: 'Microsoft Surface Pro 9',
    category: 'tablets',
    price: 999,
    condition: 'refurbished',
    rating: 4.4,
    description:
      'The tablet that can replace your laptop. 12th Gen Intel Core i5, Thunderbolt 4, and a glorious PixelSense Flow display. With Type Cover support.',
    images: ['/images/sp9-1.jpg', '/images/sp9-2.jpg', '/images/sp9-3.jpg'],
    specs: {
      Display: '13" PixelSense Flow, 120Hz',
      Processor: 'Intel Core i5‑1235U',
      RAM: '8GB / 16GB LPDDR5',
      Storage: '128GB / 256GB SSD',
      Battery: 'Up to 15.5 hours',
      OS: 'Windows 11',
    },
    seller: {
      name: 'Refurb kings',
      verified: true,
      responseTime: 'Usually replies within 1 hour',
    },
  },

  // Desk Accessories
  {
    id: 'p13',
    name: 'Logitech MX Master 3S',
    category: 'desk-accessories',
    price: 99,
    condition: 'new',
    rating: 4.9,
    description:
      'The most advanced mouse for creative pros. 8K DPI, MagSpeed electromagnetic scrolling, quiet clicks, and flow across 3 devices.',
    images: ['/images/mxmaster-1.jpg', '/images/mxmaster-2.jpg', '/images/mxmaster-3.jpg'],
    specs: {
      Type: 'Wireless Mouse',
      Sensor: 'Darkfield 8000 DPI',
      Buttons: '7 programmable',
      Scroll: 'MagSpeed electromagnetic',
      Connectivity: 'Bluetooth, USB‑C, Logi Bolt',
      Compatibility: 'Windows, macOS, Linux, iPadOS',
      Battery: 'Up to 70 days',
    },
    seller: {
      name: 'ProductivityPlus',
      verified: true,
      responseTime: 'Usually replies within 1 hour',
    },
  },
  {
    id: 'p14',
    name: 'Keychron Q1 Pro',
    category: 'desk-accessories',
    price: 199,
    condition: 'new',
    rating: 4.7,
    description:
      'A fully customizable 75% mechanical keyboard with Gateron Jupiter switches, double‑shot keycaps, and gasket mount. Built for typists who love a thock.',
    images: ['/images/q1pro-1.jpg', '/images/q1pro-2.jpg', '/images/q1pro-3.jpg'],
    specs: {
      Type: 'Mechanical Keyboard',
      Layout: '75% (84 keys)',
      Switches: 'Gateron Jupiter Red/Brown/Banana',
      Keycaps: 'Double‑shot PBT, OSA profile',
      Connectivity: 'USB‑C, Bluetooth 5.1',
      Material: 'Aluminum frame',
      Backlight: 'Per‑key RGB',
    },
    seller: {
      name: 'MechKeebs',
      verified: true,
      responseTime: 'Usually replies within 2 hours',
    },
  },
  {
    id: 'p15',
    name: 'Apple Magic Trackpad (Black)',
    category: 'desk-accessories',
    price: 129,
    condition: 'used',
    rating: 4.5,
    description:
      'The multi‑touch gesture experience, in a sleek black finish. Supports force touch and wireless connectivity. Works with Mac and iPad.',
    images: ['/images/trackpad-1.jpg', '/images/trackpad-2.jpg', '/images/trackpad-3.jpg'],
    specs: {
      Type: 'Multi‑Touch Trackpad',
      Connectivity: 'Bluetooth, USB‑C (charging)',
      Compatibility: 'Mac, iPad',
      Dimensions: '160 x 115 x 10.9 mm',
      Weight: '231 g',
    },
    seller: {
      name: 'TechVault',
      verified: true,
      responseTime: 'Usually replies within 1 hour',
    },
  },
];
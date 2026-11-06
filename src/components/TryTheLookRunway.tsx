import React, { useEffect, useRef, useState } from 'react';

// Exact asset base URL as specified in prompt
const ASSET_BASE = 'https://reel-ref-try-the-look.vercel.app/assets';

interface ProductItem {
  id: string;
  name: string;
  vendor: string;
  price: string;
  priceNum: number;
  image: string;
  imgW: number;
  imgH: number;
  optLegend: string;
  options: string[];
  tag?: string;
  link: string;
}

interface LookDef {
  num: string;
  index: number;
  name: string;
  model640: string;
  model1080: string;
  pins: { text: string; left: number; top: number; num: number }[];
  items: ProductItem[];
}

const PRODUCTS_MAP: Record<string, ProductItem> = {
  'air-jordan-12-retro': {
    id: 'tatum-5-orbit-copy',
    name: 'Air Jordan 12 Retro',
    vendor: 'Nikey | Password: 1',
    price: '$149.00',
    priceNum: 149,
    image: `${ASSET_BASE}/source-tatum-5-orbit-copy.webp`,
    imgW: 400,
    imgH: 400,
    optLegend: 'Shoe size',
    options: ['40', '41', '42', '43', '44', '45', '46'],
    link: 'https://nike-makknzjs.myshopify.com/products/tatum-5-orbit-copy',
  },
  tshirt: {
    id: 'tshirt',
    name: 'Tshirt',
    vendor: 'Nike',
    price: '$199.00',
    priceNum: 199,
    image: `${ASSET_BASE}/source-tshirt.webp`,
    imgW: 400,
    imgH: 563,
    optLegend: 'Size',
    options: ['S', 'L', 'M', 'XL'],
    link: 'https://nike-makknzjs.myshopify.com/products/tshirt',
  },
  sweatshirt: {
    id: 'sweatshirt',
    name: 'Sweatshirt',
    vendor: 'Nike',
    price: '$199.00',
    priceNum: 199,
    image: `${ASSET_BASE}/source-sweatshirt.webp`,
    imgW: 400,
    imgH: 581,
    optLegend: 'Size',
    options: ['S', 'L', 'M', 'XL'],
    link: 'https://nike-makknzjs.myshopify.com/products/sweatshirt',
  },
  'tatum-5-orbit': {
    id: 'tatum-5-orbit',
    name: 'Tatum 5 Orbit',
    vendor: 'Nikey | Password: 1',
    price: '$149.00',
    priceNum: 149,
    image: `${ASSET_BASE}/source-tatum-5-orbit.webp`,
    imgW: 400,
    imgH: 400,
    optLegend: 'Shoe size',
    options: ['40', '41', '42', '43', '44', '45', '46'],
    link: 'https://nike-makknzjs.myshopify.com/products/tatum-5-orbit',
  },
  'hoodie-black': {
    id: 'hoodie-black',
    name: 'Hoodie Black',
    vendor: 'Nike',
    price: '$199.00',
    priceNum: 199,
    image: `${ASSET_BASE}/source-hoodie-black.webp`,
    imgW: 400,
    imgH: 536,
    optLegend: 'Size',
    options: ['S', 'L', 'M', 'XL'],
    link: 'https://nike-makknzjs.myshopify.com/products/hoodie-black',
  },
  'sweatshirt-plus': {
    id: 'sweatshirt-plus',
    name: 'Sweatshirt Plus',
    vendor: 'Nike',
    price: '$199.00',
    priceNum: 199,
    image: `${ASSET_BASE}/source-sweatshirt-plus.webp`,
    imgW: 393,
    imgH: 600,
    optLegend: 'Size',
    options: ['S', 'L', 'M', 'XL'],
    link: 'https://nike-makknzjs.myshopify.com/products/sweatshirt-plus',
  },
  hoodie: {
    id: 'hoodie',
    name: 'Hoodie',
    vendor: 'Nike',
    price: '$199.00',
    priceNum: 199,
    image: `${ASSET_BASE}/source-hoodie.webp`,
    imgW: 400,
    imgH: 555,
    optLegend: 'Size',
    options: ['S', 'L', 'M', 'XL'],
    link: 'https://nike-makknzjs.myshopify.com/products/hoodie',
  },
  'luka-5': {
    id: 'air-jordan-12-retro-copy',
    name: 'Luka 5',
    vendor: 'Nikey | Password: 1',
    price: '$149.00',
    priceNum: 149,
    image: `${ASSET_BASE}/source-air-jordan-12-retro-copy.webp`,
    imgW: 400,
    imgH: 400,
    optLegend: 'Shoe size',
    options: ['40', '41', '42', '43', '44', '45', '46'],
    link: 'https://nike-makknzjs.myshopify.com/products/air-jordan-12-retro-copy',
  },
};

const LOOKS: LookDef[] = [
  {
    num: '01',
    index: 0,
    name: 'The City Edit',
    model640: `${ASSET_BASE}/model-1-640.webp`,
    model1080: `${ASSET_BASE}/original-look-1.webp`,
    pins: [
      { text: 'Air Jordan 12 Retro', left: 47, top: 27, num: 1 },
      { text: 'Tshirt', left: 48, top: 58, num: 2 },
      { text: 'Sweatshirt', left: 45, top: 96, num: 3 },
    ],
    items: [
      PRODUCTS_MAP['air-jordan-12-retro'],
      PRODUCTS_MAP['tshirt'],
      PRODUCTS_MAP['sweatshirt'],
    ],
  },
  {
    num: '02',
    index: 1,
    name: 'Gallery Opening',
    model640: `${ASSET_BASE}/model-5-640.webp`,
    model1080: `${ASSET_BASE}/original-look-5.webp`,
    pins: [
      { text: 'Tatum 5 Orbit', left: 50, top: 28, num: 1 },
      { text: 'Hoodie Black', left: 48, top: 58, num: 2 },
      { text: 'Tshirt', left: 45, top: 88, num: 3 },
    ],
    items: [
      PRODUCTS_MAP['tatum-5-orbit'],
      { ...PRODUCTS_MAP['hoodie-black'], tag: 'New' },
      PRODUCTS_MAP['tshirt'],
    ],
  },
  {
    num: '03',
    index: 2,
    name: 'Gallery Opening',
    model640: `${ASSET_BASE}/model-4-640.webp`,
    model1080: `${ASSET_BASE}/original-look-4.webp`,
    pins: [
      { text: 'Sweatshirt Plus', left: 50, top: 28, num: 1 },
      { text: 'Tatum 5 Orbit', left: 48, top: 58, num: 2 },
      { text: 'Tshirt', left: 45, top: 88, num: 3 },
    ],
    items: [
      PRODUCTS_MAP['sweatshirt-plus'],
      { ...PRODUCTS_MAP['tatum-5-orbit'], tag: 'New' },
      PRODUCTS_MAP['tshirt'],
    ],
  },
  {
    num: '04',
    index: 3,
    name: 'Studio Day',
    model640: `${ASSET_BASE}/model-6-640.webp`,
    model1080: `${ASSET_BASE}/original-look-6.webp`,
    pins: [
      { text: 'Hoodie Black', left: 50, top: 28, num: 1 },
      { text: 'Air Jordan 12 Retro', left: 48, top: 58, num: 2 },
      { text: 'Tshirt', left: 45, top: 88, num: 3 },
    ],
    items: [
      PRODUCTS_MAP['hoodie-black'],
      PRODUCTS_MAP['air-jordan-12-retro'],
      PRODUCTS_MAP['tshirt'],
    ],
  },
  {
    num: '05',
    index: 4,
    name: 'Studio Day',
    model640: `${ASSET_BASE}/model-3-640.webp`,
    model1080: `${ASSET_BASE}/original-look-3.webp`,
    pins: [
      { text: 'Sweatshirt', left: 50, top: 28, num: 1 },
      { text: 'Tatum 5 Orbit', left: 48, top: 58, num: 2 },
      { text: 'Tshirt', left: 45, top: 88, num: 3 },
    ],
    items: [
      PRODUCTS_MAP['sweatshirt'],
      PRODUCTS_MAP['tatum-5-orbit'],
      PRODUCTS_MAP['tshirt'],
    ],
  },
  {
    num: '06',
    index: 5,
    name: 'Studio Day',
    model640: `${ASSET_BASE}/model-2-640.webp`,
    model1080: `${ASSET_BASE}/original-look-2.webp`,
    pins: [
      { text: 'Hoodie', left: 50, top: 28, num: 1 },
      { text: 'Luka 5', left: 48, top: 58, num: 2 },
      { text: 'Tshirt', left: 45, top: 88, num: 3 },
    ],
    items: [
      PRODUCTS_MAP['hoodie'],
      PRODUCTS_MAP['luka-5'],
      PRODUCTS_MAP['tshirt'],
    ],
  },
];

const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));

export const TryTheLookRunway: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [bagItems, setBagItems] = useState<{ id: string; name: string; size: string; price: number; image: string; url: string; quantity: number }[]>(() => {
    try {
      const saved = localStorage.getItem('runway-styling-bag-v3');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [hotPinNum, setHotPinNum] = useState<number | null>(null);
  const [openPickers, setOpenPickers] = useState<Record<string, boolean>>({});
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});
  const [bundleLoading, setBundleLoading] = useState(false);
  const [bundleComplete, setBundleComplete] = useState<Record<number, boolean>>({});
  const [bundleMsg, setBundleMsg] = useState<string>('');

  const stageRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorInRef = useRef<HTMLDivElement>(null);
  const modelsContainerRef = useRef<HTMLDivElement>(null);

  // Animation & 3D Ring State
  const targetRef = useRef<number>(0);
  const curRef = useRef<number>(-1.15); // Initial walk-in entrance
  const velRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const startTargetRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeLook = LOOKS[currentIndex];
  const cartCount = bagItems.reduce((sum, item) => sum + item.quantity, 0);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 2500);
  };

  const saveToBag = (product: ProductItem, size: string) => {
    setBagItems((prev) => {
      const existing = prev.find((i) => i.id === product.id && i.size === size);
      let updated;
      if (existing) {
        updated = prev.map((i) =>
          i === existing ? { ...i, quantity: Math.min(20, i.quantity + 1) } : i
        );
      } else {
        updated = [
          ...prev,
          {
            id: product.id,
            name: product.name,
            size,
            price: product.priceNum,
            image: product.image,
            url: product.link,
            quantity: 1,
          },
        ];
      }
      try {
        localStorage.setItem('runway-styling-bag-v3', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // 3D Ring Calculation Loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();
    const stage = stageRef.current;
    const modelsBox = modelsContainerRef.current;
    if (!stage || !modelsBox) return;

    const K = 95;
    const C = 2 * Math.sqrt(K); // ~19.49

    const loop = (now: number) => {
      const dt = Math.min(0.034, (now - lastTime) / 1000) || 0.016;
      lastTime = now;

      // 3 Sub-steps integration
      const subSteps = 3;
      const h = dt / subSteps;
      for (let s = 0; s < subSteps; s++) {
        const acc = -K * (curRef.current - targetRef.current) - C * velRef.current;
        velRef.current += acc * h;
        curRef.current += velRef.current * h;
      }

      if (
        Math.abs(curRef.current - targetRef.current) < 0.0005 &&
        Math.abs(velRef.current) < 0.0005
      ) {
        curRef.current = targetRef.current;
      }

      const cur = curRef.current;
      const W = stage.clientWidth || 800;
      const H = stage.clientHeight || 600;
      const cx = 0.5 * W;
      const isMobile = window.innerWidth <= 749;
      const R = (isMobile ? 0.72 : 0.62) * W;
      const P = (isMobile ? 1.9 : 1.65) * W;
      const floor = H - 34;
      const horizon = 0.36 * H;
      const step = (2 * Math.PI) / 12;
      const fs = 1.08;

      const modelNodes = modelsBox.children;
      for (let i = 0; i < 12; i++) {
        const el = modelNodes[i] as HTMLElement;
        if (!el) continue;

        let phi = ((i - cur) * step) % (2 * Math.PI);
        if (phi > Math.PI) phi -= 2 * Math.PI;
        if (phi <= -Math.PI) phi += 2 * Math.PI;

        const z = R * (1 - Math.cos(phi));
        const persp = P / (P + z);
        const sl = Math.abs(phi) / step;
        const scale = persp * (1 + (fs - 1) * clamp(1 - sl, 0, 1));
        const x = cx + R * Math.sin(phi) * persp;
        const feet = horizon + (floor - horizon) * persp;
        const bottom = H - feet;
        const blur = sl <= 1 ? 1.8 * sl : Math.min(1.8 + (sl - 1) * 2, 6.5);
        const opacity = clamp((Math.cos(phi) + 0.55) / 0.3, 0, 1);

        el.style.transform = `translate3d(${x.toFixed(1)}px, -${bottom.toFixed(1)}px, 0) translateX(-50%) scale(${scale.toFixed(4)})`;
        el.style.opacity = opacity.toFixed(3);
        el.style.filter = blur > 0.1 ? `blur(${blur.toFixed(1)}px)` : 'none';
        el.style.zIndex = `${Math.round(scale * 1000)}`;
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Autoplay timer
  useEffect(() => {
    if (!isPlaying || isDraggingRef.current || isPopupOpen) return;

    timerRef.current = setTimeout(() => {
      targetRef.current += 1;
      const nextIdx = ((Math.round(targetRef.current) % 6) + 6) % 6;
      setCurrentIndex(nextIdx);
    }, 5000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, isPlaying, isPopupOpen]);

  // Pointer drag logic on stage
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button, a')) return;
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startTargetRef.current = targetRef.current;
    if (stageRef.current) stageRef.current.setPointerCapture(e.pointerId);
    if (cursorInRef.current) {
      cursorInRef.current.classList.add('is-dragging');
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (cursorRef.current && stageRef.current) {
      const rect = stageRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }

    if (!isDraggingRef.current || !stageRef.current) return;
    const dx = e.clientX - startXRef.current;
    const unit = Math.max(120, stageRef.current.clientWidth * 0.3);
    targetRef.current = startTargetRef.current - dx / unit;
    const idx = ((Math.round(targetRef.current) % 6) + 6) % 6;
    setCurrentIndex(idx);
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    targetRef.current = Math.round(targetRef.current);
    const idx = ((targetRef.current % 6) + 6) % 6;
    setCurrentIndex(idx);
    if (cursorInRef.current) {
      cursorInRef.current.classList.remove('is-dragging');
    }
  };

  const handleNext = () => {
    targetRef.current = Math.round(targetRef.current) + 1;
    setCurrentIndex(((targetRef.current % 6) + 6) % 6);
  };

  const handlePrev = () => {
    targetRef.current = Math.round(targetRef.current) - 1;
    setCurrentIndex(((targetRef.current % 6) + 6) % 6);
  };

  const handleTickClick = (idx: number) => {
    const curI = ((Math.round(targetRef.current) % 6) + 6) % 6;
    let d = (idx - curI) % 6;
    if (d > 3) d -= 6;
    if (d < -3) d += 6;
    targetRef.current = Math.round(targetRef.current) + d;
    setCurrentIndex(idx);
  };

  const handleSingleAdd = (itemKey: string, product: ProductItem) => {
    const size = selectedSizes[itemKey] || product.options[0];
    setLoadingItems((prev) => ({ ...prev, [itemKey]: true }));
    setTimeout(() => {
      setLoadingItems((prev) => ({ ...prev, [itemKey]: false }));
      setAddedItems((prev) => ({ ...prev, [itemKey]: true }));
      setOpenPickers((prev) => ({ ...prev, [itemKey]: false }));
      saveToBag(product, size);
      showToast('Piece saved to your styling bag');
    }, 450);
  };

  const handleAddFullLook = () => {
    setBundleLoading(true);
    setBundleMsg('');
    setTimeout(() => {
      activeLook.items.forEach((item, idx) => {
        const key = `${activeLook.index}-${idx}`;
        const size = selectedSizes[key] || item.options[0];
        saveToBag(item, size);
        setAddedItems((prev) => ({ ...prev, [key]: true }));
      });
      setBundleLoading(false);
      setBundleComplete((prev) => ({ ...prev, [activeLook.index]: true }));
      showToast('Look saved to your styling bag');
    }, 600);
  };

  const downloadShortlist = () => {
    const lines = [
      'RUNWAY — STYLING SHORTLIST',
      '',
      'Reference prices; no order or payment has been placed.',
      '',
    ];
    bagItems.forEach((item) => {
      lines.push(`${item.name} · Size ${item.size} · Quantity ${item.quantity}`);
      lines.push(item.url);
      lines.push('');
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'runway-outfit-shortlist.txt';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <section className="relative w-full bg-white text-[#151413] border-t border-[#e4e4e4] font-sans antialiased overflow-hidden select-none">
      <style>{`
        .ttl-pin-halo::after {
          content: "";
          position: absolute;
          inset: -5px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.8);
          animation: ttl-ring 2.6s cubic-bezier(0.2,0.6,0.3,1) infinite;
        }
        .ttl-pin-halo::before {
          content: "";
          position: absolute;
          inset: -5px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.55);
          animation: ttl-ring 2.6s cubic-bezier(0.2,0.6,0.3,1) 1.3s infinite;
        }
        @keyframes ttl-ring {
          0% { transform: scale(0.8); opacity: 0.9; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        @keyframes ttl-sweep {
          0% { transform: translateX(-130%) skewX(-12deg); opacity: 0; }
          18% { opacity: 1; }
          100% { transform: translateX(330%) skewX(-12deg); opacity: 0; }
        }
        .ttl-sweep-active {
          animation: ttl-sweep 1.5s cubic-bezier(0.65,0,0.35,1);
        }
        .ttl-cursor-in {
          width: 84px;
          height: 84px;
          margin: -42px 0 0 -42px;
          border-radius: 50%;
          border: 1px solid rgba(21, 20, 19, 0.28);
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(6px);
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s, background 0.35s, border-color 0.35s;
        }
        .ttl-cursor-in.is-dragging {
          transform: scale(0.74);
          background: #0e0e0e;
          border-color: #0e0e0e;
          color: #fff;
          letter-spacing: 0.42em;
        }
      `}</style>

      {/* 1.1 Site Header for Runway */}
      <header className="h-[88px] px-6 sm:px-10 flex items-center justify-between border-b border-[#e4e4e4] bg-white relative z-40">
        <div className="flex items-center gap-6 sm:gap-8">
          <a href="#try-the-look-runway" className="inline-flex items-center" aria-label="Runway home">
            <img
              src={`${ASSET_BASE}/nike-logo.svg`}
              alt="Nike"
              className="w-[68px] h-[24px] object-contain block"
              width={68}
              height={24}
            />
          </a>
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold tracking-tight text-[#151413]">
            <a href="#try-the-look-runway" className="py-3 hover:underline underline-offset-4">
              Home
            </a>
            <a
              href="https://nike-makknzjs.myshopify.com/pages/nike-orbit"
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 hover:underline underline-offset-4"
            >
              Nike Orbit
            </a>
            <a
              href="https://nike-makknzjs.myshopify.com/pages/scene-rail"
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 hover:underline underline-offset-4"
            >
              Hand Rail Pro
            </a>
            <a href="#try-the-look-runway" className="py-3 underline underline-offset-4 font-bold" aria-current="page">
              Runway
            </a>
          </nav>
        </div>

        <button
          onClick={() => setIsBagOpen(true)}
          className="flex items-center gap-2 p-2 hover:bg-[#f5f5f5] rounded-full transition-colors cursor-pointer"
          aria-label="Open styling bag"
        >
          <svg
            className="w-[22px] h-[24px] stroke-current fill-none stroke-[1.3]"
            viewBox="0 0 24 26"
          >
            <path d="M4 8h16l1 16H3L4 8zM8 8V6a4 4 0 0 1 8 0v2" />
          </svg>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#151413] text-white">
            {cartCount}
          </span>
        </button>
      </header>

      {/* Main Runway Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] min-h-[600px] lg:h-[calc(100vh-88px)] relative bg-white">
        {/* Left Column: Stage + Controls */}
        <div className="relative flex flex-col justify-between overflow-hidden bg-white border-b lg:border-b-0 border-[#c8c8c8]">
          {/* Head */}
          <div className="flex justify-between items-end gap-6 px-6 sm:px-14 pt-8 sm:pt-10 z-10">
            <div className="flex flex-col gap-2 max-w-[640px]">
              <h2 className="text-3xl sm:text-5xl font-normal tracking-tight text-[#151413] m-0">
                Try the Look.
              </h2>
              <p className="text-xs text-[#66625c] max-w-[46ch] leading-relaxed">
                Six looks, styled head to toe. Tap a pin to see the piece.
              </p>
            </div>
            <div className="hidden sm:block text-[11px] font-mono text-[#66625c]">
              Look 0{activeLook.index + 1}: {activeLook.name}
            </div>
          </div>

          {/* 3D Runway Stage */}
          <div
            ref={stageRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-label="Try the Look. — use arrow keys or swipe to change look"
            className="relative flex-1 min-h-[420px] sm:min-h-[500px] overflow-hidden cursor-grab active:cursor-grabbing focus:outline-none"
          >
            {/* Models Queue Ring (12 figures: 6 models + 6 clones) */}
            <div ref={modelsContainerRef} className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 12 }).map((_, i) => {
                const look = LOOKS[i % 6];
                return (
                  <div
                    key={i}
                    data-index={i}
                    className="absolute left-0 bottom-0 will-change-transform"
                    style={{
                      transformOrigin: '50% 100%',
                      width: '420px',
                      height: '560px',
                    }}
                  >
                    {/* Elliptical floor shadow */}
                    <span
                      className="absolute left-[58%] bottom-0 w-[150%] h-[9%] rounded-full -translate-x-1/2 translate-y-1/2 blur-[2px]"
                      style={{
                        background:
                          'radial-gradient(closest-side, rgba(20, 16, 12, 0.30), rgba(20, 16, 12, 0.14) 45%, rgba(20, 16, 12, 0.04) 75%, transparent)',
                      }}
                    />
                    <div className="relative w-full h-full aspect-[9/16]">
                      <img
                        src={look.model640}
                        srcSet={`${look.model640} 640w, ${look.model1080} 1080w`}
                        sizes="(min-width: 1800px) 540px, (min-width: 750px) 420px, 320px"
                        alt={look.name}
                        loading={i < 6 ? 'eager' : 'lazy'}
                        decoding="async"
                        className="w-full h-full object-contain object-bottom pointer-events-none"
                        draggable={false}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Front Hero Interactive Layer with Pins & Zoom */}
            <div className="absolute inset-0 flex items-end justify-center pointer-events-none z-20 pb-8">
              <div
                className="relative w-[340px] sm:w-[420px] h-[480px] sm:h-[560px] pointer-events-auto cursor-zoom-in"
                onClick={() => setIsPopupOpen(true)}
                title="Click to view look details and pins"
              >
                {/* Pins overlay on front model */}
                {activeLook.pins.map((pin) => (
                  <button
                    key={pin.num}
                    onClick={(e) => {
                      e.stopPropagation();
                      setHotPinNum(pin.num);
                      const itemKey = `${activeLook.index}-${pin.num - 1}`;
                      setOpenPickers((prev) => ({ ...prev, [itemKey]: true }));
                    }}
                    className={`ttl-pin-halo absolute w-11 h-11 -ml-[22px] -mt-[22px] flex items-center justify-center transition-transform hover:scale-125 cursor-pointer z-30 group`}
                    style={{ left: `${pin.left}%`, top: `${pin.top}%` }}
                    aria-label={`${pin.num}: ${pin.text}`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold shadow-md transition-colors ${
                        hotPinNum === pin.num
                          ? 'bg-[#0e0e0e] text-white scale-125'
                          : 'bg-white/90 backdrop-blur-md text-[#151413] group-hover:bg-[#0e0e0e] group-hover:text-white'
                      }`}
                    >
                      {pin.num}
                    </span>
                    <span className="absolute left-[calc(100%+6px)] top-1/2 -translate-y-1/2 hidden group-hover:inline-block px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-medium text-[#151413] shadow-lg whitespace-nowrap pointer-events-none">
                      {pin.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Light sweep band on change */}
            <span className="absolute inset-0 pointer-events-none ttl-sweep-active mix-blend-soft-light bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0" />

            {/* Custom Drag Cursor */}
            <div
              ref={cursorRef}
              className="absolute top-0 left-0 pointer-events-none z-30 hidden md:block"
            >
              <div
                ref={cursorInRef}
                className="ttl-cursor-in flex items-center justify-center text-[10px] uppercase font-semibold tracking-widest text-[#151413]"
              >
                <span>Drag</span>
              </div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center gap-4 sm:gap-5 px-6 sm:px-11 py-5 sm:pb-8 z-10 border-t border-[#f0f0f0]">
            <button
              onClick={handlePrev}
              className="w-11 h-11 rounded-full border border-black/10 hover:border-black flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Previous look"
            >
              <svg className="w-5 h-3 stroke-current fill-none stroke-[1.4]" viewBox="0 0 26 14">
                <path d="M25 7H1M7 1L1 7l6 6" />
              </svg>
            </button>

            {/* Progress Ticks */}
            <div className="flex-1 flex gap-1.5 min-w-0">
              {LOOKS.map((look, i) => {
                const isCurrent = i === activeLook.index;
                return (
                  <button
                    key={look.num}
                    onClick={() => handleTickClick(i)}
                    className={`h-11 flex flex-col justify-center text-left transition-all duration-300 cursor-pointer ${
                      isCurrent ? 'flex-[0_0_150px] sm:flex-[0_0_190px]' : 'flex-1 min-w-[14px]'
                    }`}
                  >
                    <div className="w-full h-[2px] bg-black/15 overflow-hidden relative">
                      <div
                        className={`h-full bg-[#151413] transition-all duration-500 ${
                          isCurrent ? 'w-full' : i < activeLook.index ? 'w-full opacity-40' : 'w-0'
                        }`}
                      />
                    </div>
                    <span className="text-[10px] tracking-wider font-mono text-[#66625c] truncate mt-1">
                      {look.num}
                      {isCurrent && <span className="font-semibold text-[#151413] ml-2 font-sans">{look.name}</span>}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Autoplay Pause/Play button */}
            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="w-11 h-11 rounded-full border border-black/10 hover:border-black flex items-center justify-center transition-colors cursor-pointer"
              aria-label={isPlaying ? 'Pause autoplay' : 'Play autoplay'}
            >
              {isPlaying ? (
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M6.5 4.5h3.5v15H6.5zM14 4.5h3.5v15H14z" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M7 4.5v15l12.5-7.5z" />
                </svg>
              )}
            </button>

            <button
              onClick={handleNext}
              className="w-11 h-11 rounded-full border border-black/10 hover:border-black flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Next look"
            >
              <svg className="w-5 h-3 stroke-current fill-none stroke-[1.4]" viewBox="0 0 26 14">
                <path d="M1 7h24M19 1l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Column: "In this look" Panel */}
        <aside className="bg-white border-l border-[#c8c8c8] flex flex-col justify-between overflow-hidden">
          {/* Panel Head */}
          <div className="flex items-baseline justify-between gap-3 px-6 sm:px-8 pt-8 pb-4 border-b border-[#e4e4e4]">
            <h3 className="text-lg font-normal tracking-tight text-[#151413]">In this look</h3>
            <span className="text-[10px] tracking-widest uppercase text-[#66625c] font-semibold">
              3 pieces
            </span>
          </div>

          {/* Product Items List */}
          <ul className="flex-1 overflow-y-auto px-6 sm:px-8 py-3 divide-y divide-[#c8c8c8]">
            {activeLook.items.map((item, idx) => {
              const itemKey = `${activeLook.index}-${idx}`;
              const isPickerOpen = !!openPickers[itemKey];
              const isAdded = !!addedItems[itemKey];
              const isLoading = !!loadingItems[itemKey];
              const isHot = hotPinNum === idx + 1;
              const selectedSize = selectedSizes[itemKey] || item.options[0];

              return (
                <li
                  key={itemKey}
                  onMouseEnter={() => setHotPinNum(idx + 1)}
                  onMouseLeave={() => setHotPinNum(null)}
                  className={`py-4 transition-colors ${isHot ? 'bg-[#fafafa]' : ''}`}
                >
                  <div className="grid grid-cols-[80px_1fr_44px] gap-4 items-center relative">
                    {/* Media Thumbnail */}
                    <div className="relative aspect-[4/5] bg-[#f9f9f9] overflow-hidden rounded-xs">
                      <img
                        src={item.image}
                        alt={item.name}
                        width={item.imgW}
                        height={item.imgH}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-center"
                      />
                      <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white/90 text-[#151413] text-[10px] font-bold flex items-center justify-center shadow-xs">
                        {idx + 1}
                      </span>
                      {item.tag && (
                        <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-xs bg-[#151413] text-white text-[9px] font-bold uppercase tracking-wider">
                          {item.tag}
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="text-[10px] uppercase tracking-wider text-[#66625c] truncate">
                        {item.vendor}
                      </span>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs sm:text-sm font-medium text-[#151413] hover:underline leading-snug truncate"
                      >
                        {item.name}
                      </a>
                      <span className="text-xs text-[#151413] font-semibold">{item.price}</span>
                    </div>

                    {/* Plus / Check Action Button */}
                    <button
                      onClick={() => {
                        if (isAdded) return;
                        setOpenPickers((prev) => ({ ...prev, [itemKey]: !prev[itemKey] }));
                      }}
                      disabled={isAdded}
                      className={`w-11 h-11 rounded-full flex items-center justify-center transition-transform cursor-pointer border ${
                        isAdded
                          ? 'border-[#2E5A36] bg-[#2E5A36] text-white'
                          : isPickerOpen
                          ? 'border-[#151413] bg-[#151413] text-white rotate-45'
                          : 'border-black/15 hover:border-black text-[#151413]'
                      }`}
                      aria-label={`Toggle size for ${item.name}`}
                    >
                      {isLoading ? (
                        <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                      ) : isAdded ? (
                        <svg className="w-4 h-4 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24">
                          <path d="M4.5 12.5l5 5L19.5 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 stroke-current fill-none stroke-[1.5]" viewBox="0 0 24 24">
                          <path d="M12 4v16M4 12h16" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Inline Size Picker Dropdown */}
                  {isPickerOpen && !isAdded && (
                    <div className="mt-3 pt-3 border-t border-[#f0f0f0] flex flex-col gap-3">
                      <div className="flex items-center justify-between text-[11px] text-[#66625c]">
                        <span>{item.optLegend}:</span>
                        <span className="font-semibold text-[#151413]">{selectedSize}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {item.options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() =>
                              setSelectedSizes((prev) => ({ ...prev, [itemKey]: opt }))
                            }
                            className={`px-3 py-1 text-xs rounded-full border transition-all cursor-pointer ${
                              selectedSize === opt
                                ? 'bg-[#151413] text-white border-[#151413]'
                                : 'border-[#c8c8c8] hover:border-black text-[#151413]'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => handleSingleAdd(itemKey, item)}
                        className="w-full py-2.5 rounded-none bg-[#151413] hover:bg-black text-white text-xs font-medium tracking-wide transition-colors cursor-pointer"
                      >
                        Add to bag
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Bundle Footer */}
          <div className="p-6 sm:p-8 border-t border-[#c8c8c8] bg-white flex flex-col gap-3">
            {bundleMsg && <p className="text-[11px] text-red-600 font-medium">{bundleMsg}</p>}

            <div className="flex items-end justify-between gap-2">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#151413]">Complete the look</span>
                <span className="text-[11px] text-[#66625c]">Bundle all 3 and save 10%</span>
              </div>
              <div className="flex items-baseline gap-2">
                <s className="text-xs text-[#66625c]">$547.00</s>
                <strong className="text-base font-bold text-[#151413]">$492.30</strong>
              </div>
            </div>

            <button
              onClick={handleAddFullLook}
              disabled={bundleLoading || bundleComplete[activeLook.index]}
              className={`w-full py-3.5 text-xs font-semibold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                bundleComplete[activeLook.index]
                  ? 'bg-[#2E5A36] text-white'
                  : 'bg-[#151413] hover:bg-black text-white'
              }`}
            >
              {bundleLoading ? (
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : bundleComplete[activeLook.index] ? (
                <span>Full look in your bag</span>
              ) : (
                <>
                  <span>Add full look to bag</span>
                  <svg className="w-4 h-3 stroke-current fill-none stroke-[1.4]" viewBox="0 0 26 14">
                    <path d="M1 7h24M19 1l6 6-6 6" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </aside>
      </div>

      {/* "View look" Lightbox / Popup */}
      {isPopupOpen && (
        <div
          className="fixed inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col justify-between p-6 sm:p-12"
          onClick={() => setIsPopupOpen(false)}
        >
          {/* Popup Top Bar */}
          <div className="flex justify-between items-center z-10" onClick={(e) => e.stopPropagation()}>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#66625c]">
                Look 0{activeLook.index + 1}
              </span>
              <h3 className="text-xl sm:text-2xl font-normal text-[#151413]">{activeLook.name}</h3>
            </div>
            <button
              onClick={() => setIsPopupOpen(false)}
              className="w-12 h-12 rounded-full border border-black/20 hover:border-black flex items-center justify-center text-xl transition-colors cursor-pointer"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* Model with Pins */}
          <div
            className="relative flex-1 flex items-center justify-center my-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[75vh] aspect-[9/16]">
              <img
                src={activeLook.model1080}
                alt={activeLook.name}
                className="w-full h-full object-contain pointer-events-none"
              />

              {activeLook.pins.map((pin) => (
                <div
                  key={pin.num}
                  className="ttl-pin-halo absolute w-11 h-11 -ml-[22px] -mt-[22px] flex items-center justify-center cursor-pointer group"
                  style={{ left: `${pin.left}%`, top: `${pin.top}%` }}
                  onClick={() => {
                    setIsPopupOpen(false);
                    setHotPinNum(pin.num);
                    const itemKey = `${activeLook.index}-${pin.num - 1}`;
                    setOpenPickers((prev) => ({ ...prev, [itemKey]: true }));
                  }}
                >
                  <span className="w-6 h-6 rounded-full bg-white text-[#151413] group-hover:bg-[#0e0e0e] group-hover:text-white text-xs font-bold flex items-center justify-center shadow-lg transition-colors">
                    {pin.num}
                  </span>
                  <span className="absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 hidden group-hover:inline-block px-3 py-1.5 rounded-full bg-white text-xs font-medium text-[#151413] shadow-xl whitespace-nowrap">
                    {pin.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-[10px] tracking-widest uppercase text-[#66625c]">
            Tap a dot to shop the piece
          </p>
        </div>
      )}

      {/* Styling Bag Dialog */}
      {isBagOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsBagOpen(false)}
        >
          <div
            className="bg-white border border-[#d9d9d9] w-full max-w-[560px] max-h-[85vh] flex flex-col p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-4 border-b border-[#e4e4e4]">
              <h2 className="text-xl font-normal text-[#151413]">Your styling bag</h2>
              <button
                onClick={() => setIsBagOpen(false)}
                className="text-2xl text-[#666] hover:text-black p-1 cursor-pointer"
                aria-label="Close styling bag"
              >
                ×
              </button>
            </div>

            <p className="text-xs text-[#666] leading-relaxed my-3">
              A local outfit shortlist. No payment or order is collected here. Open a piece on the
              original demo to continue.
            </p>

            {/* Bag Items list */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#ddd] my-2">
              {bagItems.length === 0 ? (
                <p className="text-xs text-[#666] py-8 text-center">
                  Your styling bag is empty. Choose a size beside a piece to save it.
                </p>
              ) : (
                bagItems.map((item, idx) => (
                  <div key={`${item.id}-${item.size}-${idx}`} className="grid grid-cols-[60px_1fr_auto] gap-4 py-4 items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-[60px] h-[80px] object-contain bg-[#f9f9f9]"
                    />
                    <div className="flex flex-col gap-1">
                      <h4 className="text-sm font-medium text-[#151413] m-0">{item.name}</h4>
                      <p className="text-xs text-[#666] m-0">
                        Size {item.size} · Quantity {item.quantity} · ${item.price.toFixed(2)}
                      </p>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#151413] underline underline-offset-2 hover:text-[#666]"
                      >
                        View original piece ↗
                      </a>
                    </div>
                    <button
                      onClick={() => {
                        setBagItems((prev) => {
                          const updated = prev.filter((_, i) => i !== idx);
                          try {
                            localStorage.setItem('runway-styling-bag-v3', JSON.stringify(updated));
                          } catch {}
                          return updated;
                        });
                      }}
                      className="p-2 text-xl text-[#666] hover:text-black cursor-pointer"
                      aria-label={`Remove ${item.name}`}
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Bag Summary & Actions */}
            {bagItems.length > 0 && (
              <div className="pt-3 border-t border-[#e4e4e4] flex flex-col gap-3">
                <div className="text-right text-sm font-semibold text-[#151413]">
                  Reference subtotal: $
                  {bagItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                </div>
                <button
                  onClick={downloadShortlist}
                  className="w-full py-3.5 bg-[#151413] hover:bg-black text-white text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer"
                >
                  Download outfit shortlist
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bag Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#151413] text-white text-xs px-5 py-3 rounded-full shadow-xl pointer-events-none transition-opacity duration-300">
          {toastMsg}
        </div>
      )}
    </section>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import { Product, ProductSwatch } from '../types';

interface RunwayDepthLookbookProps {
  onAddToCart?: (
    product: Product,
    swatch: ProductSwatch,
    quantity: number,
    event?: React.MouseEvent
  ) => void;
  onSelectProduct?: (product: Product) => void;
  onExploreClick?: () => void;
  className?: string;
}

const MODELS = '/BAbies Assets/Pastel Girls’ Studio Fashion 6 Lineup.png';
const PIECES =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261102_042057_080e85b0-b4aa-4072-8eb9-2304c7baf42b.png&w=2400&q=85';

// Each model's box on the 960 x 540 sheet: x0, x1
const LOOKS: [number, number][] = [
  [12, 176],
  [178, 330],
  [331, 470],
  [476, 633],
  [634, 767],
  [767, 956],
];
const Y0 = 48;
const Y1 = 496;
const FIRST = 15;

// Each piece's box on the 960 x 720 sheet: [x0, x1, y0, y1, name, price, priceInNaira]
interface ItemDef {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  name: string;
  price: string;
  priceNaira: number;
  lookNum: number;
}

const ITEMS: ItemDef[] = [
  { x0: 26, x1: 224, y0: 28, y1: 214, name: 'Feather Jacket', price: '$2,900', priceNaira: 290000, lookNum: 15 },
  { x0: 304, x1: 412, y0: 22, y1: 236, name: 'Satin Wide Leg Trousers', price: '$1,450', priceNaira: 145000, lookNum: 15 },
  { x0: 530, x1: 666, y0: 12, y1: 242, name: 'Pleated Dress', price: '$2,200', priceNaira: 220000, lookNum: 16 },
  { x0: 752, x1: 922, y0: 100, y1: 146, name: 'Gold Waist Belt', price: '$420', priceNaira: 42000, lookNum: 16 },
  { x0: 70, x1: 176, y0: 246, y1: 466, name: 'Satin Trench Dress', price: '$2,350', priceNaira: 235000, lookNum: 17 },
  { x0: 294, x1: 422, y0: 294, y1: 432, name: 'Top Handle Bag', price: '$980', priceNaira: 98000, lookNum: 17 },
  { x0: 508, x1: 688, y0: 240, y1: 452, name: 'Billow Sleeve Blouse', price: '$860', priceNaira: 86000, lookNum: 18 },
  { x0: 780, x1: 890, y0: 252, y1: 466, name: 'Tie Waist Trousers', price: '$740', priceNaira: 74000, lookNum: 18 },
  { x0: 64, x1: 178, y0: 484, y1: 698, name: 'Powder Long Coat', price: '$1,980', priceNaira: 198000, lookNum: 19 },
  { x0: 316, x1: 396, y0: 482, y1: 698, name: 'Ivory Straight Trousers', price: '$690', priceNaira: 69000, lookNum: 19 },
  { x0: 530, x1: 672, y0: 508, y1: 682, name: 'Sculpted Ruffle Top', price: '$1,120', priceNaira: 112000, lookNum: 20 },
  { x0: 754, x1: 916, y0: 484, y1: 700, name: 'Pleated Maxi Skirt', price: '$1,340', priceNaira: 134000, lookNum: 20 },
];

// Depth stops from d = -1 (leaving past the rail) to d = 5 (arriving out of the haze)
const KX = [1.2, 0.744, 0.496, 0.346, 0.235, 0.15, 0.085];
const KF = [1.14, 0.89, 0.777, 0.704, 0.651, 0.616, 0.59];
const KH = [1.18, 0.832, 0.574, 0.436, 0.334, 0.258, 0.19];
const KB = [0, 0, 1.5, 4, 8, 12, 17];
const KO = [1, 1, 1, 1, 0.86, 0.5, 0];

const N = LOOKS.length;
const wrap = (x: number, n: number) => ((x % n) + n) % n;
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));

export const RunwayDepthLookbook: React.FC<RunwayDepthLookbookProps> = ({
  onAddToCart,
  onSelectProduct,
  onExploreClick,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const rollRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const waitRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<'Runway' | 'The Maison' | 'Lookbook' | 'Shop'>('Runway');
  const [likedItems, setLikedItems] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const stage = stageRef.current;
    const rail = railRef.current;
    const ring = ringRef.current;
    const roll = rollRef.current;
    const line = lineRef.current;
    const wait = waitRef.current;
    const container = containerRef.current;

    if (!stage || !rail || !ring || !roll || !line || !container) return;

    const NS = 'http://www.w3.org/2000/svg';

    function crop(
      href: string,
      x0: number,
      y0: number,
      w: number,
      h: number,
      sheetW: number,
      sheetH: number
    ) {
      const s = document.createElementNS(NS, 'svg');
      s.setAttribute('viewBox', `${x0} ${y0} ${w} ${h}`);
      s.setAttribute('aria-hidden', 'true');
      const f = document.createElementNS(NS, 'svg');
      [
        ['x', `${x0}`],
        ['y', `${y0}`],
        ['width', `${w}`],
        ['height', `${h}`],
        ['viewBox', `${x0} ${y0} ${w} ${h}`],
      ].forEach(([k, v]) => f.setAttribute(k, v));
      const i = document.createElementNS(NS, 'image');
      i.setAttribute('href', href);
      i.setAttribute('width', `${sheetW}`);
      i.setAttribute('height', `${sheetH}`);
      i.setAttribute('preserveAspectRatio', 'none');
      f.append(i);
      s.append(f);
      return s;
    }

    // Clear any previous nodes inside line, rail, roll
    line.innerHTML = '';
    rail.innerHTML = '';
    roll.innerHTML = '';

    const people = LOOKS.map(([a, b], i) => {
      const e = document.createElement('div');
      e.className = 'm';
      e.dataset.i = `${i}`;
      e.append(crop(MODELS, a, Y0, b - a, Y1 - Y0, 960, 540));
      line.append(e);
      return { e, r: (b - a) / (Y1 - Y0), f: '', o: '' };
    });

    const cardElements = ITEMS.map((item, i) => {
      const e = document.createElement('article');
      e.className = 'card' + (i % 2 ? ' alt' : '');
      e.innerHTML = `
        <button class="fav" aria-pressed="false" aria-label="Save ${item.name}">
          <svg viewBox="0 0 24 24"><path d="M12 20S3.5 15 3.5 9A4.6 4.6 0 0 1 12 6.6 4.600 4.600 0 0 1 20.500 9C20.500 15 12 20 12 20Z"/></svg>
        </button>
        <span class="shot"></span>
        <div class="meta">
          <h3 class="wide">${item.name}</h3>
          <span>${item.price}</span>
          <button class="add" aria-label="Add ${item.name} to cart" title="Add to bag"></button>
        </div>
      `;
      e.querySelector('.shot')?.append(crop(PIECES, item.x0, item.y0, item.x1 - item.x0, item.y1 - item.y0, 960, 720));
      rail.append(e);
      return e;
    });

    for (let i = 0; i <= N; i++) {
      const b = document.createElement('b');
      b.textContent = `${FIRST + (i % N)}`;
      roll.append(b);
    }

    // Rail click handler for likes and add to cart
    const handleRailClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const favBtn = target.closest('.fav') as HTMLElement | null;
      if (favBtn) {
        const isPressed = favBtn.getAttribute('aria-pressed') === 'true';
        favBtn.setAttribute('aria-pressed', (!isPressed).toString());
        return;
      }

      const addBtn = target.closest('.add') as HTMLElement | null;
      if (addBtn) {
        const cardIndex = cardElements.indexOf(target.closest('.card') as HTMLElement);
        if (cardIndex !== -1 && onAddToCart) {
          const item = ITEMS[cardIndex];
          const productPayload: Product = {
            id: `runway-piece-${cardIndex}`,
            name: `${item.name} — Look ${item.lookNum}`,
            subtitle: `Maison Runway Collection`,
            category: 'Ball Dresses',
            price: item.priceNaira,
            originalPrice: item.priceNaira * 1.2,
            description: `Bespoke artisanal runway couture piece crafted with ultra-fine organic lining from the Babies Touch Atelier.`,
            story: `Featured on the runway stage. Hand-tailored in our atelier with impeccable needlework and comfort-first craftsmanship.`,
            materials: `Italian silk blend, fine tulle, French cotton lining.`,
            dimensions: `Available in custom child sizes 1 to 10 years.`,
            careInstructions: `Delicate dry clean only. Steam reverse side.`,
            shippingInfo: `Dispatched in custom keepsake heirloom box from Main Market, Onitsha.`,
            rating: 5.0,
            reviewsCount: 38,
            inStock: true,
            inventory: 10,
            isFeatured: true,
            designer: 'Babies Touch Atelier',
            madeIn: 'Handcrafted Atelier',
            imageUrl: MODELS,
            swatches: [
              { name: 'Runway Original', hex: '#FAF9F6' },
              { name: 'Champagne Satin', hex: '#E6DCC3' },
            ],
          };
          onAddToCart(productPayload, productPayload.swatches[0], 1, e as unknown as React.MouseEvent);
        }
      }
    };
    rail.addEventListener('click', handleRailClick);

    let W = 0,
      H = 0,
      base = 0,
      cardS = 0,
      side = false,
      dirty = true,
      p = 0,
      target = 0,
      last = 0;
    const calm = matchMedia('(prefers-reduced-motion:reduce)').matches;

    function size() {
      if (!stage || !rail || !roll) return;
      W = stage.clientWidth;
      H = stage.clientHeight;
      base = H * 1.2;
      side = window.innerWidth <= 820;
      people.forEach((m) => {
        m.e.style.width = base * m.r + 'px';
        m.e.style.height = base + 'px';
      });
      cardS = side ? 160 : rail.clientHeight / 3;
      cardElements.forEach((c) => {
        c.style.height = side ? '100%' : cardS + 'px';
      });
      const firstChild = roll.firstChild as HTMLElement;
      if (firstChild) {
        roll.style.setProperty('--h', `${firstChild.getBoundingClientRect().height}`);
      }
      dirty = true;
    }

    window.addEventListener('resize', size);

    function paint() {
      people.forEach((m, i) => {
        let d = wrap(i - p, N);
        if (d > N - 1) d -= N;
        const k = clamp(d + 1, 0, 6);
        const a = Math.floor(k);
        const b = Math.min(6, a + 1);
        const t = k - a;
        const mix = (A: number[]) => A[a] + (A[b] - A[a]) * t;
        const h = mix(KH) * H;
        const s = h / base;
        const w = h * m.r;
        const x = mix(KX) * W - w / 2;
        const y = mix(KF) * H - h;
        m.e.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) scale(${s.toFixed(4)})`;
        const f = mix(KB) / s;
        const fs = f < 0.2 ? 'none' : `blur(${f.toFixed(1)}px)`;
        const o = mix(KO).toFixed(3);
        if (fs !== m.f) {
          m.f = fs;
          m.e.style.filter = fs;
        }
        if (o !== m.o) {
          m.o = o;
          m.e.style.opacity = o;
        }
        m.e.style.zIndex = `${100 - Math.round(d * 10)}`;
      });

      const all = cardS * ITEMS.length;
      cardElements.forEach((c, i) => {
        let y = wrap(i * cardS - p * 2 * cardS, all);
        if (y > all - cardS) y -= all;
        c.style.transform = side ? `translate3d(${y.toFixed(1)}px,0,0)` : `translate3d(0,${y.toFixed(1)}px,0)`;
      });

      const firstB = roll?.firstChild as HTMLElement | null;
      const bHeight = firstB ? firstB.offsetHeight : 38;
      if (roll) {
        roll.style.transform = `translate3d(0,${(-wrap(p, N) * bHeight).toFixed(1)}px,0)`;
      }
    }

    let mx = 0,
      my = 0,
      cx = 0,
      cy = 0,
      down = false,
      sx = 0,
      st = 0,
      moved = 0,
      wheelT: ReturnType<typeof setTimeout> | undefined;

    function frame(now: number) {
      const dt = Math.min(50, now - last) || 16;
      last = now;
      const was = p;
      if (calm) p = target;
      else p += (target - p) * (1 - Math.exp(-dt * 0.0072));
      if (Math.abs(target - p) < 0.0004) p = target;
      if (p !== was || dirty) {
        dirty = false;
        paint();
      }
      cx += (mx - cx) * 0.32;
      cy += (my - cy) * 0.32;
      if (ring) {
        ring.style.transform = `translate3d(${cx.toFixed(1)}px,${cy.toFixed(1)}px,0)`;
      }
    }

    const PULL = () => Math.max(150, W * 0.2);

    const onPointerEnter = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && ring) ring.classList.add('show');
    };
    const onPointerLeave = () => {
      if (ring) ring.classList.remove('show');
    };
    const onPointerMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
      if (!down) return;
      const dx = e.clientX - sx;
      moved = Math.max(moved, Math.abs(dx));
      target = st + dx / PULL();
    };
    const onPointerDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('a, button')) return;
      down = true;
      sx = e.clientX;
      st = target;
      moved = 0;
      stage.setPointerCapture(e.pointerId);
      if (ring) ring.classList.add('drag');
    };
    const onRelease = (e: PointerEvent) => {
      if (!down) return;
      down = false;
      if (ring) ring.classList.remove('drag');
      if (moved < 6) {
        const hit = document.elementsFromPoint(e.clientX, e.clientY).find((x) => x.classList && x.classList.contains('m')) as HTMLElement | undefined;
        if (hit && hit.dataset.i) {
          let d = wrap(+hit.dataset.i - target, N);
          d = Math.round(d);
          if (d > 0 && d < N) target = Math.round(target) + d;
        }
      } else {
        target = Math.round(target);
      }
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      target += clamp(e.deltaY + e.deltaX, -120, 120) / 420;
      clearTimeout(wheelT);
      wheelT = setTimeout(() => {
        target = Math.round(target);
      }, 150);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (['ArrowRight', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        target = Math.round(target) + 1;
      }
      if (['ArrowLeft', 'ArrowUp'].includes(e.key)) {
        e.preventDefault();
        target = Math.round(target) - 1;
      }
    };

    stage.addEventListener('pointerenter', onPointerEnter);
    stage.addEventListener('pointerleave', onPointerLeave);
    stage.addEventListener('pointermove', onPointerMove);
    stage.addEventListener('pointerdown', onPointerDown);
    stage.addEventListener('pointerup', onRelease);
    stage.addEventListener('pointercancel', onRelease);
    stage.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown);

    let animId: number;
    function loop(t: number) {
      frame(t);
      animId = requestAnimationFrame(loop);
    }

    Promise.all([MODELS, PIECES].map((u) => {
      const img = new Image();
      img.src = u;
      return img.decode().catch(() => {});
    }))
      .then(() => document.fonts.ready)
      .then(() => {
        size();
        paint();
        if (wait) wait.classList.add('gone');
      });

    size();
    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', size);
      window.removeEventListener('keydown', onKeyDown);
      rail.removeEventListener('click', handleRailClick);
      stage.removeEventListener('pointerenter', onPointerEnter);
      stage.removeEventListener('pointerleave', onPointerLeave);
      stage.removeEventListener('pointermove', onPointerMove);
      stage.removeEventListener('pointerdown', onPointerDown);
      stage.removeEventListener('pointerup', onRelease);
      stage.removeEventListener('pointercancel', onRelease);
      stage.removeEventListener('wheel', onWheel);
      clearTimeout(wheelT);
    };
  }, [onAddToCart]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-white text-[#16191f] select-none ${className}`}
      style={
        {
          '--u': 'min(calc(100vw/1600),calc(100vh/900))',
          '--ink': '#16191f',
          '--mid': '#737b86',
          '--dim': '#a4adb8',
          '--line': '#e6ebf0',
          '--ice': '#e9f0f7',
        } as React.CSSProperties
      }
    >
      {/* Component Styles Scoped */}
      <style>{`
        .runway-wrapper .wide { font-family: Michroma, sans-serif; text-transform: uppercase; }
        .runway-wrapper { height: 85vh; min-height: 580px; max-height: 960px; display: grid; grid-template-rows: auto 1fr; background: #fff; position: relative; }
        .runway-header { position: relative; z-index: 5; background: #fff; padding: calc(18*var(--u)) calc(42*var(--u)) calc(14*var(--u)); border-bottom: 1px solid #eef2f6; }
        .runway-r1 { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; }
        .runway-brand { font-size: calc(15*var(--u)); letter-spacing: .2em; font-weight: 600; }
        .runway-tabs { display: flex; gap: calc(42*var(--u)); font-size: calc(13.5*var(--u)); letter-spacing: .14em; color: var(--dim); }
        .runway-tabs a { transition: color .25s; }
        .runway-tabs a:hover, .runway-tabs .on { color: var(--ink); }
        .runway-acct { justify-self: end; display: flex; align-items: center; gap: calc(20*var(--u)); font-size: calc(9.5*var(--u)); letter-spacing: .12em; }
        .runway-acct svg { width: calc(16*var(--u)); height: calc(16*var(--u)); fill: none; stroke: currentColor; stroke-width: 1.5; }
        .runway-r2 { display: flex; justify-content: center; gap: calc(52*var(--u)); margin-top: calc(14*var(--u)); font-size: calc(9.5*var(--u)); letter-spacing: .14em; }
        .runway-r2 a { transition: color .2s; } .runway-r2 a:hover { color: var(--mid); }
        .runway-main { position: relative; display: grid; grid-template-columns: 1fr calc(372*var(--u)); min-height: 0; height: 100%; }
        .runway-stage { position: relative; overflow: hidden; min-width: 0; touch-action: pan-y; user-select: none; -webkit-user-select: none; cursor: none;
          background: linear-gradient(transparent 60%,rgba(255,255,255,.72) 100%),linear-gradient(90deg,#f1f5fa 0%,#e7eff6 38%,#eef4f9 62%,#f6f9fc 100%); }
        .runway-line { position: absolute; inset: 0; }
        .runway-stage .m { position: absolute; left: 0; top: 0; transform-origin: 0 0; will-change: transform,filter; cursor: none; }
        .runway-stage .m svg { display: block; position: relative; width: 100%; height: 100%; }
        .runway-stage .m:before { content: ""; position: absolute; left: 8%; right: 8%; bottom: -1.6%; height: 3.6%; border-radius: 50%; background: radial-gradient(closest-side,rgba(70,85,105,.24),transparent); }
        .runway-intro { position: absolute; z-index: 2; left: calc(46*var(--u)); top: calc(36*var(--u)); width: calc(390*var(--u)); pointer-events: none; }
        .runway-intro h2 { font-weight: 400; font-size: calc(22*var(--u)); line-height: 1.2; letter-spacing: .16em; white-space: nowrap; }
        .runway-intro p { margin-top: calc(16*var(--u)); font-size: calc(14*var(--u)); line-height: 1.62; letter-spacing: .012em; color: var(--mid); }
        .runway-tag { position: absolute; z-index: 2; left: calc(46*var(--u)); bottom: calc(44*var(--u)); }
        .runway-look { display: flex; font-size: calc(29*var(--u)); line-height: calc(38*var(--u)); letter-spacing: .14em; gap: .5em; pointer-events: none; }
        .runway-win { height: calc(38*var(--u)); overflow: hidden; }
        .runway-roll { display: block; will-change: transform; }
        .runway-roll b { display: block; font-weight: 400; height: calc(38*var(--u)); }
        .runway-shop { display: inline-block; margin-top: calc(13*var(--u)); font-size: calc(9.5*var(--u)); letter-spacing: .14em; padding-bottom: calc(4*var(--u)); border-bottom: 1px solid currentColor; cursor: pointer; }
        .runway-ring { position: absolute; z-index: 4; left: 0; top: 0; width: calc(46*var(--u)); height: calc(46*var(--u)); margin: calc(-23*var(--u)) 0 0 calc(-23*var(--u)); border: calc(2.5*var(--u)) solid #16191f; border-radius: 99px; pointer-events: none; opacity: 0; transition: width .22s cubic-bezier(.2,.8,.2,1),height .22s cubic-bezier(.2,.8,.2,1),margin .22s cubic-bezier(.2,.8,.2,1),opacity .2s; }
        .runway-ring.show { opacity: 1; }
        .runway-ring.drag { width: calc(84*var(--u)); height: calc(34*var(--u)); margin: calc(-17*var(--u)) 0 0 calc(-42*var(--u)); }
        .runway-rail { position: relative; overflow: hidden; background: #f3f6fa; min-height: 0; }
        .runway-rail .card { position: absolute; left: 0; top: 0; width: 100%; display: flex; flex-direction: column; padding: calc(18*var(--u)) calc(24*var(--u)) calc(18*var(--u)); will-change: transform; background: #f3f6fa; }
        .runway-rail .card.alt { background: #fff; }
        .runway-rail .fav { position: absolute; left: calc(22*var(--u)); top: calc(18*var(--u)); width: calc(22*var(--u)); height: calc(22*var(--u)); z-index: 1; color: var(--ink); background: none; border: 0; cursor: pointer; }
        .runway-rail .fav svg { width: 100%; height: 100%; fill: none; stroke: currentColor; stroke-width: 1.4; transition: fill .2s; }
        .runway-rail .fav[aria-pressed=true] svg { fill: #d8a7a0; stroke: #b98179; }
        .runway-rail .shot { flex: 1; min-height: 0; display: block; }
        .runway-rail .shot svg { display: block; width: 100%; height: 100%; }
        .runway-rail .meta { display: grid; grid-template-columns: 1fr auto; align-items: end; margin-top: calc(8*var(--u)); }
        .runway-rail .meta h3 { font-weight: 400; font-size: calc(9.5*var(--u)); letter-spacing: .14em; }
        .runway-rail .meta span { display: block; grid-column: 1; margin-top: calc(6*var(--u)); font-size: calc(12.5*var(--u)); color: var(--mid); letter-spacing: .03em; }
        .runway-rail .add { grid-column: 2; grid-row: 1/3; width: calc(26*var(--u)); height: calc(26*var(--u)); position: relative; transition: transform .2s; background: none; border: 0; cursor: pointer; }
        .runway-rail .add:before, .runway-rail .add:after { content: ""; position: absolute; left: 50%; top: 50%; width: calc(15*var(--u)); height: 1.5px; margin: -.75px 0 0 calc(-7.5*var(--u)); background: var(--ink); }
        .runway-rail .add:after { transform: rotate(90deg); }
        .runway-rail .add:hover { transform: rotate(90deg); }
        .runway-wait { position: absolute; inset: 0; z-index: 9; background: #f1f5fa; transition: opacity .5s; pointer-events: none; }
        .runway-wait.gone { opacity: 0; }
        @media (max-width:820px){
          .runway-wrapper { --u: 1px; height: 680px; }
          .runway-header { padding: 14px 16px 12px; }
          .runway-r1 { grid-template-columns: 1fr auto; }
          .runway-tabs, .runway-r2, .runway-acct>span:not(:last-child) { display: none; }
          .runway-brand { font-size: 14px; }
          .runway-main { grid-template-columns: 1fr; grid-template-rows: 1fr 190px; }
          .runway-stage { cursor: auto; } .runway-stage .m { cursor: auto; } .runway-ring { display: none; }
          .runway-intro { left: 16px; top: 18px; width: calc(100% - 32px); }
          .runway-intro h2 { font-size: 17px; }
          .runway-intro p { display: none; }
          .runway-tag { left: 16px; bottom: 18px; }
          .runway-look { font-size: 22px; line-height: 30px; } .runway-win, .runway-roll b { height: 30px; }
          .runway-rail .card { width: 160px; height: 100%; padding: 12px; }
          .runway-rail .fav { left: 10px; top: 10px; }
        }
      `}</style>

      <div className="runway-wrapper">
        <header className="runway-header">
          <div className="runway-r1">
            <a className="runway-brand wide text-[#16191f] tracking-widest" href="#stage">
              Babies Touch
            </a>
            <nav className="runway-tabs wide" aria-label="Runway Sections">
              {(['Runway', 'The Maison', 'Lookbook', 'Shop'] as const).map((tab) => (
                <a
                  key={tab}
                  href="#runway-depth-section"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab(tab);
                  }}
                  className={activeTab === tab ? 'on' : ''}
                >
                  {tab}
                </a>
              ))}
            </nav>
            <div className="runway-acct wide">
              <span className="hidden sm:inline-block text-[#737b86]">Atelier Couture</span>
              <span className="flex items-center gap-1.5 text-[10px] text-[#2E5A36] bg-[#E6ECE3] px-2.5 py-1 rounded-full font-sans font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E5A36] animate-pulse" />
                Live Runway Loop
              </span>
            </div>
          </div>
          <nav className="runway-r2 wide" aria-label="Runway Collections">
            <a href="#catalog-section">Collections</a>
            <a href="#catalog-section">Clothing</a>
            <a href="#catalog-section">Lookbook</a>
            <a href="#catalog-section">Accessories</a>
            <a href="#catalog-section">Onitsha Atelier</a>
          </nav>
        </header>

        <main className="runway-main">
          <section
            ref={stageRef}
            className="runway-stage"
            id="stage"
            aria-label="Runway looks. Drag, scroll or use arrow keys to change look."
            tabIndex={0}
          >
            <div ref={lineRef} className="runway-line" id="line" />
            <div className="runway-intro">
              <h2 className="wide">Spring Summer 2027</h2>
              <p>
                A study in softness and strength. The new season runway collection from Babies Touch blends
                delicate textures, handcrafted tulle, and modern silhouettes for children's milestone moments.
              </p>
            </div>
            <div className="runway-tag">
              <div className="runway-look wide" aria-live="polite">
                <span>Look</span>
                <span className="runway-win">
                  <span ref={rollRef} className="runway-roll" id="roll" />
                </span>
              </div>
              <button
                onClick={() => {
                  const el = document.getElementById('catalog-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="runway-shop wide"
              >
                Shop the look
              </button>
            </div>
            <div ref={ringRef} className="runway-ring" id="ring" />
          </section>

          <aside ref={railRef} className="runway-rail" id="rail" aria-label="Pieces in this look" />
        </main>

        <div ref={waitRef} className="runway-wait" id="wait" />
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { Product, ProductSwatch } from '../types';
import { ProductVisual } from './ProductVisual';

export interface FlyItemData {
  id: string;
  product: Product;
  swatch: ProductSwatch;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
}

interface FlyToCartAnimationProps {
  items: FlyItemData[];
  onItemLanded: (id: string) => void;
}

export const FlyToCartAnimation: React.FC<FlyToCartAnimationProps> = ({
  items,
  onItemLanded,
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {items.map((item) => (
        <FlyingProductCircle
          key={item.id}
          item={item}
          onComplete={() => onItemLanded(item.id)}
        />
      ))}
    </div>
  );
};

const FlyingProductCircle: React.FC<{
  item: FlyItemData;
  onComplete: () => void;
}> = ({ item, onComplete }) => {
  const [isFlying, setIsFlying] = useState(false);
  const [isFormingCircle, setIsFormingCircle] = useState(false);

  const deltaX = item.targetX - item.startX;
  const deltaY = item.targetY - item.startY;

  useEffect(() => {
    // 1. Immediately trigger the circle morphing
    const circleTimer = setTimeout(() => {
      setIsFormingCircle(true);
    }, 20);

    // 2. Trigger the flight trajectory across to the bag
    const flyTimer = setTimeout(() => {
      setIsFlying(true);
    }, 60);

    // 3. Complete and land in bag at 800ms
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 820);

    return () => {
      clearTimeout(circleTimer);
      clearTimeout(flyTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        left: `${item.startX}px`,
        top: `${item.startY}px`,
        width: '96px',
        height: '96px',
        transform: isFlying
          ? `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px)) scale(0.24)`
          : 'translate(-50%, -50%) scale(1.08)',
        borderRadius: isFormingCircle ? '9999px' : '18px',
        transition: isFlying
          ? 'transform 760ms cubic-bezier(0.2, 0.85, 0.32, 1), border-radius 260ms ease-out, opacity 200ms ease-in 600ms'
          : 'transform 120ms ease-out, border-radius 180ms ease-out',
        opacity: isFlying ? 0.95 : 1,
      }}
      className="flex items-center justify-center bg-white shadow-2xl border-2 border-white ring-2 ring-[#171717]/20 overflow-hidden select-none"
    >
      {/* Product visual inside flying circular capsule */}
      <div className="w-full h-full p-2 flex items-center justify-center rounded-full overflow-hidden bg-gradient-to-b from-[#FAF9F6] to-[#EFECE6]">
        <ProductVisual
          product={item.product}
          activeSwatch={item.swatch}
          className="w-full h-full !p-0 scale-110 pointer-events-none"
        />
      </div>

      {/* Trailing golden highlight glow */}
      <div className="absolute inset-0 rounded-full border border-amber-300/40 pointer-events-none" />
    </div>
  );
};

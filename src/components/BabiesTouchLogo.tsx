import React, { useState } from 'react';

export interface BabiesTouchLogoProps {
  className?: string;
  imgClassName?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showLocation?: boolean;
  showTagline?: boolean;
  showWordmark?: boolean;
  locationText?: string;
  color?: string;
  onClick?: () => void;
}

export const BabiesTouchLogo: React.FC<BabiesTouchLogoProps> = ({
  className = '',
  imgClassName = '',
  size = 'md',
  showLocation = false,
  showTagline = false,
  showWordmark = false,
  locationText = 'Main Market, Onitsha',
  onClick,
}) => {
  const [imgError, setImgError] = useState(false);

  // Precise height mappings that fit seamlessly within headers, modals, cards, and footers
  const sizeConfig = {
    xs: { h: 'h-7', pxH: 28, text: 'text-sm', sub: 'text-[9px]' },
    sm: { h: 'h-9 sm:h-10', pxH: 38, text: 'text-base', sub: 'text-[10px]' },
    md: { h: 'h-11 sm:h-12', pxH: 48, text: 'text-lg sm:text-xl', sub: 'text-[10px] sm:text-[11px]' },
    lg: { h: 'h-14 sm:h-16', pxH: 64, text: 'text-xl sm:text-2xl', sub: 'text-xs' },
    xl: { h: 'h-20 sm:h-24', pxH: 88, text: 'text-2xl sm:text-3xl', sub: 'text-xs sm:text-sm' },
  };

  const current = sizeConfig[size] || sizeConfig.md;

  const content = (
    <div
      className={`inline-flex items-center gap-2.5 sm:gap-3 select-none shrink-0 ${
        onClick ? 'cursor-pointer group' : ''
      } ${className}`}
      onClick={onClick}
    >
      {/* Optimized Logo Image with Zero-CLS aspect ratio and graceful fallback */}
      <div className={`relative shrink-0 flex items-center justify-center ${current.h}`}>
        {!imgError ? (
          <img
            src="/assets/logo.png"
            srcSet="/assets/logo.png 1x, /assets/aistudio/logo_2b90ccb5.png 2x"
            alt="Babies Touch — Simply Magical"
            className={`w-auto ${current.h} aspect-[495/528] object-contain block drop-shadow-2xs transition-transform duration-200 group-hover:scale-105 ${imgClassName}`}
            loading="eager"
            decoding="async"
            onError={() => setImgError(true)}
          />
        ) : (
          /* Graceful inline vector fallback in case image asset is unreachable */
          <div
            className={`aspect-[495/528] ${current.h} flex flex-col items-center justify-center bg-[#FCE7F3] rounded-xl px-2 border border-[#F472B6]/30 text-[#E0218A]`}
          >
            <span className="font-bold text-xs leading-none">BT</span>
            <span className="text-[7px] uppercase tracking-tighter">Magical</span>
          </div>
        )}
      </div>

      {/* Optional Wordmark & Location Pill / Subtitle */}
      {(showWordmark || showLocation || showTagline) && (
        <div className="flex flex-col text-left justify-center min-w-0">
          {showWordmark && (
            <span
              className={`font-serif font-bold text-[#171717] group-hover:text-[#FA519B] transition-colors leading-tight truncate ${current.text}`}
            >
              Babies Touch
            </span>
          )}

          {showTagline && (
            <span className="font-serif italic text-[#FA519B] text-xs leading-tight">
              Simply Magical
            </span>
          )}

          {showLocation && (
            <div
              className={`flex items-center gap-1.5 font-medium text-[#737373] mt-0.5 leading-tight ${current.sub}`}
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#2E5A36] shrink-0 animate-pulse" />
              <span className="truncate">{locationText}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return content;
};

import React from 'react';
import { Product, ProductSwatch, ProductVariation } from '../types';
import { getProductAgeRange } from '../utils/productUtils';

interface ProductVisualProps {
  product: Product;
  activeSwatch?: ProductSwatch;
  selectedVariation?: ProductVariation;
  variationImageUrl?: string;
  className?: string;
  showAgeTag?: boolean;
}

export const ProductVisual: React.FC<ProductVisualProps> = ({
  product,
  activeSwatch,
  selectedVariation,
  variationImageUrl,
  className = '',
  showAgeTag = false,
}) => {
  const swatch = activeSwatch || product.swatches[0];
  const swatchHex = swatch ? swatch.hex : '#F3D6D8';

  // Specific variation image or fallback to main product image
  const displayImage =
    variationImageUrl ||
    selectedVariation?.imageUrl ||
    product.imageUrl;

  // For products with variations, allow hover image only when no specific variation is active
  const showHoverAlternate =
    product.type === 'variable' &&
    product.hoverImageUrl &&
    !selectedVariation?.imageUrl &&
    !variationImageUrl;

  if (displayImage) {
    return (
      <div
        className={`relative w-full h-full flex items-center justify-center bg-[#FFFFFF] rounded-2xl overflow-hidden select-none group ${className}`}
      >
        {/* Primary Image */}
        <img
          src={displayImage}
          alt={product.name}
          className={`w-full h-full object-cover object-center brightness-[1.05] contrast-[1.02] transition-all duration-500 ease-in-out ${
            showHoverAlternate ? 'group-hover:opacity-0 group-hover:scale-105' : 'group-hover:scale-105'
          }`}
        />

        {/* Hover Alternate Image */}
        {showHoverAlternate && (
          <img
            src={product.hoverImageUrl}
            alt={`${product.name} alternate view`}
            className="absolute inset-0 w-full h-full object-cover object-center brightness-[1.05] contrast-[1.02] opacity-0 group-hover:opacity-100 scale-100 group-hover:scale-105 transition-all duration-500 ease-in-out pointer-events-none"
          />
        )}

        {/* Small letter age range tag at top of product image without covering image detail */}
        {showAgeTag && (
          <span className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-[#525252] text-[9px] sm:text-[10px] font-medium tracking-tight border border-[#E6E4DF]/80 shadow-2xs pointer-events-none z-10 lowercase">
            age: {getProductAgeRange(product)}
          </span>
        )}

        {/* Active swatch indicator pill - hidden on mobile */}
        <div className="hidden sm:flex absolute bottom-3 left-3 items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs border border-[#E6E4DF] text-[11px] text-[#737373] pointer-events-none shadow-xs">
          <span
            className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
            style={{ backgroundColor: swatchHex }}
          />
          <span className="font-medium text-[#171717]">{swatch.name}</span>
        </div>
      </div>
    );
  }

  const renderObjectSvg = () => {
    switch (product.id) {
      case 'florence-lace-ball-dress':
        return (
          <svg
            viewBox="0 0 400 360"
            className="w-full h-full max-h-[300px] object-contain drop-shadow-sm transition-all duration-300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Soft floor shadow */}
            <ellipse cx="200" cy="325" rx="135" ry="14" fill="#DDD9C6" fillOpacity="0.45" />

            {/* Hanger and ribbon */}
            <path d="M185 35 Q200 15 210 28 Q215 38 200 45" stroke="#C5A059" strokeWidth="3" fill="none" />
            <path d="M150 65 L200 48 L250 65" stroke="#C5A059" strokeWidth="4" strokeLinecap="round" />

            {/* Bodice */}
            <path
              d="M165 72 L150 145 C175 152 225 152 250 145 L235 72 C215 78 185 78 165 72 Z"
              fill={swatchHex}
              stroke="#D4CEBF"
              strokeWidth="1.5"
            />
            {/* Sweetheart neckline curve */}
            <path d="M165 72 Q182 85 200 78 Q218 85 235 72" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.8" />

            {/* Pearl necklace/piping */}
            <circle cx="180" cy="80" r="2.5" fill="#FFFFFF" />
            <circle cx="190" cy="82" r="2.5" fill="#FFFFFF" />
            <circle cx="200" cy="83" r="2.5" fill="#FFFFFF" />
            <circle cx="210" cy="82" r="2.5" fill="#FFFFFF" />
            <circle cx="220" cy="80" r="2.5" fill="#FFFFFF" />

            {/* Satin Waistband Sash */}
            <rect x="150" y="140" width="100" height="14" rx="4" fill="#FFFFFF" fillOpacity="0.85" />
            {/* Center rosette bow */}
            <circle cx="200" cy="147" r="8" fill="#FBF8F2" stroke={swatchHex} strokeWidth="2" />
            <path d="M196 153 L188 180" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
            <path d="M204 153 L212 180" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />

            {/* Tier 1 - Upper Tulle */}
            <path
              d="M150 152 C120 195 110 215 110 225 C145 235 255 235 290 225 C290 215 280 195 250 152 Z"
              fill={swatchHex}
              fillOpacity="0.85"
            />
            {/* Tier 2 - Middle Tulle */}
            <path
              d="M115 210 C90 255 85 270 85 280 C130 292 270 292 315 280 C315 270 310 255 285 210 Z"
              fill={swatchHex}
              fillOpacity="0.92"
            />
            {/* Tier 3 - Grand Scalloped Ballroom Sweep */}
            <path
              d="M90 265 C70 305 60 318 60 324 C120 338 280 338 340 324 C340 318 330 305 310 265 Z"
              fill={swatchHex}
            />

            {/* Delicate 3D blossom petals scattered on skirt */}
            <circle cx="140" cy="245" r="4" fill="#FFFFFF" fillOpacity="0.9" />
            <circle cx="260" cy="250" r="4.5" fill="#FFFFFF" fillOpacity="0.9" />
            <circle cx="180" cy="275" r="5" fill="#FFFFFF" fillOpacity="0.9" />
            <circle cx="225" cy="290" r="4" fill="#FFFFFF" fillOpacity="0.9" />
            <circle cx="130" cy="305" r="4.5" fill="#FFFFFF" fillOpacity="0.9" />
            <circle cx="270" cy="308" r="5" fill="#FFFFFF" fillOpacity="0.9" />
          </svg>
        );

      case 'aurora-ceremony-gown':
        return (
          <svg
            viewBox="0 0 400 360"
            className="w-full h-full max-h-[300px] object-contain drop-shadow-sm transition-all duration-300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Floor shadow */}
            <ellipse cx="200" cy="330" rx="110" ry="12" fill="#DDD9C6" fillOpacity="0.5" />

            {/* Hanger */}
            <path d="M190 32 Q200 15 210 28" stroke="#C5A059" strokeWidth="2.5" fill="none" />
            <path d="M160 55 L200 42 L240 55" stroke="#C5A059" strokeWidth="3.5" strokeLinecap="round" />

            {/* Peter Pan scalloped collar */}
            <path d="M172 58 C185 75 198 75 200 62 C202 75 215 75 228 58 Z" fill="#FFFFFF" stroke="#E6E2D8" strokeWidth="1.5" />

            {/* Pin-tucked bodice */}
            <path d="M175 62 L168 130 L232 130 L225 62 Z" fill={swatchHex} stroke="#E6E2D8" strokeWidth="1" />
            <line x1="188" y1="65" x2="188" y2="128" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.8" />
            <line x1="200" y1="65" x2="200" y2="128" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.8" />
            <line x1="212" y1="65" x2="212" y2="128" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.8" />

            {/* Silk waist tie bow */}
            <ellipse cx="200" cy="132" rx="10" ry="5" fill="#FFFFFF" />
            <path d="M195 135 L175 200" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            <path d="M205 135 L225 200" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />

            {/* Long Cathedral gown skirt */}
            <path
              d="M168 130 C130 200 100 270 95 325 C145 334 255 334 305 325 C300 270 270 200 232 130 Z"
              fill={swatchHex}
              stroke="#E8E4D8"
              strokeWidth="1.5"
            />

            {/* Heirloom lace border hemline */}
            <path
              d="M95 315 Q135 328 200 328 Q265 328 305 315"
              stroke="#FFFFFF"
              strokeWidth="5"
              strokeDasharray="6 4"
            />
            <path
              d="M95 325 Q135 338 200 338 Q265 338 305 325"
              stroke="#FFFFFF"
              strokeWidth="3"
            />
          </svg>
        );

      case 'leather-mary-jane-shoes':
        return (
          <svg
            viewBox="0 0 400 340"
            className="w-full h-full max-h-[300px] object-contain drop-shadow-sm transition-all duration-300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ground shadow */}
            <ellipse cx="200" cy="275" rx="140" ry="16" fill="#DDD9C6" fillOpacity="0.5" />

            {/* Left Shoe */}
            <g transform="translate(-15, 0)">
              {/* Sole */}
              <path
                d="M100 245 C95 265 140 272 195 268 C220 266 235 255 230 242 C225 230 190 235 150 238 C120 240 102 235 100 245 Z"
                fill="#CFC3AD"
              />
              {/* Shoe Upper */}
              <path
                d="M98 240 C95 210 120 185 160 180 C200 175 228 195 228 235 C228 252 205 256 160 256 C120 256 100 252 98 240 Z"
                fill={swatchHex}
                stroke="#B8AA95"
                strokeWidth="1.5"
              />
              {/* Foot opening */}
              <ellipse cx="175" cy="205" rx="35" ry="15" fill="#F4EFE6" stroke="#D8CEBE" strokeWidth="1" />
              {/* Buckle strap */}
              <path d="M150 200 L185 215" stroke={swatchHex} strokeWidth="9" strokeLinecap="round" />
              <rect x="180" y="210" width="8" height="10" rx="2" fill="#D4AF37" />
              {/* Brogue perforations */}
              <circle cx="120" cy="235" r="1.5" fill="#66594C" fillOpacity="0.4" />
              <circle cx="128" cy="232" r="1.5" fill="#66594C" fillOpacity="0.4" />
              <circle cx="136" cy="235" r="1.5" fill="#66594C" fillOpacity="0.4" />
            </g>

            {/* Right Shoe */}
            <g transform="translate(65, -15)">
              <path
                d="M100 245 C95 265 140 272 195 268 C220 266 235 255 230 242 C225 230 190 235 150 238 C120 240 102 235 100 245 Z"
                fill="#CFC3AD"
              />
              <path
                d="M98 240 C95 210 120 185 160 180 C200 175 228 195 228 235 C228 252 205 256 160 256 C120 256 100 252 98 240 Z"
                fill={swatchHex}
                stroke="#B8AA95"
                strokeWidth="1.5"
              />
              <ellipse cx="175" cy="205" rx="35" ry="15" fill="#F4EFE6" stroke="#D8CEBE" strokeWidth="1" />
              <path d="M150 200 L185 215" stroke={swatchHex} strokeWidth="9" strokeLinecap="round" />
              <rect x="180" y="210" width="8" height="10" rx="2" fill="#D4AF37" />
            </g>
          </svg>
        );

      case 'vintage-linen-romper-set':
        return (
          <svg
            viewBox="0 0 400 340"
            className="w-full h-full max-h-[300px] object-contain drop-shadow-sm transition-all duration-300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ground shadow */}
            <ellipse cx="200" cy="295" rx="100" ry="12" fill="#DDD9C6" fillOpacity="0.5" />

            {/* Ruffle Neck Collar */}
            <path
              d="M160 70 Q200 85 240 70 Q230 95 200 95 Q170 95 160 70 Z"
              fill="#FFFFFF"
              stroke="#D4CEBF"
              strokeWidth="1.5"
            />
            {/* Ruffle edges */}
            <path
              d="M155 72 Q165 60 175 70 Q185 60 195 70 Q205 60 215 70 Q225 60 235 70 Q245 60 250 72"
              stroke="#D4CEBF"
              strokeWidth="1.5"
              fill="none"
            />

            {/* Romper Body */}
            <path
              d="M150 90 L135 180 C135 220 160 260 180 270 L195 220 L205 220 L220 270 C240 260 265 220 265 180 L250 90 Z"
              fill={swatchHex}
              stroke="#BFB5A3"
              strokeWidth="1.5"
            />

            {/* Mother of pearl front buttons */}
            <circle cx="200" cy="115" r="3.5" fill="#FFFFFF" stroke="#D1C8B8" strokeWidth="1" />
            <circle cx="200" cy="140" r="3.5" fill="#FFFFFF" stroke="#D1C8B8" strokeWidth="1" />
            <circle cx="200" cy="165" r="3.5" fill="#FFFFFF" stroke="#D1C8B8" strokeWidth="1" />

            {/* Leg gathering frills */}
            <path d="M165 265 Q180 278 190 265" stroke="#FFFFFF" strokeWidth="2.5" />
            <path d="M210 265 Q220 278 235 265" stroke="#FFFFFF" strokeWidth="2.5" />
          </svg>
        );

      case 'royal-tulle-ball-dress':
        return (
          <svg
            viewBox="0 0 400 360"
            className="w-full h-full max-h-[300px] object-contain drop-shadow-sm transition-all duration-300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ground shadow */}
            <ellipse cx="200" cy="330" rx="140" ry="15" fill="#DDD9C6" fillOpacity="0.5" />

            {/* Hanger */}
            <path d="M188 32 Q200 15 210 28" stroke="#C5A059" strokeWidth="2.5" fill="none" />
            <path d="M150 60 L200 45 L250 60" stroke="#C5A059" strokeWidth="4" strokeLinecap="round" />

            {/* Cap Sleeves */}
            <ellipse cx="145" cy="78" rx="14" ry="18" fill="#FFFFFF" fillOpacity="0.8" />
            <ellipse cx="255" cy="78" rx="14" ry="18" fill="#FFFFFF" fillOpacity="0.8" />

            {/* Sequin Crystal Bodice */}
            <path
              d="M155 70 L145 135 C175 142 225 142 255 135 L245 70 Z"
              fill={swatchHex}
              stroke="#D4CEBF"
              strokeWidth="1.5"
            />
            {/* Little crystal glimmers */}
            <polygon points="200,85 202,91 208,91 203,95 205,101 200,97 195,101 197,95 192,91 198,91" fill="#FFFFFF" />
            <polygon points="175,105 176,109 181,109 177,112 179,116 175,113 171,116 173,112 169,109 174,109" fill="#FFFFFF" />
            <polygon points="225,105 226,109 231,109 227,112 229,116 225,113 221,116 223,112 219,109 224,109" fill="#FFFFFF" />

            {/* High Princess Crinoline Skirt */}
            <path
              d="M145 135 C90 190 60 255 55 320 C120 338 280 338 345 320 C340 255 310 190 255 135 Z"
              fill={swatchHex}
            />

            {/* Shimmering tulle overlays */}
            <path
              d="M145 135 C110 200 85 260 80 310 C140 325 260 325 320 310 C315 260 290 200 255 135 Z"
              fill="#FFFFFF"
              fillOpacity="0.25"
            />

            {/* Ribbon streamers */}
            <path d="M190 138 L170 230" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
            <path d="M210 138 L230 230" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );

      case 'velvet-holiday-gown':
        return (
          <svg
            viewBox="0 0 400 360"
            className="w-full h-full max-h-[300px] object-contain drop-shadow-sm transition-all duration-300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ground shadow */}
            <ellipse cx="200" cy="325" rx="120" ry="14" fill="#DDD9C6" fillOpacity="0.45" />

            {/* Hanger */}
            <path d="M190 32 Q200 15 210 28" stroke="#C5A059" strokeWidth="2.5" fill="none" />
            <path d="M150 58 L200 45 L250 58" stroke="#C5A059" strokeWidth="3.5" strokeLinecap="round" />

            {/* Puff Velvet Sleeves */}
            <circle cx="140" cy="85" r="22" fill={swatchHex} />
            <circle cx="260" cy="85" r="22" fill={swatchHex} />

            {/* White Lace Collar */}
            <path d="M165 62 Q200 85 235 62 Q225 90 200 88 Q175 90 165 62 Z" fill="#FFFFFF" stroke="#E6E2D8" strokeWidth="1.5" />

            {/* Velvet Bodice */}
            <path
              d="M160 70 L150 145 L250 145 L240 70 Z"
              fill={swatchHex}
              stroke="#403A35"
              strokeWidth="1"
            />

            {/* Lustrous Velvet Skirt A-Line */}
            <path
              d="M150 145 C115 210 90 280 85 320 C140 332 260 332 315 320 C310 280 285 210 250 145 Z"
              fill={swatchHex}
            />

            {/* Velvet rich sheen highlight */}
            <path
              d="M185 155 C165 210 150 270 145 315"
              stroke="#FFFFFF"
              strokeWidth="8"
              strokeOpacity="0.12"
              strokeLinecap="round"
            />
          </svg>
        );

      case 't-bar-toddler-shoes':
        return (
          <svg
            viewBox="0 0 400 340"
            className="w-full h-full max-h-[300px] object-contain drop-shadow-sm transition-all duration-300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ground shadow */}
            <ellipse cx="200" cy="275" rx="135" ry="15" fill="#DDD9C6" fillOpacity="0.5" />

            {/* Suede T-Bar Shoe Profile */}
            <g transform="translate(10, 0)">
              {/* Flexible rubber gum sole */}
              <path
                d="M100 245 C95 265 140 272 195 268 C220 266 235 255 230 242 C225 230 190 235 150 238 C120 240 102 235 100 245 Z"
                fill="#8C7A65"
              />
              {/* Suede upper */}
              <path
                d="M98 240 C95 208 120 182 160 178 C200 174 228 195 228 235 C228 252 205 256 160 256 C120 256 100 252 98 240 Z"
                fill={swatchHex}
                stroke="#6B5945"
                strokeWidth="1.5"
              />
              {/* Foot cavity */}
              <ellipse cx="175" cy="202" rx="35" ry="14" fill="#E8DEC8" />
              {/* T-Bar center strap */}
              <line x1="145" y1="218" x2="175" y2="202" stroke={swatchHex} strokeWidth="8" strokeLinecap="round" />
              {/* Ankle cross strap */}
              <path d="M152 195 L190 212" stroke={swatchHex} strokeWidth="8" strokeLinecap="round" />
              {/* Brass buckle */}
              <rect x="185" y="206" width="7" height="9" rx="2" fill="#D4AF37" />
            </g>
          </svg>
        );

      case 'tailored-linen-gentleman-set':
      default:
        return (
          <svg
            viewBox="0 0 400 340"
            className="w-full h-full max-h-[300px] object-contain drop-shadow-sm transition-all duration-300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ground shadow */}
            <ellipse cx="200" cy="295" rx="100" ry="12" fill="#DDD9C6" fillOpacity="0.5" />

            {/* Mandarin Shirt Collar */}
            <path d="M175 55 Q200 68 225 55" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
            <polygon points="190,62 200,75 210,62" fill="#FFFFFF" />

            {/* Double-Breasted Linen Vest */}
            <path
              d="M155 70 L130 185 L270 185 L245 70 Q200 95 155 70 Z"
              fill={swatchHex}
              stroke="#B3A592"
              strokeWidth="1.5"
            />
            {/* Vest lapels */}
            <path d="M155 70 L185 130" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.5" />
            <path d="M245 70 L215 130" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.5" />

            {/* Pocket Kerchief */}
            <polygon points="160,115 168,102 176,115" fill="#FFFFFF" />

            {/* Double-breasted buttons */}
            <circle cx="182" cy="115" r="3" fill="#3B352E" />
            <circle cx="218" cy="115" r="3" fill="#3B352E" />
            <circle cx="182" cy="140" r="3" fill="#3B352E" />
            <circle cx="218" cy="140" r="3" fill="#3B352E" />
            <circle cx="182" cy="165" r="3" fill="#3B352E" />
            <circle cx="218" cy="165" r="3" fill="#3B352E" />

            {/* Tailored Pleated Shorts */}
            <path
              d="M140 188 L130 265 L192 265 L200 215 L208 265 L270 265 L260 188 Z"
              fill={swatchHex}
              stroke="#B3A592"
              strokeWidth="1.5"
            />
          </svg>
        );
    }
  };

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center p-6 bg-gradient-to-b from-[#FBFBFA] via-[#F7F6F2] to-[#F1EFEA] rounded-2xl overflow-hidden select-none transition-all duration-300 ${className}`}
    >
      {/* Studio lighting backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.85)_0%,rgba(240,238,232,0.4)_100%)] pointer-events-none" />

      {/* Small letter age range tag at top of product image without covering image detail */}
      {showAgeTag && (
        <span className="absolute top-2.5 left-2.5 text-[9px] sm:text-[10px] font-medium tracking-tight text-[#525252] bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md shadow-2xs border border-[#E6E4DF]/80 pointer-events-none lowercase z-10">
          age: {getProductAgeRange(product)}
        </span>
      )}

      {/* Active swatch indicator pill */}
      <div className="hidden sm:flex absolute bottom-4 left-4 items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-xs border border-[#E6E4DF] text-[11px] text-[#737373] pointer-events-none shadow-xs">
        <span
          className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
          style={{ backgroundColor: swatchHex }}
        />
        <span className="font-medium text-[#171717]">{swatch.name}</span>
      </div>

      {/* Main product silhouette */}
      <div className="relative z-10 w-full flex items-center justify-center py-2 transition-transform duration-300 hover:scale-[1.03]">
        {renderObjectSvg()}
      </div>
    </div>
  );
};

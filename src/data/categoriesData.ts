export interface SubCategoryItem {
  id: string;
  name: string;
  image: string;
  isHot?: boolean;
  isNew?: boolean;
  parentCategory: string;
  filterTag?: string;
}

export interface MegaCategory {
  id: string;
  name: string;
  subtitle: string;
  allLinkText: string;
  subcategories: SubCategoryItem[];
}

export const KIDS_MEGA_CATEGORIES: MegaCategory[] = [
  {
    id: 'ball-dresses',
    name: 'Ball Dresses',
    subtitle: 'High-volume tulle, 3D blossoms & gala gowns',
    allLinkText: 'All Ball Dresses',
    subcategories: [
      {
        id: 'midnight-rose-flared',
        name: 'Midnight Rose Flared Dresses',
        image: '/assets/products/midnight-gold-rose-dress.jpg',
        isHot: true,
        isNew: true,
        parentCategory: 'Ball Dresses',
      },
      {
        id: 'blush-lace-ball',
        name: 'Blush Lace & Pearl Gowns',
        image: '/assets/products/blush-lace-crystal-gown.jpg',
        isHot: true,
        parentCategory: 'Ball Dresses',
      },
      {
        id: 'royal-pink-rosettes',
        name: 'Royal Pink Rosette Gowns',
        image: '/assets/products/royal-pink-rosette-ball-gown.jpg',
        isHot: true,
        parentCategory: 'Ball Dresses',
      },
      {
        id: 'raspberry-velvet-rose',
        name: 'Raspberry Velvet Rose Dresses',
        image: '/assets/products/raspberry-crimson-rose-dress.jpg',
        isNew: true,
        parentCategory: 'Ball Dresses',
      },
      {
        id: 'scarlet-rose-gala',
        name: 'Scarlet Rose Gala Dresses',
        image: '/assets/products/scarlet-red-black-rose-dress.jpg',
        isHot: true,
        parentCategory: 'Ball Dresses',
      },
      {
        id: 'midnight-magenta-rose',
        name: 'Midnight & Magenta Roses',
        image: '/assets/products/midnight-magenta-rose-dress.jpg',
        isHot: true,
        parentCategory: 'Ball Dresses',
      },
      {
        id: 'aqua-party-dresses',
        name: 'Aqua Floral Party Gowns',
        image: '/assets/products/aqua-bloom-flared-dress.jpg',
        isNew: true,
        parentCategory: 'Ball Dresses',
      },
      {
        id: 'chartreuse-atelier',
        name: 'Chartreuse Rosette Gowns',
        image: '/assets/products/chartreuse-citron-rose-dress.jpg',
        parentCategory: 'Ball Dresses',
      },
      {
        id: 'blossom-pink-crimson',
        name: 'Blossom Pink & Crimson Dresses',
        image: '/assets/products/blossom-pink-crimson-rose-dress.jpg',
        isHot: true,
        parentCategory: 'Ball Dresses',
      },
      {
        id: 'ivory-champagne-ball',
        name: 'Ivory Rosette Ceremonial Gowns',
        image: '/assets/products/ivory-champagne-rosette-gown.jpg',
        parentCategory: 'Ball Dresses',
      },
    ],
  },
  {
    id: 'gowns',
    name: 'Ceremony Gowns',
    subtitle: 'Heirloom christening, dedication & evening gowns',
    allLinkText: 'All Ceremony Gowns',
    subcategories: [
      {
        id: 'christening-gowns',
        name: 'Ivory Rosette Christening Gowns',
        image: '/assets/products/ivory-champagne-rosette-gown.jpg',
        isHot: true,
        parentCategory: 'Gowns',
      },
      {
        id: 'french-lace-gowns',
        name: 'Blush Lace Ceremonial Gowns',
        image: '/assets/products/blush-lace-crystal-gown.jpg',
        isHot: true,
        parentCategory: 'Gowns',
      },
      {
        id: 'scarlet-evening-gowns',
        name: 'Scarlet Satin Gala Gowns',
        image: '/assets/products/scarlet-red-black-rose-dress.jpg',
        isNew: true,
        parentCategory: 'Gowns',
      },
      {
        id: 'royal-pink-ceremony',
        name: 'Royal Pink Cloud Gowns',
        image: '/assets/products/royal-pink-rosette-ball-gown.jpg',
        parentCategory: 'Gowns',
      },
      {
        id: 'aqua-dedication-dresses',
        name: 'Aqua Sky Dedication Dresses',
        image: '/assets/products/aqua-bloom-flared-dress.jpg',
        parentCategory: 'Gowns',
      },
      {
        id: 'midnight-gold-ceremony',
        name: 'Midnight Gold Ceremonial Dresses',
        image: '/assets/products/midnight-gold-rose-dress.jpg',
        parentCategory: 'Gowns',
      },
      {
        id: 'raspberry-ceremony',
        name: 'Raspberry Rose Evening Gowns',
        image: '/assets/products/raspberry-crimson-rose-dress.jpg',
        parentCategory: 'Gowns',
      },
      {
        id: 'chartreuse-ceremony',
        name: 'Chartreuse Silk Rosette Gowns',
        image: '/assets/products/chartreuse-citron-rose-dress.jpg',
        parentCategory: 'Gowns',
      },
      {
        id: 'blossom-pink-ceremony',
        name: 'Blossom Pink Celebration Gowns',
        image: '/assets/products/blossom-pink-crimson-rose-dress.jpg',
        isHot: true,
        parentCategory: 'Gowns',
      },
      {
        id: 'midnight-magenta-ceremony',
        name: 'Midnight Magenta Gala Gowns',
        image: '/assets/products/midnight-magenta-rose-dress.jpg',
        parentCategory: 'Gowns',
      },
    ],
  },
  {
    id: 'shoes',
    name: 'Kids Shoes',
    subtitle: 'Calfskin Mary Janes, T-Bars & ceremony flats',
    allLinkText: 'All Kids Shoes',
    subcategories: [
      {
        id: 'leather-mary-janes',
        name: 'Black Patent Mary Janes',
        image: '/assets/products/midnight-gold-rose-dress.jpg',
        isHot: true,
        parentCategory: 'Shoes',
      },
      {
        id: 'shimmer-pink-shoes',
        name: 'Glitter Rose Mary Janes',
        image: '/assets/products/raspberry-crimson-rose-dress.jpg',
        isHot: true,
        parentCategory: 'Shoes',
      },
      {
        id: 'ivory-ceremony-shoes',
        name: 'Pearl Ivory Flats',
        image: '/assets/products/aqua-bloom-flared-dress.jpg',
        isNew: true,
        parentCategory: 'Shoes',
      },
      {
        id: 'patent-scarlet-pair',
        name: 'Patent Gala Shoes',
        image: '/assets/products/scarlet-red-black-rose-dress.jpg',
        parentCategory: 'Shoes',
      },
      {
        id: 'blush-ceremony-flats',
        name: 'Blush Lace Footwear Pair',
        image: '/assets/products/blush-lace-crystal-gown.jpg',
        parentCategory: 'Shoes',
      },
      {
        id: 'champagne-flats',
        name: 'Champagne Rosette Flats',
        image: '/assets/products/ivory-champagne-rosette-gown.jpg',
        parentCategory: 'Shoes',
      },
      {
        id: 'chartreuse-pair',
        name: 'Citron Satin Footwear',
        image: '/assets/products/chartreuse-citron-rose-dress.jpg',
        parentCategory: 'Shoes',
      },
      {
        id: 'candy-pink-flats',
        name: 'Candy Blossom Shoes',
        image: '/assets/products/blossom-pink-crimson-rose-dress.jpg',
        parentCategory: 'Shoes',
      },
    ],
  },
  {
    id: 'kids-clothing',
    name: 'Kids Clothing',
    subtitle: 'Haute couture flared party dresses & celebration wear',
    allLinkText: 'All Kids Clothing',
    subcategories: [
      {
        id: 'chartreuse-citron-outfits',
        name: 'Chartreuse Rosette Dresses',
        image: '/assets/products/chartreuse-citron-rose-dress.jpg',
        isHot: true,
        parentCategory: 'Kids Clothing',
      },
      {
        id: 'blossom-pink-outfits',
        name: 'Blossom Pink Party Dresses',
        image: '/assets/products/blossom-pink-crimson-rose-dress.jpg',
        isHot: true,
        parentCategory: 'Kids Clothing',
      },
      {
        id: 'aqua-party-sets',
        name: 'Aqua Sky Blossom Dresses',
        image: '/assets/products/aqua-bloom-flared-dress.jpg',
        parentCategory: 'Kids Clothing',
      },
      {
        id: 'midnight-gold-party',
        name: 'Midnight Gold Box-Pleat Sets',
        image: '/assets/products/midnight-gold-rose-dress.jpg',
        isNew: true,
        parentCategory: 'Kids Clothing',
      },
      {
        id: 'scarlet-party-outfits',
        name: 'Scarlet Duchess Satin Dresses',
        image: '/assets/products/scarlet-red-black-rose-dress.jpg',
        parentCategory: 'Kids Clothing',
      },
      {
        id: 'raspberry-party-outfits',
        name: 'Raspberry Velvet Flare Sets',
        image: '/assets/products/raspberry-crimson-rose-dress.jpg',
        parentCategory: 'Kids Clothing',
      },
      {
        id: 'blush-lace-outfits',
        name: 'Blush Lace Butterfly Outfits',
        image: '/assets/products/blush-lace-crystal-gown.jpg',
        parentCategory: 'Kids Clothing',
      },
      {
        id: 'ivory-shimmer-outfits',
        name: 'Ivory Shimmer Ruffle Outfits',
        image: '/assets/products/ivory-champagne-rosette-gown.jpg',
        parentCategory: 'Kids Clothing',
      },
    ],
  },
  {
    id: 'featured-new',
    name: 'Featured & New In',
    subtitle: 'Latest bespoke arrivals, gala collections & seasonal drops',
    allLinkText: 'All Featured & New In',
    subcategories: [
      {
        id: 'couture-midnight-gold',
        name: 'Amara Midnight Rose Flared',
        image: '/assets/products/midnight-gold-rose-dress.jpg',
        isHot: true,
        parentCategory: 'Ball Dresses',
      },
      {
        id: 'couture-blush-pearl',
        name: 'Florence Lace & Pearl Ball Gown',
        image: '/assets/products/blush-lace-crystal-gown.jpg',
        isHot: true,
        parentCategory: 'Ball Dresses',
      },
      {
        id: 'couture-ivory-champagne',
        name: 'Aurora Rosette Ceremonial Gown',
        image: '/assets/products/ivory-champagne-rosette-gown.jpg',
        isNew: true,
        parentCategory: 'Gowns',
      },
      {
        id: 'couture-royal-pink',
        name: 'Seraphina Pink Rosette Ball Gown',
        image: '/assets/products/royal-pink-rosette-ball-gown.jpg',
        isHot: true,
        parentCategory: 'Ball Dresses',
      },
      {
        id: 'couture-scarlet-red',
        name: 'Scarlet Rose & Onyx Flared Dress',
        image: '/assets/products/scarlet-red-black-rose-dress.jpg',
        parentCategory: 'Gowns',
      },
      {
        id: 'couture-raspberry-velvet',
        name: 'Valentina Raspberry Velvet Rose',
        image: '/assets/products/raspberry-crimson-rose-dress.jpg',
        isNew: true,
        parentCategory: 'Ball Dresses',
      },
      {
        id: 'couture-aqua-sky',
        name: 'Aria Aqua Sky & Citron Blossom',
        image: '/assets/products/aqua-bloom-flared-dress.jpg',
        parentCategory: 'Gowns',
      },
      {
        id: 'couture-chartreuse-citron',
        name: 'Celeste Chartreuse Rosette Dress',
        image: '/assets/products/chartreuse-citron-rose-dress.jpg',
        parentCategory: 'Kids Clothing',
      },
      {
        id: 'couture-blossom-pink',
        name: 'Bella Blossom Pink Rosette Dress',
        image: '/assets/products/blossom-pink-crimson-rose-dress.jpg',
        parentCategory: 'Kids Clothing',
      },
      {
        id: 'couture-midnight-magenta',
        name: 'Genevieve Midnight Magenta Dress',
        image: '/assets/products/midnight-magenta-rose-dress.jpg',
        parentCategory: 'Ball Dresses',
      },
    ],
  },
];

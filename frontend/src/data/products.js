// A collection of pristine, guaranteed local ice cream photography URLs
const photoUrls = {
  Dairy: '/images/dairy_vanilla_1785224473676.png',
  Vegan: '/images/vegan_vanilla_1785224484937.png',
  Sorbet: '/images/sorbet_mango_1785224494717.png',
  Specialty: '/images/specialty_lavender_1785224505476.png',
  Chocolate: '/images/chocolate_belgian_1785224517587.png',
  Strawberry: '/images/strawberry_dream_1785224539169.png',
  Mint: '/images/mint_chip_1785224549994.png',
  Cookies: '/images/cookies_cream_1785224559861.png',
  Pecan: '/images/butter_pecan_1785224570337.png',
  Coffee: '/images/coffee_caramel_1785224582329.png',
  Rocky: '/images/rocky_road_1785224600341.png',
  Pistachio: '/images/pistachio_delight_1785224611803.png',
  Cake: '/images/cake_batter_1785224621605.png',
  Matcha: '/images/pistachio_delight_1785224611803.png',
  Cashew: '/images/butter_pecan_1785224570337.png',
  Almond: '/images/butter_pecan_1785224570337.png',
  OatStrawberry: '/images/strawberry_dream_1785224539169.png',
  Milkshake: '/milkshake.png',
  ThickShake: '/thick_shake.png',
};

export const products = [
  // DAIRY (10)
  { id: 1, name: 'Classic Vanilla Bean', category: 'Dairy', rating: 4.8, price: '₹373', image: photoUrls.Dairy, hue: 0 },
  { id: 2, name: 'Belgian Dark Chocolate', category: 'Dairy', rating: 4.9, price: '₹373', image: photoUrls.Chocolate, hue: 0 },
  { id: 3, name: 'Strawberry Dream', category: 'Dairy', rating: 4.7, price: '₹373', image: photoUrls.Strawberry, hue: 0 },
  { id: 4, name: 'Mint Choc Chip', category: 'Dairy', rating: 4.5, price: '₹373', image: photoUrls.Mint, hue: 0 },
  { id: 5, name: 'Cookies n Cream', category: 'Dairy', rating: 4.9, price: '₹373', image: photoUrls.Cookies, hue: 0 },
  { id: 6, name: 'Butter Pecan', category: 'Dairy', rating: 4.6, price: '₹373', image: photoUrls.Pecan, hue: 0 },
  { id: 7, name: 'Coffee Caramel', category: 'Dairy', rating: 4.8, price: '₹373', image: photoUrls.Coffee, hue: 0 },
  { id: 8, name: 'Rocky Road', category: 'Dairy', rating: 4.4, price: '₹373', image: photoUrls.Rocky, hue: 0 },
  { id: 9, name: 'Pistachio Delight', category: 'Dairy', rating: 4.7, price: '₹373', image: photoUrls.Pistachio, hue: 0 },
  { id: 10, name: 'Cake Batter', category: 'Dairy', rating: 4.5, price: '₹373', image: photoUrls.Cake, hue: 0 },

  // VEGAN (10)
  { id: 11, name: 'Oat Milk Vanilla', category: 'Vegan', rating: 4.6, price: '₹415', image: photoUrls.Vegan, hue: 0 },
  { id: 12, name: 'Coconut Matcha', category: 'Vegan', rating: 4.8, price: '₹415', image: photoUrls.Matcha, hue: 0 },
  { id: 13, name: 'Cashew Caramel', category: 'Vegan', rating: 4.7, price: '₹415', image: photoUrls.Cashew, hue: 0 },
  { id: 14, name: 'Almond Butter Crunch', category: 'Vegan', rating: 4.9, price: '₹415', image: photoUrls.Almond, hue: 0 },
  { id: 15, name: 'Oat Milk Strawberry', category: 'Vegan', rating: 4.4, price: '₹415', image: photoUrls.OatStrawberry, hue: 0 },
  { id: 16, name: 'Vegan Mint Chip', category: 'Vegan', rating: 4.5, price: '₹415', image: photoUrls.Mint, hue: -40 },
  { id: 17, name: 'Dark Chocolate Cherry', category: 'Vegan', rating: 4.8, price: '₹415', image: photoUrls.Chocolate, hue: 320 },
  { id: 18, name: 'Coconut Pineapple', category: 'Vegan', rating: 4.6, price: '₹415', image: photoUrls.Vegan, hue: 60 },
  { id: 19, name: 'Vegan Peanut Butter', category: 'Vegan', rating: 4.7, price: '₹415', image: photoUrls.Pecan, hue: -20 },
  { id: 20, name: 'Maple Pecan Oat', category: 'Vegan', rating: 4.5, price: '₹415', image: photoUrls.Coffee, hue: 45 },

  // SORBET (10)
  { id: 21, name: 'Mango Tango', category: 'Sorbet', rating: 4.9, price: '₹332', image: photoUrls.Sorbet, hue: 0 },
  { id: 22, name: 'Raspberry Lemonade', category: 'Sorbet', rating: 4.7, price: '₹332', image: photoUrls.Strawberry, hue: -40 },
  { id: 23, name: 'Passionfruit Paradise', category: 'Sorbet', rating: 4.8, price: '₹332', image: photoUrls.Sorbet, hue: -30 },
  { id: 24, name: 'Blood Orange', category: 'Sorbet', rating: 4.6, price: '₹332', image: photoUrls.Sorbet, hue: -60 },
  { id: 25, name: 'Zesty Lemon', category: 'Sorbet', rating: 4.5, price: '₹332', image: photoUrls.Cake, hue: 30 },
  { id: 26, name: 'Wild Berry', category: 'Sorbet', rating: 4.7, price: '₹332', image: photoUrls.OatStrawberry, hue: -80 },
  { id: 27, name: 'Watermelon Mint', category: 'Sorbet', rating: 4.8, price: '₹332', image: photoUrls.Mint, hue: 140 },
  { id: 28, name: 'Pineapple Basil', category: 'Sorbet', rating: 4.4, price: '₹332', image: photoUrls.Matcha, hue: 60 },
  { id: 29, name: 'Peach Cobbler Sorbet', category: 'Sorbet', rating: 4.6, price: '₹332', image: photoUrls.Cashew, hue: -25 },
  { id: 30, name: 'Grapefruit Campari', category: 'Sorbet', rating: 4.7, price: '₹332', image: photoUrls.Sorbet, hue: 30 },

  // SPECIALTY (10)
  { id: 31, name: 'Lavender Honey', category: 'Specialty', rating: 4.9, price: '₹498', image: photoUrls.Specialty, hue: 0 },
  { id: 32, name: 'Salted Caramel Truffle', category: 'Specialty', rating: 5.0, price: '₹498', image: photoUrls.Cashew, hue: 20 },
  { id: 33, name: 'Bourbon Pecan Pie', category: 'Specialty', rating: 4.8, price: '₹498', image: photoUrls.Pecan, hue: 10 },
  { id: 34, name: 'Earl Grey Tea', category: 'Specialty', rating: 4.7, price: '₹498', image: photoUrls.Coffee, hue: -20 },
  { id: 35, name: 'Saffron Pistachio', category: 'Specialty', rating: 4.9, price: '₹498', image: photoUrls.Pistachio, hue: 30 },
  { id: 36, name: 'Rosewater Cardamom', category: 'Specialty', rating: 4.6, price: '₹498', image: photoUrls.Specialty, hue: 200 },
  { id: 37, name: 'Black Sesame', category: 'Specialty', rating: 4.8, price: '₹498', image: photoUrls.Rocky, hue: -180 },
  { id: 38, name: 'Matcha White Chocolate', category: 'Specialty', rating: 4.7, price: '₹498', image: photoUrls.Matcha, hue: -20 },
  { id: 39, name: 'Balsamic Strawberry', category: 'Specialty', rating: 4.5, price: '₹498', image: photoUrls.Strawberry, hue: -20 },
  { id: 40, name: 'Tiramisu Gelato', category: 'Specialty', rating: 4.9, price: '₹498', image: photoUrls.Coffee, hue: 15 },

  // MILKSHAKES (5)
  { id: 41, name: 'Classic Chocolate Shake', category: 'Milkshake', rating: 4.8, price: '₹250', image: photoUrls.Milkshake, hue: 0 },
  { id: 42, name: 'Strawberry Blast', category: 'Milkshake', rating: 4.6, price: '₹250', image: photoUrls.Milkshake, hue: -40 },
  { id: 43, name: 'Vanilla Bean Shake', category: 'Milkshake', rating: 4.5, price: '₹250', image: photoUrls.Milkshake, hue: 180 },
  { id: 44, name: 'Caramel Macchiato Shake', category: 'Milkshake', rating: 4.7, price: '₹280', image: photoUrls.Milkshake, hue: 45 },
  { id: 45, name: 'Cookies & Cream Shake', category: 'Milkshake', rating: 4.9, price: '₹280', image: photoUrls.Milkshake, hue: -90 },

  // THICK SHAKES (5)
  { id: 46, name: 'Nutella Brownie Thick Shake', category: 'Thick Shake', rating: 5.0, price: '₹350', image: photoUrls.ThickShake, hue: 0 },
  { id: 47, name: 'Oreo Overload', category: 'Thick Shake', rating: 4.8, price: '₹350', image: photoUrls.ThickShake, hue: 180 },
  { id: 48, name: 'Mango Indulgence', category: 'Thick Shake', rating: 4.7, price: '₹320', image: photoUrls.ThickShake, hue: 240 },
  { id: 49, name: 'Peanut Butter Fudge', category: 'Thick Shake', rating: 4.9, price: '₹350', image: photoUrls.ThickShake, hue: -30 },
  { id: 50, name: 'Red Velvet Thick Shake', category: 'Thick Shake', rating: 4.6, price: '₹350', image: photoUrls.ThickShake, hue: 300 },

  // MORE SPECIALS (5)
  { id: 51, name: 'Gold Leaf Saffron Sundae', category: 'Specialty', rating: 5.0, price: '₹750', image: photoUrls.Specialty, hue: -40 },
  { id: 52, name: 'Dragonfruit Lychee', category: 'Specialty', rating: 4.8, price: '₹550', image: photoUrls.Vegan, hue: 280 },
  { id: 53, name: 'Blueberry Cheesecake Scoop', category: 'Specialty', rating: 4.9, price: '₹500', image: photoUrls.Strawberry, hue: -120 },
  { id: 54, name: 'Hazelnut Praline', category: 'Specialty', rating: 4.7, price: '₹500', image: photoUrls.Cashew, hue: 0 },
  { id: 55, name: 'Avocado Honey Magic', category: 'Specialty', rating: 4.6, price: '₹550', image: photoUrls.Mint, hue: 30 },
];

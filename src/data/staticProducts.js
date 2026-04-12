/**
 * Static Fallback Data for Cream Dream
 * This ensures the site is NEVER empty, even without a backend connection.
 */

export const STATIC_PRODUCTS = [
  // DAIRY
  { id: 'd1', name: 'Classic Vanilla Bean', category: 'Dairy', rating: 4.8, price: '₹373', image: '/dairy.png', hue: 0 },
  { id: 'd2', name: 'Belgian Dark Chocolate', category: 'Dairy', rating: 4.9, price: '₹373', image: '/belgian_dark_chocolate.png', hue: 0 },
  { id: 'd3', name: 'Strawberry Dream', category: 'Dairy', rating: 4.7, price: '₹373', image: '/strawberry_dream.png', hue: 0 },
  { id: 'd4', name: 'Mint Choc Chip', category: 'Dairy', rating: 4.5, price: '₹373', image: '/mint_choc_chip.png', hue: 0 },
  { id: 'd5', name: 'Cookies n Cream', category: 'Dairy', rating: 4.9, price: '₹373', image: '/cookies_n_cream.png', hue: 0 },
  { id: 'd6', name: 'Butter Pecan', category: 'Dairy', rating: 4.6, price: '₹373', image: '/butter_pecan.png', hue: 0 },
  { id: 'd7', name: 'Coffee Caramel', category: 'Dairy', rating: 4.8, price: '₹373', image: '/coffee_caramel.png', hue: 0 },
  { id: 'd8', name: 'Rocky Road', category: 'Dairy', rating: 4.4, price: '₹373', image: '/rocky_road.png', hue: 0 },
  { id: 'd9', name: 'Pistachio Delight', category: 'Dairy', rating: 4.7, price: '₹373', image: '/pistachio_delight.png', hue: 0 },
  { id: 'd10', name: 'Cake Batter', category: 'Dairy', rating: 4.5, price: '₹373', image: '/cake_batter.png', hue: 0 },

  // VEGAN
  { id: 'v1', name: 'Oat Milk Vanilla', category: 'Vegan', rating: 4.6, price: '₹415', image: '/vegan.png', hue: 0 },
  { id: 'v2', name: 'Coconut Matcha', category: 'Vegan', rating: 4.8, price: '₹415', image: '/coconut_matcha.png', hue: 0 },
  { id: 'v3', name: 'Cashew Caramel', category: 'Vegan', rating: 4.7, price: '₹415', image: '/cashew_caramel.png', hue: 0 },
  { id: 'v4', name: 'Almond Butter Crunch', category: 'Vegan', rating: 4.9, price: '₹415', image: '/almond_butter_crunch.png', hue: 0 },
  { id: 'v5', name: 'Oat Milk Strawberry', category: 'Vegan', rating: 4.4, price: '₹415', image: '/oat_milk_strawberry.png', hue: 0 },
  { id: 'v6', name: 'Vegan Mint Chip', category: 'Vegan', rating: 4.5, price: '₹415', image: '/mint_choc_chip.png', hue: -40 },
  { id: 'v7', name: 'Dark Chocolate Cherry', category: 'Vegan', rating: 4.8, price: '₹415', image: '/belgian_dark_chocolate.png', hue: 320 },
  { id: 'v8', name: 'Coconut Pineapple', category: 'Vegan', rating: 4.6, price: '₹415', image: '/vegan.png', hue: 60 },
  { id: 'v9', name: 'Vegan Peanut Butter', category: 'Vegan', rating: 4.7, price: '₹415', image: '/butter_pecan.png', hue: -20 },
  { id: 'v10', name: 'Maple Pecan Oat', category: 'Vegan', rating: 4.5, price: '₹415', image: '/coffee_caramel.png', hue: 45 },

  // SORBET
  { id: 's1', name: 'Mango Tango', category: 'Sorbet', rating: 4.9, price: '₹332', image: '/sorbet.png', hue: 0 },
  { id: 's2', name: 'Raspberry Lemonade', category: 'Sorbet', rating: 4.7, price: '₹332', image: '/strawberry_dream.png', hue: -40 },
  { id: 's3', name: 'Passionfruit Paradise', category: 'Sorbet', rating: 4.8, price: '₹332', image: '/sorbet.png', hue: -30 },
  { id: 's4', name: 'Blood Orange', category: 'Sorbet', rating: 4.6, price: '₹332', image: '/sorbet.png', hue: -60 },
  { id: 's5', name: 'Zesty Lemon', category: 'Sorbet', rating: 4.5, price: '₹332', image: '/cake_batter.png', hue: 30 },
  { id: 's6', name: 'Wild Berry', category: 'Sorbet', rating: 4.7, price: '₹332', image: '/oat_milk_strawberry.png', hue: -80 },
  { id: 's7', name: 'Watermelon Mint', category: 'Sorbet', rating: 4.8, price: '₹332', image: '/mint_choc_chip.png', hue: 140 },
  { id: 's8', name: 'Pineapple Basil', category: 'Sorbet', rating: 4.4, price: '₹332', image: '/coconut_matcha.png', hue: 60 },
  { id: 's9', name: 'Peach Cobbler Sorbet', category: 'Sorbet', rating: 4.6, price: '₹332', image: '/cashew_caramel.png', hue: -25 },
  { id: 's10', name: 'Grapefruit Campari', category: 'Sorbet', rating: 4.7, price: '₹332', image: '/sorbet.png', hue: 30 },

  // SPECIALTY
  { id: 'sp1', name: 'Lavender Honey', category: 'Specialty', rating: 4.9, price: '₹498', image: '/specialty.png', hue: 0 },
  { id: 'sp2', name: 'Salted Caramel Truffle', category: 'Specialty', rating: 5.0, price: '₹498', image: '/cashew_caramel.png', hue: 20 },
  { id: 'sp3', name: 'Bourbon Pecan Pie', category: 'Specialty', rating: 4.8, price: '₹498', image: '/butter_pecan.png', hue: 10 },
  { id: 'sp4', name: 'Earl Grey Tea', category: 'Specialty', rating: 4.7, price: '₹498', image: '/coffee_caramel.png', hue: -20 },
  { id: 'sp5', name: 'Saffron Pistachio', category: 'Specialty', rating: 4.9, price: '₹498', image: '/pistachio_delight.png', hue: 30 },
  { id: 'sp6', name: 'Rosewater Cardamom', category: 'Specialty', rating: 4.6, price: '₹498', image: '/specialty.png', hue: 200 },
  { id: 'sp7', name: 'Black Sesame', category: 'Specialty', rating: 4.8, price: '₹498', image: '/rocky_road.png', hue: -180 },
  { id: 'sp8', name: 'Matcha White Chocolate', category: 'Specialty', rating: 4.7, price: '₹498', image: '/coconut_matcha.png', hue: -20 },
  { id: 'sp9', name: 'Balsamic Strawberry', category: 'Specialty', rating: 4.5, price: '₹498', image: '/strawberry_dream.png', hue: -20 },
  { id: 'sp10', name: 'Tiramisu Gelato', category: 'Specialty', rating: 4.9, price: '₹498', image: '/coffee_caramel.png', hue: 15 },
  { id: 'sp11', name: 'Gold Leaf Saffron Sundae', category: 'Specialty', rating: 5.0, price: '₹750', image: '/specialty.png', hue: -40 },
  { id: 'sp12', name: 'Dragonfruit Lychee', category: 'Specialty', rating: 4.8, price: '₹550', image: '/vegan.png', hue: 280 },
  { id: 'sp13', name: 'Blueberry Cheesecake Scoop', category: 'Specialty', rating: 4.9, price: '₹500', image: '/strawberry_dream.png', hue: -120 },
  { id: 'sp14', name: 'Hazelnut Praline', category: 'Specialty', rating: 4.7, price: '₹500', image: '/cashew_caramel.png', hue: 0 },
  { id: 'sp15', name: 'Avocado Honey Magic', category: 'Specialty', rating: 4.6, price: '₹550', image: '/mint_choc_chip.png', hue: 30 },

  // MILKSHAKES
  { id: 'm1', name: 'Classic Chocolate Shake', category: 'Milkshake', rating: 4.8, price: '₹250', image: '/milkshake.png', hue: 0 },
  { id: 'm2', name: 'Strawberry Blast', category: 'Milkshake', rating: 4.6, price: '₹250', image: '/milkshake.png', hue: -40 },
  { id: 'm3', name: 'Vanilla Bean Shake', category: 'Milkshake', rating: 4.5, price: '₹250', image: '/milkshake.png', hue: 180 },
  { id: 'm4', name: 'Caramel Macchiato Shake', category: 'Milkshake', rating: 4.7, price: '₹280', image: '/milkshake.png', hue: 45 },
  { id: 'm5', name: 'Cookies & Cream Shake', category: 'Milkshake', rating: 4.9, price: '₹280', image: '/milkshake.png', hue: -90 },

  // THICK SHAKES
  { id: 't1', name: 'Nutella Brownie Thick Shake', category: 'Thick Shake', rating: 5.0, price: '₹350', image: '/thick_shake.png', hue: 0 },
  { id: 't2', name: 'Oreo Overload', category: 'Thick Shake', rating: 4.8, price: '₹350', image: '/thick_shake.png', hue: 180 },
  { id: 't3', name: 'Mango Indulgence', category: 'Thick Shake', rating: 4.7, price: '₹320', image: '/thick_shake.png', hue: 240 },
  { id: 't4', name: 'Peanut Butter Fudge', category: 'Thick Shake', rating: 4.9, price: '₹350', image: '/thick_shake.png', hue: -30 },
  { id: 't5', name: 'Red Velvet Thick Shake', category: 'Thick Shake', rating: 4.6, price: '₹350', image: '/thick_shake.png', hue: 300 }
];

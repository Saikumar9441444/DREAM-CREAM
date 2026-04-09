const fs = require('fs');
const path = require('path');

const files = [
  'src/data/products.js',
  'src/context/CartContext.jsx',
  'src/components/CartSidebar.jsx',
  'src/pages/Orders.jsx',
  'src/components/Footer.jsx',
  'src/pages/About.jsx'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (file === 'src/data/products.js') {
    // Replace all $ prices. Let's do $4.50 * 83 ≈ 373
    content = content.replace(/\$(\d+\.\d+)/g, (match, p1) => {
      const inr = Math.floor(parseFloat(p1) * 83);
      return `₹${inr}`;
    });
  }
  
  if (file === 'src/context/CartContext.jsx') {
    content = content.replace(/'\$'/g, "'₹'");
    content = content.replace(/"\$4\.50"/g, '"₹373"');
  }

  if (file === 'src/components/CartSidebar.jsx') {
    content = content.replace(/\$\{cartTotalPrice/g, '₹${cartTotalPrice');
  }

  if (file === 'src/pages/Orders.jsx') {
    content = content.replace(/\$\{cartTotalPrice/g, '₹${cartTotalPrice');
    content = content.replace(/\$\{taxAmount/g, '₹${taxAmount');
    content = content.replace(/\$\{finalTotal/g, '₹${finalTotal');
    content = content.replace(/\$3\.99/g, '₹50');
    content = content.replace(/\$0 Pickup/g, '₹0 Pickup');
  }

  if (file === 'src/components/Footer.jsx' || file === 'src/pages/About.jsx') {
    content = content.replace(/123 Sweet Street/, 'MG Road');
    content = content.replace(/Creamville, CA 90210/, 'Nellore, Andhra Pradesh');
  }

  fs.writeFileSync(filePath, content, 'utf8');
});
console.log('Done');

import Jimp from 'jimp';

const files = [
  { in: 'C:\\Users\\saiku\\.gemini\\antigravity\\brain\\4545dea2-41b7-4f82-979f-e08f9e0659ca\\cherry_icon_1775629967614.png', out: 'public\\cherry.png' },
  { in: 'C:\\Users\\saiku\\.gemini\\antigravity\\brain\\4545dea2-41b7-4f82-979f-e08f9e0659ca\\mixed_nuts_icon_1775629999044.png', out: 'public\\mixed_nuts.png' },
  { in: 'C:\\Users\\saiku\\.gemini\\antigravity\\brain\\4545dea2-41b7-4f82-979f-e08f9e0659ca\\scoop_icon_1775630013356.png', out: 'public\\scoop.png' }
];

async function removeBackground() {
  for (const file of files) {
    try {
      const image = await Jimp.read(file.in);
      
      // We will loop through all pixels and set the white ones to transparent
      image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
        const r = this.bitmap.data[idx + 0];
        const g = this.bitmap.data[idx + 1];
        const b = this.bitmap.data[idx + 2];
        
        // Pure or near pure white
        if (r > 240 && g > 240 && b > 240) {
          this.bitmap.data[idx + 3] = 0; // Alpha
        }
      });
      
      await image.writeAsync(file.out);
      console.log(`Processed ${file.out}`);
    } catch (e) {
      console.error(e);
    }
  }
}

removeBackground();

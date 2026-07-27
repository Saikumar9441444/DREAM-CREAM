const DEFAULT_CATEGORIES = [
  'Dairy',
  'Vegan',
  'Sorbet',
  'Specialty',
  'Milkshake',
  'Thick Shake'
];

export const getCategories = () => {
  const cached = localStorage.getItem('dream_cream_categories_db');
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      const cleaned = parsed.filter(c => c !== 'All Flavors');
      if (cleaned.length !== parsed.length) {
        localStorage.setItem('dream_cream_categories_db', JSON.stringify(cleaned));
      }
      return cleaned;
    } catch (e) {
      console.error('Failed to parse categories cache', e);
    }
  }
  
  // Initialize with default categories if empty
  localStorage.setItem('dream_cream_categories_db', JSON.stringify(DEFAULT_CATEGORIES));
  return DEFAULT_CATEGORIES;
};

export const addCategory = (categoryName) => {
  const categories = getCategories();
  if (categories.includes(categoryName)) {
    throw new Error('Category already exists');
  }
  
  const updated = [...categories, categoryName];
  localStorage.setItem('dream_cream_categories_db', JSON.stringify(updated));
  return updated;
};

export const deleteCategory = (categoryName) => {
  const categories = getCategories();
  const updated = categories.filter(c => c !== categoryName);
  localStorage.setItem('dream_cream_categories_db', JSON.stringify(updated));
  return updated;
};

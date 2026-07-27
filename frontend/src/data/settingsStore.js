const DEFAULT_SETTINGS = {
  storeName: 'Cream Dream',
  whatsappNumber: '919014002314',
  openingTime: '10:00 AM',
  closingTime: '10:00 PM',
  status: 'Open' // 'Open' or 'Closed'
};

export const getSettings = () => {
  const cached = localStorage.getItem('dream_cream_settings_db');
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      console.error('Failed to parse settings cache', e);
    }
  }
  
  // Initialize with default settings if empty
  localStorage.setItem('dream_cream_settings_db', JSON.stringify(DEFAULT_SETTINGS));
  return DEFAULT_SETTINGS;
};

export const saveSettings = (newSettings) => {
  localStorage.setItem('dream_cream_settings_db', JSON.stringify(newSettings));
  return newSettings;
};

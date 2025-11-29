import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const EXCHANGE_RATE = 278; // 1 USD = 278 PKR (approximate)

const useCurrencyStore = create(
  persist(
    (set, get) => ({
      currency: 'PKR', // Default to PKR
      isDetecting: true,

      // Detect user's country based on timezone or IP
      detectCurrency: async () => {
        try {
          // Method 1: Check timezone
          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          if (timezone.includes('Karachi') || timezone.includes('Pakistan')) {
            set({ currency: 'PKR', isDetecting: false });
            return;
          }

          // Method 2: Use a free IP geolocation API
          const response = await fetch('https://ipapi.co/json/');
          const data = await response.json();
          
          if (data.country_code === 'PK') {
            set({ currency: 'PKR', isDetecting: false });
          } else {
            set({ currency: 'USD', isDetecting: false });
          }
        } catch (error) {
          console.error('Currency detection failed:', error);
          // Default to PKR on error
          set({ currency: 'PKR', isDetecting: false });
        }
      },

      // Manual currency toggle
      setCurrency: (currency) => set({ currency }),

      // Format price based on current currency
      formatPrice: (usdPrice) => {
        const { currency } = get();
        if (currency === 'PKR') {
          const pkrPrice = usdPrice * EXCHANGE_RATE;
          return `Rs ${pkrPrice.toLocaleString('en-PK')}`;
        }
        return `$${usdPrice.toFixed(2)}`;
      },

      // Get currency symbol
      getCurrencySymbol: () => {
        const { currency } = get();
        return currency === 'PKR' ? 'Rs' : '$';
      }
    }),
    {
      name: 'currency-storage',
    }
  )
);

export default useCurrencyStore;

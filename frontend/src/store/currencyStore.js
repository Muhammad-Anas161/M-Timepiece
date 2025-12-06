import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCurrencyStore = create(
  persist(
    (set, get) => ({
      currency: 'PKR',
      symbol: 'Rs ',
      rate: 1,
      country: 'PK',
      
      setCurrency: (code) => {
        if (code === 'PKR') {
          set({ currency: 'PKR', symbol: 'Rs ', rate: 1, country: 'PK' });
        } else {
          set({ currency: 'USD', symbol: '$', rate: 0.0036, country: 'US' });
        }
      },
      
      initCurrency: async () => {
        try {
          // If already set and not default, maybe skip? 
          // But user might travel. Let's fetch every time for now or depend on session.
          // For now, let's fetch always on app start.
          
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
          const res = await fetch(`${API_URL}/location`);
          
          if (!res.ok) {
            throw new Error(`Location API error: ${res.status}`);
          }
          
          const data = await res.json();
          
          set({
            currency: data.currency,
            symbol: data.symbol,
            rate: data.rate,
            country: data.country
          });
        } catch (error) {
          console.error('Error initializing currency:', error);
          // Fallback to PKR default if error
          set({ currency: 'PKR', symbol: 'Rs ', rate: 1, country: 'PK' });
        }
      },

      formatPrice: (price) => {
        const { currency, symbol, rate } = get();
        if (!price) return `${symbol}0`;
        
        const convertedPrice = price * rate;
        
        // Formatting logic
        if (currency === 'PKR') {
          return `${symbol}${new Intl.NumberFormat('en-PK').format(Math.round(convertedPrice))}`;
        } else {
          return `${symbol}${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(convertedPrice)}`;
        }
      }
    }),
    {
      name: 'currency-storage',
      partialize: (state) => ({ currency: state.currency, symbol: state.symbol, rate: state.rate, country: state.country }), // Persist these fields
    }
  )
);

export default useCurrencyStore;

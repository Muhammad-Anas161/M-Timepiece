import React, { useEffect } from 'react';
import useCurrencyStore from '../store/currencyStore';

const CurrencySwitcher = () => {
  const { currency, setCurrency } = useCurrencyStore();

  // Detection is handled in App.jsx


  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setCurrency('PKR')}
        className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
          currency === 'PKR'
            ? 'bg-gray-900 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        PKR
      </button>
      <button
        onClick={() => setCurrency('USD')}
        className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
          currency === 'USD'
            ? 'bg-gray-900 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        USD
      </button>
    </div>
  );
};

export default CurrencySwitcher;

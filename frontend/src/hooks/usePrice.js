import useCurrencyStore from '../store/currencyStore';

const usePrice = () => {
  const { formatPrice, getCurrencySymbol, currency } = useCurrencyStore();

  return {
    formatPrice,
    getCurrencySymbol,
    currency
  };
};

export default usePrice;

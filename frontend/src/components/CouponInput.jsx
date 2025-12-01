import React, { useState } from 'react';
import { Tag, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const CouponInput = ({ orderTotal, onCouponApplied }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const handleApply = async () => {
    if (!code.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const response = await fetch(`${API_URL}/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, orderTotal })
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        setAppliedCoupon(data.coupon);
        onCouponApplied(data.coupon);
        toast.success(`Coupon applied! You saved PKR ${data.coupon.discount_amount.toFixed(2)}`);
      } else {
        toast.error(data.message || 'Invalid coupon code');
      }
    } catch (error) {
      toast.error('Failed to apply coupon');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setAppliedCoupon(null);
    setCode('');
    onCouponApplied(null);
    toast.success('Coupon removed');
  };

  if (appliedCoupon) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="text-green-600" size={20} />
            <div>
              <p className="font-medium text-green-900">
                Coupon "{appliedCoupon.code}" applied
              </p>
              <p className="text-sm text-green-700">
                You saved PKR {appliedCoupon.discount_amount.toFixed(2)}
              </p>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="text-green-600 hover:text-green-800 p-1"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Tag className="text-gray-400" size={20} />
        <span className="font-medium text-gray-900">Have a coupon code?</span>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter code"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 uppercase"
          onKeyPress={(e) => e.key === 'Enter' && handleApply()}
        />
        <button
          onClick={handleApply}
          disabled={loading || !code.trim()}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Applying...' : 'Apply'}
        </button>
      </div>
    </div>
  );
};

export default CouponInput;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Award, Gift, History, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

import { API_URL } from '../../services/api';

const LoyaltyPoints = () => {
  const { user } = useAuth();
  const [points, setPoints] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);

  useEffect(() => {
    fetchLoyaltyData();
  }, [user]);

  const fetchLoyaltyData = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      // Pass userId in query since we might not have global auth header set up in fetch wrapper yet
      // In a real app, useAuth should provide an authenticated fetch or token
      const response = await fetch(`${API_URL}/loyalty?userId=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPoints(data.points);
        setHistory(data.history);
      }
    } catch (error) {
      console.error('Error fetching loyalty data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (amount) => {
    if (points < amount) {
      toast.error('Insufficient points');
      return;
    }

    if (!confirm(`Are you sure you want to redeem ${amount} points for a PKR ${amount} discount coupon?`)) {
      return;
    }

    setRedeeming(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const response = await fetch(`${API_URL}/loyalty/redeem`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId: user.id, pointsToRedeem: amount })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Redeemed! Your coupon code is: ${data.coupon.code}`);
        fetchLoyaltyData(); // Refresh points
        // Copy to clipboard
        navigator.clipboard.writeText(data.coupon.code);
        toast.success('Coupon code copied to clipboard!');
      } else {
        toast.error(data.message || 'Redemption failed');
      }
    } catch (error) {
      toast.error('Redemption failed');
    } finally {
      setRedeeming(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading loyalty data...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-indigo-100 font-medium mb-1">Available Balance</p>
            <h1 className="text-4xl font-bold flex items-center gap-2">
              <Award className="text-yellow-300" size={36} />
              {points} Points
            </h1>
            <p className="mt-4 text-sm text-indigo-100 bg-white/10 inline-block px-3 py-1 rounded-full">
              10 Points = PKR 10 Discount
            </p>
          </div>
          <div className="hidden md:block">
            <Gift size={80} className="text-white/20" />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Rewards Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Gift className="text-indigo-600" size={20} />
            Redeem Rewards
          </h2>
          <div className="space-y-4">
            {[100, 500, 1000].map((amount) => (
              <div key={amount} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-indigo-100 transition-colors">
                <div>
                  <p className="font-bold text-gray-900">PKR {amount} Coupon</p>
                  <p className="text-sm text-gray-500">{amount} Points</p>
                </div>
                <button
                  onClick={() => handleRedeem(amount)}
                  disabled={points < amount || redeeming}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    points >= amount
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Redeem
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* History Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <History className="text-indigo-600" size={20} />
            Point History
          </h2>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {history.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No history yet</p>
            ) : (
              history.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{item.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`font-bold ${item.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.points > 0 ? '+' : ''}{item.points}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyPoints;

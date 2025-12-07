import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Mail, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import CouponInput from '../components/CouponInput';
import usePrice from '../hooks/usePrice';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { formatPrice } = usePrice();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    street: '',
    city: '',
    zip: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const finalTotal = appliedCoupon 
    ? cartTotal - appliedCoupon.discount_amount 
    : cartTotal;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create order in backend first
      await createOrder({
        customer: {
          name: formData.name,
          email: formData.email,
          paymentMethod: paymentMethod,
        },
        address: {
          street: formData.street,
          city: formData.city,
          zip: formData.zip,
        },
        items: cartItems,
        total: finalTotal,
        coupon: appliedCoupon?.code,
      });
      
      clearCart();

      /*
      // Handle different payment methods
      if (paymentMethod === 'WhatsApp') {
        const message = `Hi, I would like to place an order.\n\nName: ${formData.name}\nTotal: ${formatPrice(cartTotal)}\nItems:\n${cartItems.map(item => `- ${item.name} (x${item.quantity})`).join('\n')}`;
        const whatsappUrl = `https://wa.me/923123637833?text=${encodeURIComponent(message)}`;
        window.location.href = whatsappUrl;
        toast.success('Redirecting to WhatsApp...');
      } else if (paymentMethod === 'Bank Transfer') {
      */
     
      // Unified Success Handler
      if (paymentMethod === 'WhatsApp') {
        const message = `Hi, I would like to place an order.\n\nName: ${formData.name}\nTotal: ${formatPrice(finalTotal)}\nItems:\n${cartItems.map(item => `- ${item.name} (x${item.quantity})`).join('\n')}`;
        const whatsappUrl = `https://wa.me/923123637833?text=${encodeURIComponent(message)}`;
        
        toast.success('Order placed! Redirecting to WhatsApp...');
        // Small delay to allow toast to show
        setTimeout(() => {
          window.location.href = whatsappUrl;
        }, 1500);
        
      } else if (paymentMethod === 'Bank Transfer') {
        toast.success(`Order Placed! Check email for details.`);
        navigate('/');
      } else {
        toast.success('Order placed successfully!');
        navigate('/');
      }
    } catch (error) {
      console.error('Checkout failed', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <button 
            onClick={() => navigate('/')}
            className="text-indigo-600 hover:text-indigo-500"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12 pt-24 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>
        
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          {/* Order Summary */}
          <div className="mt-10 lg:mt-0 lg:col-start-2">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Order summary</h2>
            <div className="mt-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm transition-colors duration-200">
              <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                {cartItems.map((product) => (
                  <li key={product.id} className="flex py-6 px-4 sm:px-6">
                    <div className="flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 rounded-md object-center object-cover"
                      />
                    </div>
                    <div className="ml-6 flex-1 flex flex-col">
                      <div className="flex">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm">
                            <a href="#" className="font-medium text-gray-700 dark:text-gray-200 hover:text-gray-800">
                              {product.name}
                            </a>
                          </h4>
                        </div>
                      </div>
                      <div className="flex-1 pt-2 flex items-end justify-between">
                        <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{formatPrice(product.price)}</p>
                        <div className="ml-4">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Qty {product.quantity}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <dl className="border-t border-gray-200 dark:border-gray-700 py-6 px-4 space-y-6 sm:px-6">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600 dark:text-gray-300">Subtotal</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">{formatPrice(cartTotal)}</dd>
                </div>
                {appliedCoupon && (
                  <div className="flex items-center justify-between text-green-600 dark:text-green-400">
                    <dt className="text-sm">Discount ({appliedCoupon.code})</dt>
                    <dd className="text-sm font-medium">-{formatPrice(appliedCoupon.discount_amount)}</dd>
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-6">
                  <dt className="text-base font-medium text-gray-900 dark:text-white">Total</dt>
                  <dd className="text-base font-medium text-gray-900 dark:text-white">{formatPrice(finalTotal)}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="mt-10 lg:mt-0 lg:col-start-1">
            <form onSubmit={handleSubmit}>
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="bg-white dark:bg-gray-800 py-6 px-4 space-y-6 sm:p-6 transition-colors duration-200">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Contact Information</h3>
                    <div className="mt-6 grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="col-span-6">
                        <label htmlFor="street" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Street address</label>
                        <input
                          type="text"
                          name="street"
                          id="street"
                          required
                          value={formData.street}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
                        <input
                          type="text"
                          name="city"
                          id="city"
                          required
                          value={formData.city}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="zip" className="block text-sm font-medium text-gray-700 dark:text-gray-300">ZIP / Postal code</label>
                        <input
                          type="text"
                          name="zip"
                          id="zip"
                          required
                          value={formData.zip}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Selection */}
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Payment Method</h3>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center">
                        <input
                          id="credit-card"
                          name="paymentMethod"
                          type="radio"
                          checked={paymentMethod === 'Credit Card'}
                          onChange={() => setPaymentMethod('Credit Card')}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                        />
                        <label htmlFor="credit-card" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                          <CreditCard className="mr-2 h-5 w-5 text-gray-400" />
                          Credit Card (Online)
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="bank-transfer"
                          name="paymentMethod"
                          type="radio"
                          checked={paymentMethod === 'Bank Transfer'}
                          onChange={() => setPaymentMethod('Bank Transfer')}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                        />
                        <label htmlFor="bank-transfer" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                          <Mail className="mr-2 h-5 w-5 text-gray-400" />
                          Bank Transfer (Email Screenshot)
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="whatsapp"
                          name="paymentMethod"
                          type="radio"
                          checked={paymentMethod === 'WhatsApp'}
                          onChange={() => setPaymentMethod('WhatsApp')}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                        />
                        <label htmlFor="whatsapp" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                          <MessageCircle className="mr-2 h-5 w-5 text-gray-400" />
                          WhatsApp Order
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Coupon Input */}
                  <div className="mt-6">
                    <CouponInput 
                      orderTotal={cartTotal} 
                      onCouponApplied={setAppliedCoupon}
                    />
                  </div>

                </div>
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 text-right sm:px-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {loading ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

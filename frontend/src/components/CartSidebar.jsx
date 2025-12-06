import React from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import usePrice from '../hooks/usePrice';

const CartSidebar = () => {
  const { 
    cartItems, 
    isCartOpen, 
    toggleCart, 
    removeFromCart, 
    updateQuantity, 
    cartTotal 
  } = useCart();
  const { formatPrice } = usePrice();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={toggleCart} />
      
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
        <div className="pointer-events-auto w-screen max-w-md transform transition ease-in-out duration-500 sm:duration-700">
          <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium text-gray-900">Shopping cart</h2>
                <div className="ml-3 flex h-7 items-center">
                  <button
                    type="button"
                    className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                    onClick={toggleCart}
                  >
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Close panel</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="mt-8">
                <div className="flow-root">
                  {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-12">
                      <ShoppingBag className="h-12 w-12 text-gray-300 mb-4" />
                      <p className="text-gray-500">Your cart is empty</p>
                      <button 
                        onClick={toggleCart}
                        className="mt-4 text-indigo-600 hover:text-indigo-500 font-medium"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  ) : (
                    <ul role="list" className="-my-6 divide-y divide-gray-200">
                      {cartItems.map((product) => (
                        <li key={product.id} className="flex py-6">
                          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>

                          <div className="ml-4 flex flex-1 flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>
                                  <a href="#">{product.name}</a>
                                </h3>
                                <p className="ml-4">{formatPrice(product.price * product.quantity)}</p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">{product.features?.split('\n')[0]}</p>
                            </div>
                            <div className="flex flex-1 items-end justify-between text-sm">
                              <div className="flex items-center border border-gray-300 rounded-md">
                                <button 
                                  onClick={() => updateQuantity(product.id, product.quantity - 1)}
                                  className="p-1 hover:bg-gray-100"
                                >
                                  <Minus className="h-4 w-4 text-gray-500" />
                                </button>
                                <span className="px-2 text-gray-900">{product.quantity}</span>
                                <button 
                                  onClick={() => updateQuantity(product.id, product.quantity + 1)}
                                  className="p-1 hover:bg-gray-100"
                                >
                                  <Plus className="h-4 w-4 text-gray-500" />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeFromCart(product.id)}
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                   <p>Subtotal</p>
                   <p>{formatPrice(cartTotal)}</p>
                  </div>
                <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                <div className="mt-6">
                  <Link
                    to="/checkout"
                    onClick={toggleCart}
                    className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                  >
                    Checkout
                  </Link>
                </div>
                <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                  <p>
                    or{' '}
                    <button
                      type="button"
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                      onClick={toggleCart}
                    >
                      Continue Shopping
                      <span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;

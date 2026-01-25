export const API_URL = import.meta.env.MODE === 'production' 
  ? 'https://additional-carolee-vertexadigital-6d8b2d03.koyeb.app/api' // Primary stable backend
  : 'http://localhost:3000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'API request failed');
    
    // Normalize IDs (_id -> id)
    const normalize = (obj) => {
      if (Array.isArray(obj)) return obj.map(normalize);
      if (obj && typeof obj === 'object') {
        if (obj._id && !obj.id) obj.id = obj._id;
        Object.keys(obj).forEach(key => obj[key] = normalize(obj[key]));
      }
      return obj;
    };

    return normalize(data);
  }
  
  // Not JSON (likely HTML error page)
  const text = await response.text();
  console.error('API Error - Expected JSON but got:', text.substring(0, 200));
  console.error('Response Status:', response.status, response.statusText);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  throw new Error('Invalid API response: Expected JSON but received HTML. Check your VITE_API_URL.');
};

export const login = async (username, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse(response);
};

export const getProducts = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_URL}/products?${query}`);
  return handleResponse(response);
};

export const getProductById = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`);
  return handleResponse(response);
};

export const addProduct = async (productData) => {
  const headers = getHeaders();
  const isFormData = productData instanceof FormData;
  
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: headers,
    body: isFormData ? productData : JSON.stringify(productData),
  });
  return handleResponse(response);
};

export const updateProduct = async (id, productData) => {
  const headers = getHeaders();
  const isFormData = productData instanceof FormData;
  
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: headers,
    body: isFormData ? productData : JSON.stringify(productData),
  });
  return handleResponse(response);
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return handleResponse(response);
};

export const getOrders = async () => {
  const response = await fetch(`${API_URL}/orders`, {
    headers: getHeaders(),
  });
  return handleResponse(response);
};

export const createOrder = async (orderData) => {
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  return handleResponse(response);
};

export const getProductReviews = async (productId) => {
  const response = await fetch(`${API_URL}/reviews/product/${productId}`);
  return handleResponse(response);
};

export const addProductReview = async (reviewData) => {
  const response = await fetch(`${API_URL}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData),
  });
  return handleResponse(response);
};

// Backup & Restore
export const exportProducts = async () => {
  const response = await fetch(`${API_URL}/products/export`, {
    headers: getHeaders(),
  });
  return handleResponse(response);
};

export const importProducts = async (products) => {
  const response = await fetch(`${API_URL}/products/import`, {
    method: 'POST',
    headers: { 
      ...getHeaders(),
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify({ products }),
  });
  return handleResponse(response);
};
export const subscribeNewsletter = async (email) => {
  const res = await fetch(`${API_URL}/newsletter/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  return res.json();
};

export const sendChatMessage = async (message, history = []) => {
  const res = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'AI Chat failed');
  return data;
};

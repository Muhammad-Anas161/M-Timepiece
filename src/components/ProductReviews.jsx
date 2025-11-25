import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ average_rating: 0, review_count: 0 });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    user_name: '',
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/products/${productId}/reviews`);
      const data = await response.json();
      setReviews(data.reviews);
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setFormData({ user_name: '', rating: 5, comment: '' });
        setShowForm(false);
        fetchReviews();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const renderStars = (rating, interactive = false, onRate = null) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            } ${interactive ? 'cursor-pointer' : ''}`}
            onClick={() => interactive && onRate && onRate(star)}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  return (
    <div className="mt-16 border-t border-gray-200 pt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
      
      {/* Review Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center mb-2">
              <span className="text-4xl font-bold text-gray-900 mr-3">
                {stats.average_rating.toFixed(1)}
              </span>
              {renderStars(Math.round(stats.average_rating))}
            </div>
            <p className="text-sm text-gray-600">Based on {stats.review_count} reviews</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Write a Review
          </button>
        </div>
      </div>

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Write Your Review</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
            <input
              type="text"
              required
              value={formData.user_name}
              onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            {renderStars(formData.rating, true, (rating) => setFormData({ ...formData, rating }))}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
            <textarea
              rows="4"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Share your experience with this product..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Submit Review
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900">{review.user_name}</p>
                  {renderStars(review.rating)}
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
              {review.comment && (
                <p className="text-gray-700 mt-2">{review.comment}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductReviews;

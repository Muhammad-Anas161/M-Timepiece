import React, { useState } from 'react';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent! We will get back to you shortly.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="bg-white min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-serif font-bold text-gray-900">Contact Us</h1>
          <p className="mt-4 text-lg text-gray-500">We'd love to hear from you. Send us a message or visit our boutique.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="bg-gray-50 p-8 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Get in Touch</h3>
            <div className="space-y-4 text-gray-600">
              <p>
                <strong className="block text-gray-900">Address:</strong>
                123 Luxury Lane, Watch District<br />
                New York, NY 10001
              </p>
              <p>
                <strong className="block text-gray-900">Email:</strong>
                support@watchjunction.com
              </p>
              <p>
                <strong className="block text-gray-900">Phone:</strong>
                +1 (555) 123-4567
              </p>
              <p>
                <strong className="block text-gray-900">Hours:</strong>
                Mon-Fri: 10am - 7pm<br />
                Sat-Sun: 11am - 5pm
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  name="message"
                  id="message"
                  rows="4"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

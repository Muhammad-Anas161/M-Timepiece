import React, { useState } from 'react';
import { Mail, Phone, MapPin, Instagram, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just open WhatsApp with the message
    const message = `Name: ${formData.name}%0AEmail: ${formData.email}%0APhone: ${formData.phone}%0AMessage: ${formData.message}`;
    window.open(`https://wa.me/923171067090?text=${message}`, '_blank');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-white min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-gray-600">We'd love to hear from you. Send us a message!</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0300-1234567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                <Send size={20} />
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Phone className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">WhatsApp</h3>
                    <a 
                      href="https://wa.me/923171067090" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-indigo-600"
                    >
                      0317-1067090
                    </a>
                    <p className="text-sm text-gray-500 mt-1">Available 24/7</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-pink-100 rounded-lg">
                    <Instagram className="text-pink-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Instagram</h3>
                    <a 
                      href="https://www.instagram.com/m_timepiece1/" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-indigo-600"
                    >
                      @m_timepiece1
                    </a>
                    <p className="text-sm text-gray-500 mt-1">Follow for updates & offers</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Mail className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                    <a 
                      href="mailto:support@mtimepiece.com" 
                      className="text-gray-600 hover:text-indigo-600"
                    >
                      support@mtimepiece.com
                    </a>
                    <p className="text-sm text-gray-500 mt-1">We'll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <MapPin className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Location</h3>
                    <p className="text-gray-600">Pakistan</p>
                    <p className="text-sm text-gray-500 mt-1">Nationwide delivery available</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">Business Hours</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Monday - Saturday</span>
                  <span className="font-medium">10:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-medium">12:00 PM - 6:00 PM</span>
                </div>
              </div>
              <p className="text-sm opacity-90 mt-4">
                WhatsApp support available 24/7
              </p>
            </div>

            {/* FAQ Link */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-2">Have a Question?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Check out our FAQ page for quick answers to common questions.
              </p>
              <a 
                href="/faq" 
                className="inline-block px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm"
              >
                View FAQ
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

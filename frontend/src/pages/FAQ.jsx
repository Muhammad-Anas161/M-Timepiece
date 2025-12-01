import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: 'Orders & Shipping',
      questions: [
        {
          q: 'How long does delivery take?',
          a: 'We deliver nationwide within 3-5 business days. Major cities like Karachi, Lahore, and Islamabad typically receive orders within 2-3 days.'
        },
        {
          q: 'Do you offer Cash on Delivery (COD)?',
          a: 'Yes! We offer COD across Pakistan. You can pay when you receive your order.'
        },
        {
          q: 'What are the shipping charges?',
          a: 'Shipping is FREE on orders above Rs. 2,999. For orders below that, a flat Rs. 150 shipping fee applies.'
        },
        {
          q: 'Can I track my order?',
          a: 'Absolutely! Once your order ships, you\'ll receive a tracking ID via SMS and email. You can track it on our Order Tracking page.'
        }
      ]
    },
    {
      category: 'Returns & Exchanges',
      questions: [
        {
          q: 'What is your return policy?',
          a: 'We offer a 7-day return policy for defective or damaged items. The watch must be unused and in original packaging.'
        },
        {
          q: 'How do I return a product?',
          a: 'Contact our WhatsApp support (0317-1067090) with your order number and reason for return. We\'ll guide you through the process.'
        },
        {
          q: 'Can I exchange my watch?',
          a: 'Yes, exchanges are available within 7 days for defective items or if you received the wrong product.'
        },
        {
          q: 'Who pays for return shipping?',
          a: 'If the product is defective or we sent the wrong item, we cover return shipping. For other returns, shipping costs are borne by the customer.'
        }
      ]
    },
    {
      category: 'Products & Authenticity',
      questions: [
        {
          q: 'Are all watches authentic?',
          a: '100% yes! We only sell authentic watches. Every product comes with a warranty card and authenticity guarantee.'
        },
        {
          q: 'Do watches come with warranty?',
          a: 'Yes, all watches come with manufacturer warranty. Warranty period varies by brand (typically 6-12 months).'
        },
        {
          q: 'Are the watches water-resistant?',
          a: 'Water resistance varies by model. Check the product specifications for each watch. Most have at least 3 ATM (30m) resistance.'
        },
        {
          q: 'Can I see the watch before buying?',
          a: 'We don\'t have a physical showroom yet, but we provide detailed photos and videos. You can also order with COD to inspect before payment.'
        }
      ]
    },
    {
      category: 'Payment & Pricing',
      questions: [
        {
          q: 'What payment methods do you accept?',
          a: 'We accept Cash on Delivery (COD), bank transfer, and online payment methods.'
        },
        {
          q: 'Are prices negotiable?',
          a: 'Our prices are already competitive and fixed. However, we run regular sales and promotions—follow us on Instagram @m_timepiece1 for updates!'
        },
        {
          q: 'Do you offer discounts for bulk orders?',
          a: 'Yes! For bulk orders (5+ watches), please contact us on WhatsApp for special pricing.'
        }
      ]
    }
  ];

  const toggleFAQ = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-600">Find answers to common questions about M Timepiece</p>
        </div>

        <div className="space-y-8">
          {faqs.map((category, catIndex) => (
            <div key={catIndex}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{category.category}</h2>
              <div className="space-y-3">
                {category.questions.map((faq, qIndex) => {
                  const index = `${catIndex}-${qIndex}`;
                  const isOpen = openIndex === index;
                  
                  return (
                    <div key={qIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleFAQ(catIndex, qIndex)}
                        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900">{faq.q}</span>
                        {isOpen ? (
                          <ChevronUp className="text-gray-500 flex-shrink-0" size={20} />
                        ) : (
                          <ChevronDown className="text-gray-500 flex-shrink-0" size={20} />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                          <p className="text-gray-600">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-indigo-50 rounded-xl p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Still have questions?</h3>
          <p className="text-gray-600 mb-6">We're here to help! Contact us anytime.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/923171067090"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              WhatsApp: 0317-1067090
            </a>
            <a
              href="https://www.instagram.com/m_timepiece1/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Instagram: @m_timepiece1
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;

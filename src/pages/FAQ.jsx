import React from 'react';

const FAQ = () => {
  const faqs = [
    {
      question: "What is the warranty on watches?",
      answer: "We offer a 7-day checking warranty on all watches. If you find any functional defect within 7 days of delivery, we will replace it."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order is shipped, you will receive an email with a tracking number and a link to track your package."
    }
  ];

  return (
    <div className="bg-white min-h-screen pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h1>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
              <p className="mt-2 text-gray-500">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;

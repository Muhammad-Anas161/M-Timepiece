import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description }) => {
  return (
    <Helmet>
      <title>{title ? `${title} | Watch Junction` : 'Watch Junction - Luxury Timepieces'}</title>
      <meta name="description" content={description || 'Discover our collection of premium timepieces designed for the modern individual.'} />
    </Helmet>
  );
};

export default SEO;

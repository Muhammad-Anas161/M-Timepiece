import React from 'react';
import SEO from '../components/SEO';

// Home Sections
import Hero from '../components/home/Hero';
import Categories from '../components/home/Categories';
import TrendingSlider from '../components/home/TrendingSlider';
import FlashSale from '../components/home/FlashSale';
import TrustSection from '../components/home/TrustSection';
import Reviews from '../components/home/Reviews';
import InstagramFeed from '../components/home/InstagramFeed';

const Home = () => {
  return (
    <>
      <SEO 
        title="M Timepiece | Premium Multi-Brand Watch Store" 
        description="Discover our curated collection of premium watches. From classic elegance to modern smart technology. Every Style. Every Budget."
      />
      
      <Hero />
      <TrustSection />
      <Categories />
      <TrendingSlider />
      <FlashSale />
      <Reviews />
      <InstagramFeed />
    </>
  );
};

export default Home;

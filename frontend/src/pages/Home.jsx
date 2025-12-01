import React from 'react';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartSidebar from '../components/CartSidebar';

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
      <Navbar />
      <CartSidebar />
      <main className="overflow-hidden">
        <Hero />
        <TrustSection />
        <Categories />
        <TrendingSlider />
        <FlashSale />
        <Reviews />
        <InstagramFeed />
      </main>
      <Footer />
    </>
  );
};

export default Home;

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartSidebar from '../components/CartSidebar';
import AIChatbot from '../components/AIChatbot';

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <CartSidebar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <AIChatbot />
    </>
  );
};

export default MainLayout;

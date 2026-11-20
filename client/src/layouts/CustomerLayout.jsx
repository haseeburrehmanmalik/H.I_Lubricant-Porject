import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Toast from '../components/common/Toast';

const CustomerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#090909] text-[#F5F2EA]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toast />
    </div>
  );
};

export default CustomerLayout;

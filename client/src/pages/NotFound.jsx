import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-[#141414] border border-[#D7AD55]/40 flex items-center justify-center text-[#D7AD55] shadow-gold-sm">
        <AlertTriangle size={36} />
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-4xl font-extrabold text-[#F5F2EA]">404 – Page Not Found</h1>
        <p className="text-xs sm:text-sm text-[#A5A19A]">
          The page or lubricant product you are searching for does not exist or has been relocated.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link to="/" className="px-6 py-3 rounded-xl btn-gold text-xs font-bold">
          Return to Home
        </Link>
        <Link
          to="/shop"
          className="px-6 py-3 rounded-xl bg-[#141414] border border-[#292722] text-xs font-semibold text-[#F5F2EA] hover:border-[#D7AD55]"
        >
          Browse Shop Products
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

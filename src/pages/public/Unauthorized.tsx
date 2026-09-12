import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldOff, ArrowLeft } from 'lucide-react';

export const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-screen bg-cricket-dark flex flex-col items-center justify-center px-4">
      <ShieldOff size={64} className="text-red-500 mb-6" />
      <h1 className="text-3xl font-extrabold text-white mb-2">Access Denied</h1>
      <p className="text-gray-400 text-center max-w-md mb-8">
        You do not have permission to access this page. Please contact an administrator if you believe this is an error.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-cricket-gold text-cricket-dark font-bold rounded-lg hover:bg-cricket-gold-light transition-colors"
      >
        <ArrowLeft size={18} /> Back to Home
      </Link>
    </div>
  );
};

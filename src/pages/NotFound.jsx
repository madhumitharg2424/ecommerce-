import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            404
          </h1>
        </div>
        
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            What would you like to do?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/"
              className="flex flex-col items-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
            >
              <Home className="h-8 w-8 text-blue-600 mb-2" />
              <span className="font-medium text-gray-900">Go Home</span>
            </Link>
            
            <Link
              to="/shop"
              className="flex flex-col items-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
            >
              <Search className="h-8 w-8 text-blue-600 mb-2" />
              <span className="font-medium text-gray-900">Browse Shop</span>
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="flex flex-col items-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
            >
              <ArrowLeft className="h-8 w-8 text-blue-600 mb-2" />
              <span className="font-medium text-gray-900">Go Back</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl"
          >
            <Home className="h-5 w-5" />
            <span>Return to Home</span>
          </Link>
          
          <p className="text-sm text-gray-500">
            Need help? Contact us at{' '}
            <a href="mailto:hello@casamr.com" className="text-blue-600 hover:text-blue-700">
              hello@casamr.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
import React from 'react';
import ShopGrid from '../components/ShopGrid';
import { mockProducts } from '../data/mockProducts';

const Shop = () => {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Shop Home Décor
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our complete collection of premium home décor items. From elegant lighting to stunning wall art, find everything you need to create your perfect space.
          </p>
        </div>

        {/* Shop Grid */}
        <ShopGrid products={mockProducts} />
      </div>
    </div>
  );
};

export default Shop;
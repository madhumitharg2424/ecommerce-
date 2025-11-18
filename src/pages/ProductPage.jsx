import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import ProductDetails from '../components/ProductDetails';
import ProductCard from '../components/ProductCard';
import { mockProducts } from '../data/mockProducts';

const ProductPage = () => {
  const { id } = useParams();
  const product = mockProducts.find(p => p.id === parseInt(id));

  if (!product) {
    return <Navigate to="/shop" replace />;
  }

  // Get related products from the same category
  const relatedProducts = mockProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <a href="/" className="hover:text-blue-600 transition-colors duration-200">Home</a>
            <span>/</span>
            <a href="/shop" className="hover:text-blue-600 transition-colors duration-200">Shop</a>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </nav>

        {/* Product Details */}
        <ProductDetails product={product} />

        {/* Reviews Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
          
          <div className="space-y-6">
            {[
              {
                name: "Jennifer Walsh",
                rating: 5,
                date: "2 weeks ago",
                comment: "Absolutely love this piece! The quality is outstanding and it looks even better in person. Highly recommend!",
                helpful: 12
              },
              {
                name: "David Kim",
                rating: 4,
                date: "1 month ago",
                comment: "Great product overall. Shipping was fast and packaging was excellent. Very satisfied with my purchase.",
                helpful: 8
              },
              {
                name: "Maria Santos",
                rating: 5,
                date: "2 months ago",
                comment: "Perfect addition to my living room. The color matches exactly what I expected from the photos. Will definitely shop here again!",
                helpful: 15
              }
            ].map((review, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900">{review.name}</span>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${
                            i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <p className="text-gray-700 mb-3 leading-relaxed">{review.comment}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <button className="hover:text-blue-600 transition-colors duration-200">
                    Helpful ({review.helpful})
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map(relatedProduct => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
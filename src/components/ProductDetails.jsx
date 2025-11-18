import React, { useState } from 'react';
import { Star, ShoppingCart, Heart, Share2, Minus, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';  // ⭐ MAKE SURE THIS IS IMPORTED
window.dispatchEvent(new Event("cart-updated"));
const ProductDetails = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const productImages = product.images || [product.image];


  // ⭐ STAR RENDERER
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  // ⭐ QUANTITY HANDLER
  const handleQuantityChange = (type) => {
    if (type === "increase") setQuantity((prev) => prev + 1);
    if (type === "decrease" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  // ⭐ ADD TO CART WORKING FUNCTION
  const handleAddToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(
      (item) => item.id === product.id && item.size === selectedSize
    );

    if (existing) {
      existing.quantity += quantity;

      toast.success("Updated quantity in cart ❤️");
    } else {
      cart.push({
        ...product,
        size: selectedSize,
        quantity: quantity,
        image: product.image, 
      });

      toast.success("Added to cart 🛒✨");
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* ---------- PRODUCT IMAGES ---------- */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-2xl shadow-lg">
            <img
              src={productImages[selectedImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {productImages.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square border-2 rounded-lg overflow-hidden ${
                    selectedImageIndex === index
                      ? "border-blue-600 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-blue-400"
                  }`}
                >
                  <img src={image} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ---------- PRODUCT INFO ---------- */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-lg text-blue-600">{product.category}</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex">{renderStars(product.rating)}</div>
            <span className="text-gray-600">
              {product.rating} out of 5 ({product.reviews} reviews)
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-4xl font-bold text-blue-600">${product.price}</span>
            {product.originalPrice && (
              <>
                <span className="text-2xl text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                  {Math.round(
                    ((product.originalPrice - product.price) / product.originalPrice) * 100
                  )}% OFF
                </span>
              </>
            )}
          </div>

          <p className="text-gray-600">{product.description}</p>

          {/* ---------- SIZE SELECT ---------- */}
          {product.sizes && (
            <div>
              <h3 className="font-semibold mb-2">Size</h3>
              <div className="flex gap-3 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 rounded-lg border ${
                      selectedSize === size
                        ? "border-blue-600 bg-blue-50 text-blue-600"
                        : "border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ---------- QUANTITY ---------- */}
          <div>
            <h3 className="font-semibold mb-2">Quantity</h3>
            <div className="flex items-center border rounded-lg w-max">
              <button
                onClick={() => handleQuantityChange("decrease")}
                className="p-3"
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </button>

              <span className="px-6 py-3 font-semibold">{quantity}</span>

              <button onClick={() => handleQuantityChange("increase")} className="p-3">
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* ---------- ACTION BUTTONS ---------- */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-lg flex items-center justify-center space-x-2 shadow-lg hover:bg-blue-700"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Add to Cart</span>
            </button>

            <button className="border-2 border-gray-300 py-4 px-6 rounded-lg flex items-center space-x-2 hover:border-blue-400 hover:text-blue-600">
              <Heart className="h-5 w-5" />
              <span>Wishlist</span>
            </button>

            <button className="border-2 border-gray-300 py-4 px-6 rounded-lg flex items-center space-x-2 hover:border-blue-400 hover:text-blue-600">
              <Share2 className="h-5 w-5" />
              <span>Share</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

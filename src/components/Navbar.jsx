import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, Home, MessageCircle } from "lucide-react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const location = useLocation();
  const session = useSession();
  const supabase = useSupabaseClient();

  // Detect active route
  const isActive = (path) => location.pathname === path;

  // Toggle mobile menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // ⭐ Update cart count from localStorage
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(total);
  };

  // ⭐ Run on mount + when custom event fires
  useEffect(() => {
    updateCartCount();

    window.addEventListener("cart-updated", updateCartCount);
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("cart-updated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-lg z-50 border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-2 rounded-lg">
              <Home className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              CASA M&R
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/") ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              Home
            </Link>

            <Link
              to="/chat"
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 ${
                isActive("/chat") ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <MessageCircle className="h-4 w-4" /> AI Chat
            </Link>

            <Link
              to="/shop"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/shop") ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              Shop
            </Link>

            {/* ⭐ CART WITH BADGE */}
            <Link
              to="/cart"
              className={`relative px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 ${
                isActive("/cart") ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Cart</span>

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              to="/upload"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/upload") ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              AI Upload
            </Link>

            <Link
              to="/about"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/about") ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              About Us
            </Link>

            <Link
              to="/checkout"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700"
            >
              Checkout
            </Link>

            {!session ? (
              <Link
                to="/auth"
                className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-blue-100">
            <div className="px-3 py-3 space-y-1 bg-white">

              <Link
                to="/"
                onClick={toggleMenu}
                className={`block px-3 py-2 rounded-md ${
                  isActive("/") ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-blue-50"
                }`}
              >
                Home
              </Link>

              <Link
                to="/chat"
                onClick={toggleMenu}
                className={`block px-3 py-2 rounded-md ${
                  isActive("/chat") ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-blue-50"
                }`}
              >
                AI Chat
              </Link>

              <Link
                to="/shop"
                onClick={toggleMenu}
                className={`block px-3 py-2 rounded-md ${
                  isActive("/shop") ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-blue-50"
                }`}
              >
                Shop
              </Link>

              {/* ⭐ Mobile Cart with badge */}
              <Link
                to="/cart"
                onClick={toggleMenu}
                className={`relative block px-3 py-2 rounded-md ${
                  isActive("/cart") ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-blue-50"
                }`}
              >
                Cart
                {cartCount > 0 && (
                  <span className="absolute top-2 right-4 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link
                to="/upload"
                onClick={toggleMenu}
                className={`block px-3 py-2 rounded-md ${
                  isActive("/upload") ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-blue-50"
                }`}
              >
                AI Upload
              </Link>

              <Link
                to="/about"
                onClick={toggleMenu}
                className={`block px-3 py-2 rounded-md ${
                  isActive("/about") ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-blue-50"
                }`}
              >
                About Us
              </Link>

              <Link
                to="/checkout"
                onClick={toggleMenu}
                className="block bg-blue-600 text-white px-4 py-2 rounded-lg text-center mt-2"
              >
                Checkout
              </Link>

              {!session ? (
                <Link
                  to="/auth"
                  onClick={toggleMenu}
                  className="block bg-green-600 text-white px-4 py-2 rounded-lg text-center mt-2"
                >
                  Login
                </Link>
              ) : (
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="block w-full bg-red-600 text-white px-4 py-2 rounded-lg mt-2"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

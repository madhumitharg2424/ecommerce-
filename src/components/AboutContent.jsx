import React from 'react';
import { Heart, Users, Award, Truck, Shield, Sparkles } from 'lucide-react';

const AboutContent = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          About CASA M&R
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          We're passionate about transforming houses into homes through carefully curated décor that reflects your unique style and personality.
        </p>
      </div>

      {/* Story Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
          <div className="prose prose-lg text-gray-600">
            <p>
              Founded in 2020 by María and Roberto, CASA M&R began as a dream to make beautiful, 
              high-quality home décor accessible to everyone. What started as a small collection 
              of handpicked items has grown into a comprehensive destination for home styling.
            </p>
            <p>
              Our mission is simple: to help you create spaces that inspire, comfort, and reflect 
              who you are. Every piece in our collection is carefully selected for its quality, 
              design, and ability to transform a space.
            </p>
          </div>
        </div>
        <div className="relative">
          <img
            src="https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Our founders"
            className="w-full h-96 object-cover rounded-2xl shadow-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Passion</h3>
            <p className="text-gray-600">
              We're passionate about design and helping you create spaces you love coming home to.
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <Award className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Quality</h3>
            <p className="text-gray-600">
              Every item is carefully selected for its craftsmanship, durability, and timeless appeal.
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Community</h3>
            <p className="text-gray-600">
              We believe in building relationships and supporting our customers' design journeys.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Free Shipping</h3>
            <p className="text-gray-600">
              Free shipping on all orders over $100. Fast, reliable delivery to your door.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">30-Day Returns</h3>
            <p className="text-gray-600">
              Not satisfied? Return any item within 30 days for a full refund.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Visualization</h3>
            <p className="text-gray-600">
              See how items will look in your space with our innovative AI technology.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-3xl text-white p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Get in Touch</h2>
            <p className="text-blue-100 leading-relaxed">
              Have questions about our products or need design advice? We'd love to help you 
              create the perfect space.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Heart className="h-5 w-5" />
                </div>
                <span>hello@casamr.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Users className="h-5 w-5" />
                </div>
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <img
              src="https://images.pexels.com/photos/1571471/pexels-photo-1571471.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Contact us"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutContent;
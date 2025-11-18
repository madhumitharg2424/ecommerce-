import React, { useState } from "react";
import { Upload, Camera, Sparkles } from "lucide-react";

export default function UploadForm() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResultUrl, setAiResultUrl] = useState(null);

  // Handle image selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Submit to backend for AI transformation
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || !selectedProduct) {
      alert("Please upload an image and select a product.");
      return;
    }

    setIsProcessing(true);
    setAiResultUrl(null);

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("product", selectedProduct);

    try {
      // 👇 Change URL if your backend runs on different port
      const response = await fetch("http://localhost:5000/api/edit-room", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.image) {
        // Display AI generated image (base64 data URL)
        setAiResultUrl(`data:image/png;base64,${data.image}`);
      } else {
        alert("Failed to generate AI image. Please try again.");
      }
    } catch (error) {
      console.error("Error generating AI image:", error);
      alert("Something went wrong with the AI generation.");
    } finally {
      setIsProcessing(false);
    }
  };

  const products = [
    "Modern Floor Lamp",
    "Abstract Wall Art",
    "Velvet Accent Chair",
    "Persian Style Rug",
    "Decorative Vase",
    "Wooden Coffee Table",
    "Floating Shelves",
    "Throw Pillows",
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-6 py-3 rounded-full mb-6">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <span className="text-blue-800 font-medium">
            AI-Powered Room Visualization
          </span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          See Your Room Transformed ✨
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload your room photo and choose a decor item. Our AI will visualize
          your space with a modern touch!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Upload Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Camera className="h-6 w-6 text-blue-600" />
              Upload Room Photo
            </h2>

            <label
              htmlFor="room-upload"
              className={`block border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 transition-colors duration-200 ${
                previewUrl ? "bg-blue-50" : "bg-gray-50"
              }`}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Room preview"
                  className="max-w-full h-52 object-cover rounded-lg shadow-md mx-auto"
                />
              ) : (
                <div className="space-y-4">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                  <p className="text-lg font-semibold text-gray-700">
                    Drop or click to upload your room photo
                  </p>
                </div>
              )}
              <input
                type="file"
                id="room-upload"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Product Selection */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-blue-600" />
              Select a Product
            </h2>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a product...</option>
              {products.map((product) => (
                <option key={product} value={product}>
                  {product}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={!selectedFile || !selectedProduct || isProcessing}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Processing..." : "Generate AI Visualization"}
          </button>
        </div>

        {/* Result Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            AI-Generated Preview
          </h2>
          {isProcessing ? (
            <p className="text-gray-600">⏳ Processing your image...</p>
          ) : aiResultUrl ? (
            <div>
              <p className="text-blue-600 font-semibold mb-2">
                Here’s your AI-generated room 👇
              </p>
              <img
                src={aiResultUrl}
                alt="AI generated"
                className="max-w-full rounded-lg shadow-md mx-auto mt-4"
              />
            </div>
          ) : (
            <p className="text-gray-500">
              Upload a photo and choose a product to get started.
            </p>
          )}
        </div>
      </form>
    </div>
  );
} 
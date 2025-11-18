import React from 'react';
import UploadForm from '../components/UploadForm';

const Upload = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <UploadForm />
      </div>
    </div>
  );
};

export default Upload;
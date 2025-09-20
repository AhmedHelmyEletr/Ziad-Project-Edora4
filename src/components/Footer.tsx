import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-white text-gray-800 py-4 mt-8 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
        <p>&copy; {currentYear} جميع الحقوق محفوظة إيدورا</p>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';
import logo from '../../assets/logo.png';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-orange-200 h-20 flex items-center px-6 z-20 relative">
      <div className="flex items-center">
        <img src={logo} alt="Karpagam College of Engineering" className="h-14 object-contain" />
      </div>
    </header>
  );
};

export default Header;

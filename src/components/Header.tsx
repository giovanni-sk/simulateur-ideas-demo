import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import userIcon from '../assets/user-icon.svg';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Direction Générale des Impôts" className="h-16" />
        </Link>
        <div className="flex items-center">
          <img src={userIcon} alt="User profile" className="h-10 w-10" />
        </div>
      </div>
      <div className="bg-[#006B6B] py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-white text-4xl font-bold">Simulateur</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
// InfoNotice.tsx
import React, { useState } from 'react';
import infoIcon from '../assets/info-icon.svg';

interface InfoNoticeProps {
  title: string;
  children: React.ReactNode;
}

const InfoNotice: React.FC<InfoNoticeProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Empêche le comportement par défaut
    e.stopPropagation(); // Empêche la propagation de l'événement
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-4">
      <button 
        className="text-[#0087A6] flex items-center font-medium hover:underline focus:outline-none"
        onClick={handleClick}
      >
        <img src={infoIcon} alt="Information" className="h-6 w-6 mr-2" />
        {title}
      </button>
      {isOpen && (
        <div className="bg-[#e6f7f8] p-4 mt-2 rounded-md text-sm">
          {children}
        </div>
      )}
    </div>
  );
};

export default InfoNotice;
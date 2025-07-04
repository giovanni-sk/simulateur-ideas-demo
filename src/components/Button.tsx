import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  to?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  type = 'button',
  variant = 'primary',
  onClick,
  to,
  children
}) => {
  const baseClasses = "px-6 py-3 rounded-md text-white font-medium focus:outline-none transition duration-200";
  const variantClasses = {
    primary: "bg-[#006B6B] hover:bg-[#005555]",
    secondary: "bg-gray-600 hover:bg-gray-700"
  };

  const classes = `${baseClasses} ${variantClasses[variant]}`;

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
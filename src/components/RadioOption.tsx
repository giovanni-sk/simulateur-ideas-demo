import React from 'react';

interface RadioOptionProps {
  id: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}

const RadioOption: React.FC<RadioOptionProps> = ({ 
  id, name, value, checked, onChange, label 
}) => {
  return (
    <div className="flex items-center mb-4">
      <div className="relative flex items-center">
        <input
          id={id}
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className="w-5 h-5 text-[#006B6B] border-gray-300 focus:ring-[#006B6B]"
        />
        <label htmlFor={id} className="ml-2 text-lg text-gray-800">
          {label}
        </label>
      </div>
    </div>
  );
};

export default RadioOption;
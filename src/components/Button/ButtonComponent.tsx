import React from "react";

// Định nghĩa props cho ButtonComponent
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

// ButtonComponent sử dụng Tailwind CSS
const ButtonComponent: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`button-17 inline-flex items-center justify-center rounded-full bg-white text-gray-800 text-sm font-medium py-2 px-6 shadow-md hover:bg-gray-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 active:shadow-lg disabled:shadow-sm disabled:cursor-not-allowed transition duration-300 ease-in-out ${className}`}
    >
      {children}
    </button>
  );
};

export default ButtonComponent;

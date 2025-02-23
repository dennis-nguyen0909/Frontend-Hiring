import type React from "react";

// Định nghĩa props cho ButtonComponent
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

// ButtonComponent sử dụng Tailwind CSS và custom CSS cho hiệu ứng hover từ hai bên vào giữa
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
      className={`
        button-hover-effect
        relative
        inline-flex items-center justify-center
        rounded-full bg-white text-gray-800
        text-sm font-medium py-2 px-6
        shadow-md
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
        active:shadow-lg
        disabled:shadow-sm disabled:cursor-not-allowed
        transition duration-300 ease-in-out
        overflow-hidden
        cursor-pointer
        ${className}
      `}
    >
      <span className="relative z-10 transition-colors duration-300">
        {children}
      </span>
      <style jsx>{`
        .button-hover-effect::before,
        .button-hover-effect::after {
          content: "";
          position: absolute;
          top: 0;
          width: 50%;
          height: 100%;
          background: black;
          transition: all 0.3s ease-in-out;
        }
        .button-hover-effect::before {
          left: -50%;
        }
        .button-hover-effect::after {
          right: -50%;
        }
        .button-hover-effect:hover::before {
          left: 0;
        }
        .button-hover-effect:hover::after {
          right: 0;
        }
        .button-hover-effect:hover span {
          color: white;
        }
      `}</style>
    </button>
  );
};

export default ButtonComponent;

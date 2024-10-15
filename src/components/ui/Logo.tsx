interface TopCodexLogoProps {
    size?: number;
  }
  
  export default function TopCodexLogo({ size = 64 }: TopCodexLogoProps) {
    return (
      <div
        className="bg-black p-4 rounded-lg flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
  
          {/* Abstract shape representing a combination of 'T' and 'C' */}
          <path
            d="M50 50 L150 50 L150 70 L110 70 L110 150 L90 150 L90 70 L50 70 Z"
            fill="url(#gradient)"
            className="animate-pulse"
          />
  
          {/* Stylized code brackets */}
          <path
            d="M70 100 L90 80 L90 120 L70 100 M130 100 L110 80 L110 120 L130 100"
            stroke="#ffffff"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
  
          {/* Text */}
          <text
            x="100"
            y="180"
            fontFamily="Arial, sans-serif"
            fontSize="24"
            fontWeight="bold"
            fill="#ffffff"
            textAnchor="middle"
            className="select-none"
          >
            TopCodex
          </text>
        </svg>
      </div>
    );
  }
  
import React from "react";

type CustomAvatarProps = {
  src: string;
  size?: number;
  shape?: "circle" | "square";
  alt?: string;
};

const CustomAvatar: React.FC<CustomAvatarProps> = ({
  src,
  size = 65,
  shape = "square",
  alt = "Avatar",
}) => {
  return (
    <div
      className={`relative overflow-hidden ${
        shape === "circle" ? "rounded-full" : "rounded-md"
      }`}
      style={{ width: size, height: size }}
    >
      <img src={src} alt={alt} className="object-contain w-full h-full" />
    </div>
  );
};

export default CustomAvatar;

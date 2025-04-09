export const colors = [
  "#1A1A1A", // Deep Black
  "#2C2C2C", // Charcoal
  "#3D3D3D", // Dark Gray
  "#4A4A4A", // Medium Gray
  "#5C5C5C", // Slate Gray
  "#6E6E6E", // Light Gray
  "#808080", // Gray
  "#919191", // Silver
  "#A3A3A3", // Light Silver
  "#B5B5B5", // Platinum
  "#C7C7C7", // Off White
];

export const getRandomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};

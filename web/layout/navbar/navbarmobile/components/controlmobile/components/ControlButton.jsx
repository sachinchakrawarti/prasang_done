// src/public_app/layout/navbar/navbarmobile/components/ControlButton.jsx
import { AiFillControl } from "react-icons/ai";
import { FaChevronDown } from "react-icons/fa";

const ControlButton = ({ isOpen, onClick, iconColor, buttonBg }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition-all duration-200 ${buttonBg} flex items-center gap-1`}
      aria-label="Controls"
    >
      <AiFillControl
        className={`text-lg ${iconColor} ${isOpen ? "rotate-90" : ""} transition-transform duration-300`}
      />
      <FaChevronDown
        className={`text-xs ${iconColor} transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
      />
    </button>
  );
};

export default ControlButton;

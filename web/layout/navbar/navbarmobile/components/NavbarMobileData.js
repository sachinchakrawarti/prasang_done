// src/public_app/layout/navbar/navbarmobile/components/NavbarMobileData.js
import {
  FaHome,
  FaBook,
  FaPenNib,
  FaUser,
  FaFeatherAlt,
  FaInfoCircle,
} from "react-icons/fa";

// Mobile navigation items with translation keys
export const mobileNavItemsConfig = [
  {
    labelKey: "home",
    to: "/",
    icon: FaHome,
  },
  {
    labelKey: "poems",
    to: "/poems",
    icon: FaBook,
  },
  {
    labelKey: "prose",
    to: "/prose",
    icon: FaPenNib,
  },
  {
    labelKey: "poets",
    to: "/poets",
    icon: FaUser,
  },
  {
    labelKey: "contributors",
    to: "/contributors",
    icon: FaFeatherAlt,
  },
  {
    labelKey: "about",
    to: "/about",
    icon: FaInfoCircle,
  },
  {
    labelKey: "testPage",
    to: "/testpage",
    icon: FaInfoCircle,
  },
];

export default mobileNavItemsConfig;
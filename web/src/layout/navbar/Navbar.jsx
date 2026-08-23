// src/layout/navbar/Navbar.jsx
"use client";

import { useState } from "react";
import NavbarDesktop from "./navbardesktop/Navbar_Desktop"; // ✅ Added underscore
// import NavbarMobile from "./navbarmobile/NavbarMobile";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const openMobileMenu = () => setIsMobileMenuOpen(true);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <div className="hidden lg:block">
        <NavbarDesktop />
      </div>
      <div className="lg:hidden">
        {/* <NavbarMobile
          isOpen={isMobileMenuOpen}
          onClose={closeMobileMenu}
          onOpen={openMobileMenu}
        /> */}
      </div>
    </>
  );
};

export default Navbar;

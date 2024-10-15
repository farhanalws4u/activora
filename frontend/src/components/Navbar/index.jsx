import React, { useState } from "react";


function Navbar() {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };
  

    

  return (
    <div>
      <nav className="bg-white dark:bg-gray-900 w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600 relative">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="/" className="flex items-center rtl:space-x-reverse">
            <span className="self-center text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-semibold whitespace-nowrap text-white mt-2 ml-2">
              Activora
            </span>
          </a>

          {/* Hamburger button for mobile */}
          <button
            onClick={toggleMenu}
            className="md:hidden focus:outline-none absolute top-[35%] right-4"
          >
            {isMenuOpen ? (
              // Cross icon when menu is open
              <svg
                className="w-6 h-6 text-white cursor-pointer"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              // Hamburger icon when menu is closed
              <svg
                className="w-6 h-6 text-white cursor-pointer"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>

          <div
            className={`md:hidden z-50 fixed right-0 top-16 w-full bg-white dark:bg-gray-900 transform transition-transform ${
              isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
            id="navbar-sticky"
          >
            {/* Mobile menu content goes here */}
            <ul className="flex flex-col  p-2 mt-4 font-medium space-y-2">
              <li>
                <a
                  href="/"
                  className={`text-white rounded p-2 ${
                    window.location.pathname === "/" ? "bg-gray-800" : ""
                  }`}
                  onClick={toggleMenu}
                  aria-current={
                    window.location.pathname === "/" ? "page" : undefined
                  }
                >
                  {/* {JSON.parse(localStorage.getItem("user"))?.name} */}
                </a>
              </li>
            </ul>
          </div>

          <div
            className="items-center justify-between hidden md:flex md:w-auto md:order-1"
            id="navbar-sticky"
          >
            {/* Desktop menu content goes here */}
            <ul className="flex p-2 mt-4 font-medium space-x-8 rtl:space-x-reverse">
              <li>
                <a
                  href="/"
                  className={`text-white rounded p-2 ${
                    window.location.pathname === "/" ? "bg-gray-800" : ""
                  }`}
                  aria-current={
                    window.location.pathname === "/" ? "page" : undefined
                  }
                >
                  {/* {JSON.parse(localStorage.getItem("user"))?.name} */}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;

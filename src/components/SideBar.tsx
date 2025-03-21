"use client";
import { MoonIcon } from "@heroicons/react/20/solid";

const SideBar = () => {
  return (
    <div
      className="fixed z-40 top-0 left-0 right-0 w-full h-20 flex flex-row justify-between bg-gray-800
      lg:left-0 lg:top-0 lg:bottom-0 lg:w-24 lg:h-screen lg:flex-col lg:rounded-br-3xl lg:rounded-tr-2xl"
    >
      {/* Logo Section */}
      <div
        className="flex items-center justify-center h-full w-24 
        lg:h-24 lg:w-full lg:rounded-br-2xl lg:rounded-tr-2xl 
        bg-purple-600 relative overflow-hidden"
      >
        <img src="/assets/logo.svg" alt="logo" className="w-12 h-auto z-10" />
        <div
          className="absolute left-0 right-0 top-0 h-full
          lg:top-12 lg:h-12 
          bg-purple-200 opacity-30 z-0 rounded-tl-2xl"
        />
      </div>

      {/* Spacer - only show on desktop */}
      <div className="hidden lg:block lg:flex-grow"></div>

      {/* Controls Section - Moon Icon and Avatar */}
      <div
        className="flex flex-row h-full items-center
        lg:flex-col lg:h-auto"
      >
        {/* Moon Icon */}
        <div
          className="h-full w-24  border-gray-700
          lg:w-full lg:h-auto lg:border-l-0"
        >
          <button
            className="w-full h-20 text-gray-400 hover:bg-gray-700 transition-colors duration-200 
              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset
              flex items-center justify-center"
            aria-label="Toggle dark mode"
            onClick={() => console.log("Dark mode toggle clicked")}
          >
            <MoonIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Avatar */}
        <div
          className="h-full w-24 border-l border-gray-700
          lg:w-full lg:h-auto lg:border-l-0 lg:border-t lg:border-gray-700"
        >
          <button
            className="w-full h-20 text-gray-400 hover:bg-gray-700 transition-colors duration-200 
              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset 
              flex items-center justify-center"
            aria-label="Account settings"
            onClick={() => console.log("/account/settings")}
          >
            <img
              src="/assets/image-avatar.jpg"
              alt="avatar"
              className="w-8 h-8 rounded-full cursor-pointer"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideBar;

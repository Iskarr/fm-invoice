"use client";
import { MoonIcon } from "@heroicons/react/20/solid";

const SideBar = () => {
  return (
    <div className="flex flex-col w-24 bg-gray-800 h-screen rounded-br-3xl rounded-tr-2xl z-90">
      <div className="flex items-center justify-center h-24 bg-purple-600 relative overflow-hidden rounded-br-2xl rounded-tr-2xl">
        <img src="/assets/logo.svg" alt="logo" className="w-12 h-auto z-10" />
        <div className="absolute left-0 right-0 top-12 h-12 bg-purple-200 opacity-30 z-0 rounded-tl-2xl" />
      </div>

      <div className="flex-grow"></div>

      <div className="flex items-center justify-center border-t border-gray-700">
        <button
          className="w-full py-6 text-gray-400 hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset"
          aria-label="Toggle dark mode"
          onClick={() => console.log("Dark mode toggle clicked")}
        >
          <MoonIcon className="w-6 h-6 mx-auto" />
        </button>
      </div>

      <div className="flex items-center justify-center border-t border-gray-700">
        <button
          className="w-full py-6 text-gray-400 hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset flex items-center justify-center"
          aria-label="Toggle dark mode"
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
  );
};

export default SideBar;

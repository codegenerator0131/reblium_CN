"use client";

import { MdOutlineSettings } from "react-icons/md";

const AuthDescriptionComponent: React.FC = () => {
  return (
    <div
      className="relative w-full md:w-1/2 xl:w-2/3 min-h-[50vh] md:h-screen flex items-center justify-center p-4"
      style={{
        background:
          "radial-gradient(circle at 34% 20%, #202020 0%, #0a0a0a 80%)",
      }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-16 md:gap-28 px-4 text-center">
        <img
          src="/images/reblium_logo.png"
          alt="Logo"
          className="w-40 h-40 md:w-[225px] md:h-[225px]"
        />

        <h1 className="text-white text-xl md:text-3xl">
          Reblium Studio 2 Beta 1125
        </h1>
      </div>
      <p className="fixed bottom-8 text-center text-white text-sm md:text-md">
        © 2025 Reblium. All rights reserved. <br />{" "}
        <a
          href="https://www.reblium.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-primary transition-colors"
        >
          Reblium
        </a>{" "}
        is a product by{" "}
        <a
          href="https://www.reblika.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-primary transition-colors"
        >
          Reblika Software B.V.
        </a>
      </p>

      <MdOutlineSettings
        size={36}
        className="absolute bottom-4 left-4 md:bottom-5 md:left-5 text-white cursor-pointer"
        onClick={() => console.log("User Clicked Setting Button")}
      />
    </div>
  );
};

export default AuthDescriptionComponent;

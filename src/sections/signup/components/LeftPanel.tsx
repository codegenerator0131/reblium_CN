import React from "react";
import Image from "next/image";

import { FaCheck } from "react-icons/fa";

const LeftPanel: React.FC = () => {
  return (
    <div className="w-full md:w-1/2 text-white relative md:!flex md:!opacity-100">
      <div className="absolute top-8 left-8 z-[9]" style={{ width: "95px" }}>
        <Image
          src="/images/reblium-logo.png"
          alt="logo"
          width={100}
          height={40}
          priority
          className="cursor-pointer"
          onClick={() => (window.location.href = "/")}
        />
      </div>
      <div className="w-full relative flex justify-center items-center">
        <img
          src="/images/sign_up_image.png"
          alt="background"
          className="w-full h-full"
        />
        <div className="absolute text-center">
          <h2 className="text-4xl font-bold mb-4 leading-[150%]">
            SIGN UP <br /> FOR <br /> 14 DAYS FREE <br /> TRIAL NOW
          </h2>
          <ul className="space-y-4 text-lg">
            <li className="flex items-center">
              <FaCheck className="text-blue-standard mr-4" />
              Endless customisation
            </li>
            <li className="flex items-center">
              <FaCheck className="text-blue-standard mr-4" />
              50+ HQ grooms
            </li>
            <li className="flex items-center">
              <FaCheck className="text-blue-standard mr-4" />
              Character generator
            </li>
            <li className="flex items-center">
              <FaCheck className="text-blue-standard mr-4" />
              Export and Import garments
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;

import React from "react";
import Image from "next/image";

export const LoadingOverlay = ({ classStr, type }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center backdrop-blur-xl z-[99999] gap-4">
      <div className={classStr}>
        <Image
          src={"/images/reblium-logo.png"}
          alt="logo"
          width={100}
          height={100}
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-white animate-pulse">Loading</span>
        {type && <span className="text-white animate-pulse">{type}</span>}
        <span className="inline-flex w-12">
          <span
            className="text-white animate-bounce"
            style={{ animationDelay: "0s" }}
          >
            .
          </span>
          <span
            className="text-white animate-bounce"
            style={{ animationDelay: "0.2s" }}
          >
            .
          </span>
          <span
            className="text-white animate-bounce"
            style={{ animationDelay: "0.4s" }}
          >
            .
          </span>
        </span>
      </div>
    </div>
  );
};

export default LoadingOverlay;

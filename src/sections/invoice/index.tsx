"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useRef,
} from "react";
import { useRouter } from "next/navigation";

const InvoiceView: React.FC = () => {
  const router = useRouter();

  return (
    <>
      <div>
        <h1 className="text-white text-4xl font-bold mb-8">Invoice </h1>
      </div>
    </>
  );
};

export default InvoiceView;

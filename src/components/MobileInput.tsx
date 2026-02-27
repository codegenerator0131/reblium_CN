"use client";

import React, { ChangeEvent } from "react";
import { MdPhone } from "react-icons/md";
import IconInput from "./IconInput";

interface MobileInputProps {
  mobile: string;
  mobilePrefix?: string; // Always 86, kept for backward compatibility
  onMobileChange: (mobile: string) => void;
  onPrefixChange?: (prefix: string) => void; // Not used, kept for backward compatibility
  error?: string;
  disabled?: boolean;
  placeholder?: string;
}

const MobileInput: React.FC<MobileInputProps> = ({
  mobile,
  onMobileChange,
  error,
  disabled = false,
  placeholder = "Enter Mobile Number",
}) => {
  // SMS module only supports China (+86)
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="px-3 py-3 rounded-lg bg-gray-800 text-white border border-gray-600 flex items-center">
          +86
        </div>
        <div className="flex-1">
          <IconInput
            type="tel"
            id="mobile"
            value={mobile}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onMobileChange(e.target.value.replace(/\D/g, "").slice(0, 11))
            }
            placeholder={placeholder}
            icon={MdPhone}
            disabled={disabled}
            maxLength={11}
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default MobileInput;

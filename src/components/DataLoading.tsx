"use client";

import * as React from "react";

function DataLoadingComponent({ className }: React.ComponentProps<"div">) {
  return (
    <span className="flex justify-center items-center">
      <span className="animate-spin rounded-full h-6 w-6 border-t-2 border-cyan-400"></span>
    </span>
  );
}

export { DataLoadingComponent };

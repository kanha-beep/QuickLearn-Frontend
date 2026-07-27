import React from "react";

export function Loading({ loading }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="loader h-10 w-10 border-2 border-gray-300 border-t-black rounded-full bg-white animate-spin"></div>
        <div className="text-gray-500">Loading subjects...</div>
      </div>
    );
  }
  return;
}

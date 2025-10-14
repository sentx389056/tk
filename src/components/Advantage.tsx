import React from "react";

export default function Advantage({ count, text, Icon }: { count: number; text: string; Icon: React.ElementType }) {
  return (
    <div className="flex flex-col items-center justify-center bg-white shadow-md rounded-lg p-4">
      <div className="bg-red-pink text-white rounded-lg p-4 mb-4">
        <Icon size={32} />
      </div>
      <h3 className="text-2xl font-bold mb-2">{count}</h3>
      <p className="text-gray-500 text-sm mb-4">{text}</p>
    </div>
  );
}
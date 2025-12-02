import React from "react";

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Product Management</h1>
      <div className="bg-white rounded-xl shadow p-5">
        {children}
      </div>
    </div>
  );
}

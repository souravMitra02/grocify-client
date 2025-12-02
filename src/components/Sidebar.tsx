"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const path = usePathname();

  const menus = [
    { name: "Products", path: "/dashboard/products" },
    { name: "Analytics", path: "/dashboard/analytics" },
  ];

  return (
    <div className="w-64 min-h-screen bg-[#1e293b] p-4 text-white">
      <h2 className="text-2xl font-bold mb-6">Grocify</h2>

      <nav className="space-y-2">
        {menus.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`block px-4 py-2 rounded-lg ${
              path === item.path ? "bg-[#334155] font-semibold" : "hover:bg-[#334155]"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const path = usePathname();
  const router = useRouter();

  const menus = [
    { name: "Products", path: "/dashboard/products" },
    { name: "Analytics", path: "/dashboard/analytics" },
  ];

  const handleLogout = async () => {
    try {
      await fetch("https://grocify-server-zeta.vercel.app/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      router.push("/login");
    } catch (error) {
      console.log("Logout failed");
    }
  };

  return (
    <div className="w-64 min-h-screen bg-white/30 shadow-2xl border-r border-gray-200 p-6 flex flex-col justify-between">

      {/* Logo */}
      <div>
        <h2 className="text-3xl font-extrabold mb-10 tracking-wide text-green-600 text-center">
          Grocify
        </h2>

        {/* Dark Menu Box */}
        <div className="bg-gray-300 rounded-2xl p-3 shadow-lg">
          <nav className="space-y-2">
            {menus.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`block px-4 py-2 rounded-xl transition-all ${path === item.path
                    ? "bg-green-500 text-white font-semibold shadow-md"
                    : "text-gray-200 hover:bg-[#1e293b]"
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-10 w-full py-2 bg-red-500 hover:bg-red-600 rounded-xl font-semibold text-white transition-all shadow-md"
      >
        Sign Out
      </button>
    </div>
  );
}

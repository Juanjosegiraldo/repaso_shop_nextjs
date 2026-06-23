"use client";

import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="flex items-center justify-between border-b p-4">
      <button
        type="button"
        onClick={() => router.push("/")}
        className="text-lg font-bold"
      >
        ShopNova
      </button>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-sm">Hi, {user.name}</span>
            <Button size="sm" onPress={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button size="sm" onPress={() => router.push("/login")}>
              Login
            </Button>
            <Button size="sm" onPress={() => router.push("/register")}>
              Register
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}

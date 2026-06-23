"use client";

import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/context/i18nContext";
import type { Language } from "@/locales/translations";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { language, setLanguage, text } = useTranslation();
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
        {/* Language selector: switching updates the whole UI via context. */}
        <select
          aria-label={text.nav.language}
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="rounded border px-2 py-1 text-sm"
        >
          <option value="es">ES</option>
          <option value="en">EN</option>
          <option value="pt">PT</option>
        </select>

        {user ? (
          <>
            <Button size="sm" onPress={() => router.push("/favorites")}>
              {text.nav.favorites}
            </Button>
            <Button size="sm" onPress={() => router.push("/cart")}>
              {text.nav.cart}
            </Button>
            <Button size="sm" onPress={() => router.push("/dashboard")}>
              {text.dashboard.title}
            </Button>
            <span className="text-sm">
              {text.nav.greeting} {user.name}
            </span>
            <Button size="sm" onPress={handleLogout}>
              {text.nav.logout}
            </Button>
          </>
        ) : (
          <>
            <Button size="sm" onPress={() => router.push("/login")}>
              {text.nav.login}
            </Button>
            <Button size="sm" onPress={() => router.push("/register")}>
              {text.nav.register}
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}

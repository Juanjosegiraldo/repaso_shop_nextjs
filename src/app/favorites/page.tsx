"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/context/i18nContext";
import { getFavorites, toggleFavorite } from "@/services/favorites";
import type { Product } from "@/services/productService";
import ProductCard from "@/components/ProductCard";

export default function FavoritesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { text } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Protected page: no session means no access.
    if (!user) {
      router.push("/login");
      return;
    }
    getFavorites(user._id)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [user, router]);

  const handleToggle = async (productId: string) => {
    if (!user) return;
    await toggleFavorite(user._id, productId);
    // Removing a favorite drops it from this list immediately.
    setProducts((prev) => prev.filter((p) => p._id !== productId));
  };

  if (!user) return null;
  if (loading) {
    return (
      <main className="p-6">
        <p>{text.detail.loading}</p>
      </main>
    );
  }

  return (
    <main className="p-6">
      <h1 className="mb-6 text-3xl font-bold">{text.favorites.title}</h1>
      {products.length === 0 ? (
        <p className="text-gray-600">{text.favorites.empty}</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              id={product._id}
              name={product.name}
              price={product.price}
              image={product.image}
              isFavorite={true}
              onToggleFavorite={handleToggle}
            />
          ))}
        </div>
      )}
    </main>
  );
}

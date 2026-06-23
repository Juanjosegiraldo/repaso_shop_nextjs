"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProducts, type Product } from "@/services/productService";
import { getFavorites, toggleFavorite } from "@/services/favorites";
import ProductCard from "@/components/ProductCard";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/context/i18nContext";

export default function CatalogPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { text } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data))
      .finally(() => setLoading(false));
  }, []);

  // Load the user's favorites so the stars reflect what is already saved.
  useEffect(() => {
    if (!user) {
      setFavorites(new Set());
      return;
    }
    getFavorites(user._id).then((favs) =>
      setFavorites(new Set(favs.map((p) => p._id)))
    );
  }, [user]);

  const handleToggleFavorite = async (id: string) => {
    // Protected action: require a session before marking favorites.
    if (!user) {
      router.push("/login");
      return;
    }
    const { favorited } = await toggleFavorite(user._id, id);
    setFavorites((prev) => {
      const next = new Set(prev);
      if (favorited) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  return (
    <main className="p-6">
      <h1 className="mb-6 text-3xl font-bold">ShopNova</h1>

      {loading ? (
        <p>{text.catalog.loading}</p>
      ) : products.length === 0 ? (
        <p className="text-gray-600">{text.catalog.empty}</p>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              id={product._id}
              name={product.name}
              price={product.price}
              image={product.image}
              isFavorite={favorites.has(product._id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}
    </main>
  );
}

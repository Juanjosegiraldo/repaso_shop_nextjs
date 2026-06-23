"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProducts, type Product } from "@/services/productService";
import ProductCard from "@/components/ProductCard";
import { useAuth } from "@/context/AuthContext";

export default function CatalogPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data))
      .finally(() => setLoading(false));
  }, []);

  const toggleFavorite = (id: string) => {
    // Protected action: require a session before marking favorites.
    if (!user) {
      router.push("/login");
      return;
    }
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <main className="p-6">
      <h1 className="mb-6 text-3xl font-bold">ShopNova</h1>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-600">
          No products yet. Seed the catalog or create one.
        </p>
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
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </main>
  );
}

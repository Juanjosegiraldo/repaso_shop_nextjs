"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/context/i18nContext";
import { getCart, type CartView } from "@/services/cart";
import { createSale } from "@/services/sales";

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { text } = useTranslation();
  const [cart, setCart] = useState<CartView>({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    getCart(user._id)
      .then(setCart)
      .finally(() => setLoading(false));
  }, [user, router]);

  const handleBuy = async () => {
    if (!user) return;
    const sale = await createSale(user._id);
    if (sale) {
      setMessage(`${text.cart.purchaseComplete} $${sale.total.toFixed(2)}.`);
      setCart({ items: [], total: 0 });
    } else {
      setMessage(text.cart.purchaseFailed);
    }
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
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-3xl font-bold">{text.cart.title}</h1>

      {cart.items.length === 0 ? (
        <p className="text-gray-600">{text.cart.empty}</p>
      ) : (
        <>
          <ul className="flex flex-col">
            {cart.items.map((line) => (
              <li
                key={line.product._id}
                className="flex justify-between border-b py-2"
              >
                <span>
                  {line.product.name} × {line.quantity}
                </span>
                <span>${(line.product.price * line.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-lg font-bold">
            {text.cart.total}: ${cart.total.toFixed(2)}
          </p>
          <Button className="mt-4" onPress={handleBuy}>
            {text.cart.buy}
          </Button>
        </>
      )}

      {message && <p className="mt-4 text-sm">{message}</p>}
    </main>
  );
}

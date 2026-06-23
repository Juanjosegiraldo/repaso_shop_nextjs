"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button, Card } from "@heroui/react";
import { useTranslation } from "@/context/i18nContext";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  isFavorite,
  onToggleFavorite,
}: ProductCardProps) {
  const router = useRouter();
  const { text } = useTranslation();

  return (
    <Card className="w-64 shrink-0">
      <Card.Content className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={image || "https://placehold.co/400x300?text=No+image"}
            alt={name}
            fill
            sizes="256px"
            className="object-cover"
          />
          {/* Favorite toggle: data comes from props, behaviour from props. */}
          <button
            type="button"
            aria-label="Toggle favorite"
            onClick={() => onToggleFavorite(id)}
            className="absolute right-2 top-2 rounded-full bg-white/80 px-2 py-1 text-xl leading-none"
          >
            {isFavorite ? "★" : "☆"}
          </button>
        </div>
      </Card.Content>

      <Card.Footer className="flex flex-col items-start gap-2">
        <h3 className="font-semibold">{name}</h3>
        <p className="text-sm text-gray-600">${price.toFixed(2)}</p>
        <Button fullWidth onPress={() => router.push(`/products/${id}`)}>
          {text.catalog.viewDetails}
        </Button>
      </Card.Footer>
    </Card>
  );
}

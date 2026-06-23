// Shape of the part of the Pexels search response we use.
interface PexelsSearchResponse {
  photos?: { src?: { medium?: string } }[];
}

/**
 * Searches Pexels by name and returns the first photo URL.
 * Falls back to a placehold.co image when there is no key or no result.
 */
export const buscarImagen = async (nombre: string): Promise<string> => {
  const fallback = `https://placehold.co/400x300?text=${encodeURIComponent(nombre)}`;

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(nombre)}&per_page=1`,
      { headers: { Authorization: process.env.PEXELS_API_KEY ?? "" } }
    );
    const data: PexelsSearchResponse = await res.json();
    return data.photos?.[0]?.src?.medium ?? fallback;
  } catch {
    return fallback;
  }
};

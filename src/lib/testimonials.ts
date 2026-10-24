export interface Testimonial {
  id: string;
  author: string;
  isAdult: boolean;
  athlete: string;
  age: string | number;
  rating: number;
  content: string;
  order: number;
}

export async function readTestimonials(
  signal: AbortSignal,
): Promise<Testimonial[]> {
  const response = await fetch("/api/testimonials", {
    signal,
    cache: "no-store",
  });
  if (!response.ok)
    throw new Error("Não foi possível carregar os depoimentos.");
  const data = await response.json();
  if (!Array.isArray(data.testimonials)) throw new Error("Resposta inválida.");
  return data.testimonials;
}

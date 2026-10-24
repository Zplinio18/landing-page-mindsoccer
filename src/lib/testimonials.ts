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

class TestimonialsRequestError extends Error {
  retryable: boolean;

  constructor(message: string, retryable: boolean) {
    super(message);
    this.retryable = retryable;
  }
}

function waitBeforeRetry(signal: AbortSignal, delay: number): Promise<void> {
  return new Promise((resolve, reject) => {
    signal.throwIfAborted();
    const cancel = () => {
      clearTimeout(timer);
      signal.removeEventListener("abort", cancel);
      reject(signal.reason);
    };
    const timer = setTimeout(() => {
      signal.removeEventListener("abort", cancel);
      resolve();
    }, delay);
    signal.addEventListener("abort", cancel, { once: true });
  });
}

export async function readTestimonials(
  signal: AbortSignal,
): Promise<Testimonial[]> {
  // Cada tentativa tem seu próprio prazo: uma falha não cancela as seguintes.
  for (let attempt = 0; attempt < 3; attempt++) {
    signal.throwIfAborted();
    const controller = new AbortController();
    const cancel = () => controller.abort(signal.reason);
    signal.addEventListener("abort", cancel, { once: true });
    const timeout = setTimeout(
      () =>
        controller.abort(
          new DOMException("A consulta demorou demais.", "TimeoutError"),
        ),
      25000,
    );

    try {
      const response = await fetch("/api/testimonials", {
        signal: controller.signal,
        cache: "no-store",
      });
      if (!response.ok) {
        throw new TestimonialsRequestError(
          "Não foi possível carregar os depoimentos.",
          response.status >= 500 || [408, 429].includes(response.status),
        );
      }
      const data = await response.json();
      if (!Array.isArray(data.testimonials))
        throw new TestimonialsRequestError("Resposta inválida.", false);
      return data.testimonials;
    } catch (error) {
      if (
        signal.aborted ||
        attempt === 2 ||
        (error instanceof TestimonialsRequestError && !error.retryable)
      )
        throw error;
    } finally {
      clearTimeout(timeout);
      signal.removeEventListener("abort", cancel);
    }
    await waitBeforeRetry(signal, 1000 * (attempt + 1));
  }
  throw new Error("Não foi possível carregar os depoimentos.");
}

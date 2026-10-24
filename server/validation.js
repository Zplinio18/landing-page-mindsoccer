export function validateTestimonial(input) {
  if (
    !input ||
    typeof input !== "object" ||
    typeof input.isAdult !== "boolean" ||
    typeof input.active !== "boolean"
  ) {
    throw new Error(
      "Informe se o atleta é adulto e se o depoimento deve ser publicado.",
    );
  }
  const bounded = (value, name, max) => {
    if (typeof value !== "string" || !value.trim() || value.trim().length > max)
      throw new Error(`${name}: preencha até ${max} caracteres.`);
    return value.trim();
  };
  const author = bounded(input.author, "Autor", 100);
  const content = bounded(input.content, "Depoimento", 3000);
  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5)
    throw new Error("A nota deve ser de 1 a 5.");
  if (!Number.isInteger(input.order) || input.order < 1 || input.order > 100000)
    throw new Error("Informe uma ordem de 1 a 100000.");
  const athlete = input.isAdult
    ? ""
    : bounded(input.athlete, "Nome do atleta", 100);
  const age = input.isAdult ? "" : input.age;
  if (!input.isAdult && (!Number.isInteger(age) || age < 1 || age > 17))
    throw new Error(
      "Informe a idade do atleta menor de idade, de 1 a 17 anos.",
    );
  return {
    author,
    content,
    isAdult: input.isAdult,
    athlete,
    age,
    rating: input.rating,
    active: input.active,
    order: input.order,
  };
}

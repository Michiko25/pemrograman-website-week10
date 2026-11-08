import { HttpError } from "./http-error";

// "12" -> 12. Tolak yang bukan bilangan bulat positif
export const parseId = (value: unknown, label = "id"): number => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, `${label} harus berupa bilangan bulat positif`);
  }
  return id;
};

// Dianggap "tidak diisi" kalau undefined, null, atau string kosong
export const isEmpty = (value: unknown): boolean =>
  value === undefined || value === null || value === "";
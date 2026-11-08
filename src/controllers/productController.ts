import type { Request, Response } from "express";
import prisma from "../config/prisma";
import { HttpError } from "../utils/http-error";
import { isEmpty, parseId } from "../utils/parse";
import { sendSuccess } from "../utils/response";

// Validasi body untuk POST dan PUT (name dan price)
const parseProductBody = (body: Record<string, unknown>) => {
  const { name, price } = body;

  if (typeof name !== "string" || name.trim() === "") {
    throw new HttpError(400, "name wajib diisi (teks tidak kosong)");
  }
  if (isEmpty(price)) {
    throw new HttpError(400, "price wajib diisi");
  }
  if (typeof price !== "number" || !Number.isInteger(price) || price <= 0) {
    throw new HttpError(400, "price harus berupa bilangan bulat lebih dari 0");
  }
  if (price > 2_000_000_000) {
    throw new HttpError(400, "price terlalu besar");
  }

  return { name: name.trim(), price };
};

// GET /products -> seluruh produk
export const getAllProducts = async (_req: Request, res: Response) => {
  const products = await prisma.product.findMany({ orderBy: { id: "asc" } });

  sendSuccess(res, 200, "Berhasil mengambil data produk", products);
};

// GET /products/:id -> satu produk, 404 kalau tidak ada
export const getProductById = async (req: Request, res: Response) => {
  const id = parseId(req.params.id);

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new HttpError(404, "Produk tidak ditemukan");

  sendSuccess(res, 200, "Berhasil mengambil data produk", product);
};

// POST /products   body: { "name": "...", "price": 7000 }
export const createProduct = async (req: Request, res: Response) => {
  const data = parseProductBody(req.body ?? {});

  const product = await prisma.product.create({ data });

  sendSuccess(res, 201, "Produk berhasil dibuat", product);
};

// PUT /products   body: { "id": 3, "name": "...", "price": 9000 }
export const updateProduct = async (req: Request, res: Response) => {
  const body = req.body ?? {};
  const rawId = req.params.id ?? body.id;

  // 1. Validasi id dan body -> 400
  if (isEmpty(rawId)) {
    throw new HttpError(400, "id wajib diisi");
  }
  const id = parseId(rawId);
  const data = parseProductBody(body);

  // 2. Produk tidak ada -> 404
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) throw new HttpError(404, "Produk tidak ditemukan");

  // 3. Berhasil -> 200
  const product = await prisma.product.update({ where: { id }, data });

  sendSuccess(res, 200, "Produk berhasil diupdate", product);
};

// DELETE /products/:id
export const deleteProduct = async (req: Request, res: Response) => {
  const id = parseId(req.params.id);

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) throw new HttpError(404, "Produk tidak ditemukan");

  await prisma.product.delete({ where: { id } });

  sendSuccess(res, 200, "Produk berhasil dihapus", existing);
};
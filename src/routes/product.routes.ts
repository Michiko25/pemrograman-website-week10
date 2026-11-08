import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/productController";

const router = Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/", updateProduct); // id dari body
router.put("/:id", updateProduct); // id dari URL
router.delete("/:id", deleteProduct);

export default router;
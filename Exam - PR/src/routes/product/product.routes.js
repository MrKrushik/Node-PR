const express = require("express");
const productRoute = express.Router();

const {
    addProduct,
    getSingleProduct,
    getAllProducts,
    updateProduct,
    deleteProduct
} = require("../../controller/product/product.controller");

const { authMiddleware } = require("../../middleware/auth.middleware");

productRoute.post("/", authMiddleware, addProduct);
productRoute.patch("/:id", authMiddleware, updateProduct);
productRoute.delete("/:id", authMiddleware, deleteProduct);
productRoute.get("/:id", authMiddleware, getSingleProduct);
productRoute.get("/", authMiddleware, getAllProducts);

module.exports = productRoute;
const express = require("express");

const router = express.Router();

const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

// CREATE
router.post("/", createProduct);

// READ ALL
router.get("/", getProducts);

// READ ONE
router.get("/:pid", getProductById);

// UPDATE
router.put("/:pid", updateProduct);

// DELETE
router.delete("/:pid", deleteProduct);

module.exports = router;
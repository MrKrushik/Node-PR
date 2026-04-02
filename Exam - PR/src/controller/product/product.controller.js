const ProductService = require("../../services/product/product.service"); 
const { errorResponse, successResponse } = require("../../utils/response");
const { MSG } = require("../../utils/msg");

const productService = new ProductService();

module.exports.addProduct = async (req, res) => {
    try {
        req.body.userId = req.user.id;

        const product = await productService.addProduct(req.body);

        return res.status(201).json(
            successResponse(201, false, MSG.PRODUCT_CREATED, product)
        );
    } catch (error) {
        res.status(500).json(errorResponse(500, true, error.message));
    }
};

module.exports.getSingleProduct = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);

        if (!product || product.isDeleted)
            return res.status(404).json(
                errorResponse(404, true, MSG.PRODUCT_NOT_FOUND)
            );

        return res.status(200).json(
            successResponse(200, false, MSG.PRODUCT_FETCH_SUCCESS, product)
        );
    } catch (error) {
        res.status(500).json(errorResponse(500, true, error.message));
    }
};

module.exports.getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();

        return res.status(200).json(
            successResponse(200, false, MSG.PRODUCT_FETCH_SUCCESS, products)
        );
    } catch (error) {
        res.status(500).json(errorResponse(500, true, error.message));
    }
};

module.exports.updateProduct = async (req, res) => {
    try {
        const updated = await productService.updateProduct(req.params.id, req.body);

        return res.status(200).json({
            message: "Updated",
            data: updated
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports.deleteProduct = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);

        if (!product || product.isDeleted)
            return res.status(404).json(
                errorResponse(404, true, MSG.PRODUCT_NOT_FOUND)
            );

       
        if (product.userId.toString() !== req.user.id)
            return res.status(403).json(
                errorResponse(403, true, "Unauthorized")
            );

        await productService.deleteProduct(req.params.id);

        return res.status(200).json(
            successResponse(200, false, MSG.PRODUCT_DELETED)
        );
    } catch (error) {
        res.status(500).json(errorResponse(500, true, error.message));
    }
};
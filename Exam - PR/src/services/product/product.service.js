const Product = require("../../model/product.model");

module.exports = class ProductService {

    async addProduct(body) {
        try {
            return await Product.create(body);
        } catch (err) {
            console.log("Add Product Error ", err);
            throw err;
        }
    }

    async getAllProducts() {
        try {
            return await Product.find({ isDeleted: false });
        } catch (err) {
            console.log("Get All Products Error ", err);
            throw err;
        }
    }

    async getProductById(id) {
        try {
            return await Product.findById(id);
        } catch (err) {
            console.log("Get Product By ID Error ", err);
            throw err;
        }
    }

    async updateProduct(id, body) {
        try {
            return await Product.findByIdAndUpdate(id, body, { new: true });
        } catch (err) {
            console.log("Update Product Error ", err);
            throw err;
        }
    }

    async deleteProduct(id) {
        try {
            return await Product.findByIdAndUpdate(
                id,
                { isDeleted: true },
                { new: true }
            );
        } catch (err) {
            console.log("Delete Product Error ", err);
            throw err;
        }
    }
};
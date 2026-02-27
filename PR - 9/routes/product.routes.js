const express = require('express');
const passport = require('passport');

const { addProductPage, addProduct, viewProductPage, deleteProduct, editProductPage, editProduct } = require('../controllers/product.controller');
const upload = require('../Middleware/product.multer.middleware');

const productRoute = express.Router();

productRoute.get('/addProductPage', passport.checkAuthIsDone, addProductPage);
productRoute.post('/addProduct', passport.checkAuthIsDone, upload.single('image'), addProduct);

productRoute.get('/viewProductPage', passport.checkAuthIsDone, viewProductPage);

productRoute.get('/deleteProduct', passport.checkAuthIsDone, deleteProduct);

productRoute.get('/editProductPage/:Id', passport.checkAuthIsDone, editProductPage);
productRoute.post('/updateProduct/:Id', passport.checkAuthIsDone, upload.single('image'), editProduct);

module.exports = productRoute;
const express = require('express');

const route = express.Router();

route.use("/user", require('./user/user.routes'));
route.use("/product", require('./product/product.routes'));

module.exports = route;
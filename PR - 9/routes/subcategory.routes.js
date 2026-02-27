const express = require('express');
const passport = require('passport');

const { addSubCategoryPage, addSubCategory, viewSubCategoryPage, deleteSubCategory, editSubCategoryPage, updateSubCategory } = require('../controllers/subCategory.controller');

const subCategoryRoute = express.Router();

subCategoryRoute.get('/addSubCategoryPage', passport.checkAuthIsDone, addSubCategoryPage);
subCategoryRoute.post('/addSubCategory', passport.checkAuthIsDone, addSubCategory);

subCategoryRoute.get('/viewSubCategoryPage', passport.checkAuthIsDone, viewSubCategoryPage);

subCategoryRoute.get('/deleteSubCategory', passport.checkAuthIsDone, deleteSubCategory);

subCategoryRoute.get('/editSubCategory/:subcategoryId', passport.checkAuthIsDone, editSubCategoryPage);
subCategoryRoute.post('/editSubCategory/:subcategoryId', passport.checkAuthIsDone, updateSubCategory);

module.exports = subCategoryRoute;
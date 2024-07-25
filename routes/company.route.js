// routes/companyRoutes.js
const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');

// Routes
router.post('/companies', companyController.createCompany);
router.get('/companies', companyController.getCompanies);
router.get('/companies/:id', companyController.getCompanyById);
router.put('/companies/:id', companyController.updateCompany);
router.delete('/companies/:id', companyController.deleteCompany);

module.exports = router;

import express from 'express';
import {
    createAgency,
    getAgencies,
    getAgencyById,
    updateAgency,
    deleteAgency
} from './controllers/agencyController.js';

const router = express.Router();

// Create a new agency
router.post('/agencies', createAgency);

// Get all agencies
router.get('/agencies', getAgencies);

// Get a single agency by ID
router.get('/agencies/:id', getAgencyById);

// Update an agency by ID
router.put('/agencies/:id', updateAgency);

// Delete an agency by ID
router.delete('/agencies/:id', deleteAgency);

export default router;

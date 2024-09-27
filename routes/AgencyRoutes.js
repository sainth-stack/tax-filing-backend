import express from 'express';
import {
    createAgency,
    getAgencies,
    getAgencyById,
    updateAgency,
    deleteAgency,
    getFilterAgencies
} from '../controllers/AgencyController.js';

const router = express.Router();

// Create a new agency
router.post('/agencies', createAgency);

// Get all agencies
router.get('/agencies/all', getAgencies);

// Get a single agency by ID
router.get('/agencies/:id', getAgencyById);

// Update an agency by ID
router.put('/agencies/:id', updateAgency);

// Delete an agency by ID
router.delete('/agencies/:id', deleteAgency);

router.post("/agencies/filter", getFilterAgencies);


export default router;

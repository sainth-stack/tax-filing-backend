
import  express  from 'express';

import {
    createPayment,
    getPaymentsByCompany,
    updatePayment
} from "../controllers/PaymentController.js";


const router = express.Router();

router.post("/payments", createPayment); 
router.put("/payments", updatePayment); 
router.get("/payments/:companyId", getPaymentsByCompany); 

export default router;

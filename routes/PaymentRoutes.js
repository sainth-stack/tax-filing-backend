
import  express  from 'express';

import {
  createPayment,
  getPaymentsByCompany,
  updatePayment,
  getAllPayments,
  deletePaymentById,
} from "../controllers/PaymentController.js";


const router = express.Router();

router.post("/payments", createPayment); 
router.put("/payments", updatePayment); 
router.get("/payments/:companyId", getPaymentsByCompany); 
router.get("/payments", getAllPayments);    
router.delete("/payments/:id", deletePaymentById);



export default router;

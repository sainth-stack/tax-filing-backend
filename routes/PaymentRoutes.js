
import  express  from 'express';

import {
  createPayment,
  getPaymentsByCompany,
  updatePayment,
  getAllPayments,
  deletePaymentById,
  getPaymentByID,
} from "../controllers/PaymentController.js";


const router = express.Router();

router.get("/payments/:paymentId", getPaymentByID);
router.post("/payments", createPayment); 
router.put("/payments/:id", updatePayment);
router.get("/payments/:companyId", getPaymentsByCompany); 
router.get("/payments", getAllPayments);    
router.delete("/payments/:id", deletePaymentById);





export default router;

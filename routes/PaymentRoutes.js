
import  express  from 'express';

import {
  createPayment,
  getCompanyByAgency,
  updatePayment,
  getAllPayments,
  deletePaymentById,
  getPaymentByID,
  getPaymentsByAgency
} from "../controllers/PaymentController.js";


const router = express.Router();

router.get("/payments/:paymentId", getPaymentByID);

router.post("/payments", createPayment); 
router.put("/payments/:id", updatePayment);
router.get("/payments", getCompanyByAgency);


router.get("/payments", getAllPayments);    
router.delete("/payments/:id", deletePaymentById);
router.get("/payments-data",getPaymentsByAgency)




export default router;

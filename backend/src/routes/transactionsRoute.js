import express from 'express';
import {createTransaction, getTransactionsByUserId,deleteTransaction, getSummaryByUserId} from '../controllers/transactionsController.js'; // Adjust the path as necessary
const router = express.Router();

 
router.get("/summary/:userId",getSummaryByUserId );

router.post("/", createTransaction);

router.delete("/:id", deleteTransaction);

router.get("/:userId",getTransactionsByUserId);
export default router;
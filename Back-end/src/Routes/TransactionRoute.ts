import express from "express";
import { validate } from "../Middleware/Validator";
import { transactionSchema } from "../schema/transactionSchema";
import {
  createTransaction,
  deleteTransaction,
  getAllTransactions,
  updateTransaction,
} from "../Controller/TransactionController";
import { protect } from "../Controller/AuthController";
import { DashboardService, GenereateReport } from "../Controller/ReportController";
const Router = express.Router();
Router.get("/",protect, getAllTransactions);
Router.post("/", protect,validate(transactionSchema), createTransaction);
Router.patch("/:id", protect,updateTransaction);
Router.delete(
  "/:id",
  validate(transactionSchema),
  protect,
  deleteTransaction
);
Router.post("/report", protect, GenereateReport);
Router.get("/dashboard", protect, DashboardService);

export default Router;
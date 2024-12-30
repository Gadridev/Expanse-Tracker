import { Request, Response, NextFunction } from "express";
import Transaction from "../Model/Transaction";
import AppError from "../utils/AppError";
import asynchandler from "express-async-handler";

// Create a new transaction
export const createTransaction = asynchandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Create a new transaction
    const transaction = await Transaction.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        transaction,
      },
    });
  }
);

// Get all transactions
export const getAllTransactions = asynchandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const transactions = await Transaction.find().populate("userId");

    res.status(200).json({
      status: "success",
      results: transactions.length,
      data: {
        transactions,
      },
    });
  }
);
// Get a single transaction by ID
export const getTransaction = asynchandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await Transaction.findById(req.params.id).populate(
      "userId"
    );
    if (!transaction) {
      return next(new AppError("No transaction found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        transaction,
      },
    });
  }
);
// Update a transaction by ID
export const updateTransaction = asynchandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("userId");

    if (!transaction) {
      return next(new AppError("No transaction found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        transaction,
      },
    });
  }
);

// Delete a transaction by ID
export const deleteTransaction = asynchandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return next(new AppError("No transaction found with that ID", 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

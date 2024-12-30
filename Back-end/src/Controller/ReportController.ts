import expressAsyncHandler from "express-async-handler";
import { AuthRequest } from "./AuthController";
import AppError from "../utils/AppError";
import Transaction from "../Model/Transaction"; // Ensure you import the Transaction model
import { Response, NextFunction } from "express";

export const GenereateReport = expressAsyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    // Get the start date, end date, and category from the request body
    const user = req.user;
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return next(
        new AppError("Please provide a start date and end date", 400)
      );
    }
    const transactionTest = await Transaction.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
      userId: user._id,
    });
    console.log(transactionTest, new Date(startDate));
    // Aggregation pipeline for monthly revenue and expenses
    const monthlyReport = await Transaction.aggregate([
      {
        $match: {
          userId: user._id,
          date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $project: {
          year: { $year: "$date" },
          month: { $month: "$date" },
          amount: 1,
          categoryType: "$category.type",
        },
      },
      {
        $group: {
          _id: {
            year: "$year",
            month: "$month",
            categoryType: "$categoryType",
          },
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);
console.log(monthlyReport)
 

    // Aggregation pipeline for expense categories
    const expenseCategories = await Transaction.aggregate([
      {
        $match: {
          userId: user._id,
          date: { $gte: new Date(startDate), $lte: new Date(endDate) },
          "category.type": "Expense",
        },
      },
      {
        $group: {
          _id: "$category.name",
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $sort: {
          totalAmount: -1,
        },
      },
    ]);
    // Format the monthly report
    const formattedMonthlyReport = monthlyReport.reduce((acc, item) => {
      const monthName = new Date(
        item._id.year,
        item._id.month - 1
      ).toLocaleString("default", { month: "short" });
      const existingMonth = acc.find((m: any) => m.name === monthName);

      if (existingMonth) {
        if (item._id.categoryType) {
          existingMonth[item._id.categoryType.toLowerCase()] = item.totalAmount;
        }
      } else {
        acc.push({
          name: monthName,
          [item._id.categoryType
            ? item._id.categoryType.toLowerCase()
            : "undefined"]: item.totalAmount,
        });
      }

      return acc;
    }, []);

    // Format the expense categories
    const formattedExpenseCategories = expenseCategories.map((item) => ({
      name: item._id,
      value: item.totalAmount,
    }));

    res.status(200).json({
      status: "success",
      data: {
        monthlyReport: formattedMonthlyReport,
        expenseCategories: formattedExpenseCategories,
      },
    });
  }
);

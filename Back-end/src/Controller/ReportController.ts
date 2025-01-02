import expressAsyncHandler from "express-async-handler";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";
import { AuthRequest } from "./AuthController";
import AppError from "../utils/AppError";
import Transaction from "../Model/Transaction"; // Ensure you import the Transaction model
import { Response, NextFunction } from "express";
import ConvertToMonth from "../utils/ConvertToMonth";

export const GenereateReport = expressAsyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    // Get the start date, end date, and category from the request body
    const user = req.user;
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const { startDate, endDate } = req.body;
    if (isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate))) {
      return next(new AppError("Invalid date format provided", 400));
    }

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
    console.log("month",monthlyReport);

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
 const formattedMonthlyReport= ConvertToMonth(monthlyReport)
    // Format the expense categories
    const formattedExpenseCategories = expenseCategories.map((item) => ({
      name: item._id,
      value: item.totalAmount,
    }));
    const ExpenseHeatmap = await Transaction.aggregate([
      {
        $match: {
          userId: user._id,
          date: { $gte: new Date(startDate), $lte: new Date(endDate) },
          "category.type": "Expense",
        },
      },
      {
        $project: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          time: { $dateToString: { format: "%H:%M", date: "$date" } },
          amount: 1,
          categoryType: "$category.name",
        },
      },
      {
        $group: {
          _id: {
            date: "$date",
            time: "$time",
          },
          totalAmount: { $sum: "$amount" },
          categoryType: { $first: "$categoryType" },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id.date",
          time: "$_id.time",
          totalAmount: 1,
          categoryType: 1,
        },
      },
    ]);
    console.log("test", ExpenseHeatmap);
    res.status(200).json({
      status: "success",
      data: {
        monthlyReport: formattedMonthlyReport,
        expenseCategories: formattedExpenseCategories,
        expenseHeatmap: ExpenseHeatmap,
      },
    });
  }
);
export const DashboardService = expressAsyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const lastMonthStartDate = startOfMonth(subMonths(new Date(), 1));
    const lastMonthEndDate = endOfMonth(subMonths(new Date(), 1));
    console.log(lastMonthStartDate, lastMonthEndDate);
    const user = req.user;
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    const totalRevenueLastMonth = await Transaction.aggregate([
      {
        $match: {
          userId: user._id,
          date: { $gte: lastMonthStartDate, $lte: lastMonthEndDate },
          "category.type": "Revenue",
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);
console.log(user._id)
    // Calculate total expense from last month
    const totalExpenseLastMonth = await Transaction.aggregate([
      {
        $match: {
          userId: user._id,
          date: { $gte: lastMonthStartDate, $lte: lastMonthEndDate },
          "category.type": "Expense",
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);
    const pendingTransactionCount = await Transaction.aggregate([
      {
        $match: {
          userId: user._id,
          status: "pending",
          date: { $gte: lastMonthStartDate, $lte: lastMonthEndDate },
        },
      },
      {
        $count: "totalPendingCount",
      },
    ]);
    const monthlyExpense = await Transaction.aggregate([
      {
        $match: {
          userId: user._id
        },
      },
      {
        $project: {
          year: { $year: "$date" },
          month: { $month: "$date" },
          amount: 1,
          categoryType: "Expense",
        },
      },
      {
        $group: {
          _id: {
            year: "$year",
            month: "$month",
            categoryType: "Expense",
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
    const ExpenseByMonth = ConvertToMonth(monthlyExpense);
    
    
  
    res.status(200).json({
      status: "success",
      data: { totalExpenseLastMonth, totalRevenueLastMonth,pendingTransactionCount,ExpenseByMonth },
    });
  }
);

import mongoose, { Schema, model, Document } from "mongoose";

interface ICategory {
  name: string;
  type: string;
}

interface ITransaction extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  description: string;
  category: ICategory;
  status: string;
  date: Date;
  amount: number;
}
const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const transactionSchema = new Schema<ITransaction>({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: categorySchema,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
    set: (val: string) => new Date(val)
  },
  amount: {
    type: Number,
    required: true,
  },
});
transactionSchema.index({ userId: 1, date: 1, "category.type": 1 });
const Transaction = model<ITransaction>("Transaction", transactionSchema);
export default Transaction;

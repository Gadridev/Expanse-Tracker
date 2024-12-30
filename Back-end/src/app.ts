import express from "express";
import UserRoute from "./Routes/UserRoute";
import TransactionRoute from "./Routes/TransactionRoute";

import cookieParser from 'cookie-parser';
import globalErrorHandler from "./Middleware/errorMiddleware";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/users", UserRoute);
app.use("/api/v1/transactions", TransactionRoute);
app.use(globalErrorHandler);

export default app;
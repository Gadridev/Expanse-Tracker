import app  from "./app";
import dotenv from "dotenv"
import connectDB from "./config/db";
import { env } from "node:process";
dotenv.config({path:'./config.env'})
const PORT = process.env.PORT || 5000;
console.log(env.PORT)
connectDB()
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
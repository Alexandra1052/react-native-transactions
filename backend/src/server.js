import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js"; // Adjust the path as necessary
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js"; // Adjust the path as necessary
const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(rateLimiter);
app.use(express.json()); //middleware to parse JSON bodies



app.get("/health", (req, res) => {
  res.send("Welcome to the Transactions API");   
   });



app.use("/api/transactions", transactionsRoute); // Use the transactions route

initDB().then(()=>{
    app.listen(PORT,() => {
        console.log("Server is running on port " + PORT);
    });
})
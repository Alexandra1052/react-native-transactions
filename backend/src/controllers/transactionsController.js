 import { sql } from "../config/db.js"; 
 export async function getTransactionsByUserId(req,res){
  
      try {
       const { userId } = req.params;
         console.log("Fetching transactions for user:", userId);
       
          const transactions =await sql`
         SELECT * FROM transactions
         WHERE user_id = ${userId} ORDER BY created_at DESC;`
         res.status(200).json(transactions);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    
}

export async function createTransaction (req,res){
    const { user_id, title, amount, category } = req.body;
      try {
        if(!user_id || !title || !amount || !category) {
          return res.status(400).json({ error: "All fields are required" });
        }
        const result = await sql`
          INSERT INTO transactions (user_id, title, amount, category)
          VALUES (${user_id}, ${title}, ${amount}, ${category})
          RETURNING *;
        `;
        res.status(201).json(result[0]);
      } catch (err) {
        console.error("Error inserting transaction:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
}
export async function deleteTransaction(req, res) {
     try {
          const { id } = req.params;
          if(isNaN(parseInt(id))) {
            return res.status(400).json({ error: "Invalid transaction ID" });
          }
        const result = await sql`
          DELETE FROM transactions
          WHERE id = ${id}
          RETURNING *;
        `;
        if (result.length === 0) {
          return res.status(404).json({ error: "Transaction not found" });
        }
        res.status(200).json({ message: "Transaction deleted successfully", transaction: result[0] });
      } catch (err) {
        console.error("Error deleting transaction:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
}

export async function getSummaryByUserId(req, res) {
     try {
        const { userId } = req.params;
        const balanceResult = await sql`
            SELECT COALESCE(SUM(amount),0) AS balance
            FROM transactions
            WHERE user_id = ${userId};
        `;
        const incomeResult = await sql`
            SELECT COALESCE(SUM(amount),0) AS income
            FROM transactions
            WHERE user_id = ${userId} AND amount > 0;
        `;
        const expenseResult = await sql`
            SELECT COALESCE(SUM(amount),0) AS expense
            FROM transactions
            WHERE user_id = ${userId} AND amount < 0;
        `;
        res.status(200).json({
            balance: balanceResult[0].balance,
            income: incomeResult[0].income,
            expense: expenseResult[0].expense,
            net: balanceResult[0].balance + incomeResult[0].income - expenseResult[0].expense
        });
        // income +   expense -  amount >0    amount<0 
    } catch (error) {
        console.error("Error fetching transaction summary:", error);
        res.status(500).json({ error: "Internal Server Error" });
        
    }
}
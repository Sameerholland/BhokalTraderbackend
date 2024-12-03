const db = require("../db");

exports.QueryForm = async (req, res) => {
  const { Full_Name, Contact_Number, email_address, Message } = req.body;

  if (!Full_Name || !Contact_Number || !email_address || !Message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  console.log("Query Function Called");

  try {
    // Use parameterized query to prevent SQL injection
    const sql =
      "INSERT INTO query (Full_Name, Contact_Number, email_address, Message) VALUES (?, ?, ?, ?)";
    const values = [Full_Name, Contact_Number, email_address, Message];

    // Execute the query
    db.query(sql, values, (error, result) => {
      if (error) {
        console.error("Database Error:", error);
        return res.status(500).json({ error: "Database operation failed" });
      }
      console.log("Query Inserted ID:", result.insertId);
      res
        .status(200)
        .json({
          message: "Your query has been accepted",
          data: result.insertId,
        });
    });
  } catch (error) {
    console.error("Error in QueryForm:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

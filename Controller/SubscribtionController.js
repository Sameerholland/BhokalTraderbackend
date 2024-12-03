const db = require("../db");

exports.subscription = async function (req, res) {
  const { email_address } = req.body;

  // Validate input
  if (!email_address || !/\S+@\S+\.\S+/.test(email_address)) {
    return res.status(400).json({ error: "Invalid or missing email address" });
  }

  console.log("Subscription API Called");

  try {
    // Use a parameterized query to prevent SQL injection
    const sql = "INSERT INTO newsletter (email_address) VALUES (?)";
    const values = [email_address];

    db.query(sql, values, (error, result) => {
      if (error) {
        console.error("Database Error:", error);
        return res.status(500).json({ error: "Failed to subscribe" });
      }
      console.log("Subscription Successful:", result.insertId);
      res.status(200).json({
        message: "Subscription successful",
        subscriptionId: result.insertId,
      });
    });
  } catch (error) {
    console.error("Error in Subscription API:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

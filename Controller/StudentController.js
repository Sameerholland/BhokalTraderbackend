const db = require("../db");

exports.getAllStudents = async (req, res) => {
  console.log("Get All Students API Invoked");

  // SQL query to fetch students
  const sql = "SELECT Name, Id, email_address, Contact_Number, Course_Id FROM users";

  // Execute query
  db.query(sql, (error, result) => {
    if (error) {
      console.error("Database Error:", error);
      return res.status(500).json({ error: "Failed to retrieve students" });
    }

    console.log("Students Retrieved:", result);
    res.status(200).json({ students: result });
  });
};

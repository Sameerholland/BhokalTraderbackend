const db = require("../db");

exports.GetCourse = async (req, res) => {
  console.log("Get Course API called");

  // Query to fetch all courses
  const sql = "SELECT * FROM course";

  // Execute query
  db.query(sql, (error, result) => {
    if (error) {
      console.error("Database Error:", error);
      return res.status(500).json({ error: "Failed to retrieve courses" });
    }
    console.log("Courses Retrieved:", result);  
    res.status(200).json({ courses: result });
  });
};

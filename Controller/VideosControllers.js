const db = require("../db");

exports.GetClasses = async (req, res) => {

  const { Id } = req.body;
  console.log(req.body, 'Get Classes API Called')

  if (!Id) {
    return res.status(400).json({ error: "Course ID is required" });
  }

  try {
    const sql = "SELECT * FROM videos WHERE Course_Id = ?";
    db.query(sql, [Id], (err, result) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ error: "Failed to fetch classes" });
      }
      console.log(result, 'Get ALL Classes API Called');
      
      res.status(200).json({ classes: result });
    });
  } catch (err) {
    console.error("Error in GetClasses:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.addClasses = async (req, res) => {
  console.log("Add Classes API Invoked");

  const { name, number, courseId, duration, format } = req.body;

  if (!name || !number || !courseId || !duration || !format ) {
    return res.status(400).json({ error: "All fields and a file are required" });
  }

  const videoName = req.file.filename; // Assuming multer handles file uploads

  try {
    const sql =
      "INSERT INTO videos (Classes_Name, Class_No,  Duration, Course_Id, path) VALUES (?, ?, ?, ?, ?)";
    const values = [name, number,  duration, courseId, videoName];

    db.query(sql, values, (error, result) => {
      if (error) {
        console.error("Database Error:", error);
        return res.status(500).json({ error: "Failed to add class" });
      }
      console.log("Class Added:", result.insertId);
      res.status(200).json({
        message: "Class added successfully",
        classId: result.insertId,
      });
    });
  } catch (err) {
    console.error("Error in addClasses:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

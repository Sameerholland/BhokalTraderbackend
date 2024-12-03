// const bcrypt = require("bcrypt");
// let db = require("../db");
// const { sentizeUser } = require("../Components");
// const jwt = require("jsonwebtoken");
// require("dotenv").config();
// const connection = db;
// exports.createUser = async (req, res) => {
//   console.log(req.body, "Create User API Called");
//   const { Name, Contact_Number, email_address, Course_Id } = req.body;
//   console.log(req.body.Name);
//   try {
//     const salt = await bcrypt.genSalt(10);
//     console.log(salt);
//     const hashpassword = await bcrypt.hash(req.body.password, salt);
//     console.log(hashpassword);
//     connection.connect(function (error) {
//       if (error) throw error;
//       let sql =
//         "insert into users (Name, Contact_Number, email_address, password,salt, Course_Id) values ('" +
//         Name +
//         "', '" +
//         Contact_Number +
//         "','" +
//         email_address +
//         "','" +
//         hashpassword +
//         "','" +
//         salt +
//         "' , '" +
//         Course_Id +
//         "')";
//       db.query(sql, function (error, result) {
//         if (error) throw error;
//         console.log(result.insertId);
//         res.status(200).json(result.insertId);
//       });
//     });
//   } catch (err) {
//     console.log(err);
//   }
// };

// exports.loginuser = async (req, res) => {
//   console.log( "Login API Called");
//   res
//     .cookie("jwt", req.user.token, {
//       expires: new Date(Date.now() + 3660000),
//       secure:true,
//       httpOnly: true,
      
//     })
//     .status(201)
//     .json(sentizeUser(req.user));
// };

// exports.checkUser = async (req, res) => {
//   console.log("Check user API Called");
//   res.send(req.user);
// };

const bcrypt = require("bcrypt");
const db = require("../db"); // Ensure `db` is configured properly
const { sentizeUser } = require("../Components");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.createUser = async (req, res) => {
  console.log(req.body, "Create User API Called");

  const { Name, Contact_Number, email, password, Course_Id } = req.body;
  if (!Name || !Contact_Number || !email || !password || !Course_Id) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Generate salt and hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Parameterized query to prevent SQL injection
    const sql =
      "INSERT INTO users (Name, Contact_Number, email_address, password, salt, Course_Id) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [Name, Contact_Number, email, hashedPassword, salt, Course_Id];

    // Execute query
    db.query(sql, values, (error, result) => {
      if (error) {
        console.error("Database Error:", error);
        return res.status(500).json({ error: "Database operation failed" });
      }
      console.log("Inserted User ID:", result.insertId);
      res.status(200).json({ userId: result.insertId });
    });
  } catch (err) {
    console.error("Error in createUser:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.loginuser = async (req, res) => {
  console.log("Login API Called");
  if (!req.user || !req.user.token) {
    return res.status(400).json({ error: "Invalid login request" });
  }

  res
    .cookie("jwt", req.user.token, {
      expires: new Date(Date.now() + 3600000), // 1 hour
      secure: true,
      httpOnly: true,
    })
    .status(201)
    .json(sentizeUser(req.user));
};

exports.checkUser = async (req, res) => {
  console.log("Check User API Called");
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  res.status(200).json(req.user);
};

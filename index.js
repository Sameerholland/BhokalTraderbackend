const express = require("express");
const fs = require("fs");
const cors = require("cors");
const session = require('express-session');
const multer = require('multer')
const passport = require('passport');
const AuthRouter = require('./Routes/AuthRoute');
const ContactRouter = require('./Routes/ContactRoute');
const CourseRouter = require('./Routes/CourseRoute');
const SubscriptionRouter = require('./Routes/SubscribtionRoute');
const VideosRouter = require('./Routes/VideosRoute');
const StudentRouter = require('./Routes/StudentRoute');
const bodyParser = require('body-parser')

const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcrypt");
const cookieparser = require('cookie-parser')
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const path = require('path');
const { sentizeUser, cookieExtracter } = require("./Components");

require("dotenv").config()



const uploadDirectory = path.resolve(__dirname, 'uploads', 'imgs');







let db = require('./db');


const connection = db;




const app = express();
app.use(cookieparser())
const opts = {}
opts.jwtFromRequest = cookieExtracter;
opts.secretOrKey = process.env.SECERT_KEY;

app.use(express.static(path.resolve(__dirname, 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build'));
});




app.use(session({
  secret:process.env.SECERT_KEY,
  resave:false, // don't save session if is unmodified
  saveUninitialized:false,

}));

app.use(passport.authenticate('session'));



app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/imgs"); // Save to 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage });


app.use('/auth', AuthRouter.router);
app.use('/contact',ContactRouter.router);
app.use('/course',CourseRouter.router);
app.use('/subscription', SubscriptionRouter.router);
app.use('/class', VideosRouter.router);
app.use('/students',StudentRouter.router)



app.post("/upload", upload.single("file"), (req, res) => {
  const videoName = path.join(__dirname, req.file.filename);
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  console.log(req.body, file);
  const { Name, duration, recorded, live, demo, price } = req.body;

  try {
    connection.connect(function (error) {
      if (error) throw error;
      let sql =
        "insert into course (Name, Thumbnail, duration, Recorded_video, Live_Classes, Demo_Video, price ) values (?, ?, ?, ?, ?, ?, ?)";
      db.query(sql, [Name, videoName, duration, recorded, live, demo, price], function (error, result) {
        if (error) throw error;
        console.log(result);
        res.status(200).json({
          message: "File uploaded successfully",
          file: file.path,
        });
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get('/dashboard', async (req, res) => {
  try {
    const sql1 = "SELECT * FROM users";
    const sql2 = "SELECT * FROM course";
    const sql3 = "SELECT * FROM videos";
    
    // Use Promise.all() to run queries in parallel
    const [users, courses, videos] = await Promise.all([
      new Promise((resolve, reject) => {
        db.query(sql1, (err, result) => {
          if (err) reject("Failed to fetch users");
          else resolve(result);
        });
      }),
      new Promise((resolve, reject) => {
        db.query(sql2, (err, result) => {
          if (err) reject("Failed to fetch courses");
          else resolve(result);
        });
      }),
      new Promise((resolve, reject) => {
        db.query(sql3, (err, result) => {
          if (err) reject("Failed to fetch videos");
          else resolve(result);
        });
      })
    ]);

    // Send the response once all queries are completed
    res.json({ user: users, course: courses, video: videos });
    
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: error });
  }
});



app.get("/video", (req, res) => {
console.log("Function is invoke");
const range = req.headers.range;
const VideoPath = `${__dirname}/public/Videos/${req.query._id}`;
const VideoSize = fs.statSync(VideoPath).size;
const chunk = 10 ** 4;
const start = Number(range.replace(/\D/g, ""));
const end = Math.min(start + chunk, VideoSize - 1);
const contentlength = end - start + 1;

const headers = {
  "Content-Range": `bytes ${start}-${end}/${VideoSize}`,
  "Accept-Ranges": "bytes",
  "Content-Length": contentlength,
  "Content-Type": "video/mp4",
};


res.writeHead(206, headers);

const stream = fs.createReadStream(VideoPath, {
  start,
  end,
});

stream.pipe(res);
});
passport.use( 'local',
  
  new LocalStrategy({usernameField: 'Id',}, async (Id, password, done) => {
    console.log("Working-local", Id);
    
    const query = 'SELECT * FROM users WHERE Id = ?';
    connection.query(query, [Id], async (err, results) => {
      console.log(results,'results')
      if (err) return done(err);
      if (results.length === 0) return done(null, false, { message: 'Invalid Id.' });

      const user = results[0];
      const hashpassword = await bcrypt.hash(password , user.salt);

      console.log(hashpassword === user.password)

      if (hashpassword != user.password) return done(null, false, { message: 'Incorrect password.' })
     const token = jwt.sign(sentizeUser(user),process.env.SECERT_KEY)

      return done(null,{Id:user.Id, Course_Id:user.Course_Id,token,role:user.role});
    });
  })
);


passport.use('jwt', new JwtStrategy(opts, async function(jwt_payload, done) {
  console.log("working-jwt", { jwt_payload });
  try {
    const query = 'SELECT * FROM users WHERE Id = ?'; // Fixed query
    connection.query(query, [jwt_payload.Id], (err, results) => {
      console.log("jwt token working", results);

      if (err) return done(err);
      if (results[0]) {
        return done(null, sentizeUser(results[0]));
      } else {
        return done(null, false);
      }
    });
  } catch (err) {
    return done(err, false);
  }
}));



passport.serializeUser((user, done) => {
  console.log('Serelizeuser called')
  done(null, user.Id);
});

// Deserialize user from the session
passport.deserializeUser((Id, done) => {
  console.log('deserelizeuser called', Id)
  const query = 'SELECT * FROM users WHERE id = ?';
  connection.query(query, [Id], (err, results) => {
    if (err) return done(err);
    done(null, sentizeUser(results[0]));
  });
});



app.listen(8000, () => {
  console.log("Server is started at port 8000");
});

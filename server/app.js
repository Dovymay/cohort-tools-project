const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5005;
const cors = require("cors");
const mongoose = require("mongoose");
const StudentModel = require("./models/StudentModel");

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...
// const cohorts = require("./cohorts.json")
// const students = require("./students.json")

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
app.use(cors({
  origin: ["http://localhost:5173"]
}))

app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Connect to the DB
mongoose
  .connect("mongodb://localhost:27017/cohort-tools-api")
  .then(()=>{
    console.log("Connected!")
  })
  .catch((err) => console.log(err))

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

//Get all students
app.get("/api/students", (req, res) => {
  StudentModel.find({})
  .then((students) => {
    console.log("Students incoming", students);
    res.status(200).json(students);
  })
  .catch((error) => {
      console.error("Error while retrieving students ->", error);
      res.status(500).json({ error: "Failed to retrieve students" });
    });
})

//Get all students of specific cohort?
app.get("/api/students/cohort/:cohortId", (req, res) => {
  StudentModel.findById(req.params.cohortId)
  .then((allCohortStudents) => {
    console.log("Students incoming", allCohortStudents);
    res.status(200).json(allCohortStudents);
  })
  .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
})

//Returns the specified student by id
app.get("/api/students/:studentId", (req, res) => {
  StudentModel.findById(req.params.studentId)
  .then((oneStudent) => {
    console.log("Student incoming", oneStudent);
    res.status(200).json(oneStudent);
  })
  .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
})

//Create new student
app.post("/api/students", (req, res) => {
  StudentModel.create(req.body)
  .then(createdStudent => {
    console.log("Created!", createdStudent)
    res.status(201).json(createdStudent)
  })
  .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
})

//Updates the specified student by id
app.put("/api/students/:studentId", (req, res) => {
  StudentModel.findByIdAndUpdate(req.params.studentId, req.body, {new: true})
  .then(updatedStudent => {
    console.log("Updated student", updatedStudent)
    res.status(200).json(updatedBook)
  })
  .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
})

//Deletes the specified cohort by id
app.delete("/api/students/:studentId", (req, res) => {
  StudentModel.delete(req.params.studentId)
  .then((result) => {
    console.log("Deleted!");
    res.status(200).send("Student deleted");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
})


//Routes with Static data:
// app.get("/api/cohorts", (req, res) => {res.json(cohorts)})
// app.get("/api/students", (req, res) => {res.json(students)})

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
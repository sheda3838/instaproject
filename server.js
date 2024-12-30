const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const db = new sqlite3.Database("students.db");

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (CSS, JS, etc.)
app.use(express.static(path.join(__dirname, "public")));

// Create the database table if it doesn't exist
db.run(
  "CREATE TABLE IF NOT EXISTS students (id INTEGER PRIMARY KEY, name TEXT, phone TEXT)"
);

// Serve the HTML form
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Handle form submission
app.post("/submit", (req, res) => {
  const { name, phone } = req.body;
  db.run("INSERT INTO students (name, phone) VALUES (?, ?)", [name, phone], (err) => {
    if (err) {
      return res.status(500).send("Failed to save student data.");
    }
    res.send("Student data saved successfully! <a href='/'>Go back</a>");
  });
});

// View submitted data (admin route)
app.get("/admin", (req, res) => {
  db.all("SELECT * FROM students", [], (err, rows) => {
    if (err) {
      return res.status(500).send("Failed to fetch data.");
    }
    res.json(rows);
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

app.use(bodyParser.json());


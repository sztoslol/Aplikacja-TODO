const express = require("express");
const mysql = require("mysql2");
const app = express();

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "todoapp",
});

connection.connect((err) => {
    if (err) {
        console.error("Error connecting to database:", err);
    } else {
        console.log("Connected to database.");
    }
});

app.get("/users", (req, res) => {
    connection.query("SELECT * FROM użytkownicy", (err, results) => {
        if (err) {
            console.error("Error querying database:", err);
            res.status(500).send("Error querying database");
        } else {
            res.json(results);
        }
    });
});

app.listen(3010, () => {
    console.log("Server listening on port 3010");
});

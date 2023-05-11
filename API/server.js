const express = require("express");
const mysql = require("mysql2");
const app = express();

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

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

app.get("/users/:login", (req, res) => {
    const login = req.params.login;

    connection.query(
        "SELECT * FROM użytkownicy WHERE login = ?",
        [login],
        (err, results) => {
         if (err) {
                console.error("Error querying database:", err);
                res.status(500).send("Error querying database");
            } else {
                console.log(results);
                if (results.length === 0) {
                    res.json({ exists: false });
                } else {
                    const user = results[0];
                    res.json({ exists: true, user });
                }
            }
        }
    );
});

app.post("/users", (req, res) => {
    const { login, password } = req.body;
    connection.query(
        "INSERT INTO użytkownicy (login, hasło) VALUES (?, ?)",
        [login, password],
        (err, results) => {
            if (err) {
                console.error("Error querying database:", err);
                res.status(500).send("Error querying database");
            } else {
                console.log(`New user added with ID: ${results.insertId}`);
                res.status(200).send("User added successfully");
            }
        }
    );
});

app.listen(3010, () => {
    console.log("Server listening on port 3010");
});

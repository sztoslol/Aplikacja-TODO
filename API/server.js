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
    connection.query("SELECT * FROM users", (err, results) => {
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
        "SELECT * FROM users WHERE login = ?",
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
        "INSERT INTO users (login, password) VALUES (?, ?)",
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

app.get("/notes", (req, res) => {
    connection.query("SELECT * FROM notes", (err, results) => {
        if (err) {
            console.error("Error querying database:", err);
            res.status(500).send("Error querying database");
        } else {
            res.json(results);
        }
    });
});

app.post("/notes", (req, res) => {
    const { name, description } = req.body;
    connection.query(
        "INSERT INTO notes (name, description) VALUES (?, ?)",
        [name, description],
        (err, results) => {
            if (err) {
                console.error("Error querying database:", err);
                res.status(500).send("Error querying database");
            } else {
                console.log(`New note added with ID: ${results.insertId}`);
                res.status(200).send("Note added successfully");
            }
        }
    );
});

app.post("/tasks", (req, res) => {
    const { name, description, due_date, target_users } = req.body;

    const taskQuery = `INSERT INTO tasks (name, description, due_date) VALUES (?, ?, ?)`;
    connection.query(
        taskQuery,
        [name, description, due_date],
        (taskErr, taskResults) => {
            if (taskErr) {
                console.error("Error inserting task:", taskErr);
                res.status(500).send("Error inserting task");
            } else {
                const taskId = taskResults.insertId;

                const userIdsQuery = `SELECT id FROM users WHERE login IN (?)`;
                connection.query(
                    userIdsQuery,
                    [target_users],
                    (userIdsErr, userIdsResults) => {
                        if (userIdsErr) {
                            console.error(
                                "Error retrieving user IDs:",
                                userIdsErr
                            );
                            res.status(500).send("Error retrieving user IDs");
                        } else {
                            const userTaskValues = userIdsResults.map(
                                ({ id }) => [id, taskId]
                            );

                            const userTasksQuery = `INSERT INTO user_tasks (user_id, task_id) VALUES ?`;
                            connection.query(
                                userTasksQuery,
                                [userTaskValues],
                                (userTasksErr) => {
                                    if (userTasksErr) {
                                        console.error(
                                            "Error inserting user-task relationships:",
                                            userTasksErr
                                        );
                                        res.status(500).send(
                                            "Error inserting user-task relationships"
                                        );
                                    } else {
                                        console.log("Task added successfully");
                                        res.status(200).send(
                                            "Task added successfully"
                                        );
                                    }
                                }
                            );
                        }
                    }
                );
            }
        }
    );
});

app.listen(3010, () => {
    console.log("Server listening on port 3010");
});

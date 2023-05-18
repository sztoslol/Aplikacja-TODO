const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.use(cors());

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
        "SELECT * FROM users WHERE login = ? COLLATE utf8mb4_bin",
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

app.get("/tasks", (req, res) => {
    connection.query("SELECT * FROM tasks", (err, results) => {
        if (err) {
            console.error("Error querying database:", err);
            res.status(500).send("Error querying database");
        } else {
            res.json(results);
        }
    });
});

app.post("/tasks", (req, res) => {
    const { name, description, due_date, target_users } = req.body;
    const formattedDueDate = new Date(due_date);
    const year = formattedDueDate.getFullYear();
    const month = String(formattedDueDate.getMonth() + 1).padStart(2, "0");
    const day = String(formattedDueDate.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;

    const taskQuery = `INSERT INTO tasks (name, description, due_date) VALUES (?, ?, ?)`;
    connection.query(
        taskQuery,
        [name, description, formattedDate],
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

app.get("/tasks/:login", (req, res) => {
    const login = req.params.login;
    const filter = req.query.filter;

    let query = `
      SELECT t.*, ut.is_favorite
      FROM tasks t
      INNER JOIN user_tasks ut ON t.id = ut.task_id
      INNER JOIN users u ON u.id = ut.user_id`;

    if (login !== "none") {
        query += `
          WHERE u.login = ?`;
    }

    console.log(query);
    switch (filter) {
        case "saved":
            query += `
            AND t.id IN (
                SELECT task_id
                FROM user_tasks
                WHERE user_id = (
                    SELECT id
                    FROM users
                    WHERE login = ?
                )
                AND is_favorite = 1
            )`;
            break;
        case "completed":
            const today = new Date().toISOString().split("T")[0];
            query += `
            AND t.id IN (
                SELECT id
                FROM tasks
                WHERE id = t.id
                AND due_date <= '${today}'
            )`;
            break;
        case "upcoming":
            const today_upcoming = new Date().toISOString().split("T")[0];
            const threeDaysFromNow = new Date(
                Date.now() + 3 * 24 * 60 * 60 * 1000
            )
                .toISOString()
                .split("T")[0];
            query += ` AND t.due_date BETWEEN '${today_upcoming}' AND '${threeDaysFromNow}'`;
            console.log(query);
            break;
        default:
            console.log(query);
            break;
    }

    connection.query(query, [login, login], (err, results) => {
        if (err) {
            console.error("Error querying database:", err);
            res.status(500).send("Error querying database");
        } else {
            console.log(results);
            res.json(results);
        }
    });
});

app.put("/tasks/favorite", (req, res) => {
    const taskId = req.body.taskId;
    const userId = req.body.userId;
    const isFavorite = req.body.isFavorite;

    const query = `
      UPDATE user_tasks
      SET is_favorite = ?
      WHERE user_id = ?
      AND task_id = ?
    `;

    connection.query(query, [isFavorite, userId, taskId], (err, results) => {
        if (err) {
            console.error("Error updating task favorite status:", err);
            res.status(500).send("Error updating task favorite status");
        } else {
            res.sendStatus(200);
        }
    });
});

app.listen(3010, () => {
    console.log("Server listening on port 3010");
});

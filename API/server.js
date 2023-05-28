// Importowanie niezbędnych modułów
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const { v4: uuidv4 } = require("uuid");

// Tworzenie instancji aplikacji Express
const app = express();

// Ustawienie parsera dla żądań z kodowaniem URL
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Ustawienie nagłówków do obsługi CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

// Ustawienie obsługi CORS
app.use(cors());

// Tworzenie połączenia z bazą danych MySQL
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "todoapp",
});

// Nawiązywanie połączenia z bazą danych
connection.connect((err) => {
    if (err) {
        console.error("Error connecting to database:", err);
    } else {
        console.log("Connected to database.");
    }
});

/**
 * Uruchamia serwer nasłuchujący na porcie 3010.
 */
app.listen(3010, () => {
    console.log("Server listening on port 3010");
});

/**
 * =================================================================================
 * ===================================== 🅶🅴🆃 ======================================
 * =================================================================================
 */

/**
 * Endpoint zwraca tablice obiektów JSON o polach: {id, login, password, role}
 *
 * @returns {object[]} - Tablica zawierająca obiekty reprezentujące użytkowników.
 */
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

/**
 * Endpoint zwraca obiekt JSON o polach: {exists, user}.
 * Jeśli użytkownik o podanym loginie istnieje, pole exists będzie równa true,
 * a pole user zawiera informacje o użytkowniku z bazy danych.
 * W przeciwnym razie, pole exists będzie równa false.
 *
 * @param {string} req.params.login - Login użytkownika.
 * @returns {object} - Obiekt JSON zawierający wyniki zapytania do bazy danych.
 */
app.post("/login", (req, res) => {
    const { login, password, rememberMe } = req.body;

    connection.query(
        "SELECT * FROM users WHERE login = ? COLLATE utf8mb4_bin",
        [login],
        async (err, results) => {
            if (err) {
                console.error("Error querying database:", err);
                res.status(500).send("Error querying database");
            } else {
                if (results.length === 0) {
                    res.status(404).send("User not found");
                } else {
                    const user = results[0];
                    const passwordMatch = await bcrypt.compare(
                        password,
                        user.password
                    );
                    if (passwordMatch) {
                        const token = uuidv4();

                        const sessionData = {
                            user_id: user.id,
                            token: token,
                            expiration: rememberMe
                                ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                                : new Date(
                                      Date.now() + 1 * 24 * 60 * 60 * 1000
                                  ),
                            type: rememberMe ? "long" : "short",
                        };

                        connection.query(
                            "DELETE FROM sessions WHERE user_id = ?",
                            [sessionData.user_id],
                            (deleteErr) => {
                                if (deleteErr) {
                                    console.error(
                                        "Error deleting existing session:",
                                        deleteErr
                                    );
                                    res.status(500).send(
                                        "Error deleting existing session."
                                    );
                                } else {
                                    connection.query(
                                        "INSERT INTO sessions SET ?",
                                        sessionData,
                                        (insertErr) => {
                                            if (insertErr) {
                                                console.error(
                                                    "Error inserting session into database:",
                                                    insertErr
                                                );
                                                res.status(500).send(
                                                    "Error inserting into database."
                                                );
                                            } else {
                                                console.log(
                                                    "Session added to database"
                                                );
                                                res.status(200).send({
                                                    token: token,
                                                    expires:
                                                        sessionData.expiration,
                                                    type: sessionData.type,
                                                });
                                            }
                                        }
                                    );
                                }
                            }
                        );
                    } else {
                        res.status(401).send("Invalid password");
                    }
                }
            }
        }
    );
});

app.get("/session/:token", (req, res) => {
    const token = req.params.token.slice(1);
    if (!token) {
        return res.status(401).json({ message: "Token not provided" });
    }
    connection.query(
        "SELECT * FROM sessions WHERE token = ?",
        [token],
        (err, results) => {
            if (err) {
                console.error("Error querying database:", err);
                return res
                    .status(500)
                    .json({ message: "Error querying database" });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "Session not found" });
            }

            const session = results[0];
            const userId = session.user_id;

            connection.query(
                "SELECT * FROM users WHERE id = ?",
                [userId],
                (err, results) => {
                    if (err) {
                        console.error("Error querying database:", err);
                        return res
                            .status(500)
                            .json({ message: "Error querying database" });
                    }

                    if (results.length === 0) {
                        return res
                            .status(404)
                            .json({ message: "User not found" });
                    }

                    const user = results[0];
                    return res.status(200).json(user);
                }
            );
        }
    );
});

app.post("/logout/:token", (req, res) => {
    // Usunięcie `:` z początku tokenu
    const token = req.params.token.slice(1);

    if (!token) {
        return res.status(401).json({ message: "Token not provided" });
    }

    connection.query(
        "DELETE FROM sessions WHERE token = ?",
        [token],
        (err, results) => {
            if (err) {
                console.error("Error querying database:", err);
                return res
                    .status(500)
                    .json({ message: "Error querying database" });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "Session not found" });
            }

            return res.status(200).json({ message: "Logged out successfully" });
        }
    );
});

/**
 * Endpoint zwraca tablice obiektów JSON o polach: {id, name, description, created_at}
 *
 * @returns {object[]} - Tablica zawierająca obiekty reprezentujące notatki.
 */
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

/**
 * Endpoint zwraca tablice obiektów JSON o polach: {id, name, description, due_date, created_at, updated_at}
 *
 * @returns {object[]} - Tablica zawierająca obiekty reprezentujące zadania.
 */
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

/**
 * Pobiera zadania przypisane do określonego użytkownika.
 *
 * @param {string} req.params.login - Login użytkownika.
 * @param {string} req.query.filter - Opcjonalny parametr filtrujący: "saved" (zapisane), "completed" (ukończone), "upcoming" (nadchodzące).
 */
app.get("/tasks/:login", (req, res) => {
    const login = req.params.login;
    const filter = req.query.filter;

    let query = `
        SELECT t.*, ut.is_favorite
        FROM tasks t
        INNER JOIN user_tasks ut ON t.id = ut.task_id
        INNER JOIN users u ON u.id = ut.user_id
        WHERE u.login = ?`;

    switch (filter) {
        case "saved":
            // Warunek dla filtru "saved" - zwraca tylko zapisane zadania użytkownika
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
            // Warunek dla filtru "completed" - zwraca tylko ukończone zadania do dzisiejszej daty
            query += `
            AND t.id IN (
                SELECT id
                FROM tasks
                WHERE id = t.id
                AND due_date <= '${today}'
            )`;
            break;
        case "upcoming":
            const today_upcoming = new Date();
            today_upcoming.setHours(0, 0, 0, 0);
            const tomorrow = new Date(
                today_upcoming.getTime() + 24 * 60 * 60 * 1000
            );
            const threeDaysFromNow = new Date(
                today_upcoming.getTime() + 3 * 24 * 60 * 60 * 1000
            );
            const tomorrowFormatted = tomorrow.toISOString().split("T")[0];
            const threeDaysFromNowFormatted = threeDaysFromNow
                .toISOString()
                .split("T")[0];
            // Warunek dla filtru "upcoming" - zwraca tylko nadchodzące zadania od jutra do trzech dni w przód
            query += ` AND t.due_date > '${tomorrowFormatted}' AND t.due_date <= '${threeDaysFromNowFormatted}'`;
            break;
        default:
            break;
    }

    connection.query(query, [login, login], (err, results) => {
        if (err) {
            console.error("Error querying database:", err);
            res.status(500).send("Error querying database");
        } else {
            res.json(results);
        }
    });
});

/**
 * Endpoint zwraca listę użytkowników przypisanych do zadania o podanym identyfikatorze.
 *
 * @param {string} req.params.id - Identyfikator zadania.
 * @returns {object} - Obiekt JSON z listą użytkowników przypisanych do zadania lub błąd.
 */
app.get("/tasks/:id/users", (req, res) => {
    const taskId = req.params.id;

    const getUsersQuery = `
        SELECT users.login
        FROM users
        JOIN user_tasks ON users.id = user_tasks.user_id
        WHERE user_tasks.task_id = ?
    `;

    connection.query(getUsersQuery, [taskId], (err, results) => {
        if (err) {
            console.error("Error retrieving users:", err);
            res.status(500).send("Error retrieving users");
        } else {
            console.log(results);
            const users = results.map((user) => user.login);
            res.status(200).json(users);
        }
    });
});

/**
 * ================================================================================
 * ==================================== 🅟🅞🅢🅣 ====================================
 * ================================================================================
 */

/**
 * Endpoint dodaje nowego użytkownika do bazy danych.
 *
 * @param {string} req.body.login - Login nowego użytkownika.
 * @param {string} req.body.password - Hasło nowego użytkownika.
 */
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

/**
 * Dodaje nową notatkę do bazy danych.
 *
 * @param {string} req.body.name - Nazwa notatki.
 * @param {string} req.body.description - Opis notatki.
 */
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

/**
 * Dodaje nowe zadanie do bazy danych.
 *
 * @param {string} req.body.name - Nazwa zadania.
 * @param {string} req.body.description - Opis zadania.
 * @param {string} req.body.due_date - Data terminu zadania w formacie "YYYY-MM-DD".
 * @param {Array<string>} req.body.target_users - Tablica zawierająca loginy użytkowników, do których przypisane jest zadanie.
 */
app.post("/tasks", (req, res) => {
    const { name, description, due_date, target_users } = req.body;

    // Formatowanie daty terminu zadania
    const formattedDueDate = new Date(due_date);
    const year = formattedDueDate.getFullYear();
    const month = String(formattedDueDate.getMonth() + 1).padStart(2, "0");
    const day = String(formattedDueDate.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;

    // Zapytanie wstawiające zadanie do bazy danych
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

                // Zapytanie pobierające identyfikatory użytkowników
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
                            // Tworzenie wartości dla tabeli user_tasks
                            const userTaskValues = userIdsResults.map(
                                ({ id }) => [id, taskId]
                            );

                            // Zapytanie wstawiające relacje między użytkownikami a zadaniem
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

/**
 * ================================================================================
 * ===================================== 🅟🅤🅣 =====================================
 * ================================================================================
 */

/**
 * Aktualizuje status ulubionego zadania dla użytkownika.
 *
 * @returns {Object} Odpowiedź z kodem stanu 200 w przypadku powodzenia.
 */
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

/**
 * Endpoint aktualizuje notatkę o podanym identyfikatorze.
 *
 * @param {string} req.params.id - Identyfikator notatki.
 * @param {string} req.body.name - Nowa nazwa notatki.
 * @param {string} req.body.description - Nowy opis notatki.
 * @returns {object} - Obiekt JSON z odpowiedzią.
 */
app.put("/notes/:id", (req, res) => {
    const noteId = req.params.id;
    const { name, description } = req.body;

    const updateNoteQuery =
        "UPDATE notes SET name = ?, description = ? WHERE id = ?";
    connection.query(
        updateNoteQuery,
        [name, description, noteId],
        (err, result) => {
            if (err) {
                console.error("Error updating note:", err);
                res.status(500).send("Error updating note");
            } else {
                if (result.affectedRows === 0) {
                    res.status(404).send("Note not found");
                } else {
                    res.sendStatus(200);
                }
            }
        }
    );
});

/**
 * Endpoint aktualizuje zadanie o podanym identyfikatorze.
 *
 * @param {string} req.params.id - Identyfikator zadania.
 * @param {string} req.body.name - Nowa nazwa zadania.
 * @param {string} req.body.description - Nowy opis zadania.
 * @param {string} req.body.due_date - Nowa data do wykonania zadania.
 * @param {Array<string>} req.body.target_users - Tablica użytkowników do aktualizacji.
 * @returns {object} - Obiekt JSON z odpowiedzią.
 */
app.put("/tasks/:id", (req, res) => {
    const taskId = req.params.id;
    const { name, description, due_date, target_users } = req.body;
    const formattedDueDate = new Date(due_date);
    const year = formattedDueDate.getFullYear();
    const month = String(formattedDueDate.getMonth() + 1).padStart(2, "0");
    const day = String(formattedDueDate.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;

    const updateTaskQuery = `UPDATE tasks SET name = ?, description = ?, due_date = ? WHERE id = ?`;
    connection.query(
        updateTaskQuery,
        [name, description, formattedDate, taskId],
        (updateTaskErr, updateTaskResults) => {
            if (updateTaskErr) {
                console.error("Error updating task:", updateTaskErr);
                res.status(500).send("Error updating task");
            } else {
                const deletePreviousUsersQuery = `DELETE FROM user_tasks WHERE task_id = ?`;
                connection.query(
                    deletePreviousUsersQuery,
                    [taskId],
                    (deleteUsersErr) => {
                        if (deleteUsersErr) {
                            console.error(
                                "Error deleting previous user-task relationships:",
                                deleteUsersErr
                            );
                            res.status(500).send(
                                "Error deleting previous user-task relationships"
                            );
                        } else {
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
                                        res.status(500).send(
                                            "Error retrieving user IDs"
                                        );
                                    } else {
                                        const userTaskValues =
                                            userIdsResults.map(({ id }) => [
                                                id,
                                                taskId,
                                            ]);

                                        const insertUserTasksQuery = `INSERT INTO user_tasks (user_id, task_id) VALUES ?`;
                                        connection.query(
                                            insertUserTasksQuery,
                                            [userTaskValues],
                                            (insertUserTasksErr) => {
                                                if (insertUserTasksErr) {
                                                    console.error(
                                                        "Error inserting user-task relationships:",
                                                        insertUserTasksErr
                                                    );
                                                    res.status(500).send(
                                                        "Error inserting user-task relationships"
                                                    );
                                                } else {
                                                    console.log(
                                                        "Task updated successfully"
                                                    );
                                                    res.status(200).send(
                                                        "Task updated successfully"
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
            }
        }
    );
});

/**
 * =================================================================================
 * =================================== 🅳🅴🅻🅴🆃🅴 ===================================
 * =================================================================================
 */

/**
 * Endpoint usuwa zadanie o podanym identyfikatorze.
 *
 * @param {string} req.params.id - Identyfikator zadania.
 * @returns {object} - Obiekt JSON z odpowiedzią.
 */
app.delete("/tasks/:id", (req, res) => {
    const taskId = req.params.id;

    const deleteTaskQuery = "DELETE FROM tasks WHERE id = ?";
    connection.query(deleteTaskQuery, [taskId], (err, result) => {
        if (err) {
            console.error("Error deleting task:", err);
            res.status(500).send("Error deleting task");
        } else {
            if (result.affectedRows === 0) {
                res.status(404).send("Task not found");
            } else {
                res.sendStatus(200);
            }
        }
    });
});

/**
 * Endpoint usuwa notatkę o podanym identyfikatorze.
 *
 * @param {string} req.params.id - Identyfikator notatki.
 * @returns {object} - Obiekt JSON z odpowiedzią.
 */
app.delete("/notes/:id", (req, res) => {
    const noteId = req.params.id;

    const deleteNoteQuery = "DELETE FROM notes WHERE id = ?";
    connection.query(deleteNoteQuery, [noteId], (err, result) => {
        if (err) {
            console.error("Error deleting note:", err);
            res.status(500).send("Error deleting note");
        } else {
            if (result.affectedRows === 0) {
                res.status(404).send("Note not found");
            } else {
                res.sendStatus(200);
            }
        }
    });
});

import "./addTaskForm.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddTaskForm = ({ handleCloseForm, editData }) => {
    const [users, setUsers] = useState([]);
    const [dropdownVisibility, setDropdownVisibility] = useState("none");
    const [editUsers, setEditUsers] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3010/users")
            .then((response) => response.json())
            .then((data) => setUsers(data))
            .catch((error) => console.error(error));
        Object.keys(editData).length > 0 &&
            fetch(`http://localhost:3010/tasks/${editData.id}/users`)
                .then((response) => response.json())
                .then((data) => setEditUsers(data))
                .catch((error) => console.error(error));
    }, []);

    console.log(editUsers);

    const handleButtonClick = (values) => {
        fetch("http://localhost:3010/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error adding task");
                }
                console.log("Task added successfully");
                handleCloseForm();
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const truncatedText = (text) => {
        return text.length > 30 ? text.slice(0, 30) + "..." : text;
    };

    return (
        <div className='taskForm-main'>
            <div className='taskForm-header'>Zadanie</div>
            <div className='taskForm-subheader'>
                {Object.keys(editData).length > 1
                    ? "Aby edytować zadanie wypełnij pola poniżej"
                    : "Aby dodać zadanie wypełnij pola poniżej"}
            </div>

            <Formik
                initialValues={{
                    name: "",
                    description: "",
                    due_date: null,
                    target_users: [],
                }}
                validate={(values) => {
                    const errors = {};
                    if (!values.name) {
                        errors.name = "Uzupełnij to pole!";
                    }
                    if (!values.description) {
                        errors.description = "Uzupełnij to pole!";
                    }
                    if (!values.due_date) {
                        errors.due_date = "Uzupełnij to pole!";
                    }
                    if (values.target_users.length === 0) {
                        errors.target_users =
                            "Wybierz co najmniej jedną osobę!";
                    }
                    return errors;
                }}
                onSubmit={(values) => {
                    handleButtonClick(values);
                }}
            >
                {({ errors, touched, values, setFieldValue }) => (
                    <Form>
                        <div className='taskForm-input-taskname'>
                            <div className='taskForm-input-taskname-top'>
                                <div className='taskForm-input-taskname-text'>
                                    Nazwa zadania
                                </div>
                                <div className='login-input-top-dot'>
                                    <ErrorMessage
                                        name='name'
                                        component='div'
                                        className='form-error-text'
                                    />
                                    {errors.name && touched.name && (
                                        <div className='dot'></div>
                                    )}
                                </div>
                            </div>
                            <Field
                                type='text'
                                name='name'
                                className='taskForm-taskname'
                                placeholder='Przykładowa nazwa zadania'
                            />
                        </div>

                        <div className='taskForm-input-desc'>
                            <div className='taskForm-input-desc-top'>
                                <div className='taskForm-input-desc-text'>
                                    Opis zadania
                                </div>
                                <div className='login-input-top-dot'>
                                    <ErrorMessage
                                        name='description'
                                        component='div'
                                        className='form-error-text'
                                    />
                                    {errors.description &&
                                        touched.description && (
                                            <div className='dot'></div>
                                        )}
                                </div>
                            </div>
                            <Field
                                as='textarea'
                                name='description'
                                className='taskForm-desc'
                                placeholder='Przykładowy opis zadania'
                            />
                        </div>

                        <div className='datepicker-outer'>
                            <div className='datepicker-outer-top'>
                                <div className='datepicker-header'>
                                    Data wykonania
                                </div>
                                <div className='login-input-top-dot'>
                                    <ErrorMessage
                                        name='due_date'
                                        component='div'
                                        className='form-error-text'
                                    />
                                    {errors.due_date && touched.due_date && (
                                        <div className='dot'></div>
                                    )}
                                </div>
                            </div>
                            <Field name='due_date'>
                                {({ field }) => (
                                    <ReactDatePicker
                                        {...field}
                                        selected={values.due_date}
                                        onChange={(date) =>
                                            setFieldValue("due_date", date)
                                        }
                                        className='datepicker'
                                        dateFormat='yyyy-MM-dd'
                                        placeholderText='Wybierz datę wykonania'
                                    />
                                )}
                            </Field>
                        </div>

                        <div className='taskForm-dropdown'>
                            <div className='taskForm-dropdown-top'>
                                <div className='taskForm-dropdown-header'>
                                    Osoby
                                </div>
                                <div className='login-input-top-dot'>
                                    <ErrorMessage
                                        name='target_users'
                                        component='div'
                                        className='form-error-text'
                                    />
                                    {errors.target_users &&
                                        touched.target_users && (
                                            <div className='dot'></div>
                                        )}
                                </div>
                            </div>
                            <div
                                className='taskForm-dropdown-main'
                                onClick={() =>
                                    setDropdownVisibility(
                                        dropdownVisibility === "none"
                                            ? "block"
                                            : "none"
                                    )
                                }
                            >
                                {values.target_users.length <= 0
                                    ? "Wybierz osoby"
                                    : truncatedText(
                                          values.target_users.join(", ")
                                      )}
                                <div className='taskForm-dropdown-main-icon'>
                                    <FontAwesomeIcon icon={faChevronDown} />
                                </div>
                            </div>
                            <div
                                className='taskForm-dropdown-users'
                                style={{ display: dropdownVisibility }}
                            >
                                {users.length > 0 &&
                                    users.map((user) => (
                                        <div
                                            className={`taskForm-dropdown-element ${
                                                values.target_users.includes(
                                                    user.login
                                                )
                                                    ? "selected"
                                                    : ""
                                            }`}
                                            onClick={() => {
                                                const targetUsers =
                                                    values.target_users.includes(
                                                        user.login
                                                    )
                                                        ? values.target_users.filter(
                                                              (u) =>
                                                                  u !==
                                                                  user.login
                                                          )
                                                        : [
                                                              ...values.target_users,
                                                              user.login,
                                                          ];
                                                setFieldValue(
                                                    "target_users",
                                                    targetUsers
                                                );
                                            }}
                                            key={user.login}
                                        >
                                            {user.login}
                                            <FontAwesomeIcon
                                                icon={faCirclePlus}
                                                className='dropdown-icon'
                                            />
                                        </div>
                                    ))}
                            </div>
                        </div>

                        <button className='taskForm-button' type='submit'>
                            Potwierdź
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddTaskForm;

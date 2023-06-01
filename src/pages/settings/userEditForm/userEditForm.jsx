import "./userEditForm.css";
import { useState, useRef } from "react";
import { toast } from "react-toastify";

const UserEditForm = ({ userID, role, handleClose }) => {
    const dotLogin = useRef(null);
    const dotPassword = useRef(null);

    const errorLogin = useRef(null);
    const errorPassword = useRef(null);

    const [userData, setUserData] = useState({
        login: "",
        password: "",
        role: role || "user",
    });

    const addStyle = {
        position: "absolute",
        top: "14.7%",
        left: "68%",
        transform: "translate(-50%, -50%)",
    };

    const handleLoginInputChange = (event) => {
        setUserData((prevState) => ({
            ...prevState,
            login: event.target.value,
        }));
    };

    const handlePasswordInputChange = (event) => {
        setUserData((prevState) => ({
            ...prevState,
            password: event.target.value,
        }));
    };

    const handleRoleInputChange = (event) => {
        setUserData((prevState) => ({
            ...prevState,
            role: event.target.value,
        }));
    };

    const handleEditUser = () => {
        fetch(`http://localhost:3010/users/${userID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        })
            .then((response) => {
                if (response.ok) {
                    console.log("Użytkownik został zaktualizowany.");
                    handleClose();
                } else {
                    console.error(
                        "Błąd podczas aktualizacji użytkownika:",
                        response.status
                    );
                    toast.error("Użytkownik już istnieje", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
            })
            .catch((error) => {
                if (error.message.includes("500")) {
                    console.error("Błąd serwera");
                    toast.error("Błąd serwera", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
            });
    };

    const handleAddUser = () => {
        fetch("http://localhost:3010/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        })
            .then((response) => {
                if (response.ok) {
                    console.log("User added successfully");
                    handleClose();
                } else if (response.status === 409) {
                    toast.error("Użytkownik już istnieje", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                } else {
                    toast.error("Błąd serwera", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleButtonClick = () => {
        if (!userData.login) {
            dotLogin.current.style.display = "block";
            errorLogin.current.style.display = "block";
            errorLogin.current.textContent = "Uzupełnij to pole!";
        } else {
            dotLogin.current.style.display = "none";
            errorLogin.current.style.display = "none";
        }

        if (!userData.password) {
            dotPassword.current.style.display = "block";
            errorPassword.current.style.display = "block";
            errorPassword.current.textContent = "Uzupełnij to pole!";
        } else {
            dotPassword.current.style.display = "none";
            errorPassword.current.style.display = "none";
        }

        role ? handleEditUser() : handleAddUser();
    };

    return (
        <div
            className={
                "userEditForm-main animate__animated " +
                (role ? "animate__fadeInUp" : "animate__fadeInRight")
            }
            style={role ? {} : addStyle}
        >
            {!role && (
                <div className='userEditForm-header'>Dodaj użytkownika</div>
            )}
            <div className='userEditForm-input-login'>
                <div className='userEditForm-input-login-top'>
                    <div className='userEditForm-input-login-text'>
                        Nowy login
                    </div>
                    <div className='login-input-top-dot'>
                        <div className='form-error-text' ref={errorLogin}>
                            Debug
                        </div>
                        <div className='dot' ref={dotLogin}></div>
                    </div>
                </div>

                <input
                    className='userEditForm-input-login-input'
                    placeholder='Wpisz nowy login'
                    value={userData.login}
                    onChange={handleLoginInputChange}
                ></input>
            </div>
            <div className='userEditForm-input-password'>
                <div className='userEditForm-input-password-top'>
                    <div className='userEditForm-input-password-text'>
                        Nowe hasło
                    </div>
                    <div className='login-input-top-dot'>
                        <div className='form-error-text' ref={errorPassword}>
                            Debug
                        </div>
                        <div className='dot' ref={dotPassword}></div>
                    </div>
                </div>

                <input
                    type='password'
                    className='userEditForm-input-password-input'
                    placeholder='Wpisz nowe hasło'
                    value={userData.password}
                    onChange={handlePasswordInputChange}
                ></input>
            </div>
            <div className='userEditForm-input-radio'>
                <div className='radio-input'>
                    <label>
                        <input
                            type='radio'
                            id='admin'
                            name={"radio" + userID}
                            value='admin'
                            checked={userData.role === "admin"}
                            onChange={handleRoleInputChange}
                        />
                        <span>Admin</span>
                    </label>
                    <label>
                        <input
                            type='radio'
                            id='user'
                            name={"radio" + userID}
                            value='user'
                            checked={userData.role === "user"}
                            onChange={handleRoleInputChange}
                        />
                        <span>User</span>
                    </label>
                    <span className='selection'></span>
                </div>
            </div>
            <button
                className='userEditForm-button'
                onClick={() => handleButtonClick()}
            >
                Potwierdź
            </button>
        </div>
    );
};

export default UserEditForm;

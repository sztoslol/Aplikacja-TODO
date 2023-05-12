import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { getIsLoggedIn } from "../main/App";
import Cookies from "js-cookie";
import bcrypt from "bcryptjs";
import "./register.css";
import "animate.css";

/*
    Do zrobienia:
        - dokończyć walidacje formularza
        - dokończyć cookies (szyfrowanie danych)
        - zrobić dymek `onHover` przy labelu hasła z informacjami co hasło powinno zawierać 
*/

const Register = ({ onLogin }) => {
    const dotLogin = useRef(null);
    const dotPassword = useRef(null);
    const dotConfirmPassword = useRef(null);

    const errorLogin = useRef(null);
    const errorPassword = useRef(null);
    const errorConfirmPassword = useRef(null);

    const [userData, setUserData] = useState({
        login: "",
        password: "",
        confirmPassword: "",
        rememberMe: true,
    });
    const navigate = useNavigate();
    const regex =
        /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;

    useEffect(() => {
        getIsLoggedIn() && navigate("/");
    }, []);

    useEffect(() => {
        fetch("http://localhost:3010/users")
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Network response was not ok.");
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

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

    const handleConfirmPasswordInputChange = (event) => {
        setUserData((prevState) => ({
            ...prevState,
            confirmPassword: event.target.value,
        }));
    };

    const handleRememberMeInputChange = (event) => {
        setUserData((prevState) => ({
            ...prevState,
            rememberMe: event.target.checked,
        }));
    };

    const handleLoginLinkClick = () => {
        navigate("/login");
    };

    const handleAddUser = () => {
        if (
            !userData.login ||
            !userData.password ||
            !userData.confirmPassword
        ) {
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

            if (!userData.confirmPassword) {
                dotConfirmPassword.current.style.display = "block";
                errorConfirmPassword.current.style.display = "block";
                errorConfirmPassword.current.textContent = "Uzupełnij to pole!";
            } else {
                dotConfirmPassword.current.style.display = "none";
                errorConfirmPassword.current.style.display = "none";
            }
            return;
        }

        if (userData.login.length <= 3) {
            dotLogin.current.style.display = "block";
            errorLogin.current.style.display = "block";
            errorLogin.current.textContent = "Login jest za krótki!";
        } else {
            errorLogin.current.style.display = "none";
            dotLogin.current.style.display = "none";
        }

        if (userData.confirmPassword !== userData.password) {
            dotPassword.current.style.display = "block";
            dotConfirmPassword.current.style.display = "block";
            errorPassword.current.textContent = "Hasła nie mogą się rożnić!";

            errorConfirmPassword.current.style.display = "none";
            return;
        } else {
            dotPassword.current.style.display = "none";
        }

        if (!regex.test(userData.password)) {
            dotPassword.current.style.display = "block";
            dotConfirmPassword.current.style.display = "block";
            errorPassword.current.style.display = "block";
            errorPassword.current.textContent = "Nieprawidłowe hasło";
            return;
        } else {
            dotPassword.current.style.display = "none";
            dotConfirmPassword.current.style.display = "none";
            errorPassword.current.style.display = "none";
        }

        const hashedPassword = bcrypt.hashSync(userData.password, 10);

        /* Sprawdzenie, czy użytkownik o podanym loginie już istnieje
        fetch(`http://localhost:3010/users/${userData.login}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.exists) {
                    errorLogin.current.textContent =
                        "Użytkownik z podanym login już istnieje";
                    console.log("User with this login already exists");
                    return;
                }
                // Dodanie nowego użytkownika do bazy danych
                return fetch("http://localhost:3010/users", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        login: userData.login,
                        password: hashedPassword,
                    }),
                });
            })
            .then((response) => {
                if (response && response.ok) {
                    console.log("User added successfully");

                    if (userData.rememberMe) {
                        Cookies.set("isLoggedIn", true, { expires: 7 });

                        Cookies.set(
                            "user",
                            JSON.stringify({
                                login: userData.login,
                                password: bcrypt.hashSync(
                                    userData.password,
                                    10
                                ),
                                type: "user",
                            }),
                            { expires: 7 }
                        );
                    }

                    onLogin();
                } else {
                    throw new Error("Error adding user to database");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });*/
    };

    return (
        <>
            <div id='register-background'></div>
            <div id='register-main'>
                <div id='register-emotes'>👋🤗</div>
                <div id='register-header'>Witaj</div>
                <div id='register-subheader'>
                    Aby kontynuować zarejestruj się poniżej
                </div>

                <div className='register-input'>
                    <div className='register-input-top'>
                        <div className='register-input-top-text'>Login</div>
                        <div className='login-input-top-dot'>
                            <div
                                className='form-error-text'
                                id='error-register-login'
                                ref={errorLogin}
                            >
                                Debug
                            </div>
                            <div
                                className='dot animate__animated animate__heartBeat'
                                id='dot-register-login'
                                ref={dotLogin}
                            ></div>
                        </div>
                    </div>
                    <input
                        type='text'
                        className='register-input-login'
                        placeholder='Wprowadź login'
                        value={userData.login}
                        onChange={handleLoginInputChange}
                    />
                </div>

                <div className='register-input'>
                    <div className='register-input-top'>
                        <div className='register-input-top-text'>Hasło</div>
                        <div className='login-input-top-dot'>
                            <div
                                className='form-error-text'
                                id='error-register-password'
                                ref={errorPassword}
                            >
                                Debug
                            </div>
                            <div
                                className='dot animate__animated animate__heartBeat'
                                id='dot-register-password'
                                ref={dotPassword}
                            ></div>
                        </div>
                    </div>
                    <input
                        type='password'
                        className='register-input-login'
                        placeholder='Minimalnie 6 znaków'
                        value={userData.password}
                        onChange={handlePasswordInputChange}
                    />
                </div>

                <div className='register-input'>
                    <div className='register-input-top'>
                        <div className='register-input-top-text'>
                            Powtórz hasło
                        </div>
                        <div className='login-input-top-dot'>
                            <div
                                className='form-error-text'
                                id='error-register-confirmPassword'
                                ref={errorConfirmPassword}
                            >
                                Debug
                            </div>
                            <div
                                className='dot animate__animated animate__heartBeat'
                                id='dot-register-confirmPassword'
                                ref={dotConfirmPassword}
                            ></div>
                        </div>
                    </div>
                    <input
                        type='password'
                        className='register-input-login'
                        placeholder='Powtórz hasło'
                        value={userData.confirmPassword}
                        onChange={handleConfirmPasswordInputChange}
                    />
                </div>

                <div id='login-checkbox'>
                    <div className='cntr'>
                        <input
                            defaultChecked={true}
                            type='checkbox'
                            id='cbx'
                            className='hidden-xs-up'
                            onChange={handleRememberMeInputChange}
                        />
                        <label htmlFor='cbx' className='cbx'></label>
                    </div>
                    <div id='login-checkbox-text'>Zapamietaj mnie</div>
                </div>

                <button
                    type='button'
                    id='register-button-main'
                    onClick={handleAddUser}
                >
                    Zarejstruj się
                </button>

                <div id='register-separator'>
                    <div className='separator-line'></div>
                    <div className='separator-text'>Lub</div>
                    <div className='separator-line'></div>
                </div>

                <div id='login-section'>
                    <div id='login-section-text'>Masz już konto?</div>
                    <div id='login-section-link' onClick={handleLoginLinkClick}>
                        Zaloguj się!
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;

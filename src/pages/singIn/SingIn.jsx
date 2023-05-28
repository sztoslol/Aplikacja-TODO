import { useState, useEffect, useRef } from "react";
import { json, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import bcrypt from "bcryptjs";
import "./singin.css";
import "animate.css";

const SingIn = ({ onLogin, isLoggedIn }) => {
    const dotLogin = useRef(null);
    const dotPassword = useRef(null);

    const errorLogin = useRef(null);
    const errorPassword = useRef(null);

    const [userData, setUserData] = useState({
        login: "",
        password: "",
        rememberMe: true,
    });
    const navigate = useNavigate();

    useEffect(() => {
        isLoggedIn === true && navigate("/");
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

    const handleRememberMeInputChange = (event) => {
        setUserData((prevState) => ({
            ...prevState,
            rememberMe: event.target.checked,
        }));
    };

    const handleRegisterLinkClick = () => {
        navigate("/register");
    };

    const handleLogIn = () => {
        if (!userData.login || !userData.password) {
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
            return;
        } else {
            fetch("http://localhost:3010/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            `HTTP error! Status: ${response.status}`
                        );
                    }
                    return response.json();
                })
                .then((data) => {
                    onLogin(data);
                })
                .catch((error) => {
                    console.error("Błąd pobierania danych użytkownika:", error);

                    if (error.message.includes("500")) {
                        console.error("Błąd serwera");
                    } else if (error.message.includes("401")) {
                        console.error("Błędny login lub hasło");
                    } else {
                        console.error("Nieznany błąd");
                    }
                });
        }
    };

    return (
        <>
            <div id='login-background'></div>
            <div id='login-main'>
                <div id='login-emotes'>👋😁</div>
                <div id='login-header'>Witaj ponownie</div>
                <div id='login-subheader'>
                    Aby kontynuować zaloguj się poniżej
                </div>
                <div className='login-input'>
                    <div className='login-input-top'>
                        <div className='login-input-top-text'>Login</div>
                        <div className='login-input-top-dot'>
                            <div
                                className='form-error-text'
                                id='error-signin-confirmPassword'
                                ref={errorLogin}
                            >
                                Debug
                            </div>
                            <div
                                className='dot'
                                id='dot-login-login'
                                ref={dotLogin}
                            ></div>
                        </div>
                    </div>
                    <input
                        type='text'
                        className='login-input-login'
                        placeholder='Wprowadź login'
                        value={userData.login}
                        onChange={handleLoginInputChange}
                    />
                </div>

                <div className='login-input'>
                    <div className='login-input-top'>
                        <div className='login-input-top-text'>Hasło</div>
                        <div className='login-input-top-dot'>
                            <div
                                className='form-error-text'
                                id='error-signin-confirmPassword'
                                ref={errorPassword}
                            >
                                Debug
                            </div>
                            <div
                                className='dot'
                                id='dot-login-password'
                                ref={dotPassword}
                            ></div>
                        </div>
                    </div>
                    <input
                        type='password'
                        className='login-input-login'
                        placeholder='Wprowadź hasło'
                        value={userData.password}
                        onChange={handlePasswordInputChange}
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
                    id='login-button-main'
                    onClick={handleLogIn}
                >
                    Zaloguj się
                </button>

                <div id='login-separator'>
                    <div className='separator-line'></div>
                    <div className='separator-text'>Lub</div>
                    <div className='separator-line'></div>
                </div>

                <div id='register-section'>
                    <div id='register-section-text'>Nie masz konta? </div>
                    <div
                        id='register-section-link'
                        onClick={handleRegisterLinkClick}
                    >
                        Zarejestruj się
                    </div>
                </div>
            </div>
        </>
    );
};

export default SingIn;

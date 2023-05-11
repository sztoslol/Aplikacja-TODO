import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import "./singin.css";
import "animate.css";

const SingIn = ({ handleLogin }) => {
    const [userData, setUserData] = useState({
        login: "",
        password: "",
        rememberMe: false,
    });
    const navigate = useNavigate();

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

    /*TODO: Dokończyć*/
    const handleUserDataCheck = (data) => {
        if (userData.login !== data.login) console.log("Błędny login");

        bcrypt.compare(userData.password, data.hasło).then((match) => {
            if (match) {
                navigate("/");
            } else {
                console.log("Hasła się rożnią");
            }
        });

        handleLogin();
    };

    const handleLogIn = () => {
        if (!userData.login || !userData.password) return; // TODO: obsługa pustych pól formularza

        fetch(`http://localhost:3010/users/${userData.login}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.exists) {
                    handleUserDataCheck(data.user);
                } else {
                    console.log("Użytkownik nie istnieje");
                }
            })
            .catch((error) => {
                console.error("Błąd pobierania danych użytkownika:", error);
            });
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
                            <div className='dot' id='dot-login-login'></div>
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
                            <div className='dot' id='dot-login-password'></div>
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

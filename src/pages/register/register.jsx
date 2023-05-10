import { useState } from "react";
import { useNavigate } from "react-router";
import "./register.css";

const Register = () => {
    const [userData, setUserData] = useState({
        login: "",
        password: "",
        confirmPassword: "",
        rememberMe: false,
    });
    const navigate = useNavigate();

    console.log(userData);

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

    const handleButtonClick = () => {
        /*Dodac sprawdzanie danych*/
        navigate("/");
    };

    const handleLoginLinkClick = () => {
        navigate("/login");
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
                        <div className='register-input-top-dot'>
                            <div className='dot' id='dot-register-login'></div>
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
                        <div className='register-input-top-dot'>
                            <div
                                className='dot'
                                id='dot-register-password'
                            ></div>
                        </div>
                    </div>
                    <input
                        type='text'
                        className='register-input-login'
                        placeholder='Minimalnie 8 znaków'
                        value={userData.password}
                        onChange={handlePasswordInputChange}
                    />
                </div>

                <div className='register-input'>
                    <div className='register-input-top'>
                        <div className='register-input-top-text'>
                            Powtórz hasło
                        </div>
                        <div className='register-input-top-dot'>
                            <div
                                className='dot'
                                id='dot-register-confirmPassword'
                            ></div>
                        </div>
                    </div>
                    <input
                        type='text'
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
                    onClick={handleButtonClick}
                >
                    Zaloguj się
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

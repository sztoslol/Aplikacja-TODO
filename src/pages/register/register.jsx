import { useState } from "react";
import "./register.css";

const Register = () => {
    const [userData, setUserData] = useState({
        login: "",
        password: ["", ""],
        rememberMe: false,
    });

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
                            <div className='dot'></div>
                        </div>
                    </div>
                    <input
                        type='text'
                        className='register-input-login'
                        placeholder='Wprowadź login'
                    />
                </div>

                <div className='register-input'>
                    <div className='register-input-top'>
                        <div className='register-input-top-text'>Hasło</div>
                        <div className='register-input-top-dot'>
                            <div className='dot'></div>
                        </div>
                    </div>
                    <input
                        type='text'
                        className='register-input-login'
                        placeholder='Minimalnie 8 znaków'
                    />
                </div>

                <div className='register-input'>
                    <div className='register-input-top'>
                        <div className='register-input-top-text'>
                            Powtórz hasło
                        </div>
                        <div className='register-input-top-dot'>
                            <div className='dot'></div>
                        </div>
                    </div>
                    <input
                        type='text'
                        className='register-input-login'
                        placeholder='Powtórz hasło'
                    />
                </div>

                <div id='login-checkbox'>
                    <div className='cntr'>
                        <input
                            defaultChecked={true}
                            type='checkbox'
                            id='cbx'
                            className='hidden-xs-up'
                        />
                        <label htmlFor='cbx' className='cbx'></label>
                    </div>
                    <div id='login-checkbox-text'>Zapamietaj mnie</div>
                </div>

                <button type='button' id='register-button-main'>
                    Zaloguj się
                </button>

                <div id='register-separator'>
                    <div className='separator-line'></div>
                    <div className='separator-text'>Lub</div>
                    <div className='separator-line'></div>
                </div>

                <div id='login-section'>
                    <div id='login-section-text'>Masz już konto?</div>
                    <div id='login-section-link'>Zaloguj się!</div>
                </div>
            </div>
        </>
    );
};

export default Register;

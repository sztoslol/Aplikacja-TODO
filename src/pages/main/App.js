import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Dashboard from "../dashboard/dashboard.jsx";
import SingIn from "../singIn/singin";
import Register from "../register/register";
import ProtectedRoutes from "../../ProtectedRoutes";
import Cookies from "js-cookie";

const App = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState(
        sessionStorage.getItem("session")
            ? { token: sessionStorage.getItem("session").toString() }
            : { token: "" }
    );

    console.log("userdata", userData);
    console.log("loading", isLoading);
    console.log("logged", isLoggedIn);
    console.log("token", token);
    console.log(
        "============================================================================="
    );

    useEffect(() => {
        const sessionToken = sessionStorage.getItem("session");

        if (!sessionToken && Cookies.get("session")) {
            sessionStorage.setItem("session", Cookies.get("session"));
            sessionStorage.setItem("session_type", Cookies.get("session_type"));
            setToken({ token: Cookies.get("session") });
        } else if (sessionToken && token.token === "") {
            setToken({ token: sessionToken });
        }
    }, []);

    useEffect(() => {
        if (token.token !== "") {
            console.log("test", token.token);
            fetch(`http://localhost:3010/session/:${token.token}`)
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error("Failed");
                    }
                })
                .then((data) => {
                    setUserData(data);
                    setIsLoggedIn(true);
                    setIsLoading(false);
                    navigate("/");
                })
                .catch((error) => {
                    console.error("Error:", error);
                    navigate("/login");
                });
        }
    }, [token]);

    const handleLogin = (tokenData) => {
        if (tokenData.type !== "short") {
            Cookies.set("session", tokenData.token, {
                expires: new Date(tokenData.expires),
            });
            Cookies.set("session_type", tokenData.type, {
                expires: new Date(tokenData.expires),
            });
        }
        sessionStorage.setItem("session", tokenData.token);
        sessionStorage.setItem("session_type", tokenData.type);
        setToken(tokenData);
    };

    const handleLogOut = () => {
        fetch(`http://localhost:3010/logout/:${token.token}`, {
            method: "POST",
        })
            .then((response) => {
                if (response.ok) {
                    Cookies.remove("session");
                    Cookies.remove("session_type");
                    navigate("/login");
                } else {
                    console.error("Failed to log out");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    return (
        <Routes>
            <Route path='/login' element={<SingIn onLogin={handleLogin} />} />
            <Route
                path='/register'
                element={<Register onLogin={handleLogin} />}
            />
            <Route element={<ProtectedRoutes isLoggedIn={isLoggedIn} />}>
                <Route
                    path='/'
                    element={
                        <Dashboard
                            onLogOut={handleLogOut}
                            userData={userData}
                        />
                    }
                />
            </Route>
        </Routes>
    );
};

export default App;

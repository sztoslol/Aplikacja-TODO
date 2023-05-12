import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useState } from "react";
import Dashboard from "../dashboard/dashboard.jsx";
import SingIn from "../singIn/singin";
import Register from "../register/register";
import ProtectedRoutes from "../../ProtectedRoutes";
import Cookies from "js-cookie";

const App = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        if (Cookies.get("isLoggedIn") === "true") return true;
        else if (sessionStorage.getItem("isLoggedIn") == "true") return true;
        else return false;
    });

    const handleLogin = () => {
        sessionStorage.setItem("isLoggedIn", "true");
        setIsLoggedIn(() => {
            if (Cookies.get("isLoggedIn") === "true") return true;
            else if (sessionStorage.getItem("isLoggedIn") == "true")
                return true;
            else return false;
        });
        navigate("/");
    };

    return (
        <Routes>
            <Route
                path='/login'
                element={
                    <SingIn onLogin={handleLogin} isLoggedIn={isLoggedIn} />
                }
            />
            <Route
                path='/register'
                element={
                    <Register onLogin={handleLogin} isLoggedIn={isLoggedIn} />
                }
            />
            <Route element={<ProtectedRoutes isLoggedIn={isLoggedIn} />}>
                <Route path='/' element={<Dashboard />} />
            </Route>
        </Routes>
    );
};

export default App;

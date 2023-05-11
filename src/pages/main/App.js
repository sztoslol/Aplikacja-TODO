import "./App.css";
import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import Dashboard from "../dashboard/dashboard.jsx";
import SingIn from "../singIn/singin";
import Register from "../register/register";
import ProtectedRoutes from "../../ProtectedRoutes";
import Cookies from "js-cookie";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(
        Cookies.get("user") ? Cookies.get("isLoggedIn") : false
    );

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    return (
        <Routes>
            <Route path='/login' element={<SingIn onLogin={handleLogin} />} />
            <Route
                path='/register'
                element={<Register onLogin={handleLogin} />}
            />
            <Route element={<ProtectedRoutes isLoggedIn={isLoggedIn} />}>
                <Route path='/' element={<Dashboard />} />
            </Route>
        </Routes>
    );
};

export default App;

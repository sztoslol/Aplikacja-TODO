import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Dashboard } from "../dashboard/dashboard.jsx";
import SingIn from "../singIn/SingIn";
import ProtectedRoutes from "../../ProtectedRoutes";

const App = () => {
    return (
        <Routes>
            <Route path='/login' element={<SingIn />} />
            <Route element={<ProtectedRoutes />}>
                <Route path='/' element={<Dashboard />} />
            </Route>
        </Routes>
    );
};

export default App;
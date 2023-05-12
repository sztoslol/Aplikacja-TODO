import { Outlet, Navigate } from "react-router";

const ProtectedRoutes = ({ isLoggedIn }) => {
    return isLoggedIn ? <Outlet /> : <Navigate to='/login' />;
};

export default ProtectedRoutes;

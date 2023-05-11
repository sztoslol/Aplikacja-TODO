import { Outlet, Navigate } from "react-router";

const useAuth = () => {
    const user = { loggedIn: true };
    return user && user.loggedIn;
};

const ProtectedRoutes = () => {
    const isAuth = useAuth();
    return isAuth ? <Outlet /> : <Navigate to='/register' />;
};

export default ProtectedRoutes;

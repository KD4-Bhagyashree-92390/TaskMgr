import { Navigate } from "react-router";
import { isAuthenticated } from './../auth/auth';

function ProtectedRoute({ children, roles }) {

    const token = sessionStorage.getItem("token"); // using session storage
    const userRole = sessionStorage.getItem("role");

    // ✅ Not logged in
    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }

    // ✅ Role check (optional)
    if (roles && !roles.includes(userRole)) {
        return <Navigate to="/login" />;
    }

    return children;
}

export default ProtectedRoute;
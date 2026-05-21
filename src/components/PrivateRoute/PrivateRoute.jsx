// components/PrivateRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function AdminPrivateRoute({ children }) {
    const [auth, setAuth] = useState(null); // null = cargando

    useEffect(() => {
        fetch("https://one2onebackend.onrender.com/api/auth/me", {
            credentials: "include",
        })
            .then((res) => setAuth(res.ok))
            .catch(() => setAuth(false));
    }, []);

    if (auth === null) return null; // o un spinner
    if (!auth) return <Navigate to="/auth" />;
    return children;
}

export default AdminPrivateRoute;
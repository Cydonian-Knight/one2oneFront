// components/AdminRoute/AdminRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
    const [auth, setAuth] = useState(null);

    useEffect(() => {
        fetch("https://one2onebackend.onrender.com/api/admin/me", {
            credentials: "include",
        })
            .then((res) => setAuth(res.ok))
            .catch(() => setAuth(false));
    }, []);

    if (auth === null) return null;
    if (!auth) return <Navigate to="/auth" />;
    return children;
}

export default AdminRoute;
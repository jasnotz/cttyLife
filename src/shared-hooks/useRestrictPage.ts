import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function ProtectedRoute({ children }: { children: React.ReactNode; }) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const user = Cookies.get("user");

        if (user) {
            setIsAuthenticated(true);
        } else {
            navigate("/login");
        }
        setIsLoading(false);
    }, [navigate]);

    if (isLoading) {
        return "Loading...";
    }

    return isAuthenticated ? children : null;
}

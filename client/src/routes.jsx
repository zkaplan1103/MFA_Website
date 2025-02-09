import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Verify2FA from "./pages/Verify2FA";
import HomePage from "./pages/HomePage";
import Error from "./pages/Error";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />,
        errorElement: <Error />,
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: "/",
                element: <HomePage />,
                errorElement: <Error />,
            },
            {
                path: "/verify-2fa",
                element: <Verify2FA />,
                errorElement: <Error />,
            },
        ]
    }
]);

export default router;
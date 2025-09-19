// src/routes/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAuth } from "../utils/auth";

export default function ProtectedRoute({ allowedRoles }) {
  const location = useLocation();
  const auth = getAuth();
  const isLoggedIn = !!auth?.isLoggedIn;
  const role = auth?.role;

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}

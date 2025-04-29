import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/authContext";

interface IProtectedRoute {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: IProtectedRoute) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

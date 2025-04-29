import { Outlet } from "react-router";
import { AuthProvider } from "../hooks/authContext";
export const ProtectedRouteMod = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

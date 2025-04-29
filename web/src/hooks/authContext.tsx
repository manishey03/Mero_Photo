/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";

interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  bio?: string;
  contact?: string;
  image?: string;
}

interface AuthContextType {
  user: IUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // @ts-ignore
  useEffect(() => {
    const loggedInUser = Cookies.get("user");

    if (!loggedInUser) {
      // Clear auth cookies if user data is missing
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      Cookies.remove("user");
      setLoading(false); // Mark loading as complete
      return navigate("/login"); // Redirect to login page
    }

    try {
      const parsedUser: IUser = JSON.parse(loggedInUser);
      setUser(parsedUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
      Cookies.remove("user");
      navigate("/login");
    } finally {
      setLoading(false); // Mark loading as complete
    }
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading ? children : <p>Loading...</p>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

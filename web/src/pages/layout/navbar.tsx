/* eslint-disable @typescript-eslint/no-explicit-any */
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router";

import { MdLogout } from "react-icons/md";
import { FaBell, FaUserCircle } from "react-icons/fa";

import type { User } from "../../types/auth.types";
import { toast } from "react-toastify";
import axiosInstance from "../../config/axiosInstance";
import { useQuery } from "@tanstack/react-query";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const loggedInUser = Cookies.get("user");
  const backendUrl =
    import.meta.env.VITE_API_IMAGE_URL ?? "http://localhost:3000";

  const { data: userNotifications = { notifications: [], count: 0 } } =
    useQuery<{
      notifications: any[];
      count: number;
    }>({
      queryKey: ["notifications"],
      queryFn: async () => {
        const response = await axiosInstance.get("/user/notification");
        return {
          notifications: response.data?.data,
          count: response.data?.metadata?.count ?? 0,
        };
      },
    });

  const handleLogout = () => {
    Cookies.remove("user");
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    // Show a toast message
    toast.success("Logged out successfully!", {
      position: "top-right",
      autoClose: 500,
    });

    // Do hard reload after toast shows
    setTimeout(() => {
      window.location.href = "/"; // 💥 Hard reload + navigate to /
    }, 500); // same as toast duration
  };

  useEffect(() => {
    try {
      const parsedUser = loggedInUser ? JSON.parse(loggedInUser) : null;
      if (parsedUser) {
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Invalid JSON format:", error);
    }
  }, [loggedInUser, navigate]);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white z-50 shadow-md">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="container py-3 px-6 flex justify-between items-center relative"
      >
        {/* Logo Section */}
        <div>
          <h1 className="font-bold text-2xl">Mero Photo</h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:block">
          <ul className="flex items-center gap-4">
            {/* Always visible links */}
            <li>
              <RouterLink
                to="/"
                className="inline-block py-2 px-3 hover:text-secondary"
              >
                Home
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/photographers"
                className="inline-block py-2 px-3 hover:text-secondary"
              >
                Photographers
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/about-us"
                className="inline-block py-2 px-3 hover:text-secondary"
              >
                About Us
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/contact-us"
                className="inline-block py-2 px-3 hover:text-secondary"
              >
                Contact Us
              </RouterLink>
            </li>

            {user && user?._id ? (
              <>
                <li>
                  <RouterLink
                    to="/booking-request"
                    className="inline-block py-2 px-3 hover:text-secondary"
                  >
                    Bookings
                  </RouterLink>
                </li>

                {/* Notification Icon */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationOpen(!notificationOpen)}
                    className="relative p-4"
                  >
                    <FaBell className="text-2xl text-gray-700" />
                    {userNotifications?.count > 0 && (
                      <span className="absolute top-2 right-2 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.2rem] text-center">
                        {userNotifications?.count > 99
                          ? "99+"
                          : userNotifications?.count}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {notificationOpen && (
                    <div className="absolute right-0 mt-2 w-86 bg-white shadow-md rounded-md p-2">
                      <p className="px-4 py-2 text-sm font-semibold border-b">
                        Notifications
                      </p>
                      {userNotifications?.notifications?.length > 0 ? (
                        userNotifications?.notifications?.map(
                          (notification: any, index: number) => (
                            <p
                              key={index}
                              className="px-4 py-2 text-gray-700 hover:bg-gray-100"
                            >
                              {notification.title}
                            </p>
                          )
                        )
                      ) : (
                        <p className="px-4 py-2 text-gray-500">
                          No new notifications
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center"
                  >
                    {user?.image ? (
                      <img
                        src={`${backendUrl}/${user.image}`}
                        alt="User"
                        className="w-10 h-10 rounded-full object-cover border border-gray-300"
                      />
                    ) : (
                      <FaUserCircle className="text-3xl text-gray-700" />
                    )}
                  </button>

                  {/* Dropdown menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-white shadow-md rounded-md p-2">
                      <p className="px-4 py-2 text-sm text-gray-700 font-semibold border-b">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <RouterLink
                        to="/edit-user-profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Edit Profile
                      </RouterLink>
                      <RouterLink
                        to="/change-password"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Change Password
                      </RouterLink>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-gray-100"
                      >
                        <MdLogout className="mr-2" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <RouterLink to="/login" className="primary-btn">
                Sign In
              </RouterLink>
            )}
          </ul>
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;

/* eslint-disable @typescript-eslint/no-explicit-any */
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { IoMdMenu } from "react-icons/io";
import { MdLogout } from "react-icons/md";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../hooks/authContext";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../config/axiosInstance";

const PhotographerNavbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // New state for logout process
  const [notificationOpen, setNotificationOpen] = useState(false);

  const { data: userNotifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await axiosInstance.get("/user/notification");
      return response.data?.data; // Assuming response.data is an array of notifications
    },
  });

  const handleLogout = () => {
    setIsLoggingOut(true); // Set logging out state
    Cookies.remove("user");
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    toast.success("Logged out successfully!", {
      position: "top-right",
      autoClose: 3000,
    });

    setTimeout(() => {
      setIsLoggingOut(false); // Reset logout state
      navigate("/");
      window.location.reload(); // Hard reload
    }, 100);
  };

  useEffect(() => {
    if (isLoggingOut) {
      // Optionally, handle any cleanup or UI updates here before the reload
    }
  }, [isLoggingOut]);

  const backendUrl =
    import.meta.env.VITE_API_IMAGE_URL ?? "http://localhost:3000";

  return (
    <div className="flex h-screen">
      <motion.div
        initial={{ x: -200 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="w-64 bg-white shadow-md p-6 fixed inset-y-0 left-0 z-10"
      >
        {/* Sidebar Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-600">Mero Photo</h1>
          <button
            className="lg:hidden text-3xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <IoMdMenu />
          </button>
        </div>

        {/* Navigation Links */}
        <ul className="space-y-4">
          <li>
            <Link
              to="/photographer/dashboard"
              className="flex items-center text-lg text-gray-700 hover:bg-indigo-100 p-2 rounded-lg"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/photographer/booking"
              className="flex items-center text-lg text-gray-700 hover:bg-indigo-100 p-2 rounded-lg"
            >
              Bookings
            </Link>
          </li>
          <li>
            <Link
              to="/photographer/booking-request"
              className="flex items-center text-lg text-gray-700 hover:bg-indigo-100 p-2 rounded-lg"
            >
              Booking Request
            </Link>
          </li>
          <li>
            <Link
              to="/photographer/edit-profile"
              className="flex items-center text-lg text-gray-700 hover:bg-indigo-100 p-2 rounded-lg"
            >
              Edit Profile
            </Link>
          </li>
          <li>
            <Link
              to="/photographer/availability"
              className="flex items-center text-lg text-gray-700 hover:bg-indigo-100 p-2 rounded-lg"
            >
              Availability
            </Link>
          </li>
          <li>
            <Link
              to="/photographer/package"
              className="flex items-center text-lg text-gray-700 hover:bg-indigo-100 p-2 rounded-lg"
            >
              Package
            </Link>
          </li>
          <li>
            <Link
              to="/photographer/feature-images"
              className="flex items-center text-lg text-gray-700 hover:bg-indigo-100 p-2 rounded-lg"
            >
              Feature Images
            </Link>
          </li>
        </ul>
      </motion.div>

      {/* Top Navbar */}
      <div className="bg-white p-4 w-full flex justify-between items-center border-b shadow-md fixed top-0 left-0 z-20">
        <h1 className="text-2xl font-bold text-indigo-600">Mero Photo</h1>

        {/* Right Section */}
        <div className="flex items-center space-x-10">
          {/* Notification Icon */}
          <div className="relative">
            <button onClick={() => setNotificationOpen(!notificationOpen)}>
              <FaBell className="text-2xl text-gray-700" />
            </button>
            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-86 bg-white shadow-md rounded-md p-2">
                <p className="px-4 py-2 text-sm font-semibold border-b">
                  Notifications
                </p>
                {userNotifications.length > 0 ? (
                  userNotifications.map((notification: any, index: number) => (
                    <p
                      key={index}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      {notification.title}
                    </p>
                  ))
                ) : (
                  <p className="px-4 py-2 text-gray-500">
                    No new notifications
                  </p>
                )}
              </div>
            )}
          </div>

          {/* User Profile & Logout */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-3xl text-gray-700"
            >
              {user && user?.image ? (
                <img
                  src={`${backendUrl}/${user.image}`}
                  alt="User Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <FaUserCircle />
              )}
            </button>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden border border-gray-200"
              >
                <div className="p-2">
                  <Link
                    to="/change-password"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-100 rounded-md"
                  >
                    <MdLogout className="mr-2 text-indigo-500 text-lg" />
                    <span>Change Password</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-100 rounded-md"
                  >
                    <MdLogout className="mr-2 text-red-500 text-lg" />
                    <span>Logout</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotographerNavbar;

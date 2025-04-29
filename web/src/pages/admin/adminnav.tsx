import Cookies from "js-cookie";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { IoMdMenu } from "react-icons/io";
import { MdLogout } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";

const AdminNav = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    Cookies.remove("user");
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    navigate("/");
  };

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
          <h1
            className="text-2xl font-bold text-indigo-600 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Mero Photo
          </h1>
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
              to="/admin/dashboard"
              className="flex items-center text-lg text-gray-700 hover:bg-indigo-100 p-2 rounded-lg"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/admin/bookings"
              className="flex items-center text-lg text-gray-700 hover:bg-indigo-100 p-2 rounded-lg"
            >
              Bookings
            </Link>
          </li>
          <li>
            <Link
              to="/admin/add-photographer"
              className="flex items-center text-lg text-gray-700 hover:bg-indigo-100 p-2 rounded-lg"
            >
              Add Photographer
            </Link>
          </li>
          <li>
            <Link
              to="/admin/photographer-list"
              className="flex items-center text-lg text-gray-700 hover:bg-indigo-100 p-2 rounded-lg"
            >
              Photographers List
            </Link>
          </li>
        </ul>
      </motion.div>

      {/* Top Navbar */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white p-4 w-full flex justify-between items-center border-b shadow-md fixed top-0 left-0 z-20">
          <h1
            className="text-2xl font-bold text-indigo-600 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Mero Photo
          </h1>
          {/* User Profile & Logout */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-3xl text-gray-700"
            >
              <FaUserCircle />
            </button>

            {/* Dropdown Menu */}
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

export default AdminNav;

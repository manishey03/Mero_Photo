/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";

import { FaBookReader } from "react-icons/fa";
import { GrUserExpert } from "react-icons/gr";
import { MdOutlineAccessTime } from "react-icons/md";

import hero from "../../assets/heroo.webp"; // ✅ Fixed space issue
import banner from "../../assets/banner.webp";
import community from "../../assets/community.webp";

import Footer from "../layout/footer";
import Navbar from "../layout/navbar";
import Button from "../../components/button";
import axiosInstance from "../../config/axiosInstance";
import photographerDummyImage from "../../assets/photographer1.jpg";

// Framer Motion animation
export const FadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 50 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      duration: 0.5,
      delay,
      ease: "easeInOut",
    },
  },
});

// Fetch photographers from API
const fetchPhotographers = async () => {
  try {
    const { data } = await axiosInstance.get("/user/photographer");
    return data?.data || [];
  } catch (error) {
    console.error("Error fetching photographers:", error);
    throw new Error("Failed to fetch photographers");
  }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const loggedInUser = Cookies.get("user");

    try {
      if (loggedInUser) {
        setUser(JSON.parse(loggedInUser));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error parsing user cookie:", error);
      setUser(null);
    } finally {
      setIsLoadingUser(false); // Stop loading after checking user
    }
  }, []);

  useEffect(() => {
    console.log("User state:", user);
  }, [user]);

  // Fetch photographers using React Query
  const {
    data: photographers = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["photographers"],
    queryFn: fetchPhotographers,
  });

  const backendUrl =
    import.meta.env.VITE_API_IMAGE_URL ?? "http://localhost:3000";

  if (isLoading) return <p className="text-center text-lg">Loading...</p>;
  if (isError)
    return <p className="text-center text-red-500">Error fetching data</p>;

  return (
    <section className="bg-light relative pt-20 flex flex-col items-center">
      {/* Navbar Section */}
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gray-100 container grid grid-cols-1 md:grid-cols-2 min-h-[650px] p-5">
        {/* Brand Info */}
        <div className="flex flex-col justify-center py-14 md:py-0 relative z-20">
          <div className="text-center md:text-left space-y-10 lg:max-w-[400px]">
            <motion.h1
              variants={FadeUp(0.2)}
              initial="initial"
              animate="animate"
              className="text-4xl lg:text-5xl font-bold leading-tight"
            >
              Capture Timeless Moments with <br />
              <span className="text-secondary">
                Professional Photographers....
              </span>
            </motion.h1>
            <motion.p
              variants={FadeUp(0.4)}
              initial="initial"
              animate="animate"
              className="text-lg text-gray-600"
            >
              Stunning visuals that tell your story. Book a session today and
              make every moment unforgettable.
            </motion.p>
            <Button>Get Started</Button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="flex justify-center items-center">
          <motion.img
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeInOut" }}
            src={hero}
            alt=""
            className="w-[400px] xl:w-[600px] relative z-10 drop-shadow"
          />
        </div>
      </div>

      {/* Meet Our Best Photographers */}
      <div className="container pb-14 pt-16 p-4">
        <h1 className="text-4xl font-bold text-left pb-10">
          Meet Our Best Photographers
        </h1>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
          }}
        >
          {photographers.map((photographer: any, index: number) => {
            const photographerProfile = photographer.image
              ? `${backendUrl}/${photographer.image}`
              : photographerDummyImage;

            return (
              <motion.div
                key={photographer.id}
                className="bg-white shadow-lg rounded-lg p-6 text-center w-full"
                variants={FadeUp(index * 0.2)}
                initial="initial"
                animate="animate"
              >
                <motion.img
                  src={photographerProfile}
                  alt={photographer.name}
                  className="w-full h-80 object-cover rounded-lg mb-4"
                  whileHover={{ scale: 1.05 }}
                />

                <h2 className="text-xl font-semibold">
                  {photographer.firstName} {photographer.lastName}
                </h2>

                {isLoadingUser ? (
                  <p>Loading...</p> // Prevents incorrect redirection
                ) : user ? (
                  <Button
                    onClick={() =>
                      navigate(`/photographer/profile/${photographer?._id}`)
                    }
                  >
                    Details
                  </Button>
                ) : (
                  <Button onClick={() => navigate("/login")}>Details</Button>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Lifetime Access & Community Section */}
      <div className="bg-gray-100 container grid grid-cols-1 md:grid-cols-2 min-h-[650px] p-5">
        {/* Banner Image */}
        <div className="flex justify-center items-center">
          <img
            src={banner}
            alt=""
            className="w-[350px] md:max-w-[450px] object-cover drop-shadow"
          />
        </div>

        {/* Banner Text */}
        <div className="flex flex-col justify-center items-center md:items-start w-full">
          <h1 className="text-3xl md:text-4xl font-bold leading-snug text-center md:text-left">
            The World's Leading Online Booking Platform
          </h1>

          {/* Statistics Section - Aligned Vertically */}
          <motion.div className="flex flex-col items-center md:items-start space-y-6 mt-6 w-full">
            {/* 10,000+ Bookings */}
            <motion.div
              className="flex items-center gap-6 p-6 bg-white rounded-2xl shadow-lg w-full md:max-w-[400px]"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <FaBookReader className="text-3xl text-black-600" />
              <p className="text-lg font-semibold text-gray-700">
                10,000+ Bookings
              </p>
            </motion.div>

            {/* Expert Photographers */}
            <motion.div
              className="flex items-center gap-6 p-6 bg-white rounded-2xl shadow-lg w-full md:max-w-[400px]"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <GrUserExpert className="text-3xl text-black-600" />
              <p className="text-lg font-semibold text-gray-700">
                Expert Photographers
              </p>
            </motion.div>

            {/* Lifetime Access */}
            <motion.div
              className="flex items-center gap-6 p-6 bg-white rounded-2xl shadow-lg w-full md:max-w-[400px]"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <MdOutlineAccessTime className="text-3xl text-black-600" />
              <p className="text-lg font-semibold text-gray-700">
                Lifetime Access
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Join Our Community Section */}
      <motion.div
        className="container py-16 md:py-28 flex flex-col md:flex-row items-center justify-between gap-12 bg-white-100  rounded-lg shadow-lg px-8"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        viewport={{ once: true }}
      >
        {/* Text Section */}
        <motion.div
          className="flex flex-col justify-center max-w-lg text-center md:text-left"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <h1 className="text-5xl font-extrabold text-gray-800 leading-snug">
            Join Our Photographers Community
          </h1>
          <p className="mt-5 text-lg text-gray-600">
            Calling all photographers! Be part of a growing community where
            creativity meets opportunity. Connect, collaborate, and enhance your
            skills with like-minded professionals who share your passion for
            photography.
          </p>
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Button
              onClick={() => navigate("/contact-us")}
              className="px-6 py-3 text-lg font-semibold bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
            >
              Contact Us
            </Button>
          </motion.div>
        </motion.div>

        {/* Image Section */}
        <motion.div
          className="flex justify-center items-center"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <motion.img
            src={community}
            alt="Community"
            className="w-[400px] md:w-[500px] object-cover rounded-lg shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </motion.div>

      {/* Footer */}
      <Footer />
    </section>
  );
};

export default Dashboard;

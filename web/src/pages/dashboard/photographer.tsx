import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";

import Footer from "../layout/footer";
import Navbar from "../layout/navbar";
import Cookies from "js-cookie";
import Button from "../../components/button";
import axiosInstance from "../../config/axiosInstance";

import photographerDummyImage from "../../assets/photographer1.jpg";
import { useEffect, useState } from "react";

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
  const { data } = await axiosInstance.get<
    { id: number; name: string; image: string }[]
  >("/user/photographer");

  return data?.data;
};

const Photographers = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState();

  const loggedInUser = Cookies.get("user");
  useEffect(() => {
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  // Use React Query to fetch data
  const {
    data: photographers,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["photographers"],
    queryFn: fetchPhotographers,
  });

  const backendUrl = import.meta.env.API_IMAGE_URL ?? "http://localhost:3000";


  if (isLoading) return <p className="text-center text-lg">Loading...</p>;
  if (isError)
    return <p className="text-center text-red-500">Error fetching data</p>;

  return (
    <section className="bg-light overflow-hidden relative pt-20 p-4">
      <Navbar />
      <div className="container py-16">
        <h1 className="text-4xl font-bold text-center pb-10">
          Our Professional Photographers
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
          {photographers?.map((photographer: any, index: number) => {
            const photographerProfile = photographer?.image
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

                <h2 className="text-xl font-semibold">{`${photographer.firstName} ${photographer.lastName}`}</h2>

                {user ? (
                  <>
                    <Button
                      onClick={() =>
                        navigate(`/photographer/profile/${photographer?._id}`)
                      }
                    >
                      Details
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => navigate("/login")}>Details</Button>
                  </>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
      <Footer />
    </section>
  );
};

export default Photographers;

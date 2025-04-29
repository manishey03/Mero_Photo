import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

import Navbar from "../layout/navbar";
import Footer from "../layout/footer";

import contactImage from "../../assets/contactus.png";
import Button from "../../components/button";

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

const ContactUs = () => {
  return (
    <section className="bg-white overflow-hidden relative pt-20 px-6 ">
      <Navbar />
      <div className="container py-12 text-center md:text-left relative">
        <motion.h1
          className="text-5xl font-extrabold text-primary mb-6 tracking-wide drop-shadow-lg"
          variants={FadeUp(0.2)}
          initial="initial"
          animate="animate"
        >
          Let’s Work Together & Capture the Best Moments!
        </motion.h1>

        <motion.p
          className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto md:mx-0 p-6 border-l-4 border-primary bg-gray-50 shadow-md rounded-lg"
          variants={FadeUp(0.4)}
          initial="initial"
          animate="animate"
        >
          <strong>
            Have an event, a special occasion, or need professional portraits?
          </strong>{" "}
          Our team is here to bring your vision to life. Whether it’s a wedding,
          corporate event, fashion shoot, or personal session, we provide
          top-quality photography services tailored to your needs. Let us craft
          stunning visuals that preserve your most cherished moments forever.
          <br />
          <br />
          Contact us today and let’s create something unforgettable together!
        </motion.p>
      </div>
      {/* Contact Information & Image */}
      <motion.div
        className="container py-10 grid md:grid-cols-2 gap-2 items-center bg-gray-100 px-20 py-16"
        variants={FadeUp(0.6)}
        initial="initial"
        animate="animate"
      >
        <div className="order-2 md:order-1 space-y-4">
          <div className="flex items-center space-x-3">
            <Phone className="text-primary" />
            <span className="text-lg font-semibold text-black">
              +977 9816153541
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Mail className="text-primary" />
            <span className="text-lg font-semibold text-black">
              merophoto@gmail.com
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <MapPin className="text-primary" />
            <span className="text-lg font-semibold text-black">
              Pokhara-25, Hemja
            </span>
          </div>
        </div>

        <div className="order-1 md:order-2 w-[900px] h-[450px] flex items-center justify-start rounded-lg overflow-hidden shadow-lg -ml-70">
          <img
            src={contactImage}
            alt="Contact Us"
            className="w-full h-full object-contain"
          />
        </div>
      </motion.div>
      {/* Contact Form */}
      <motion.div className="container py-10">
        <form className="grid grid-cols-1 gap-6 max-w-lg mx-auto p-6 rounded-lg shadow-lg border border-gray-300">
          <input
            type="text"
            placeholder="Full Name"
            className="p-4 rounded-lg border border-gray-300 focus:outline-primary"
            required
          />

          <input
            type="email"
            placeholder="E-mail"
            className="p-4 rounded-lg border border-gray-300 focus:outline-primary"
            required
          />

          <textarea
            placeholder="How can we help you?"
            className="p-4 h-32 rounded-lg border border-gray-300 focus:outline-primary"
            required
          ></textarea>

          <div className="flex justify-between">
            <Button className="bg-red-600 hover:bg-red-700">Reset</Button>
            <Button>Submit</Button>
          </div>
        </form>
      </motion.div>
      <Footer />
    </section>
  );
};

export default ContactUs;

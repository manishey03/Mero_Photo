import { motion } from "framer-motion";
import { FaInstagram, FaWhatsapp, FaYoutube, FaFacebook } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="py-16 bg-gray-100 p-5">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        viewport={{ once: true }}
        className="container"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-6">
          {/* First Section: Mero Photo Info */}
          <div className="space-y-4 max-w-[350px]">
            <h1 className="text-2xl font-bold text-black">Mero Photo</h1>
            <p className="text-gray-600 leading-relaxed">
              Mero Photo is a photographer booking platform that connects you
              with skilled professionals for every occasion. From weddings to
              portraits, we make bookings easy and hassle-free.
            </p>
          </div>

          {/* Second Section: Services */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-black">Our Services</h1>
            <ul className="space-y-2 text-lg text-gray-600">
              {[
                "Event Photography",
                "Portrait Photography",
                "Landscape Photography",
                "Product Photography",
              ].map((service, index) => (
                <motion.li
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="cursor-pointer hover:text-secondary transition duration-200"
                >
                  {service}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Third Section: Quick Links */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-black">Quick Links</h1>
            <ul className="space-y-2 text-lg text-gray-600">
              {["Home", "Photographers", "About Us", "Contact Us"].map(
                (link, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="cursor-pointer hover:text-secondary transition duration-200"
                  >
                    {link}
                  </motion.li>
                )
              )}
            </ul>
          </div>

          {/* Fourth Section: Get In Touch */}
          <div className="space-y-6 max-w-[350px]">
            <h1 className="text-2xl font-bold text-black">Get In Touch</h1>

            {/* Email Subscription Input & Button */}
            <div className="flex bg-white rounded-lg overflow-hidden border border-gray-300 shadow-sm">
              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-3 text-gray-600 focus:ring-0 focus:outline-none placeholder-gray-400"
              />
              <button className="bg-primary text-white font-semibold px-6 py-3 hover:bg-secondary transition duration-300">
                Subscribe
              </button>
            </div>

            {/* Social Icons */}
            <div className="flex space-x-6 text-xl text-gray-600">
              {[
                { icon: <FaWhatsapp />, link: "#" },
                { icon: <FaInstagram />, link: "#" },
                { icon: <FaFacebook />, link: "#" },
                { icon: <FaYoutube />, link: "#" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  className="cursor-pointer hover:text-secondary transition duration-300"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="text-center text-gray-600 text-sm pt-10 border-t mt-10 border-gray-300">
          © {new Date().getFullYear()} Mero Photo. All Rights Reserved.
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;

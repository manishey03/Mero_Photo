import { motion } from "framer-motion";

import Navbar from "../layout/navbar";
import Footer from "../layout/footer";

export const FadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 50 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      duration: 0.6,
      delay,
      ease: "easeInOut",
    },
  },
});

const AboutUs = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#fdfbfb] to-[#ebedee]">
      <Navbar />

      {/* Hero Section */}
<motion.div 
  className="container mx-auto px-6 md:px-12 py-20 md:py-24"
  variants={FadeUp(0.2)}
>
  {/* White Box Container */}
  <motion.div 
    className="bg-white shadow-xl rounded-lg p-10 md:p-16 max-w-5xl mx-auto text-center md:text-left"
    variants={FadeUp(0.3)}
  >
    {/* Heading */}
    <motion.h1
      className="text-4xl font-extrabold text-gray-900 leading-tight mb-6"
      variants={FadeUp(0.2)}
      initial="initial"
      animate="animate"
    >
      Mero Photo – Where Every Click Tells a Story 📸
    </motion.h1>

    {/* Paragraph Content */}
    <motion.p
      className="text-xl text-gray-700 leading-relaxed text-justify"
      variants={FadeUp(0.4)}
      initial="initial"
      animate="animate"
    >
      In a world where moments fade too quickly, <strong>Mero Photo</strong> exists to make them last forever. 
      We are more than just a photography booking platform—we are a bridge between talented <strong>professional photographers </strong> 
       and individuals who want to preserve <strong>life’s most cherished moments</strong>.
      <br /><br /> 
      We believe that <strong>every picture tells a story, every moment deserves to be captured, and every client deserves the best</strong>. 
      At <strong>Mero Photo</strong>, we don’t just take pictures—we create <strong>lasting legacies</strong>.
    </motion.p>
  </motion.div>
</motion.div>


      {/* Why Mero Photo Section */}
      <motion.div
        className="container mx-auto px-6 md:px-12 py-10 md:py-0"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        viewport={{ once: true }}
      >
        <motion.h2 className="text-4xl font-bold text-gray-900 mb-6" variants={FadeUp(0.2)}>
          Why Mero Photo?
        </motion.h2>
        <motion.p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed" variants={FadeUp(0.4)}>
          We believe that photography is more than just clicking pictures; it’s about 
          preserving emotions, telling stories, and capturing the essence of every moment. 
          Our platform simplifies the process of finding the perfect photographer, so you 
          can focus on enjoying your big day while we handle the rest.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <motion.div className="p-6 bg-white shadow-lg rounded-lg" variants={FadeUp(0.3)}>
            <h3 className="text-2xl font-semibold">🌟 Verified Professional Photographers</h3>
            <p className="text-gray-600 mt-2">
              We connect you with skilled and experienced photographers across various genres, 
              ensuring high-quality results.
            </p>
          </motion.div>
          <motion.div className="p-6 bg-white shadow-lg rounded-lg" variants={FadeUp(0.4)}>
            <h3 className="text-2xl font-semibold">📅 Seamless Booking Process</h3>
            <p className="text-gray-600 mt-2">
              Our user-friendly platform allows you to browse, compare, and book photographers effortlessly.
            </p>
          </motion.div>
          <motion.div className="p-6 bg-white shadow-lg rounded-lg" variants={FadeUp(0.5)}>
            <h3 className="text-2xl font-semibold">💡 Personalized Experience</h3>
            <p className="text-gray-600 mt-2">
              Whether you want candid shots, cinematic visuals, or classic portraiture, we cater to your unique photography needs.
            </p>
          </motion.div>
          <motion.div className="p-6 bg-white shadow-lg rounded-lg" variants={FadeUp(0.6)}>
            <h3 className="text-2xl font-semibold">🚀 Hassle-Free Coordination</h3>
            <p className="text-gray-600 mt-2">
              Our intuitive interface and customer support make communication between photographers and clients smoother than ever.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Capture Every Chapter */}
      <motion.div className="container mx-auto px-6 md:px-16 py-10 md:py-24 text-center" variants={FadeUp(0.2)}>
        <h2 className="text-4xl font-bold text-gray-900 mb-6 ">Capture Every Chapter of Your Life</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            ["💍 Weddings & Engagements", "Your love story deserves to be told in the most beautiful way."],
            ["👨‍👩‍👧 Family & Portraits", "Celebrate family bonds with portraits that last generations."],
            ["🎉 Events & Celebrations", "From birthdays to corporate events, we capture your memories."],
            ["📈 Commercial & Branding", "Elevate your brand with professional headshots & product photography."],
            ["🌍 Travel & Outdoor Shoots", "Capture breathtaking travel and fashion moments anywhere."],
            ["🏡 Real Estate Photography", "Showcase properties with high-quality visuals for buyers and renters."]
          ].map(([title, description], i) => (
            <motion.div key={i} className="p-6 bg-white shadow-lg rounded-lg" variants={FadeUp(i * 0.2 + 0.3)}>
              <h3 className="text-2xl font-semibold">{title}</h3>
              <p className="text-gray-600 mt-2">{description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <Footer />
    </section>
  );
};

export default AboutUs;

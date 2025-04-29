import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="flex justify-center items-center bg-white">
      <motion.div
        className="size-8 border-4 border-blue-500 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
    </div>
  );
};

export default Loading;

import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import WebSection from "@/elements/WebSection";

const BlogIntroSection = ({ name }: { name: string }) => {
  return (
    <WebSection
      className="bg-gradient-to-r from-accent/50 to-accent selection:bg-white selection:text-accent bg-white text-white overflow-hidden"
      id="blog"
    >
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0 opacity-90"
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundImage:
              "linear-gradient(115deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.3) 18%, rgba(217, 56, 56, 0.08) 34%, rgba(255, 255, 255, 0.22) 52%, rgba(217, 56, 56, 0.36) 70%, rgba(255, 255, 255, 0.04) 100%)",
            backgroundSize: "180% 180%",
          }}
        />
        <motion.div
          className="absolute inset-0 opacity-95"
          animate={{
            background: [
              "radial-gradient(circle at 14% 32%, rgba(255, 255, 255, 0.54), rgba(255, 255, 255, 0.22) 16%, rgba(217, 56, 56, 0.05) 38%, rgba(217, 56, 56, 0) 54%)",
              "radial-gradient(circle at 82% 38%, rgba(255, 255, 255, 0.58), rgba(255, 255, 255, 0.18) 17%, rgba(217, 56, 56, 0.08) 42%, rgba(217, 56, 56, 0) 58%)",
              "radial-gradient(circle at 48% 76%, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.2) 15%, rgba(217, 56, 56, 0.04) 38%, rgba(217, 56, 56, 0) 54%)",
              "radial-gradient(circle at 14% 32%, rgba(255, 255, 255, 0.54), rgba(255, 255, 255, 0.22) 16%, rgba(217, 56, 56, 0.05) 38%, rgba(217, 56, 56, 0) 54%)",
            ],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-white/25 blur-2xl"
          animate={{ x: [0, 84, 22, 0], scale: [1, 1.2, 0.9, 1], opacity: [0.42, 0.78, 0.5, 0.42] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-20 top-6 h-80 w-80 rounded-full bg-accent/45 blur-2xl"
          animate={{ x: [0, -78, -28, 0], y: [0, 36, 64, 0], scale: [1, 0.86, 1.16, 1], opacity: [0.36, 0.68, 0.44, 0.36] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div
        className="narrow mx-auto text-center pb-6 relative z-10"
      >
        <div className="relative w-full px-4 py-8">
          <h3 className="leading-tight text-white my-0">
            {name}
          </h3>
          <h1 className="mt-0">
            Latest From The Blog
          </h1>
          <p className="text-center m-0 p-0 font-normal text-3xl">
            I have strong views on topics like Finance, Technology, Future and
            Environment. Find me&nbsp;
            <Link
              className="text-white underline decoration-white/50 underline-offset-4 transition hover:decoration-white focus:decoration-white"
              title={name}
              href="/blog"
            >
              blogging about them here
            </Link>
            .
          </p>
        </div>
      </div>
    </WebSection>
  );
};

export default BlogIntroSection;

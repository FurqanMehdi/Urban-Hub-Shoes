"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Leaf, Award, Users, Globe, TrendingUp, Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const milestones = [
  { year: "2018", title: "Founded", description: "Urban Hub Shoes was born with a vision to redefine footwear." },
  { year: "2020", title: "10K Customers", description: "Reached our first 10,000 happy customers worldwide." },
  { year: "2022", title: "Sustainability", description: "Launched our eco-friendly collection using recycled materials." },
  { year: "2024", title: "Global Reach", description: "Expanded to over 50 countries with flagship stores in major cities." },
];

const values = [
  {
    icon: Zap,
    title: "Innovation First",
    description: "Pushing boundaries with cutting-edge technology in every step you take.",
  },
  {
    icon: Shield,
    title: "Quality Promise",
    description: "Every pair undergoes rigorous testing to ensure durability and comfort.",
  },
  {
    icon: Leaf,
    title: "Sustainable Future",
    description: "Committed to eco-friendly materials and responsible manufacturing.",
  },
  {
    icon: Award,
    title: "Award Winning",
    description: "Recognized globally for design excellence and customer satisfaction.",
  },
];

const stats = [
  { icon: Users, value: "50K+", label: "Happy Customers" },
  { icon: Globe, value: "50+", label: "Countries Served" },
  { icon: TrendingUp, value: "200+", label: "Products" },
  { icon: Heart, value: "98%", label: "Satisfaction Rate" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 block">
              About Us
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Crafted for the{" "}
              <span className="text-gray-400">Modern Explorer</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Born from a passion for movement and design, Urban Hub Shoes
              represents the intersection of style and performance. We believe
              every journey deserves the perfect companion.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 text-white mx-auto mb-4" />
                <p className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 block">
                Our Story
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                From a Small Garage to Global Recognition
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Urban Hub Shoes started in 2018 when our founders, passionate
                  sneakerheads and industrial designers, noticed a gap in the market
                  for footwear that combined cutting-edge style with uncompromising comfort.
                </p>
                <p>
                  What began as a small operation crafting custom sneakers for friends
                  quickly grew into a movement. Today, we are a global brand trusted by
                  athletes, artists, and everyday explorers who refuse to compromise on
                  quality or aesthetics.
                </p>
                <p>
                  Our mission remains unchanged: to create the perfect companion for
                  every step of your journey, whether that journey takes you across the
                  city or around the world.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gray-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-9xl">🏭</span>
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">50K+</p>
                    <p className="text-gray-500 text-sm">Happy Customers</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 block">
              Our Journey
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Milestones That Define Us
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="text-3xl font-bold text-black mb-2">{milestone.year}</p>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                <p className="text-gray-600 text-sm">{milestone.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 block">
              What We Stand For
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Our Core Values
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center p-8"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-gray-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Step Into Something New?
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Explore our latest collection and find your perfect pair today.
            </p>
            <a
              href="/shop"
              className="inline-flex items-center justify-center bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Shop Now
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

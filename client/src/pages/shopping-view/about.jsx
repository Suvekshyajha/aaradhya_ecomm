

import { useState } from 'react';
import sariImage from '../../assets/download.png'; // Updated image path
import { Button } from '@/components/ui/button'; // Reusing your Button component
import { useSEO } from '@/components/common/seo';

function About() {
  useSEO({
    title: "About Us | AARADHYA",
    description:
      "Learn about AARADHYA - handpicked traditional and modern saris and fashion crafted with premium fabrics for every occasion.",
    path: "/shop/about",
  });
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8">
      {/* About Section */}
      <div className="w-full max-w-4xl px-8">
        {/* Title */}
        <p className="text-center text-xs font-semibold uppercase tracking-[0.28em] text-gold">
          Our Story
        </p>
        <h2 className="mt-2 text-center font-display text-4xl font-bold md:text-5xl">About Us</h2>
        <div className="gold-rule" />

        {/* Small Oval Image */}
        <div className="w-full mb-6 flex justify-center">
          <div className="relative w-1/2 max-w-sm group">
            <img
              src={sariImage}
              alt="Aaradhya Saris"
              className="w-full h-64 object-contain rounded-[50%/25%] shadow-md transition-transform duration-300 group-hover:scale-105"
            />
            {/* Decorative Frame */}
            <div className="absolute inset-0 -z-10 rounded-[50%/25%] bg-gradient-to-br from-rose-50 via-lavender-50 to-sky-50 opacity-70 blur-lg"></div>
          </div>
        </div>

        {/* Text */}
        <div className="text-lg text-gray-700 text-center">
          <p>
            Welcome to <strong>Aaradhya</strong>, your go-to destination for exquisite and stylish saris. 
            We bring you a handpicked collection of traditional and modern designs, perfect for every occasion. 
            Our saris are crafted with premium fabrics and intricate detailing to help you embrace elegance and grace. 
            Experience the beauty of timeless fashion with Aaradhya!
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-gray-100 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            {/* Column 1 */}
            <div>
              <h5 className="text-lg font-semibold">AARADHYA</h5>
            </div>

            {/* Column 2 */}
            <div>
              <p className="text-gray-600">Shop</p>
              <p className="text-gray-600">About Us</p>
              <p className="text-gray-600">Contact Us</p>
            </div>

            {/* Column 3 */}
            <div>
              <p className="text-gray-600">Customer Care</p>
              <p className="text-gray-600">Store Policy</p>
              <p className="text-gray-600">Payment Methods</p>
              <p className="text-gray-600">FAQ</p>
            </div>
          </div>

          {/* Social Media */}
          <div className="mt-8 text-center">
            <h5 className="text-lg font-semibold">Follow Us</h5>
            <div className="flex justify-center space-x-4 mt-2">
              <p className="text-gray-600">Facebook</p>
              <p className="text-gray-600">Instagram</p>
            </div>
          </div>

          {/* Copyright */}
          <p className="text-gray-500 text-center mt-6">
            © 2025 AARADHYA - All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
}

export default About;
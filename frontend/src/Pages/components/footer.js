import React from "react";
import { Link } from "react-router-dom";
import logo from "../Assets/logo.png";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-neutral-800 text-neutral-300 dark:bg-neutral-900 dark:text-neutral-200">
      {/* Social media section */}
      <div className="flex items-center justify-between border-b border-neutral-700 p-6">
        <span className="hidden lg:block">
          Get connected with us on social networks:
        </span>
        <div className="flex space-x-6">
          {[
            { href: "https://facebook.com", icon: <Facebook size={20} /> },
            { href: "https://twitter.com", icon: <Twitter size={20} /> },
            { href: "https://instagram.com", icon: <Instagram size={20} /> },
            { href: "https://linkedin.com", icon: <Linkedin size={20} /> },
          ].map(({ href, icon }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-200"
            >
              {icon}
            </a>
          ))}
        </div>
      </div>

      {/* Footer content */}
      <div className="mx-6 py-10 grid gap-8 md:grid-cols-3 text-center md:text-left">
        {/* Logo Section */}
        <div className="flex justify-center md:justify-start">
          <Link to="/">
            <img
              src={logo}
              alt="Company Logo"
              className="h-40 w-auto filter invert"
            />
          </Link>
        </div>

        {/* Links Section */}
        <div className="text-center">
          <h6 className="mb-4 font-semibold uppercase">Links</h6>
          {["Home", "News", "Ads", "About"].map((text) => (
            <Link
              key={text}
              to={`/${text.toLowerCase()}`}
              className="block mb-2 hover:text-white transition-colors duration-200"
            >
              {text}
            </Link>
          ))}
        </div>

        {/* Contact Section - Fixed Alignment */}
        <div className="text-left flex flex-col items-start md:justify-start">
          <h6 className="mb-4 font-semibold uppercase">Contact</h6>
          <div className="space-y-2">
            <div className="flex items-center">
              <MapPin size={18} className="mr-2" />
              <span>New York, NY 10012, US</span>
            </div>
            <div className="flex items-center">
              <Mail size={18} className="mr-2" />
              <span>info@example.com</span>
            </div>
            <div className="flex items-center">
              <Phone size={18} className="mr-2" />
              <span>+1 234 567 88</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center p-4 bg-neutral-700 dark:bg-neutral-800">
        © {new Date().getFullYear()} Investo. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

// app/components/navbar.tsx
import { useState } from "react";
import { Link, useNavigate } from "@remix-run/react";
import { Button } from "@/components/ui/button";
import { X, Menu } from "lucide-react";

const links = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

  return (
    <header className="w-full shadow-md bg-white dark:bg-gray-950 px-6 py-4 fixed z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-gray-900 dark:text-white"
        >
          Pxtcode
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 items-center text-lg font-semibold">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Button
            className="ml-4 px-6 py-2 font-bold text-lg"
            onClick={() => navigate("/auth/signin")}
          >
            Get Started
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 dark:text-gray-300"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu size={28} />
        </button>

        {/* Mobile Sidebar */}
        <div
          className={`fixed top-0 right-0 h-full w-full md:w-2/3 md:max-w-xs max-w-xs bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 z-50 p-6 flex flex-col space-y-6 ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button
            className="absolute top-4 right-4"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={28} className="text-gray-700 dark:text-gray-300" />
          </button>
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="px-2 text-lg font-semibold text-gray-800 dark:text-gray-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Button
            className="text-base font-bold w-full"
            onClick={() => navigate("/auth/signin")}
          >
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
}

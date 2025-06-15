import { useState } from "react";
import { Link, useNavigate } from "@remix-run/react";
import { Menu, X, Play } from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navLinks = [
    { name: "Home", href: "/app/home" },
    { name: "Services", href: "/services" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Contact", href: "/contact" },
  ];

  const navigate = useNavigate();

  return (
    <nav className="fixed top-3 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-5xl mx-auto px-4">
      <div
        className={`navbar-glass px-5 py-2.5 shadow-lg backdrop-blur-md border border-white/10 transition-all duration-300 ease-out  rounded-2xl`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-bold text-gradient hover:scale-105 transition-all duration-300 ease-out py-1"
          >
            STUCO
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                to={link.href}
                className="relative px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-all duration-300 ease-out rounded-full hover:bg-white/10 group"
              >
                {link.name}
                <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-white/60 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
              </Link>
            ))}
          </div>

          {/* CTA Button & Mobile Menu Button */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate("/app/play/home")}
              className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
            >
              <Play className="h-4 w-4" />
              <span>Play</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 ease-out"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="pt-4 pb-2 mt-4 border-t border-white/10">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 ease-out font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <button
                onClick={() => navigate("/app/play/home")}
                className="sm:hidden flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 ease-out mt-2 mx-4"
              >
                <Play className="h-4 w-4" />
                <span>Play</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

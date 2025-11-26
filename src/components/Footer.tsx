
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Heart, Mountain } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-charcoal dark:bg-charcoal-dark text-cream pt-16 pb-8 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-pattern-dots opacity-5 pointer-events-none" />
      
      <div className="container px-4 mx-auto relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <Mountain className="h-6 w-6 text-terracotta group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-heading font-bold text-cream">AscendPath</h3>
            </Link>
            <p className="text-cream/70 mb-6 text-sm leading-relaxed">
              Empowering learners through personalized educational roadmaps tailored to your journey.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/" className="text-cream/60 hover:text-terracotta transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://x.com/" className="text-cream/60 hover:text-terracotta transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://www.instagram.com/" className="text-cream/60 hover:text-terracotta transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://www.linkedin.com/" className="text-cream/60 hover:text-terracotta transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-terracotta">Platform</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="text-cream/70 hover:text-cream transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/onboarding" className="text-cream/70 hover:text-cream transition-colors">Get Started</Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-cream/70 hover:text-cream transition-colors">Your Dashboard</Link>
              </li>
              <li>
                <Link to="/resources" className="text-cream/70 hover:text-cream transition-colors">Resources</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-terracotta">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-cream/70 hover:text-cream transition-colors">Blog</a>
              </li>
              <li>
                <a href="#" className="text-cream/70 hover:text-cream transition-colors">Success Stories</a>
              </li>
              <li>
                <a href="#" className="text-cream/70 hover:text-cream transition-colors">Events</a>
              </li>
              <li>
                <a href="#" className="text-cream/70 hover:text-cream transition-colors">Partners</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-terracotta">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/aboutus" className="text-cream/70 hover:text-cream transition-colors">About Us</Link>
              </li>
              <li>
                <a href="#" className="text-cream/70 hover:text-cream transition-colors">Careers</a>
              </li>
              <li>
                <a href="#" className="text-cream/70 hover:text-cream transition-colors">Contact</a>
              </li>
              <li>
                <Link to="/privacypolicy" className="text-cream/70 hover:text-cream transition-colors">Privacy Policy</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-cream/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-cream/60">© 2025 AscendPath. All rights reserved.</p>
          <p className="text-sm text-cream/60 mt-2 md:mt-0 flex items-center">
            Made with <Heart size={14} className="mx-1 text-terracotta animate-pulse-soft" /> for aspiring learners everywhere
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

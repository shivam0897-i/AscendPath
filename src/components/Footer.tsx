
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-12 pb-8">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">EmpowerPath</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Empowering women through personalized educational roadmaps.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-empowerPurple">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-empowerPurple">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-empowerPurple">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-empowerPurple">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-500 hover:text-empowerPurple">Home</Link>
              </li>
              <li>
                <Link to="/onboarding" className="text-gray-500 hover:text-empowerPurple">Get Started</Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-500 hover:text-empowerPurple">Your Dashboard</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-500 hover:text-empowerPurple">Resources</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-500 hover:text-empowerPurple">Blog</a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-empowerPurple">Success Stories</a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-empowerPurple">Events</a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-empowerPurple">Partners</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-500 hover:text-empowerPurple">About Us</a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-empowerPurple">Careers</a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-empowerPurple">Contact</a>
              </li>
              <li>
                <Link to="/privacypolicy" className="text-gray-500 hover:text-empowerPurple">Privacy Policy</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">© 2023 EmpowerPath. All rights reserved.</p>
          <p className="text-sm text-gray-500 mt-2 md:mt-0 flex items-center">
            Made with <Heart size={14} className="mx-1 text-empowerPurple" /> for women's education
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

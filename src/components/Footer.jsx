import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaGithub, FaLinkedin, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';

const Footer = () => {
  const navigation = [
    {
      title: 'Quick Links',
      links: [
        { name: 'Home', href: '/' },
        { name: 'Movies', href: '/movies' },
        { name: 'TV Shows', href: '/shows' },
        { name: 'My List', href: '/my-list' },
        { name: 'New & Popular', href: '/new' }
      ]
    },
    {
      title: 'Help & Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Device Support', href: '/devices' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Terms of Use', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Cookie Preferences', href: '/cookies' },
        { name: 'Corporate Information', href: '/corporate' },
        { name: 'Legal Notices', href: '/legal' }
      ]
    },
    {
      title: 'Account',
      links: [
        { name: 'Account Settings', href: '/account/settings' },
        { name: 'Billing', href: '/account/billing' },
        { name: 'Plans', href: '/pricing' },
        { name: 'Gift Cards', href: '/gift-cards' },
        { name: 'Redeem Code', href: '/redeem' }
      ]
    }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: FaFacebook, href: 'https://facebook.com' },
    { name: 'Twitter', icon: FaTwitter, href: 'https://twitter.com' },
    { name: 'Instagram', icon: FaInstagram, href: 'https://instagram.com' },
    { name: 'YouTube', icon: FaYoutube, href: 'https://youtube.com' },
    { name: 'LinkedIn', icon: FaLinkedin, href: 'https://www.linkedin.com/in/sharmasushant2310/' },
    { name: 'GitHub', icon: FaGithub, href: 'https://github.com' }
  ];

  const contactInfo = [
    { icon: FaMapMarkerAlt, text: '123 Streaming Street, Digital City, DC 12345' },
    { icon: FaPhone, text: '1-800-STREAM-FX' },
    { icon: FaEnvelope, text: 'support@streamflix.com' }
  ];

  return (
    <footer className="bg-gray-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {navigation.map((section) => (
            <div key={section.title}>
              <h3 className="text-gray-400 font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-500 hover:text-primary transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Information */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contactInfo.map((info, index) => (
              <div key={index} className="flex items-center text-gray-500">
                <info.icon className="mr-2 text-primary" />
                <span>{info.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Social Media Links */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="flex flex-wrap justify-center gap-6">
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <social.icon className="h-6 w-6" />
              </motion.a>
            ))}
          </div>
        </div>

        {/* App Store Badges */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="flex justify-center space-x-4">
            <button className="bg-gray-850 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors">
              Download on the App Store
            </button>
            <button className="bg-gray-850 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors">
              Get it on Google Play
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} StreamFlix. All rights reserved.
            </div>
            <div className="flex space-x-4 text-sm text-gray-500">
              <Link to="/terms" className="hover:text-primary transition-colors">
                Terms
              </Link>
              <Link to="/privacy" className="hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link to="/cookies" className="hover:text-primary transition-colors">
                Cookies
              </Link>
              <button
                className="hover:text-primary transition-colors"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Back to top
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
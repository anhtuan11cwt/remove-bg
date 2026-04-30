import { assets, footerConstants } from "../assets/assets";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-gray-200 border-t">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex md:flex-row flex-col justify-between items-center gap-4">
          {/* Left - Logo & Copyright */}
          <div className="flex items-center gap-3">
            <img alt="Logo" className="w-8 h-8" src={assets.logo} />
            <p className="text-gray-600 text-sm">
              © {currentYear} Artify. Đã đăng ký bản quyền.
            </p>
          </div>

          {/* Right - Social Links */}
          <div className="flex gap-4">
            {footerConstants.map((social) => (
              <a
                aria-label={social.name}
                className="text-gray-500 hover:text-indigo-600 transition"
                href={social.url}
                key={social.name}
                rel="noopener noreferrer"
                target="_blank"
              >
                <img
                  alt={social.name}
                  className="w-5 h-5"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                  src={social.icon}
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

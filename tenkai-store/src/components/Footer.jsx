import { FaDiscord, FaTiktok, FaInstagram, FaYoutube, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    // J'écrase le padding géant de l'ancien footer pour le rendre plus fin
    <footer className="site-footer" style={{ padding: '3rem 2rem' }}>
      
      <div className="footer-bottom" style={{ borderTop: 'none', paddingTop: '0' }}>
        <div className="footer-branding">
          <img src="/tenkailogo.webp" alt="TENKAI" height="35" />
          <p>&copy; 2024 Tenkai One Piece RP. Non affilié à Eiichiro Oda ou Toei Animation.</p>
        </div>
        <div className="social-links">
          <a href="#" className="social-icon"><FaDiscord size={24}/></a>
          <a href="#" className="social-icon"><FaTiktok size={24}/></a>
          <a href="#" className="social-icon"><FaInstagram size={24}/></a>
          <a href="#" className="social-icon"><FaYoutube size={24}/></a>
          <a href="#" className="social-icon"><FaTwitter size={24}/></a>
        </div>
      </div>

    </footer>
  );
}
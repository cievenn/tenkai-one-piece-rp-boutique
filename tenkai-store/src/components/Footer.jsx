import { FaDiscord, FaTiktok, FaInstagram, FaYoutube, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="community-section">
        <div className="section-title-wrapper">
          <div className="line"></div>
          <h2>Mur des Légendes</h2>
          <div className="line"></div>
        </div>

        <div className="community-bento">
          {/* Cartes MVP */}
          <div className="mvp-card gold">
            <div className="mvp-avatar-wrapper">
              <div className="mvp-halo"></div>
              <img src="https://i.pravatar.cc/150?img=11" alt="MVP" className="mvp-avatar" />
            </div>
            <div className="mvp-role">Sponsor Légendaire</div>
            <div className="mvp-name">Gol D. Roger</div>
            <div className="mvp-amount">Contribution Maximale</div>
          </div>

          <div className="mvp-card cyan">
             <div className="mvp-avatar-wrapper">
              <div className="mvp-halo"></div>
              <img src="https://i.pravatar.cc/150?img=33" alt="Hero" className="mvp-avatar" />
            </div>
            <div className="mvp-role">Héros du Mois</div>
            <div className="mvp-name">Shanks Le Roux</div>
            <div className="mvp-amount">Empereur de Février</div>
          </div>

          {/* Flux en direct */}
          <div className="live-feed-card">
            <div className="feed-header">
              <h3><span className="live-indicator"></span> Achats en direct</h3>
            </div>
            <div className="feed-list">
              <div className="feed-item"><img src="https://i.pravatar.cc/50?img=59" className="feed-avatar" /><div className="feed-info"><strong>Zoro_77</strong> a acheté <span className="product">Grade Corsaire</span></div></div>
              <div className="feed-item"><img src="https://i.pravatar.cc/50?img=44" className="feed-avatar" /><div className="feed-info"><strong>NamiSwann</strong> a acheté <span className="product">5x Reroll Dial</span></div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-branding">
          <img src="tenkailogo.webp" alt="TENKAI" height="35" />
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
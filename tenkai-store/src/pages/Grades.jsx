import { useStore } from '../context/StoreContext';

export default function Grades() {
  const { addToCart } = useStore();
  
  // 🟢 AJOUT DE 'img' ICI POUR CHAQUE GRADE
  const grades = [
    { name: "Grade VIP", desc: "X1.25 XP, coupe file, 5 rerolls dials, 5 rerolls haki, 5 rerolls clans, 30 000 berrys, Tenue VIP", price: 10.00, theme: "theme-corsaire", btnText: "S'abonner", img: "grade_vip.webp" },
    { name: "Grade Premium", desc: "X1.50 XP, coupe file, 10 rerolls dials, 10 rerolls haki, 10 rerolls clans, 50 000 berrys, Tenue Premium, 2 slots personnage ", price: 25.00, theme: "theme-empereur", btnText: "S'abonner", img: "grade_premium.webp" },
    { name: "Grade Roi des Pirates", desc: "Grade a vie ! X2 XP, coupe file, 15 rerolls dials, 15 rerolls haki, 15 rerolls clans, 100 000 berrys, Tenue ROI DES PIRATES, 3 slots personnage", price: 50.00, theme: "theme-roi", btnText: "Devenir Roi", img: "grade_roi_pirate.webp" }
  ];

  return (
    <section className="page active">
      <div className="page-header">
        <div className="bg-text">EMPIRE</div>
        <h1>L'ÉLITE DE TENKAI</h1>
        <p>Atteins le sommet de la chaîne alimentaire.</p>
      </div>
      <div className="bento-grid">
        {grades.map((grade, index) => (
          <div key={index} className={`card-wrapper ${grade.theme} title-accent`}>
            <div className="store-card">
              
              {/* LECTURE DE L'IMAGE UNIQUE DU GRADE */}
              <img 
                src={`/${grade.img || 'grade.webp'}`} 
                className="card-image" 
                alt={grade.name} 
                onError={(e) => e.target.src='https://via.placeholder.com/350x400/ffcc00/000?text=GRADE'} 
              />
              
              <div className="card-content">
                <h2>{grade.name.replace('Grade ', '')}</h2>
                <p>{grade.desc}</p>
                <div className="card-footer">
                  <div className="price-badge">{grade.price.toFixed(2)} €</div>
                  <button className="btn-action" onClick={() => addToCart({ name: grade.name, price: grade.price, img: grade.img || 'grade.webp' })}>
                    {grade.btnText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
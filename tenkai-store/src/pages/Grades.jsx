export default function Grades({ addToCart }) {
  const grades = [
    { name: "Grade Corsaire", desc: "File x2, Salaire +25%, Tag.", price: 10.00, theme: "theme-corsaire", btnText: "S'abonner" },
    { name: "Grade Roi des Pirates", desc: "Bypass, Salaire +100%, VIP.", price: 50.00, theme: "theme-roi", btnText: "Devenir Roi" },
    { name: "Grade Empereur", desc: "File x4, Salaire +50%.", price: 25.00, theme: "theme-empereur", btnText: "S'abonner" }
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
              <img src="grade.webp" className="card-image" alt={grade.name} />
              <div className="card-content">
                <h2>{grade.name.replace('Grade ', '')}</h2>
                <p>{grade.desc}</p>
                <div className="card-footer">
                  <div className="price-badge">{grade.price.toFixed(2)} €</div>
                  <button className="btn-action" onClick={() => addToCart({ name: grade.name, price: grade.price })}>
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
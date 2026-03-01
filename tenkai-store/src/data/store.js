export const storeData = {
  categories: {
    // On remplace rerolls et resets par une seule catégorie "Coins"
    coins: [
      { id: 'coins', title: 'Packs de Coins', desc: "La monnaie premium officielle de Tenkai.", img: 'coins_category.webp', theme: 'theme-roi' }
    ]
  },
  products: {
    // Les différentes offres de Coins
    coins: { 
      title: "Tenkai Coins", 
      theme: "theme-roi", 
      img: "coins_default.webp", 
      bgText: "WEALTH", 
      offers: [
        { name: "500 Tenkai Coins", price: 5.00, isBest: false, img: "coins_small.webp" },
        { name: "1200 Tenkai Coins", price: 10.00, isBest: true, img: "coins_medium.webp" },
        { name: "3000 Tenkai Coins", price: 20.00, isBest: false, img: "coins_large.webp" },
        { name: "8000 Tenkai Coins", price: 50.00, isBest: false, img: "coins_huge.webp" }
      ]
    }
  }
};
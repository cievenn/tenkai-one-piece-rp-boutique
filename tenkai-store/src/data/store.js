export const storeData = {
  categories: {
    rerolls: [
      { id: 'haki', title: 'Reroll Haki', desc: "Change la couleur et l'affinité.", img: 'haki.webp', theme: 'theme-haki' },
      { id: 'clan', title: 'Reroll Clan', desc: "Modifie ta lignée.", img: 'clan.webp', theme: 'theme-clan' },
      { id: 'dial', title: 'Reroll Dial', desc: "Tire un puissant Dial.", img: 'dials.webp', theme: 'theme-dial' }
    ],
    resets: [
      { id: 'classe', title: 'Reset Classe', desc: "Change de voie de combat.", img: 'classe.webp', theme: 'theme-classe' },
      { id: 'race', title: 'Reset Race', desc: "Change d'espèce sans perdre ton stuff.", img: 'race.webp', theme: 'theme-race' }
    ]
  },
  products: {
    haki: { title: "Reroll Haki", theme: "theme-haki", img: "dé_reroll.webp", bgText: "HAKI", offers: [
      { name: "1x Reroll Haki", price: 1.99, isBest: false, img: "1xhaki.webp" },
      { name: "5x Rerolls Haki", price: 19.99, isBest: true, img: "5xhaki.webp" },
      { name: "20x Rerolls Haki", price: 39.99, isBest: true, img: "20xhaki.webp" },
      { name: "50x Rerolls Haki", price: 99.99, isBest: true, img: "50xhaki.webp" },
      { name: "100x Rerolls Haki", price: 199.99, isBest: true, img: "100xhaki.webp"}
    ]},
    clan: { title: "Reroll Clan", theme: "theme-clan", img: "dé_reroll.webp", bgText: "BLOOD", offers: [
      { name: "1x Reroll Clan", price: 1.99, isBest: false, img: "1xclan.webp" },
      { name: "5x Rerolls Clan", price: 19.99, isBest: true, img: "5xclan.webp" },
      { name: "20x Rerolls Clan", price: 39.99, isBest: true, img: "20xclan.webp" },
      { name: "50x Rerolls Clan", price: 99.99, isBest: true, img: "50xclan.webp" },
      { name: "100x Rerolls Clan", price: 199.99, isBest: true, img: "100xclan.webp"}
    ]},
    dial: { title: "Reroll Dial", theme: "theme-dial", img: "dé_reroll.webp", bgText: "SKYPIEA", offers: [
      { name: "1x Reroll Dial", price: 1.99, isBest: false, img: "1xdial.webp" },
      { name: "5x Rerolls Dial", price: 19.99, isBest: true, img: "5xdial.webp" },
      { name: "20x Rerolls Dial", price: 39.99, isBest: true, img: "20xdial.webp" },
      { name: "50x Rerolls Dial", price: 99.99, isBest: true, img: "50xdial.webp" },
      { name: "100x Rerolls Dial", price: 199.99, isBest: true, img: "100xdial.webp"}
    ]},
    classe: { title: "Reset Classe", theme: "theme-classe", img: "classe.webp", bgText: "COMBAT", offers: [
      { name: "Reset Simple", price: 10.00, isBest: false, img: "classe_simple.webp" },
      { name: "Reset Premium", price: 18.00, isBest: true, img: "classe_premium.webp" }
    ]},
    race: { title: "Reset Race", theme: "theme-race", img: "race.webp", bgText: "SPECIES", offers: [
      { name: "1x Reset Race", price: 15.00, isBest: false, img: "race_1.webp" },
      { name: "Pack 3x Race", price: 35.00, isBest: true, img: "race_3.webp" }
    ]}
  }
};
export const storeData = {
  categories: {
    rerolls: [
      { id: 'haki', title: 'Reroll Haki', desc: "Change la couleur et l'affinité.", img: '/haki.webp', theme: 'theme-haki', specialImg: false },
      { id: 'clan', title: 'Reroll Clan', desc: "Modifie ta lignée.", img: '/clan.webp', theme: 'theme-clan', specialImg: false },
      { id: 'dial', title: 'Reroll Dial', desc: "Tire un puissant Dial.", img: '/dials.webp', theme: 'theme-dial', specialImg: false }
    ],
    resets: [
      { id: 'classe', title: 'Reset Classe', desc: "Change de voie de combat.", img: '/classe.webp', theme: 'theme-classe', specialImg: true },
      { id: 'race', title: 'Reset Race', desc: "Change d'espèce sans perdre ton stuff.", img: '/race.webp', theme: 'theme-race', specialImg: true }
    ]
  },
  products: {
    haki: { title: "Reroll Haki", theme: "theme-haki", img: "/dé_reroll.webp", bgText: "HAKI", specialImg: false, offers: [
      { name: "1x Reroll Haki", price: 5.00, isBest: false },
      { name: "5x Rerolls Haki", price: 20.00, isBest: true }
    ]},
    clan: { title: "Reroll Clan", theme: "theme-clan", img: "/dé_reroll.webp", bgText: "BLOOD", specialImg: false, offers: [
      { name: "1x Reroll Clan", price: 8.50, isBest: false },
      { name: "5x Rerolls Clan", price: 35.00, isBest: true }
    ]},
    dial: { title: "Reroll Dial", theme: "theme-dial", img: "/dé_reroll.webp", bgText: "SKYPIEA", specialImg: false, offers: [
      { name: "1x Dial", price: 3.00, isBest: false },
      { name: "5x Dials", price: 12.00, isBest: true }
    ]},
    classe: { title: "Reset Classe", theme: "theme-classe", img: "/classe.webp", bgText: "COMBAT", specialImg: true, offers: [
      { name: "Reset Simple", price: 10.00, isBest: false },
      { name: "Reset Premium", price: 18.00, isBest: true }
    ]},
    race: { title: "Reset Race", theme: "theme-race", img: "/race.webp", bgText: "SPECIES", specialImg: true, offers: [
      { name: "1x Reset Race", price: 15.00, isBest: false },
      { name: "Pack 3x Race", price: 35.00, isBest: true }
    ]}
  }
};
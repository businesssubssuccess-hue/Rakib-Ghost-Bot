module.exports = {
  config: {
    name: "fftips",
    aliases: ["freefiretips"],
    version: "1.0",
    author: "Rakib",
    countDown: 3,
    role: 0,
    shortDescription: "Random Free Fire pro tips (Bangla)",
    category: "free fire",
    guide: { en: "{p}fftips" }
  },
  onStart: async function ({ message }) {
    const tips = [
      "Rush korar agey footstep audio shono — minimum 3 sec wait koro",
      "Headshot er জন্য crosshair টা সবসময় head level এ রাখো — running time এও",
      "Gloo wall এ jump shot peek করো — predictable হবে না",
      "MP40 + AWM — best combo close+long range এর জন্য",
      "Drag headshot সবসময় close-range এ — practice training mode এ",
      "Vehicle drop এ jump করার সময় aim down করে rush দাও",
      "1v1 এ drop করলে hit-trade না করে cover এর পেছন থেকে peek মারো",
      "End zone এ flank route নাও — frontal push এ মরবে",
      "Smoke + medkit combo — heal করার সময় smoke ঢেলে দাও",
      "Sensitivity high রাখলে close range এ ভাল, কিন্তু sniping এ low দরকার",
      "Pre-fire করো — corner peek এর আগে trigger ধরে রাখো",
      "Movement এর সময় ZIGZAG run — straight line এ গেলে সহজ target"
    ];
    return message.reply(`🔫 𝗙𝗙 𝗣𝗥𝗢 𝗧𝗜𝗣\n━━━━━━━━━━━━━━\n💡 ${tips[Math.floor(Math.random() * tips.length)]}\n━━━━━━━━━━━━━━\n👻 Ghost Net`);
  }
};

module.exports = {
  config: {
    name: "ffmap",
    aliases: ["ffmaps"],
    version: "1.0",
    author: "Rakib",
    countDown: 3,
    role: 0,
    shortDescription: "Random Free Fire map suggestion",
    category: "free fire",
    guide: { en: "{p}ffmap" }
  },
  onStart: async function ({ message }) {
    const maps = [
      { n: "Bermuda", d: "Classic — সব এর প্রিয়, balanced loot" },
      { n: "Bermuda Remastered", d: "Updated graphics, smoother gameplay" },
      { n: "Purgatory", d: "৩টা island connected — sniper এর paradise" },
      { n: "Kalahari", d: "Desert map, vehicle এর জন্য best" },
      { n: "Alpine", d: "Snow map, close-range combat ভালো" },
      { n: "Nexterra", d: "Future-style map, এক্সাইটিং drops" }
    ];
    const m = maps[Math.floor(Math.random() * maps.length)];
    const drops = ["Clock Tower", "Factory", "Pochinok", "Bayfront", "Mill", "Plantation", "Cape Town", "Refinery"];
    const d = drops[Math.floor(Math.random() * drops.length)];
    const tip = ["Quick rush early", "Hold building ground", "Snipe from edges", "Vehicle rotate fast", "Loot heavy first"][Math.floor(Math.random() * 5)];
    return message.reply(`🗺️ 𝗙𝗙 𝗠𝗔𝗣 𝗦𝗨𝗚𝗚𝗘𝗦𝗧𝗜𝗢𝗡\n━━━━━━━━━━━━━━━━\n📍 Map  : ${m.n}\n📝 Note : ${m.d}\n🎯 Drop : ${d}\n💡 Tip  : ${tip}\n━━━━━━━━━━━━━━━━\n👻 Ghost Net`);
  }
};

module.exports = {
  config: {
    name: "ffstats",
    aliases: ["freefirestats"],
    version: "1.0",
    author: "Rakib",
    countDown: 5,
    role: 0,
    shortDescription: "Random Free Fire player stat card",
    longDescription: "নিজের বা mention এর জন্য একটা মজার Free Fire stat dump (fake demo)",
    category: "free fire",
    guide: { en: "{p}ffstats [name]" }
  },
  onStart: async function ({ message, event, args, api }) {
    let name = args.join(" ").trim();
    if (!name) {
      let uid = event.senderID;
      if (event.type === "message_reply") uid = event.messageReply.senderID;
      else if (Object.keys(event.mentions || {}).length) uid = Object.keys(event.mentions)[0];
      try { name = (await api.getUserInfo(uid))[uid].name; } catch { name = "Player"; }
    }
    const r = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
    const lvl = r(40, 80);
    const rank = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Heroic", "Grandmaster"][r(0, 6)];
    const kd = (Math.random() * 5 + 1).toFixed(2);
    const wins = r(50, 2000);
    const matches = wins + r(100, 5000);
    const headshots = r(40, 95);
    const totalKills = r(2000, 50000);
    return message.reply(`🔫 𝗙𝗥𝗘𝗘 𝗙𝗜𝗥𝗘 𝗦𝗧𝗔𝗧𝗦
━━━━━━━━━━━━━━━━━━
👤 Player    : ${name}
🏆 Rank      : ${rank}
📊 Level     : ${lvl}
🎯 K/D Ratio : ${kd}
🥇 Wins      : ${wins}
🎮 Matches   : ${matches}
💀 Total Kill: ${totalKills}
🎯 HS Rate   : ${headshots}%
━━━━━━━━━━━━━━━━━━
⚠ Demo stats — real Free Fire API ব্যবহার করা হয়নি
👻 Ghost Net`);
  }
};

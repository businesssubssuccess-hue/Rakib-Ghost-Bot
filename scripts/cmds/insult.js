module.exports = {
  config: {
    name: "insult",
    aliases: ["bokachoda", "kotha"],
    version: "1.0",
    author: "Rakib",
    countDown: 3,
    role: 0,
    shortDescription: "Bondhuke moja kore galagal",
    category: "fun",
    guide: { en: "{p}insult @mention" }
  },
  onStart: async function ({ message, event, api }) {
    let name = "তুই";
    if (event.type === "message_reply") {
      try { name = (await api.getUserInfo(event.messageReply.senderID))[event.messageReply.senderID].name; } catch {}
    } else if (Object.keys(event.mentions || {}).length) {
      const id = Object.keys(event.mentions)[0];
      try { name = (await api.getUserInfo(id))[id].name; } catch {}
    }
    const list = [
      `${name}, তুই হলি সেই ভাজা মাছ যেটা না পুড়েছে, না সিদ্ধ! 🐟`,
      `${name}, তোর IQ আর তোর pocket এর টাকা — দুটোই ZERO! 🤡`,
      `${name}, তুই হলি সেই WiFi যেটা connect হয় but internet নাই! 📶`,
      `${name}, তোকে দেখে ভূতও বলে — "ভাই আমি দূরে যাই!" 👻`,
      `${name}, তোর mood swing এর চেয়ে Dhaka traffic ও predictable! 🚗`,
      `${name}, তুই হলি সেই extra zero যা phone bill এ অপ্রয়োজনীয়! 0️⃣`,
      `${name}, তোর জীবনে glow নেই, শুধু slow আছে! 🐌`,
      `${name}, Mirror তোকে দেখে বলে — "ভাই আমাকে break কোরো না!" 🪞`
    ];
    return message.reply(`💀 𝗙𝗨𝗡 𝗜𝗡𝗦𝗨𝗟𝗧\n━━━━━━━━━━━━━━\n${list[Math.floor(Math.random() * list.length)]}\n━━━━━━━━━━━━━━\n👻 Ghost Net`);
  }
};

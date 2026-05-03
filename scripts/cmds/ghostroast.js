module.exports = {
  config: {
    name: "ghostroast",
    aliases: ["roastbn", "ghostgali"],
    version: "1.0",
    author: "Rakib",
    countDown: 5,
    role: 0,
    shortDescription: "ভূত স্টাইলে বাংলা roast",
    longDescription: "Mention বা reply করলে user কে দারুণ Bengali roast দেয়",
    category: "fun",
    guide: { en: "{p}ghostroast @mention | reply" }
  },

  onStart: async function ({ event, message, api }) {
    let uid = event.senderID;
    let name = "তুই";
    if (event.type === "message_reply") uid = event.messageReply.senderID;
    else if (Object.keys(event.mentions || {}).length) {
      uid = Object.keys(event.mentions)[0];
      name = event.mentions[uid].replace("@", "");
    }
    if (uid !== event.senderID) {
      try { name = (await api.getUserInfo(uid))[uid].name; } catch {}
    }

    const roasts = [
      `${name}, তোর মুখটা দেখে আয়না ভেঙে গেলো 💀`,
      `${name}, তুই হলি সেই ছেলেটা যাকে দেখলে Wi-Fi এর signal চলে যায় 📶❌`,
      `${name}, তোর IQ আর তোর pocket এর টাকা — দুইটাই zero 🤡`,
      `${name}, তোর সেলফি দেখে phone নিজেই factory reset করে নিয়েছে 📱💔`,
      `${name}, তুই হলি সেই product যেটার warranty কেউ claim করে না 😂`,
      `${name}, তোর জীবনের motivation হলো ৫ টাকার চা ☕`,
      `${name}, তোর GF নাই — কারণ Google Map এও তোর location ভুল দেখায় 🗺️`,
      `${name}, তোর gaming setup মানে phone এ Free Fire আর mom এর গালি 🎮👋`,
      `${name}, তুই এমন একটা মানুষ যাকে block করতে অন্যদের real money খরচ হয় 💸`,
      `${name}, তোর crush ও তোকে friend zone এ পাঠায়নি — কারণ সে তোকে চিনে না 👻`,
      `${name}, তোর জন্য Facebook নতুন reaction add করেছে — "Cringe" 😬`,
      `${name}, তুই হলি সেই youtuber যার subscriber শুধু তার বাবা 📹`,
      `${name}, তোকে দেখলে ভূতও দ্বিতীয়বার ভাবে — ভয় দেখাবো নাকি কষ্ট পাবো 👻💔`,
      `${name}, তোর sense of humor টা PUBG এর mobile data এর মতো — দ্রুত শেষ হয়ে যায় 🎮`,
      `${name}, তোর জীবনে rizz এতটাই কম যে Siri ও তোকে block করেছে 🗣️❌`,
      `${name}, তুই সেই ছাত্র যার GPA টা তোর height থেকেও কম 📏`,
      `${name}, তোর জন্য বাজারে নতুন brand এসেছে — "ব্যর্থতা+" 🛒`,
      `${name}, তোর জীবনের glow-up টা চাঁদের অন্ধকার পাশে happen হবে 🌑`,
      `${name}, তোকে দেখলে mosquito ও কামড় দিতে confusion এ পড়ে — খাবো নাকি pity দেবো 🦟`,
      `${name}, তোর confidence আর Bangladesh এর traffic — দুটোই দেখা যায় না 🚗💨`
    ];

    const r = roasts[Math.floor(Math.random() * roasts.length)];
    return message.reply(`👻 𝗚𝗛𝗢𝗦𝗧 𝗥𝗢𝗔𝗦𝗧\n━━━━━━━━━━━━━━\n${r}\n━━━━━━━━━━━━━━\n💀 Powered by Ghost Net Edition`);
  }
};

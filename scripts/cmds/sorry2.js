const msgs = [
  "আমি সত্যিই দুঃখিত। আমার ভুলের জন্য তোমাকে কষ্ট দিয়েছি, মাফ করো। 🙏",
  "আমি ভুল করেছি, এটা স্বীকার করছি। তোমার কাছে ক্ষমা চাইছি। 💔",
  "তোমাকে hurt করিনি ইচ্ছে করে। please forgive করো। 😢",
  "আমার কথা বা কাজে কষ্ট পেলে সত্যিই sorry। আর হবে না। 🌷",
  "ভুল সবাই করে, কিন্তু ক্ষমা চাওয়া মানুষই করে। sorry ভাই। 🤝",
  "তোমার সাথে যা হয়েছে তার জন্য আমি দায়ী। মাফ করে দাও। 🙇",
  "I'm really sorry। তোমার বিশ্বাস ভাঙিনি ইচ্ছে করে। 💙",
  "ক্ষমা চাওয়া কঠিন, কিন্তু তোমার কাছে সহজেই চাই — sorry। 💌"
];

module.exports.config = {
  name: "sorry2",
  aliases: ["apology", "ক্ষমা", "maaf"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Sorry messages in Bangla 🙏" },
  longDescription: { en: "Send a sincere sorry/apology message in Bangla." },
  category: "বাংলা",
  guide: { en: "{pn} [@mention]" }
};

module.exports.onStart = async ({ event, message, usersData }) => {
  const m = msgs[Math.floor(Math.random() * msgs.length)];
  let target = "";
  if (event.mentions && Object.keys(event.mentions).length > 0) {
    const uid = Object.keys(event.mentions)[0];
    const name = await usersData.getName(uid) || "তুমি";
    target = `🙏 ${name},\n\n`;
  }
  return message.reply(`🙏 𝗦𝗼𝗿𝗿𝘆 𝗠𝗲𝘀𝘀𝗮𝗴𝗲\n━━━━━━━━━━━━\n${target}${m}\n━━━━━━━━━━━━\n💌 আরেকটা: .sorry2`);
};

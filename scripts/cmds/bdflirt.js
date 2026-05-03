const msgs = [
  "তুমি কি wifi password? কারণ তোমার সাথে সংযুক্ত হতে চাই সারাজীবন। 😏",
  "তোমার চোখ দুটো তারার মতো, রাতের আকাশে হারিয়ে যাই। 😍",
  "তুমি কি Google? কারণ তোমার মধ্যে সব উত্তর খুঁজে পাই। 💻❤️",
  "তোমার হাসিটা দেখলে দিনটা সুন্দর হয়ে যায়। 😊",
  "তুমি কি চকোলেট? এত মিষ্টি কেন তুমি? 🍫",
  "তোমার সাথে কথা বলতে বলতে সময় কোথায় যায় বুঝি না। ⏰💕",
  "তুমি কি সূর্যমুখী? কারণ তুমি সবসময় আলো ছড়াও। 🌻",
  "তুমি কি ম্যাপ? কারণ তোমার চোখে হারিয়ে গেছি পথ। 🗺️❤️",
  "তোমার একটু হাসি পেলে মনে হয় lottery জিতে গেছি। 🎰💕",
  "তুমি কি ঔষধ? কারণ তোমাকে দেখলেই সব ব্যথা সেরে যায়। 💊❤️"
];

module.exports.config = {
  name: "bdflirt",
  aliases: ["flirt2", "ফ্লার্ট", "cuteline"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Fun flirt lines in Bangla 😏" },
  longDescription: { en: "Get a fun Bangla flirt/pickup line!" },
  category: "বাংলা",
  guide: { en: "{pn} [@mention]" }
};

module.exports.onStart = async ({ event, message, usersData }) => {
  const m = msgs[Math.floor(Math.random() * msgs.length)];
  let target = "";
  if (event.mentions && Object.keys(event.mentions).length > 0) {
    const uid = Object.keys(event.mentions)[0];
    const name = await usersData.getName(uid) || "তুমি";
    target = `😏 ${name}, `;
  }
  return message.reply(`😏 𝗙𝗹𝗶𝗿𝘁 𝗟𝗶𝗻𝗲\n━━━━━━━━━━━━\n${target}${m}\n━━━━━━━━━━━━\n💕 আরেকটা: .bdflirt`);
};

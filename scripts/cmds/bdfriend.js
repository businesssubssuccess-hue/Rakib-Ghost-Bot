const msgs = [
  "সত্যিকারের বন্ধু সেই যে তোমার ভুলও ধরিয়ে দেয়, আবার পাশেও থাকে। 🤝",
  "বন্ধুত্ব মানে জাজ না করা — যেমন আছো তেমনি accept করা। 💙",
  "ভালো বন্ধু জীবনের সবচেয়ে দামি সম্পদ। ধরে রেখো। 💎",
  "দূরত্ব কমায় না বন্ধুত্ব, সত্যিকারের বন্ধু সবসময় মনে থাকে। 🌟",
  "তোমার সাথে হাসা-কাঁদা যে পারে, সেই তোমার আসল বন্ধু। 😊😢",
  "বন্ধু থাকলে কোনো সমস্যাই বড় মনে হয় না। 💪",
  "বছরে একবার কথা হলেও যে মন থেকে চায় — সেই বন্ধু। ❤️",
  "Friendship is not about whom you have known the longest — it's about who came and never left! 🤗"
];

module.exports.config = {
  name: "bdfriend",
  aliases: ["friendship", "বন্ধুত্ব", "friendmsg"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Friendship messages in Bangla 🤝" },
  longDescription: { en: "Send a heartfelt friendship message!" },
  category: "social",
  guide: { en: "{pn} [@mention]" }
};

module.exports.onStart = async ({ event, message, usersData }) => {
  const uids = Object.keys(event.mentions || {});
  const m = msgs[Math.floor(Math.random() * msgs.length)];
  let target = "";
  if (uids.length > 0) {
    const name = await usersData.getName(uids[0]) || "বন্ধু";
    target = `🤝 ${name},\n\n`;
  }
  return message.reply(`🤝 𝗙𝗿𝗶𝗲𝗻𝗱𝘀𝗵𝗶𝗽\n━━━━━━━━━━━━\n${target}${m}\n━━━━━━━━━━━━\n💙 আরেকটা: .bdfriend`);
};

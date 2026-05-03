const quotes = [
  "রাগ একটি আগুন — নিজেকেই পোড়ায় বেশি। 🔥",
  "রাগ করো, কিন্তু রাতের বেলা রাগ নিয়ে ঘুমিও না। 😤",
  "রাগের সময় চুপ থাকা সবচেয়ে বড় শক্তি। 🤐",
  "তোমার রাগ দেখে শত্রু খুশি হয়, বন্ধু কষ্ট পায়। 💔",
  "দশটা গুণে রাগ প্রকাশ করো — না হলে পস্তাবে। 🔢",
  "রাগ মানুষকে অন্ধ করে, কিন্তু দুঃখ মানুষকে জ্ঞানী করে। 😔",
  "সবচেয়ে শক্তিশালী মানুষ সে, যে রাগের মধ্যেও শান্ত থাকতে পারে। 💪",
  "তোমার মূল্যবান কেউ? রাগ করলে তাকে কষ্ট দিও না। ❤️",
];

module.exports.config = {
  name: "angry",
  aliases: ["rage", "রাগ", "madquote"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Angry quotes & cool-down tips 😤" },
  longDescription: { en: "Quotes about anger to cool yourself down!" },
  category: "বাংলা",
  guide: { en: "{pn}" }
};

module.exports.onStart = async ({ message }) => {
  const q = quotes[Math.floor(Math.random() * quotes.length)];
  return message.reply(`😤 𝗔𝗻𝗴𝗿𝘆 𝗤𝘂𝗼𝘁𝗲\n━━━━━━━━━━━━\n${q}\n━━━━━━━━━━━━\n🔥 একটু শান্ত হও! | আরেকটা: .angry`);
};

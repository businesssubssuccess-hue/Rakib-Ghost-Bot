const captions = [
  "নিজেকে ভালোবাসো, বাকিরা এমনিই আসবে। 🌟 #attitude",
  "আমি perfect না, কিন্তু আমি unique। 💎 #selfie",
  "সূর্য ডুবলেও আলো থাকে, আমিও তেমনই। 🌅 #vibe",
  "জীবনটা ছোট, তাই হাসতে থাকো। 😊 #life",
  "আমার হাসি আমার অস্ত্র। 😁 #smile",
  "ব্যর্থতা থামার সংকেত নয়, চেষ্টা করার সংকেত। 🔥 #motivation",
  "চুপ থাকাটাও একটা উত্তর। 🤫 #silent",
  "আমার রাস্তা আলাদা, তাই গন্তব্যও আলাদা। 🛤️ #unique",
  "ভালো থাকো, ভালো রেখো। 💚 #positivity",
  "অন্যের মতামত আমার জীবন নিয়ন্ত্রণ করে না। 👊 #bossup",
  "সকালের চায়ের মতো জীবনটা উপভোগ করো। ☕ #morning",
  "আমি সেই মানুষ যে শেষ পর্যন্ত হাসে। 😌 #winner",
  "পথ যদি কঠিন হয়, জেনো তুমি সঠিক পথে আছো। 💪 #hardwork",
  "রাত যতই গভীর হোক, ভোর আসবেই। 🌄 #hope",
  "আমি যা, তাই-ই থাকব — চাইলে মেনে নাও, না চাইলে যাও। 😎 #real"
];

module.exports.config = {
  name: "bdcaption",
  aliases: ["caption2", "fbcaption", "ক্যাপশন", "cap2"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Bangla FB captions 📸" },
  longDescription: { en: "Get a cool Bangla caption for your Facebook post!" },
  category: "বাংলা",
  guide: { en: "{pn}" }
};

module.exports.onStart = async ({ message }) => {
  const c = captions[Math.floor(Math.random() * captions.length)];
  return message.reply(`📸 𝗙𝗕 𝗖𝗮𝗽𝘁𝗶𝗼𝗻\n━━━━━━━━━━━━\n${c}\n━━━━━━━━━━━━\n✨ আরেকটা: .bdcaption`);
};

const truths = [
  "তোমার জীবনে সবচেয়ে বড় ভুল কী ছিল? 🤔",
  "তুমি কি কখনো কারো ব্যাপারে jealous হয়েছো? কার ব্যাপারে? 😒",
  "তোমার first crush কে ছিল? 😳",
  "তুমি কি গ্রুপে কারো কথা পছন্দ করো না? কার? 🤫",
  "তোমার সবচেয়ে বড় গোপন কথা কী? 🤐",
  "তুমি কি কাউকে মিথ্যা বলেছো সম্প্রতি? কী নিয়ে? 😅",
  "তোমার সবচেয়ে বাজে অভ্যাস কী? 😬",
  "তুমি কি কখনো কারো সাথে বিশ্বাসঘাতকতা করেছো? 😔",
  "এই group এ তুমি কাকে সবচেয়ে বেশি পছন্দ করো? 💕",
  "তুমি কি কখনো কারো message পড়ে reply দাওনি ইচ্ছে করে? 👀",
  "তোমার জীবনের সবচেয়ে লজ্জাজনক মুহূর্ত কী? 😖",
  "তুমি কি online থেকে offline দেখিয়েছো কখনো? 📴",
  "তোমার মাথায় এখন কার কথা ঘুরছে? 🌀",
  "তুমি কি কাউকে না বলে stalk করেছো? 👁️",
  "এই group এ সবচেয়ে boring কে? সৎভাবে বলো! 😂"
];

module.exports.config = {
  name: "truth2",
  aliases: ["btruth", "t2", "সত্য"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 5,
  role: 0,
  shortDescription: { en: "Truth or Dare - Truth questions 🤫" },
  longDescription: { en: "Get a random truth question for the group!" },
  category: "বাংলা",
  guide: { en: "{pn}" }
};

module.exports.onStart = async ({ message }) => {
  const t = truths[Math.floor(Math.random() * truths.length)];
  return message.reply(`🤫 𝗧𝗿𝘂𝘁𝗵 𝗤𝘂𝗲𝘀𝘁𝗶𝗼𝗻\n━━━━━━━━━━━━\n❓ ${t}\n━━━━━━━━━━━━\n💯 সত্যি বলতে হবে! | আরেকটা: .truth2`);
};

const wishes = [
  "🌸 শুভ নববর্ষ! এসো হে বৈশাখ এসো এসো — নতুন বছরে নতুন আশা। 🇧🇩",
  "🎊 পহেলা বৈশাখের শুভেচ্ছা! বাংলা নববর্ষ ১৪৩১ মুবারক। 🌺",
  "🌻 এসো হে বৈশাখ! নতুন বছরে সুখ-শান্তি আসুক তোমার জীবনে। শুভ নববর্ষ! 🎉",
  "🌹 বাংলা নববর্ষের অনেক অনেক শুভেচ্ছা! মঙ্গল শোভাযাত্রায় যাও, আনন্দ করো। 🥁",
  "🎶 পান্তা-ইলিশ খাও, ঢোল বাজাও — শুভ বাংলা নববর্ষ! 🐟🍚",
  "🌞 নতুন বছরে পুরনো দুঃখ ভুলে যাও। শুভ বাংলা নববর্ষ ১৪৩১! 🌸"
];

module.exports.config = {
  name: "pohela",
  aliases: ["boishakh", "নববর্ষ", "pahela"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Pohela Boishakh wishes 🌸" },
  longDescription: { en: "Send Bangla New Year (Pohela Boishakh) wishes!" },
  category: "social",
  guide: { en: "{pn} | {pn} [@mention]" }
};

module.exports.onStart = async ({ event, message, usersData }) => {
  const uids = Object.keys(event.mentions || {});
  const w = wishes[Math.floor(Math.random() * wishes.length)];
  let target = "";
  if (uids.length > 0) {
    const name = await usersData.getName(uids[0]) || "তুমি";
    target = `🌸 ${name},\n\n`;
  }
  return message.reply(`🌸 𝗣𝗼𝗵𝗲𝗹𝗮 𝗕𝗼𝗶𝘀𝗵𝗮𝗸𝗵\n━━━━━━━━━━━━\n${target}${w}\n━━━━━━━━━━━━\n🇧🇩 আরেকটা: .pohela`);
};

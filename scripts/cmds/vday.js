const wishes = [
  "💝 Happy Valentine's Day! তোমার ভালোবাসা অনন্তকাল টিকে থাকুক। ❤️",
  "🌹 ভালোবাসা দিবসের শুভেচ্ছা! প্রিয় মানুষকে আজ বলো 'I love you'. 💕",
  "💌 Valentine's Day Mubarak! ভালোবাসা শুধু একদিনের নয়, প্রতিদিনের। ❤️🌹",
  "🦋 আজকের দিনটা বিশেষ কারণ তুমি বিশেষ। Happy Valentine's Day! 💝",
  "🌺 ভালোবাসার কোনো সীমা নেই — এই দিনে সেটা জানিয়ে দাও প্রিয়জনকে! 💞",
];

module.exports.config = {
  name: "vday",
  aliases: ["valentine", "ভালোবাসাদিবস", "vd"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Valentine's Day wishes 💝" },
  longDescription: { en: "Send beautiful Valentine's Day wishes!" },
  category: "social",
  guide: { en: "{pn} [@mention]" }
};

module.exports.onStart = async ({ event, message, usersData }) => {
  const uids = Object.keys(event.mentions || {});
  const w = wishes[Math.floor(Math.random() * wishes.length)];
  let target = "";
  if (uids.length > 0) {
    const name = await usersData.getName(uids[0]) || "প্রিয়";
    target = `💝 ${name},\n\n`;
  }
  return message.reply(`💝 𝗩𝗮𝗹𝗲𝗻𝘁𝗶𝗻𝗲'𝘀 𝗗𝗮𝘆\n━━━━━━━━━━━━\n${target}${w}\n━━━━━━━━━━━━\n🌹 আরেকটা: .vday`);
};

const wishes = [
  "🌙 ঈদ মোবারক! আল্লাহ তোমার সব দোয়া কবুল করুন। ঈদের আনন্দ সবার সাথে ভাগ করে নাও। 🌸",
  "☪️ ঈদ মোবারক! এই ঈদ তোমার জীবনে সুখ ও সমৃদ্ধি নিয়ে আসুক। 💚",
  "🎉 ঈদুল ফিতর মোবারক! রোজার মাসের পর এই আনন্দময় দিন আসুক বারবার। 🌙✨",
  "🌺 ঈদ মোবারক! আল্লাহর রহমত তোমার উপর বর্ষিত হোক। সবার সাথে খুশি ভাগ করো। 💕",
  "🕌 ঈদ মোবারক! এই পবিত্র দিনে আল্লাহ তোমার সব গুনাহ মাফ করুন। 🌟",
  "🎊 Eid Mubarak! May this Eid fill your life with joy, peace and happiness! ☪️",
  "🌙 ঈদ আসে খুশি নিয়ে, আনন্দ দিয়ে যায়। এই ঈদে তোমার মন ভরে যাক সুখে। 💛"
];

module.exports.config = {
  name: "eid",
  aliases: ["eidwish", "ঈদ", "eidmubarak"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Eid wishes in Bangla ☪️" },
  longDescription: { en: "Send beautiful Eid Mubarak wishes in Bangla!" },
  category: "social",
  guide: { en: "{pn} | {pn} [@mention]" }
};

module.exports.onStart = async ({ event, message, usersData }) => {
  const uids = Object.keys(event.mentions || {});
  const w = wishes[Math.floor(Math.random() * wishes.length)];
  let target = "";
  if (uids.length > 0) {
    const name = await usersData.getName(uids[0]) || "তুমি";
    target = `🌙 ${name},\n\n`;
  }
  return message.reply(`☪️ 𝗘𝗶𝗱 𝗪𝗶𝘀𝗵\n━━━━━━━━━━━━\n${target}${w}\n━━━━━━━━━━━━\n🌟 আরেকটা: .eid`);
};

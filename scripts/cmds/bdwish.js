const wishes = {
  birthday: ["🎂 জন্মদিনের অনেক অনেক শুভেচ্ছা! তোমার প্রতিটি স্বপ্ন পূরণ হোক। 🎉🌟", "🎁 Happy Birthday! আজকের দিনটা তোমার জীবনের সুন্দরতম দিন হোক! 🎊", "🎂 শুভ জন্মদিন! আল্লাহ তোমাকে দীর্ঘ ও সুখী জীবন দিন। 🌸"],
  anniversary: ["💑 শুভ বার্ষিকী! তোমাদের ভালোবাসা চিরকাল অটুট থাকুক। 💕🌹", "🥂 Anniversary Mubarak! তোমরা সারাজীবন এভাবেই হাসতে থাকো। 💑"],
  exam: ["📚 পরীক্ষায় সাফল্য কামনা করছি! তুমি পারবে! 💪🌟", "✏️ Best of luck for your exam! পড়েছ ভালো, লিখবে ভালো। 🎯"],
  job: ["💼 নতুন চাকরির শুভেচ্ছা! সাফল্য তোমার সাথে থাকুক। 🌟", "🎊 Congratulations on your new job! নতুন শুরু, নতুন স্বপ্ন। 💼🚀"],
};

module.exports.config = {
  name: "bdwish",
  aliases: ["wish2", "wishes", "শুভেচ্ছা"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Bangla wishes for all occasions 🎉" },
  longDescription: { en: "Get Bangla wishes for birthday, anniversary, exam, job!" },
  category: "বাংলা",
  guide: { en: "{pn} [birthday/anniversary/exam/job] [@mention]" }
};

module.exports.onStart = async ({ event, message, args, usersData }) => {
  const type = args[0]?.toLowerCase() || "birthday";
  const list = wishes[type] || wishes.birthday;
  const w = list[Math.floor(Math.random() * list.length)];

  const uids = Object.keys(event.mentions || {});
  let target = "";
  if (uids.length > 0) {
    const name = await usersData.getName(uids[0]) || "তুমি";
    target = `🎉 ${name},\n\n`;
  }

  const types = Object.keys(wishes).join(" / ");
  return message.reply(`🎉 𝗪𝗶𝘀𝗵\n━━━━━━━━━━━━\n${target}${w}\n━━━━━━━━━━━━\n💡 Types: ${types}`);
};

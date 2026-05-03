module.exports.config = {
  name: "age2",
  aliases: ["myage", "বয়স"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Age calculator from birthdate 🎂" },
  longDescription: { en: "Calculate your exact age from your date of birth." },
  category: "utility-bd",
  guide: { en: "{pn} [DD/MM/YYYY] — e.g: .age2 15/08/2000" }
};

module.exports.onStart = async ({ message, args }) => {
  if (!args[0]) return message.reply("📅 ব্যবহার: .age2 [তারিখ/মাস/বছর]\n📌 উদাহরণ: .age2 15/08/2000");

  const parts = args[0].split("/");
  if (parts.length !== 3) return message.reply("❌ ফরম্যাট সঠিক নয়। DD/MM/YYYY ব্যবহার করো।");

  const [day, month, year] = parts.map(Number);
  if (isNaN(day) || isNaN(month) || isNaN(year)) return message.reply("❌ সংখ্যা সঠিকভাবে দাও।");

  const birth = new Date(year, month - 1, day);
  const today = new Date();

  if (birth > today) return message.reply("❌ ভবিষ্যতের তারিখ দেওয়া যাবে না!");

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  if (days < 0) { months--; days += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); }
  if (months < 0) { years--; months += 12; }

  const totalDays = Math.floor((today - birth) / (1000 * 60 * 60 * 24));
  const nextBirthday = new Date(today.getFullYear(), month - 1, day);
  if (nextBirthday < today) nextBirthday.setFullYear(today.getFullYear() + 1);
  const daysUntilBirthday = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));

  return message.reply(`🎂 𝗔𝗴𝗲 𝗖𝗮𝗹𝗰𝘂𝗹𝗮𝘁𝗼𝗿\n━━━━━━━━━━━━\n📅 জন্মতারিখ: ${day}/${month}/${year}\n🎯 বয়স: ${years} বছর ${months} মাস ${days} দিন\n📊 মোট দিন: ${totalDays.toLocaleString()} দিন\n🎉 পরের জন্মদিন: ${daysUntilBirthday} দিন পরে\n━━━━━━━━━━━━\n🌟 Happy ${years + 1}th birthday in advance!`);
};

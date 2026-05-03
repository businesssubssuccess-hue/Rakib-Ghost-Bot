module.exports = {
  config: {
    name: "horny level",
    aliases: ["check", "🥵","hrny-lvl"],
    version: "1.0.0",
    author: "RAKIB ISLAM",
    countDown: 5,
    role: 0,
    category: "18+",
    shortDescription: { en: "Check your horny level" },
    guide: { en: "{pn} @mention" }
  },

  onStart: async function ({ message, event, args }) {
    const mention = Object.keys(event.mentions);
    const target = mention.length > 0 ? event.mentions[mention[0]].replace("@", "") : "You";
    const level = Math.floor(Math.random() * 101);
    
    let comment = "";
    if (level < 30) comment = "একদম ইনোসেন্ট বাচ্চা! 😇";
    else if (level < 60) comment = "একটু একটু দুষ্টু হচ্ছে... 😏";
    else if (level < 90) comment = "সাবধান! এর ভেতরে অনেক কিছু চলছে! 🔥";
    else comment = "একে দ্রুত বিয়ে করান, কন্ট্রোল করা অসম্ভব! 🥵";

    const msg = 
      `╭──────❍ 𝗛𝗢𝗥𝗡𝗬 𝗠𝗘𝗧𝗘𝗥 ❍──────╮\n` +
      `│ 👤 𝗧𝗮𝗿𝗴𝗲𝘁: ${target}\n` +
      `│ 🌡️ 𝗟𝗲𝘃𝗲𝗹: ${level}%\n` +
      `├──────────────────────────\n` +
      `│ 📝 𝗡𝗼𝘁𝗲: ${comment}\n` +
      `╰─────────── 💠 ───────────╯\n` +
      `👤 𝗗𝗲𝘃: RAKIB ISLAM 🧸`;

    return message.reply(msg);
  }
};

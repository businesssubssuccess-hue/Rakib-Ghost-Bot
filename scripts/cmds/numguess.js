const fs = require("fs-extra");
const path = require("path");
const STATE = path.join(__dirname, "cache", "numguess_state.json");

function load() { try { return fs.readJsonSync(STATE); } catch { return {}; } }
function save(d) { fs.ensureDirSync(path.dirname(STATE)); fs.writeJsonSync(STATE, d, { spaces: 2 }); }

module.exports.config = {
  name: "numguess",
  aliases: ["nguess", "সংখ্যাখেলা", "guessgame"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 3,
  role: 0,
  shortDescription: { en: "Guess the number game 🎲" },
  longDescription: { en: "Bot thinks of a number 1-100, you guess it!" },
  category: "game-bd",
  guide: { en: "{pn} start | {pn} [guess]" }
};

module.exports.onStart = async ({ api, event, args, message }) => {
  const tid = event.threadID;
  let data = load();

  if (args[0] === "start" || !data[tid]) {
    const secret = Math.floor(Math.random() * 100) + 1;
    data[tid] = { secret, tries: 0 };
    save(data);
    return message.reply(`🎲 𝗡𝘂𝗺𝗯𝗲𝗿 𝗚𝘂𝗲𝘀𝘀 𝗚𝗮𝗺𝗲\n━━━━━━━━━━━━\n🤔 আমি ১-১০০ এর মধ্যে একটা সংখ্যা ভেবেছি!\n💡 অনুমান করো: .numguess [সংখ্যা]\n🎯 যত কম চেষ্টায় পারো!`);
  }

  const guess = parseInt(args[0]);
  if (isNaN(guess)) return message.reply("❌ একটা সংখ্যা দাও। যেমন: .numguess 50");

  data[tid].tries++;
  const { secret, tries } = data[tid];

  if (guess === secret) {
    delete data[tid];
    save(data);
    return message.reply(`🎉 𝗖𝗼𝗿𝗿𝗲𝗰𝘁!\n━━━━━━━━━━━━\n✅ হ্যাঁ! সংখ্যাটা ছিল ${secret}!\n🏆 তুমি ${tries}টা চেষ্টায় পেরেছ!\n${tries <= 5 ? "🌟 অসাধারণ!" : tries <= 10 ? "😊 ভালো!" : "💪 আরও practice করো!"}\n🔄 নতুন খেলা: .numguess start`);
  }

  const hint = guess < secret ? "⬆️ বেশি বলো!" : "⬇️ কম বলো!";
  return message.reply(`❌ ভুল! ${hint}\n🔢 তোমার অনুমান: ${guess}\n🎯 চেষ্টা: ${tries}\n💡 আবার: .numguess [সংখ্যা]`);
};

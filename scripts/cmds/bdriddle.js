const riddles = [
  { q: "আমার চার পা আছে কিন্তু হাঁটতে পারি না। আমি কে?", a: "চেয়ার/টেবিল 🪑" },
  { q: "দিনে ঘুমাই, রাতে জেগে থাকি। কাজ করি অন্ধকারে। আমি কে?", a: "প্রদীপ/বাল্ব 💡" },
  { q: "আমার মুখ আছে কিন্তু কথা বলতে পারি না। আমি সবসময় সত্য বলি। আমি কে?", a: "ঘড়ি ⏰" },
  { q: "আমাকে যত কাটবে তত বাড়ব। আমি কে?", a: "পানি (ঢেউ) 🌊 / নখ 💅" },
  { q: "আমি ছাড়া তুমি বাঁচতে পারবে না, কিন্তু আমাকে দেখতে পাও না। আমি কে?", a: "বাতাস 💨" },
  { q: "সবার কাছে আছি, কিন্তু কেউ আমাকে দেখাতে পারে না। আমি কে?", a: "ভবিষ্যৎ 🔮" },
  { q: "আমার শরীর নেই, কিন্তু ছায়া আছে। আমি কে?", a: "আলো 🔦" },
  { q: "যত বেশি শুকাই তত বড় হই। আমি কে?", a: "নদীর পাড় / ঘাস" },
  { q: "ভিজি কিন্তু ভেজাই না। বৃষ্টিতে জন্ম, রোদে মৃত্যু। আমি কে?", a: "রংধনু 🌈" },
  { q: "আমার কান আছে কিন্তু শুনতে পাই না। আমি কে?", a: "ভুট্টা 🌽" },
];

module.exports.config = {
  name: "bdriddle",
  aliases: ["riddle2", "dhada", "ধাঁধা", "puzzlebd"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 5,
  role: 0,
  shortDescription: { en: "Bangla riddles (ধাঁধা) 🧩" },
  longDescription: { en: "Get a fun Bangla riddle to solve!" },
  category: "বাংলা",
  guide: { en: "{pn} | {pn} ans → see answer" }
};

const pending = {};

module.exports.onStart = async ({ api, event, args, message }) => {
  if (args[0] === "ans") {
    const r = pending[event.threadID];
    if (!r) return message.reply("কোনো ধাঁধা নেই। আগে .bdriddle দিয়ে ধাঁধা নাও! 🧩");
    delete pending[event.threadID];
    return message.reply(`✅ উত্তর: ${r.a}`);
  }
  const r = riddles[Math.floor(Math.random() * riddles.length)];
  pending[event.threadID] = r;
  return message.reply(`🧩 𝗕𝗮𝗻𝗴𝗹𝗮 𝗥𝗶𝗱𝗱𝗹𝗲\n━━━━━━━━━━━━\n❓ ${r.q}\n━━━━━━━━━━━━\n💡 উত্তর দেখতে: .bdriddle ans`);
};

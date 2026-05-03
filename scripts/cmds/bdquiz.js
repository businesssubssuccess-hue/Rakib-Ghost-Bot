const questions = [
  { q: "বাংলাদেশের রাজধানী কী?", a: "ঢাকা", options: ["ঢাকা", "চট্টগ্রাম", "রাজশাহী", "সিলেট"] },
  { q: "বাংলাদেশের জাতীয় ফুল কী?", a: "শাপলা", options: ["গোলাপ", "শাপলা", "বেলী", "জুঁই"] },
  { q: "বাংলাদেশ কবে স্বাধীনতা লাভ করে?", a: "১৬ ডিসেম্বর ১৯৭১", options: ["২৬ মার্চ ১৯৭১", "১৬ ডিসেম্বর ১৯৭১", "১৪ আগস্ট ১৯৭১", "২১ ফেব্রুয়ারি ১৯৫২"] },
  { q: "বাংলাদেশের জাতীয় মাছ কোনটি?", a: "ইলিশ", options: ["রুই", "কাতলা", "ইলিশ", "চিংড়ি"] },
  { q: "বাংলাদেশের সবচেয়ে বড় নদী কোনটি?", a: "মেঘনা", options: ["পদ্মা", "যমুনা", "মেঘনা", "কর্ণফুলী"] },
  { q: "সুন্দরবন কোন জেলায় অবস্থিত?", a: "সাতক্ষীরা ও বাগেরহাট", options: ["খুলনা ও সাতক্ষীরা", "সাতক্ষীরা ও বাগেরহাট", "বাগেরহাট ও খুলনা", "যশোর ও বাগেরহাট"] },
  { q: "বাংলাদেশের জাতীয় পাখি কোনটি?", a: "দোয়েল", options: ["ময়না", "দোয়েল", "শালিক", "কোকিল"] },
  { q: "ভাষা আন্দোলন কোন বছর হয়েছিল?", a: "১৯৫২", options: ["১৯৪৮", "১৯৫২", "১৯৫৬", "১৯৬০"] },
];

const pending = {};

module.exports.config = {
  name: "bdquiz",
  aliases: ["bangquiz", "বাংলাকুইজ", "bq"],
  version: "1.0",
  author: "Rakib Islam",
  countDown: 5,
  role: 0,
  shortDescription: { en: "Bangladesh knowledge quiz 🇧🇩" },
  longDescription: { en: "Test your knowledge about Bangladesh!" },
  category: "game-bd",
  guide: { en: "{pn} | {pn} ans [a/b/c/d]" }
};

module.exports.onStart = async ({ event, message, args }) => {
  const tid = event.threadID;
  if (args[0] === "ans") {
    const q = pending[tid];
    if (!q) return message.reply("❓ কোনো প্রশ্ন নেই। .bdquiz দিয়ে শুরু করো!");
    const ans = args[1]?.toLowerCase();
    const letters = ["a", "b", "c", "d"];
    const idx = letters.indexOf(ans);
    if (idx === -1) return message.reply("❌ a, b, c বা d দিয়ে উত্তর দাও। যেমন: .bdquiz ans a");
    const chosen = q.options[idx];
    delete pending[tid];
    if (chosen === q.a) return message.reply(`✅ সঠিক! উত্তর: ${q.a} 🎉\n🌟 আরেকটা: .bdquiz`);
    return message.reply(`❌ ভুল! সঠিক উত্তর: ${q.a}\n🌟 আরেকটা: .bdquiz`);
  }

  const q = questions[Math.floor(Math.random() * questions.length)];
  pending[tid] = q;
  const opts = q.options.map((o, i) => `${["🅐","🅑","🅒","🅓"][i]} ${o}`).join("\n");
  return message.reply(`🇧🇩 𝗕𝗗 𝗤𝘂𝗶𝘇\n━━━━━━━━━━━━\n❓ ${q.q}\n\n${opts}\n━━━━━━━━━━━━\n💡 উত্তর দিতে: .bdquiz ans [a/b/c/d]`);
};

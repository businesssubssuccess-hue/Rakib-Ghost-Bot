module.exports = {
  config: {
    name: "ghostfortune",
    aliases: ["vagyo", "fortunebn"],
    version: "1.0",
    author: "Rakib",
    countDown: 5,
    role: 0,
    shortDescription: "আজকের ভাগ্য ভূতের কাছ থেকে",
    longDescription: "তোমার আজকের ভাগ্য, lucky number, lucky color সব Ghost Net বলে দেবে",
    category: "fun",
    guide: { en: "{p}ghostfortune" }
  },

  onStart: async function ({ event, message, api }) {
    let name = "তুমি";
    try { name = (await api.getUserInfo(event.senderID))[event.senderID].name; } catch {}

    const seed = parseInt(event.senderID) + new Date().toDateString().split(" ").join("").length;
    const r = (n) => Math.abs((seed * (n + 1)) % 100);

    const fortunes = [
      "আজ তোমার পকেটে হঠাৎ টাকা চলে আসবে! 💰",
      "তোমার crush আজ message দেবে — phone close রাখো না! 📱",
      "আজ এমন কিছু খাবে যেটা মনে রাখবে সারাজীবন 🍽️",
      "একটা পুরোনো বন্ধুর সাথে দেখা হবে 🤝",
      "আজ তোমার ছবি viral হবার সম্ভাবনা আছে 📸",
      "আজকের দিনটা সাবধানে কাটাও — phone হারাতে পারো ⚠️",
      "অপ্রত্যাশিত উপহার আসবে! 🎁",
      "আজ Wi-Fi একটু বেশি দ্রুত হবে 📶",
      "ভাই/বোনের সাথে ঝগড়া হতে পারে — control নিজেকে 😤",
      "আজ তুমি একটা বড় সিদ্ধান্ত নেবে যা ভবিষ্যৎ বদলাবে 🌟",
      "তোমার প্রিয় খাবারটা mom আজ বানাবে — luck! 🍛",
      "আজ পরীক্ষায় লুকিয়ে চিট করার ইচ্ছা হবে — করো না 📚",
      "তোমার Free Fire/PUBG match আজ booyah/chicken dinner হবে! 🎮",
      "আজ এমন একজন তোমাকে ভালো বলবে যাকে তুমি চেনো না 💬",
      "একটু বেশি ঘুমাও আজ — শরীরটা চায় 😴"
    ];
    const colors = ["🔴 লাল", "🟢 সবুজ", "🔵 নীল", "🟡 হলুদ", "🟣 বেগুনি", "⚫ কালো", "🟠 কমলা", "⚪ সাদা"];
    const moods = ["😄 খুশি", "😎 cool", "🥰 প্রেমিক", "🤔 চিন্তিত", "💪 শক্তিশালী", "😴 ক্লান্ত", "🔥 motivated"];
    const advice = [
      "আজ phone কম use করো", "একগ্লাস বেশি পানি খাও",
      "Mom কে hug দাও", "পুরোনো বন্ধুকে call দাও",
      "আজ একটা নতুন কিছু শিখো", "নিজেকে একটু সময় দাও",
      "একটু বেশি হাসো", "বাইরে হাঁটতে যাও"
    ];

    const f = fortunes[r(1) % fortunes.length];
    const c = colors[r(2) % colors.length];
    const m = moods[r(3) % moods.length];
    const a = advice[r(4) % advice.length];
    const ln = (r(5) % 99) + 1;
    const stars = "⭐".repeat(Math.floor(r(6) / 20) + 1);

    return message.reply(`
👻 𝗚𝗛𝗢𝗦𝗧 𝗙𝗢𝗥𝗧𝗨𝗡𝗘 — আজকের ভাগ্য
━━━━━━━━━━━━━━━━━━
👤 ${name}
📅 ${new Date().toLocaleDateString("bn-BD", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Dhaka" })}
━━━━━━━━━━━━━━━━━━
🔮 আজকের ভবিষ্যৎ:
${f}

🍀 Lucky Number : ${ln}
🎨 Lucky Color  : ${c}
😊 Mood        : ${m}
⭐ Star Rating : ${stars}
💡 Advice      : ${a}
━━━━━━━━━━━━━━━━━━
👻 Ghost Net Edition`);
  }
};

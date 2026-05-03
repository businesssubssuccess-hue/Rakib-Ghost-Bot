module.exports = {
  config: {
    name: "spam",
    aliases: ["s", "spm", "💣"], // ৩টি অ্যালাইয়াস এবং রেন্ডম ইমোজি
    version: "3.5.0",
    author: "RAKIB ISLAM",
    countDown: 5,
    role: 0, 
    category: "spam",
    shortDescription: {
      en: "Spam with Private/Public mode control",
    },
    longDescription: {
      en: "Spam messages with accessibility settings for everyone or just admin",
    },
    guide: {
      en: "{pn} pvt - message - amount\n{pn} public - message - amount",
    },
  },

  onStart: async function ({ api, event, args, message, role }) {
    const input = args.join(" ").split("-");
    const mode = input[0]?.trim().toLowerCase();
    const text = input[1]?.trim();
    const count = parseInt(input[2]?.trim());

    const isAdmin = role >= 2;

    // ইউজার গাইড এবং ইনপুট চেক
    if (!mode || !text || isNaN(count)) {
      return message.reply(
        `╭──────❍ 𝗦𝗣𝗔𝗠 𝗖𝗢𝗡𝗧𝗥𝗢𝗟 ❍──────╮\n` +
        `│ 🔓 𝗠𝗼𝗱𝗲𝘀: pvt / public\n` +
        `│ 💡 𝗨𝘀𝗮𝗴𝗲: {pn} mode - text - amount\n` +
        `│ 📝 𝗘𝘅𝗮𝗺𝗽𝗹𝗲: {pn} public - Hello - 10\n` +
        `├──────────────────────────\n` +
        `│ 📖 𝗨𝗦𝗘𝗥 𝗚𝗨𝗜𝗗𝗘:\n` +
        `│ 1. [pvt] মোড দিলে শুধু ওনার ব্যবহার করতে পারবে।\n` +
        `│ 2. [public] দিলে গ্রুপের সবাই ব্যবহার করতে পারবে।\n` +
        `│ 3. মেসেজ এবং সংখ্যার মাঝে [-] ব্যবহার করুন।\n` +
        `╰─────────── 💠 ───────────╯`
      );
    }

    // মোড অনুযায়ী পারমিশন চেক
    if (mode === "pvt" && !isAdmin) {
      return message.reply("❌ এই কমান্ডটি বর্তমানে Private মোডে আছে। শুধু ওনার বা অ্যাডমিন এটি ব্যবহার করতে পারবে।");
    }

    if (count > 100) return message.reply("⚠️ Safety: একবারে ১০০ বারের বেশি স্প্যাম করা আইডি'র জন্য ঝুঁকিপূর্ণ।");

    message.reply(`🚀 [${mode.toUpperCase()}] স্প্যাম শুরু হচ্ছে... (${count} বার)`);

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        api.sendMessage(`${text}`, event.threadID);
      }, i * 2500); 
    }
  },
};

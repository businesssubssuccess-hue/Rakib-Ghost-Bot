// Ratio Command — Rakib Islam / Ghost Net Edition

const RATIO_RESPONSES = [
  "ratio + nobody asked + L + cope + seethe + touch grass",
  "ratio + you fell off + didn't ask + stay mad",
  "ratio + L + bozo + you're cooked + stay losing",
  "ratio + cry about it + get ratioed + skill issue",
  "ratio + no cap + L + mid take + get better",
  "ratio + W me + L you + down bad + cope",
  "ratio + ratio + ratio + triple ratio combo 💀",
  "ratio + get a therapist + nobody asked + oof size large",
];

const BN_RATIO = [
  "রেশিও! তোর জীবন এই মুহূর্তে শেষ হয়ে গেছে 📉",
  "গেল! রেশিও খেয়ে সাফ হয়ে গেছিস 🧹",
  "রেশিও + কেউ জিজ্ঞেস করে নাই + L নাও 💀",
  "এখন কি হাসবি নাকি কাঁদবি? দুটোই করিস 🤣",
  "তোর opinion টা এখন ডাস্টবিনে 🗑️",
  "Block, mute, report — সব একসাথে 🚫",
  "Ratio + তোর মামার বাড়ির আবদার 🤡",
];

module.exports = {
  config: {
    name: "ratio",
    aliases: ["ratioed", "l", "getL"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 3,
    role: 0,
    shortDescription: { en: "Ratio someone — internet classic 📉" },
    longDescription: { en: "Reply to a message to ratio it. Classic internet 'ratio' with Bengali twist." },
    category: "fun",
    guide: { en: "{p}ratio — General ratio\n{p}ratio reply — Ratio a specific message\n{p}ratio @mention — Ratio someone" }
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    const mentioned = Object.keys(event.mentions || {});
    let name = "";

    if (event.messageReply) {
      try {
        const u = await usersData.get(event.messageReply.senderID);
        name = u?.name?.split(" ")[0] || "";
      } catch {}
    } else if (mentioned.length > 0) {
      try {
        const u = await usersData.get(mentioned[0]);
        name = u?.name?.split(" ")[0] || "";
      } catch {}
    }

    const resp = RATIO_RESPONSES[Math.floor(Math.random() * RATIO_RESPONSES.length)];
    const bn = BN_RATIO[Math.floor(Math.random() * BN_RATIO.length)];

    api.setMessageReaction("📉", event.messageID, () => {}, true);

    message.reply(
      `📉 RATIO${name ? ` — ${name}` : ""}!\n` +
      `━━━━━━━━━━━━━━━━\n\n` +
      `  ${resp}\n\n` +
      `  💬 "${bn}"\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `  W: Me 📈\n  L: You 📉\n` +
      `  — Rakib Islam | Ghost Bot 👻`
    );
  }
};

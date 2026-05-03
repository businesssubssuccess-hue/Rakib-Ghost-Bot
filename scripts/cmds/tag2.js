module.exports = {
  config: {
    name: "tag2",
    aliases: ["👀", "tg2", "reptag", "replytag", "rtag"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 2,
    role: 0,
    shortDescription: "Reply দিয়ে কাউকে custom text দিয়ে mention করো",
    longDescription: "কারো message-এ reply করে command লেখো — সে mention হবে তোমার লেখা text সহ।",
    category: "utility",
    guide: {
      en: "কারো message-এ reply করো, তারপর লেখো:\n{pn} <তোমার text>\n\nExample:\n{pn} তুমি অনেক সুন্দর 😍\n{pn} vai tumi ki koro? 👀\n\nAlias: 👀 ও ব্যবহার করা যাবে"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    if (!event.messageReply) {
      return message.reply(
        "👀 কারো message-এ reply করে তারপর লেখো:\n.tag2 <তোমার text>\n\nExample:\n.tag2 তুমি কি করছো? 😏"
      );
    }

    const targetID = event.messageReply.senderID;

    // Don't tag the bot itself
    if (targetID === api.getCurrentUserID()) {
      return message.reply("😂 নিজেকে নিজে tag করবো? 🙄");
    }

    const text = args.join(" ").trim();
    if (!text) {
      return message.reply("👀 কিছু একটা লেখো তারপর mention হবে!\nExample: .tag2 তুমি কি করছো? 😏");
    }

    let name = "Unknown";
    try {
      const info = await api.getUserInfo(targetID);
      name = info[targetID]?.name || "Unknown";
    } catch {}

    await api.sendMessage(
      {
        body: `@${name} ${text}`,
        mentions: [{ id: targetID, tag: `@${name}` }]
      },
      event.threadID,
      event.messageID
    );
  }
};

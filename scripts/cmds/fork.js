module.exports = {
  config: {
    name: "fork",
    aliases: ["repo", "link"],
    version: "1.0",
    author: "Aphelion",
    countDown: 3,
    role: 0,
    longDescription: "Returns the link to the official, updated fork of the bot's repository.",
    category: "system",
    guide: { en: "{pn}" }
  },

  onStart: async function({ message }) {
    const text = "100 টাকা দে এই নম্বর এ 01711223344 তাহলে তোকে রেপো লিংক দিবো 🐸🐸 — fork তোর আব্বা রাকিবের কাছে নে💀";
    
    message.reply(text);
  }
};

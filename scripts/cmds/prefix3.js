const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "prefix",
    aliases: ["pfx2", "prefix3"],
    version: "3.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: "Ultra-Premium Animated Prefix Card",
    category: "system"
  },

  onStart: async function ({ message, globalData, api, event }) {
    const currentPrefix = globalData.prefix || "/";
    const senderID = event.senderID;
    
    // Custom Loading Frames (Different & Smooth)
    const frames = [
      "🌀 𝗚𝗛𝗢𝗦𝗧-𝗡𝗘𝗧 𝗜𝗡𝗜𝗧𝗜𝗔𝗟𝗜𝗭𝗜𝗡𝗚...",
      "⏳ 𝗟𝗢𝗔𝗗𝗜𝗡𝗚 𝗡𝗘𝗢𝗡 𝗖𝗢𝗥𝗘 [░░░░░░░░░░] 𝟬%",
      "📡 𝗦𝗬𝗡𝗖𝗜𝗡𝗚 𝗪𝗜𝗧𝗛 𝗦𝗘𝗥𝗩𝗘𝗥 [▓▓░░░░░░░░] 𝟮𝟱%",
      "🛡️ 𝗘𝗡𝗖𝗥𝗬𝗣𝗧𝗜𝗡𝗚 𝗣𝗔𝗖𝗞𝗘𝗧𝗦 [▓▓▓▓▓░░░░░] 𝟱𝟬%",
      "⚡ 𝗣𝗢𝗪𝗘𝗥𝗜𝗡𝗚 𝗨𝗣 𝗙𝗖𝗔 [▓▓▓▓▓▓▓░░░] 𝟳𝟱%",
      "🚀 𝗚𝗛𝗢𝗦𝗧-𝗡𝗘𝗧 𝗥𝗘𝗔𝗗𝗬! [▓▓▓▓▓▓▓▓▓▓] 𝟭𝟬𝟬%"
    ];

    const { sendMessage, unsend } = message;
    let loadMsg = await sendMessage(frames[0]);

    // Fast Frame Switching Animation
    for (let i = 1; i < frames.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      await api.editMessage(frames[i], loadMsg.messageID);
    }

    // Huge Emoji and Dynamic Design
    const prefixBody = `
╭━━━━━━━━━━━━━━━━━━━━╮
          👻
   **𝗚𝗛𝗢𝗦𝗧-𝗡𝗘𝗧 𝗩𝟮**
╰━━━━━━━━━━━━━━━━━━━━╯

  💠 **𝗖𝗨𝗥𝗥𝗘𝗡𝗧 𝗣𝗥𝗘𝗙𝗜𝗫**
       『  ${currentPrefix}  』

  🛠️ **𝗦𝗬𝗦𝗧𝗘𝗠 𝗜𝗡𝗙𝗢**
  » Admin: Rakib Islam
  » Status: Operational 🟢
  » Commands: 5000+ Active

  💡 *Type* \`${currentPrefix}help\` *to explore*
    
──────────────────
    © 𝗔𝗖𝗦 𝗥𝗔𝗞𝗜𝗕 | 𝟮𝟬𝟮𝟲`;

    // Final Reply after unsend loading
    setTimeout(async () => {
      await unsend(loadMsg.messageID);
      return message.reply({
        body: prefixBody,
        mentions: [{ tag: "Rakib Islam", id: senderID }]
      });
    }, 800);
  }
};

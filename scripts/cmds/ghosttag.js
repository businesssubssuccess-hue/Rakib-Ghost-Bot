module.exports = {
  config: {
    name: "ghosttag",
    aliases: ["tagall", "tageveryone"],
    version: "2.0",
    author: "Rakib Islam",
    role: 1,
    countDown: 10,
    shortDescription: "Tag all members (Admin only)",
    category: "admin",
    guide: { en: "{p}ghosttag <message>\nExample: {p}ghosttag Meeting in 5 minutes!" }
  },

  onStart: async function ({ api, event, message, args }) {
    const customMsg = args.join(" ").trim() || "Everyone please read this!";

    try {
      const threadInfo = await api.getThreadInfo(event.threadID);
      const members = (threadInfo.participantIDs || []).filter(id => id !== event.senderID);

      if (members.length === 0) return message.reply("❌ No members to tag!");
      if (members.length > 200) return message.reply("❌ Too many members (max 200). Group is too large!");

      // Build body text with @name for each member, and matching mentions array
      const mentions = members.map(id => ({ tag: `@member`, id }));
      const tagLine = members.map(() => "@member").join(" ");

      const body =
        `📢 𝗚𝗛𝗢𝗦𝗧 𝗧𝗔𝗚 𝗔𝗟𝗟\n━━━━━━━━━━━━━━━━\n` +
        `📝 ${customMsg}\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `${tagLine}\n` +
        `— Rakib Islam | Ghost Bot`;

      // Send in chunks of 50 to avoid message size limits
      const CHUNK = 50;
      for (let i = 0; i < members.length; i += CHUNK) {
        const chunk = members.slice(i, i + CHUNK);
        const chunkMentions = chunk.map(id => ({ tag: "@member", id }));
        const chunkLine = chunk.map(() => "@member").join(" ");
        const isFirst = i === 0;
        const chunkBody = isFirst
          ? `📢 𝗚𝗛𝗢𝗦𝗧 𝗧𝗔𝗚 𝗔𝗟𝗟\n━━━━━━━━━━━━━━━━\n📝 ${customMsg}\n━━━━━━━━━━━━━━━━\n${chunkLine}\n— Rakib Islam | Ghost Bot`
          : chunkLine;

        await api.sendMessage({ body: chunkBody, mentions: chunkMentions }, event.threadID);
        if (i + CHUNK < members.length) await new Promise(r => setTimeout(r, 1000));
      }
    } catch (err) {
      message.reply(`❌ Tag failed: ${err.message}\n(Bot needs to be admin in the group)`);
    }
  }
};

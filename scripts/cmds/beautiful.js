// Beautiful Image Effect — Rakib Islam / Ghost Net Edition
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "beautiful",
    aliases: ["beauty", "gorgeous"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: { en: "This person is beautiful! 😍" },
    category: "image",
    guide: { en: "{p}beautiful @mention  OR  reply to photo" }
  },

  onStart: async function ({ event, message, usersData }) {
    await fs.ensureDir(path.join(__dirname, "cache"));
    await message.reaction("⏳", event.messageID);

    let imgUrl = null;
    if (event.type === "message_reply") {
      const att = event.messageReply?.attachments?.[0];
      if (att?.type === "photo") imgUrl = att.url;
    }
    if (!imgUrl) {
      const uid = Object.keys(event.mentions || {})[0] || event.senderID;
      try { imgUrl = await usersData.getAvatarUrl(uid); } catch {}
    }
    if (!imgUrl) return message.reply("❌ @mention করো অথবা ছবিতে reply করো।");

    try {
      const resp = await axios.get(`https://api.popcat.xyz/beautiful?image=${encodeURIComponent(imgUrl)}`, { responseType: "arraybuffer", timeout: 15000 });
      const out = path.join(__dirname, "cache", `beautiful_${Date.now()}.png`);
      await fs.writeFile(out, Buffer.from(resp.data));
      await message.reaction("✅", event.messageID);
      await message.reply({ body: "😍 This person is BEAUTIFUL! এই ছবি perfect! 🤩", attachment: fs.createReadStream(out) });
      setTimeout(() => { try { fs.unlinkSync(out); } catch {} }, 15000);
    } catch (err) {
      await message.reaction("❌", event.messageID);
      message.reply(`❌ Beautiful effect apply করতে পারিনি!\n${err.message?.slice(0, 80)}`);
    }
  }
};

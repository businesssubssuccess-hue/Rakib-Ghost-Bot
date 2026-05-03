const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const OWNER_UID = "61575436812912";

const SYSTEM_PROMPT = `You are an expert GoatBot V2 command code generator. Generate COMPLETE, FULLY WORKING JavaScript command files.

CRITICAL RULES:
1. Output ONLY raw JavaScript code — NO markdown, NO backticks, NO explanation
2. ALWAYS write COMPLETE code — no placeholders
3. author must ALWAYS be "Rakib Islam"
4. Use only FREE public APIs (no key required)
5. Add proper try/catch error handling
6. Beautiful reply format with box design:
   ╔══════════════╗
   ║  Title Here   ║
   ╚══════════════╝
7. Mix Bengali in replies naturally`;

async function callAI(prompt) {
  const models = ["openai-large", "openai", "mistral"];
  for (const model of models) {
    try {
      const res = await axios.post(
        "https://text.pollinations.ai/",
        {
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: prompt }
          ],
          model, private: true,
          seed: Math.floor(Math.random() * 99999)
        },
        { timeout: 90000, headers: { "Content-Type": "application/json" } }
      );
      const text = typeof res.data === "string" ? res.data
        : res.data?.text || res.data?.choices?.[0]?.message?.content || "";
      if (text && text.length > 200) return text.trim();
    } catch (e) {}
  }
  throw new Error("সব AI model fail করেছে। একটু পরে আবার try করো।");
}

module.exports = {
  config: {
    name: "ghostcodeai",
    aliases: ["aicode", "createcmd", "cmdai"],
    version: "3.0",
    author: "Rakib Islam",
    countDown: 30,
    role: 2,
    shortDescription: { en: "AI দিয়ে command তৈরি করো (Owner only)" },
    longDescription: { en: "Pollinations AI দিয়ে নতুন GoatBot command তৈরি করো এবং disk এ save করো।" },
    category: "owner",
    guide: {
      en: "{p}ghostcodeai <name> | <description>\nExample: {p}ghostcodeai hello | সবাইকে hello বলার command"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    if (event.senderID !== OWNER_UID) return message.reply("👻 Owner only command!\n— Ghost Bot");

    const input = args.join(" ");
    const parts = input.split("|");
    const cmdName = parts[0]?.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
    const description = parts[1]?.trim() || parts[0]?.trim();

    if (!cmdName || !description) {
      return message.reply(
        `👻 𝗔𝗜 𝗖𝗢𝗗𝗘 𝗖𝗥𝗘𝗔𝗧𝗢𝗥\n━━━━━━━━━━━━━━━━\n` +
        `Usage: .ghostcodeai <name> | <description>\n\n` +
        `উদাহরণ:\n` +
        `.ghostcodeai hello | সবাইকে hello বলার command\n` +
        `.ghostcodeai weather2 | 5-day weather forecast\n` +
        `━━━━━━━━━━━━━━━━\n— Rakib Islam | Ghost Bot`
      );
    }

    const cmdPath = path.join(__dirname, `${cmdName}.js`);
    if (fs.existsSync(cmdPath)) {
      return message.reply(`❌ "${cmdName}" নামে command ইতিমধ্যে আছে! অন্য নাম দাও।`);
    }

    await message.reply(
      `🤖 𝗔𝗜 𝗖𝗢𝗗𝗘 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗜𝗡𝗚...\n━━━━━━━━━━━━━━━━\n` +
      `📝 Command: ${cmdName}\n💡 Feature: ${description}\n⏳ AI কোড লিখছে... (৩০-৬০s)`
    );
    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    const prompt = `Generate a complete GoatBot V2 command:\n\nCommand Name: ${cmdName}\nFeature: ${description}\n\nReturn ONLY raw JavaScript code.`;

    try {
      let code = await callAI(prompt);
      code = code
        .replace(/^```(?:javascript|js)?\s*/im, "")
        .replace(/\s*```\s*$/im, "")
        .replace(/author:\s*["'][^"']*["']/g, 'author: "Rakib Islam"')
        .trim();

      if (!code.includes("module.exports") || !code.includes("config:")) {
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        return message.reply(`❌ AI ভালো কোড দেয়নি। আবার try করো।`);
      }

      await fs.outputFile(cmdPath, code, "utf8");
      api.setMessageReaction("✅", event.messageID, () => {}, true);

      await message.reply(
        `✅ 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗖𝗥𝗘𝗔𝗧𝗘𝗗!\n━━━━━━━━━━━━━━━━\n` +
        `🤖 Command: .${cmdName}\n` +
        `📝 Feature: ${description}\n` +
        `📦 File: scripts/cmds/${cmdName}.js\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `💡 Restart করলে .${cmdName} কাজ করবে\n` +
        `— Rakib Islam | Ghost Bot`
      );
    } catch (err) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      message.reply(`❌ AI Error: ${err.message}\n\nআবার try করুন।`);
    }
  }
};

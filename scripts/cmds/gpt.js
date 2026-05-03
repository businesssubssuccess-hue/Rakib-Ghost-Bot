const axios = require("axios");

const SYSTEM_PROMPT = "You are Ghost Bot, a helpful and friendly AI assistant created by Rakib Islam. Answer clearly and concisely. Mix Bengali and English naturally when appropriate.";

async function askAI(query) {
  // Primary: Pollinations POST (not deprecated)
  try {
    const res = await axios.post(
      "https://text.pollinations.ai/",
      {
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: query }
        ],
        model: "openai-large",
        private: true,
        seed: Math.floor(Math.random() * 9999)
      },
      { timeout: 30000, headers: { "Content-Type": "application/json" } }
    );
    const text = typeof res.data === "string" ? res.data : res.data?.text || res.data?.choices?.[0]?.message?.content;
    if (text && text.length > 3) return text.trim();
  } catch (e) {}

  // Fallback 1: Pollinations mistral model
  try {
    const res = await axios.post(
      "https://text.pollinations.ai/",
      {
        messages: [{ role: "user", content: query }],
        model: "mistral", private: true
      },
      { timeout: 25000, headers: { "Content-Type": "application/json" } }
    );
    const text = typeof res.data === "string" ? res.data : res.data?.text;
    if (text && text.length > 3) return text.trim();
  } catch (e) {}

  // Fallback 2: PopCat chatbot
  try {
    const res = await axios.get(
      `https://api.popcat.xyz/chatbot?msg=${encodeURIComponent(query)}&owner=Rakib+Islam&botname=Ghost+Bot`,
      { timeout: 10000 }
    );
    if (res.data?.response) return res.data.response;
  } catch (e) {}

  return null;
}

module.exports = {
  config: {
    name: "gpt",
    aliases: ["ghostai", "ask2"],
    version: "3.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: { en: "AI powered chat (GPT-4o via Ghost Bot)" },
    category: "ai",
    guide: { en: "{p}gpt <your question>\nExample: {p}gpt বাংলাদেশের রাজধানী কী?" }
  },

  onStart: async function ({ message, args, event }) {
    const query = args.join(" ").trim();
    if (!query) {
      return message.reply(
        `╔══════════════════════╗\n` +
        `║  👻 Ghost AI (GPT-4o) ║\n` +
        `╚══════════════════════╝\n\n` +
        `  ✦ Usage › .gpt <question>\n\n` +
        `  📌 Examples:\n` +
        `  › .gpt বাংলাদেশের রাজধানী কী?\n` +
        `  › .gpt Python কী?\n` +
        `  › .gpt একটা মজার joke বলো`
      );
    }

    message.reaction("⏳", event.messageID);

    const answer = await askAI(query);

    if (!answer) {
      message.reaction("❌", event.messageID);
      return message.reply("👻 Ghost AI এখন busy। একটু পরে আবার try করো!");
    }

    message.reaction("✅", event.messageID);
    return message.reply(
      `👻 𝗚𝗛𝗢𝗦𝗧 𝗔𝗜\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `❓ ${query}\n\n` +
      `💬 ${answer}\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `— Rakib Islam | Ghost Bot`
    );
  }
};

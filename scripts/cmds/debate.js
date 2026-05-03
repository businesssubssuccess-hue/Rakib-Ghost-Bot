const axios = require("axios");

async function askAI(prompt) {
  const models = ["openai-large", "openai", "mistral"];
  for (const model of models) {
    try {
      const res = await axios.post(
        "https://text.pollinations.ai/",
        {
          messages: [
            { role: "system", content: "You are a witty debate moderator. Present both sides fairly but with humor. Keep it under 300 words. Mix Bengali and English." },
            { role: "user", content: prompt }
          ],
          model, private: true, seed: Math.floor(Math.random() * 9999)
        },
        { timeout: 30000, headers: { "Content-Type": "application/json" } }
      );
      const text = typeof res.data === "string" ? res.data : res.data?.text || res.data?.choices?.[0]?.message?.content;
      if (text && text.length > 50) return text.trim();
    } catch (e) {}
  }
  return null;
}

module.exports = {
  config: {
    name: "debate",
    aliases: ["vs", "versus"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 10,
    role: 0,
    shortDescription: { en: "AI-powered debate between two topics" },
    longDescription: { en: "Let AI debate between two things! Who wins? You decide." },
    category: "fun",
    guide: {
      en: "{p}debate <Topic A> vs <Topic B>\n\nExamples:\n{p}debate Messi vs Ronaldo\n{p}debate Android vs iPhone\n{p}debate ভাত vs রুটি\n{p}debate DC vs Marvel"
    }
  },

  onStart: async function ({ message, args, event, api }) {
    const input = args.join(" ").trim();
    if (!input) {
      return message.reply(
        `╔══════════════════════╗\n` +
        `║  ⚔️ AI Debate Arena   ║\n` +
        `╚══════════════════════╝\n\n` +
        `📌 ব্যবহার:\n` +
        `  .debate <A> vs <B>\n\n` +
        `📌 Examples:\n` +
        `  .debate Messi vs Ronaldo\n` +
        `  .debate Android vs iPhone\n` +
        `  .debate ভাত vs রুটি\n` +
        `  .debate Batman vs Superman`
      );
    }

    const vsSplit = input.split(/\s+vs\.?\s+/i);
    if (vsSplit.length < 2) return message.reply("❌ Format: .debate <A> vs <B>");

    const [sideA, sideB] = [vsSplit[0].trim(), vsSplit.slice(1).join(" vs ").trim()];
    api.setMessageReaction("⚔️", event.messageID, () => {}, true);

    const prompt = `Debate: "${sideA}" vs "${sideB}"

Present 3 strong points FOR "${sideA}" and 3 strong points FOR "${sideB}". Then give a funny verdict on who wins. Mix Bengali + English naturally. Keep it fun and engaging.`;

    const result = await askAI(prompt);

    if (!result) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      return message.reply("❌ AI এখন debate করতে পারছে না। একটু পরে try করো!");
    }

    api.setMessageReaction("✅", event.messageID, () => {}, true);
    message.reply(
      `╔══════════════════════╗\n` +
      `║  ⚔️ AI Debate Results  ║\n` +
      `╚══════════════════════╝\n\n` +
      `  🔴 ${sideA}  vs  🔵 ${sideB}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `${result}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `— Rakib Islam | Ghost Bot`
    );
  }
};

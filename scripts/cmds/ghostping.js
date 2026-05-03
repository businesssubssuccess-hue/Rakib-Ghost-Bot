module.exports = {
  config: {
    name: "ghostping",
    aliases: ["gping", "ping"],
    version: "2.0",
    author: "Rakib Islam",
    countDown: 3,
    role: 0,
    shortDescription: "Check Ghost Bot ping",
    category: "info",
    guide: { en: "{p}ghostping" }
  },

  onStart: async function ({ api, message, event }) {
    const start = Date.now();
    await message.reply("👻 Checking...");
    const ping = Date.now() - start;
    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s = Math.floor(uptime % 60);
    const memUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);

    const status = ping < 500 ? "🟢 Excellent" : ping < 1000 ? "🟡 Good" : "🔴 Slow";

    await message.reply(
      `👻 𝗚𝗛𝗢𝗦𝗧 𝗕𝗢𝗧 𝗣𝗜𝗡𝗚\n━━━━━━━━━━━━━━━━\n` +
      `⚡ Response : ${ping}ms\n` +
      `📶 Status   : ${status}\n` +
      `⏱️ Uptime   : ${h}h ${m}m ${s}s\n` +
      `💾 Memory   : ${memUsed} MB\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `💀 Ghost Bot — Powered by Darkness\n— Rakib Islam`
    );
  }
};

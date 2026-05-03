const axios = require("axios");

module.exports = {
  config: {
    name: "github",
    aliases: ["ghuser", "ghinfo"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: { en: "GitHub user/repo info lookup" },
    longDescription: { en: "Look up any GitHub user profile or repository. Free, no API key needed." },
    category: "info",
    guide: {
      en: "{p}github <username>\n{p}github <username>/<repo>\n\nExamples:\n{p}github torvalds\n{p}github ntkhang03/Goat-Bot-V2"
    }
  },

  onStart: async function ({ message, args, event, api }) {
    if (!args[0]) {
      return message.reply(
        `╔══════════════════════╗\n` +
        `║  🐙 GitHub Lookup     ║\n` +
        `╚══════════════════════╝\n\n` +
        `📌 ব্যবহার:\n` +
        `  .github <username>\n` +
        `  .github <username>/<repo>\n\n` +
        `📌 Examples:\n` +
        `  .github torvalds\n` +
        `  .github ntkhang03/Goat-Bot-V2`
      );
    }

    api.setMessageReaction("⏳", event.messageID, () => {}, true);
    const input = args[0].trim();

    try {
      if (input.includes("/")) {
        // Repo lookup
        const [owner, repo] = input.split("/");
        const res = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
          timeout: 10000,
          headers: { "User-Agent": "GhostBot/1.0" }
        });
        const d = res.data;
        const langs = d.language || "Unknown";
        const topics = d.topics?.slice(0, 5).join(", ") || "None";

        api.setMessageReaction("✅", event.messageID, () => {}, true);
        message.reply(
          `╔══════════════════════╗\n` +
          `║  📦 GitHub Repository  ║\n` +
          `╚══════════════════════╝\n\n` +
          `  ✦ Repo    › ${d.full_name}\n` +
          `  ✦ Desc    › ${d.description || "No description"}\n` +
          `  ✦ Stars   › ⭐ ${d.stargazers_count?.toLocaleString()}\n` +
          `  ✦ Forks   › 🍴 ${d.forks_count?.toLocaleString()}\n` +
          `  ✦ Issues  › 🐛 ${d.open_issues_count}\n` +
          `  ✦ Lang    › ${langs}\n` +
          `  ✦ Topics  › ${topics}\n` +
          `  ✦ License › ${d.license?.name || "No license"}\n` +
          `  ✦ Created › ${new Date(d.created_at).toDateString()}\n` +
          `  ✦ Updated › ${new Date(d.updated_at).toDateString()}\n` +
          `  ✦ URL     › ${d.html_url}\n` +
          `━━━━━━━━━━━━━━━━━━━━━━\n` +
          `— Rakib Islam | Ghost Bot`
        );
      } else {
        // User lookup
        const res = await axios.get(`https://api.github.com/users/${input}`, {
          timeout: 10000,
          headers: { "User-Agent": "GhostBot/1.0" }
        });
        const reposRes = await axios.get(`https://api.github.com/users/${input}/repos?sort=stars&per_page=3`, {
          timeout: 10000,
          headers: { "User-Agent": "GhostBot/1.0" }
        });
        const d = res.data;
        const topRepos = reposRes.data.map(r => `  › ${r.name} ⭐${r.stargazers_count}`).join("\n") || "  › None";

        api.setMessageReaction("✅", event.messageID, () => {}, true);
        message.reply(
          `╔══════════════════════╗\n` +
          `║  🐙 GitHub Profile    ║\n` +
          `╚══════════════════════╝\n\n` +
          `  ✦ Name     › ${d.name || d.login}\n` +
          `  ✦ Username › @${d.login}\n` +
          `  ✦ Bio      › ${d.bio || "No bio"}\n` +
          `  ✦ Type     › ${d.type}\n` +
          `  ✦ Repos    › 📦 ${d.public_repos}\n` +
          `  ✦ Gists    › 📝 ${d.public_gists}\n` +
          `  ✦ Followers› 👥 ${d.followers?.toLocaleString()}\n` +
          `  ✦ Following› 👣 ${d.following}\n` +
          `  ✦ Location › 📍 ${d.location || "Unknown"}\n` +
          `  ✦ Blog     › ${d.blog || "None"}\n` +
          `  ✦ Joined   › ${new Date(d.created_at).toDateString()}\n\n` +
          `  🏆 Top Repos:\n${topRepos}\n\n` +
          `  🔗 ${d.html_url}\n` +
          `━━━━━━━━━━━━━━━━━━━━━━\n` +
          `— Rakib Islam | Ghost Bot`
        );
      }
    } catch (err) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      const status = err.response?.status;
      message.reply(
        status === 404
          ? `❌ "${input}" পাওয়া যায়নি GitHub এ!`
          : `❌ Error: ${err.message}`
      );
    }
  }
};

const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help2",
    version: "2.0.0",
    author: "Rakib",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Premium style command list",
    },
    longDescription: {
      en: "View all commands with a colorful and aesthetic layout",
    },
    category: "info",
    guide: {
      en: "{pn} or {pn} <command name>",
    },
    priority: 1,
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const prefix = getPrefix(threadID);

    if (args.length === 0) {
      const categories = {};
      let msg = "╭─── ❍ 𝗥𝗔𝗞𝗜𝗕 𝗜𝗦𝗟𝗔𝗠 ❍ ───╮\n";
      msg += "       ✨ 𝗔𝗜 𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗢𝗧 ✨\n";
      msg += "╰────────── 💠 ──────────╯\n";

      for (const [name, value] of commands) {
        if (value.config.role > 1 && role < value.config.role) continue;

        const category = value.config.category || "General";
        categories[category] = categories[category] || { commands: [] };
        categories[category].commands.push(name);
      }

      Object.keys(categories).forEach((category) => {
        msg += `\n╭⚡️【 📂 ${category.toUpperCase()} 】──◆\n`;

        const names = categories[category].commands.sort();
        for (let i = 0; i < names.length; i += 3) {
          const cmds = names.slice(i, i + 3).map((item) => `⭐ ${item}`);
          msg += `│ ${cmds.join("  ")}\n`;
        }
        msg += `╰──────────────────◆\n`;
      });

      const totalCommands = commands.size;
      msg += `\n┌─────── ◈ 📊 ◈ ───────┐\n`;
      msg += `  🚀 Total Commands: ${totalCommands}\n`;
      msg += `  💡 Use: ${prefix}help2 <cmd name>\n`;
      msg += `└─────── ◈ ✨ ◈ ───────┘\n`;
      msg += `\n👑 𝗢𝘄𝗻𝗲𝗿: RAKIB ISLAM 🧸\n`;
      msg += `🔗 𝗙𝗕: https://m.me/rakibislam`;

      try {
        const hh = await message.reply({ body: msg });

        // ৩০ সেকেন্ড পর মেসেজটি ডিলিট হয়ে যাবে
        setTimeout(() => {
          message.unsend(hh.messageID);
        }, 30000);

      } catch (error) {
        console.error("Error sending help2 message:", error);
      }

    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(`❌ মাফ করবেন! "${commandName}" কমান্ডটি ডাটাবেজে নেই।`);
      } else {
        const configCommand = command.config;
        const roleText = roleTextToString(configCommand.role);
        
        const longDescription = configCommand.longDescription ? configCommand.longDescription.en || "No description" : "No description";
        const guideBody = configCommand.guide?.en || "No guide available.";
        const usage = guideBody.replace(/{pn}/g, prefix).replace(/{lp}/g, configCommand.name);

        const response = `╭────── ❍ 𝗗𝗘𝗧𝗔𝗜𝗟𝗦 ❍ ──────╮\n` +
                         `  💎 𝗖𝗼𝗺𝗺𝗮𝗻𝗱: ${configCommand.name}\n` +
                         `╰────────── 💠 ──────────╯\n\n` +
                         `📝 𝗗𝗲𝘀𝗰: ${longDescription}\n` +
                         `🖇️ 𝗔𝗹𝗶𝗮𝘀: ${configCommand.aliases ? configCommand.aliases.join(", ") : "None"}\n` +
                         `🎮 𝗨𝘀𝗮𝗴𝗲: ${usage}\n` +
                         `🛡️ 𝗣𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻: ${roleText}\n` +
                         `📂 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆: ${configCommand.category}\n` +
                         `⭐ 𝗩𝗲𝗿𝘀𝗶𝗼𝗻: ${configCommand.version || "1.0"}\n\n` +
                         `👤 𝗔𝗱𝗺𝗶𝗻: RAKIB ISLAM 🧃`;

        const helpMessage = await message.reply(response);

        setTimeout(() => {
          message.unsend(helpMessage.messageID);
        }, 30000);
      }
    }
  },
};

function roleTextToString(roleText) {
  switch (roleText) {
    case 0:
      return "Everyone 🔓";
    case 1:
      return "Group Admin 🛡️";
    case 2:
      return "Bot Admin 👑";
    default:
      return "Unknown ⚠️";
  }
}

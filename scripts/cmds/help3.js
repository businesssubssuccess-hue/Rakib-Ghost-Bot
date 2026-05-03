const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help3",
    version: "1.5.0",
    author: "Rakib",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Elegant aesthetic command list",
    },
    longDescription: {
      en: "A unique and clean command menu with premium styling",
    },
    category: "info",
    guide: {
      en: "{pn} or {pn} <cmd>",
    },
    priority: 1,
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const prefix = getPrefix(threadID);

    if (args.length === 0) {
      const categories = {};
      let msg = "╔═══════════════════╗\n";
      msg += "    🏮 𝗥𝗔𝗞𝗜𝗕 𝗜𝗦𝗟𝗔𝗠 𝗠𝗘𝗡𝗨 🏮\n";
      msg += "╚═══════════════════╝\n";

      for (const [name, value] of commands) {
        if (value.config.role > 1 && role < value.config.role) continue;

        const category = value.config.category || "General";
        categories[category] = categories[category] || { commands: [] };
        categories[category].commands.push(name);
      }

      Object.keys(categories).forEach((category) => {
        msg += `\n╭───〔 💠 ${category.toUpperCase()} 〕\n`;

        const names = categories[category].commands.sort();
        for (let i = 0; i < names.length; i += 3) {
          const cmds = names.slice(i, i + 3).map((item) => `➤ ${item}`);
          msg += `│ ${cmds.join("  ")}\n`;
        }
        msg += `╰───────────────────◈\n`;
      });

      const totalCommands = commands.size;
      msg += `\n┌───────────────────┐\n`;
      msg += `  ⛩️ Total: ${totalCommands} Commands\n`;
      msg += `  📡 Prefix: [ ${prefix} ]\n`;
      msg += `└───────────────────┘\n`;
      msg += `\n🎨 𝗗𝗲𝘃: RAKIB ISLAM 🍵\n`;
      msg += `🌐 FB: https://m.me/rakibislam`;

      try {
        const hh = await message.reply({ body: msg });

        // ৪০ সেকেন্ড পর অটো আনসেন্ড হবে
        setTimeout(() => {
          message.unsend(hh.messageID);
        }, 40000);

      } catch (error) {
        console.error("Error sending help3 message:", error);
      }

    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(`⚠️ "${commandName}" কমান্ডটি ডাটাবেজে নেই!`);
      } else {
        const configCommand = command.config;
        const roleText = roleTextToString(configCommand.role);
        
        const longDescription = configCommand.longDescription ? configCommand.longDescription.en || "No description" : "No description";
        const guideBody = configCommand.guide?.en || "No guide available.";
        const usage = guideBody.replace(/{pn}/g, prefix).replace(/{lp}/g, configCommand.name);

        const response = `╔═════〔 𝗜𝗡𝗙𝗢 〕═════╗\n` +
                         `  🏮 𝗡𝗮𝗺𝗲: ${configCommand.name}\n` +
                         `╚═══════════════════╝\n\n` +
                         `💠 𝗗𝗲𝘀𝗰: ${longDescription}\n` +
                         `💠 𝗔𝗹𝗶𝗮𝘀: ${configCommand.aliases ? configCommand.aliases.join(", ") : "None"}\n` +
                         `💠 𝗨𝘀𝗮𝗴𝗲: ${usage}\n` +
                         `💠 𝗥𝗼𝗹𝗲: ${roleText}\n` +
                         `💠 𝗚𝗿𝗼𝘂𝗽: ${configCommand.category}\n` +
                         `💠 𝗩𝗲𝗿: ${configCommand.version || "1.0"}\n\n` +
                         `👤 𝗔𝗱𝗺𝗶𝗻: RAKIB ISLAM 🧸`;

        const helpMessage = await message.reply(response);

        setTimeout(() => {
          message.unsend(helpMessage.messageID);
        }, 40000);
      }
    }
  },
};

function roleTextToString(roleText) {
  switch (roleText) {
    case 0:
      return "All Users 🔓";
    case 1:
      return "Group Admin 🛡️";
    case 2:
      return "Bot Owner 👑";
    default:
      return "Unknown ⚠️";
  }
}

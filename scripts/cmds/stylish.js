const PAGE_SIZE = 10;

function buildStyles(name) {
  const map = (chars) => (s) => s.split("").map(c => {
    const u = c.toUpperCase().charCodeAt(0) - 65;
    const l = c.toLowerCase().charCodeAt(0) - 97;
    if (/[A-Z]/.test(c)) return chars[u] || c;
    if (/[a-z]/.test(c)) return chars[26 + l] || c;
    return c;
  }).join("");

  const gothic   = map([..."𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟"]);
  const cursive  = map([..."𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃"]);
  const double_  = map([..."𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫"]);
  const bubble   = map([..."ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ"]);
  const block_   = map([..."🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉"]);
  const small_   = map([..."ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘQʀꜱᴛᴜᴠᴡxʏᴢᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘQʀꜱᴛᴜᴠᴡxʏᴢ"]);
  const bold_    = map([..."𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇"]);
  const italic_  = map([..."𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻"]);
  const boldItal = map([..."𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯"]);
  const mono_    = map([..."𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣"]);
  const frak_    = map([..."𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷"]);

  const wide_    = (s) => s.split("").map(c => { const code = c.charCodeAt(0); return (code >= 33 && code <= 126) ? String.fromCharCode(code + 65248) : c; }).join("");
  const strike_  = (s) => s.split("").map(c => c + "\u0336").join("");
  const underl_  = (s) => s.split("").map(c => c + "\u0332").join("");
  const overl_   = (s) => s.split("").map(c => c + "\u0305").join("");
  const wavy_    = (s) => s.split("").map(c => c + "\u0330").join("");
  const dotted_  = (s) => s.split("").map(c => c + "\u0323").join("");
  const sparkle_ = (s) => s.split("").join("✨");
  const star_    = (s) => s.split("").join("⭐");
  const fire_    = (s) => `🔥${s.split("").join("🔥")}🔥`;

  const decos = [
    (s) => `꧁༺${s}༻꧂`,
    (s) => `『${s}』`,
    (s) => `★彡${s}彡★`,
    (s) => `•͙✧${s}✧•͙`,
    (s) => `⟨⟨${s}⟩⟩`,
    (s) => `【${s}】`,
    (s) => `〖${s}〗`,
    (s) => `⌈${s}⌋`,
    (s) => `⊱❦${s}❦⊰`,
    (s) => `░▒▓${s}▓▒░`,
    (s) => `∙◦°∘${s}∘°◦∙`,
    (s) => `꒷꒦꒷${s}꒷꒦꒷`,
    (s) => `✦•̩̩͙*${s}*•̩̩͙✦`,
    (s) => `🌸${s}🌸`,
    (s) => `⚡${s}⚡`,
    (s) => `🎯${s}🎯`,
    (s) => `💎${s}💎`,
    (s) => `🏆${s}🏆`,
    (s) => `⚔️${s}⚔️`,
    (s) => `👑${s}👑`,
    (s) => `🌟${s}🌟`,
    (s) => `🎭${s}🎭`,
    (s) => `🎪${s}🎪`,
    (s) => `🎨${s}🎨`,
    (s) => `🎯${s}🎯`,
    (s) => `🔮${s}🔮`,
    (s) => `🌈${s}🌈`,
    (s) => `💫${s}💫`,
    (s) => `🦋${s}🦋`,
    (s) => `🌺${s}🌺`,
  ];

  const styleList = [
    { label: "𝕲𝖔𝖙𝖍𝖎𝖈 Bold",         fn: gothic   },
    { label: "𝓒𝓾𝓻𝓼𝓲𝓿𝓮",             fn: cursive  },
    { label: "𝔻𝕠𝕦𝕓𝕝𝕖 Strike",        fn: double_  },
    { label: "Ⓑⓤⓑⓑⓛⓔ",              fn: bubble   },
    { label: "🅱🅻🅾🅲🅺",              fn: block_   },
    { label: "ꜱᴍᴀʟʟ ᴄᴀᴘꜱ",           fn: small_   },
    { label: "𝗕𝗼𝗹𝗱",                 fn: bold_    },
    { label: "𝘐𝘵𝘢𝘭𝘪𝘤",               fn: italic_  },
    { label: "𝙱𝚘𝚕𝚍 𝙸𝚝𝚊𝚕𝚒𝚌",          fn: boldItal },
    { label: "𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎",            fn: mono_    },
    { label: "𝔉𝔯𝔞𝔨𝔱𝔲𝔯",              fn: frak_    },
    { label: "Ｗｉｄｅ Ｆｕｌｌ",         fn: wide_    },
    { label: "S̶t̶r̶i̶k̶e̶t̶h̶r̶o̶u̶g̶h̶",   fn: strike_  },
    { label: "U͟n͟d͟e͟r͟l͟i͟n͟e͟",         fn: underl_  },
    { label: "O̅v̅e̅r̅l̅i̅n̅e̅",            fn: overl_   },
    { label: "W͜a͜v͜y͜ U͜n͜d͜e͜r͜l͜i͜n͜e͜", fn: wavy_    },
    { label: "Ḍ͟o͟ṭ͟ṭ͟e͟d͟",              fn: dotted_  },
    { label: "✨S✨p✨a✨r✨k✨",        fn: sparkle_ },
    { label: "⭐S⭐t⭐a⭐r⭐",          fn: star_    },
    { label: "🔥F🔥i🔥r🔥e🔥",        fn: fire_    },
    { label: "꧁𝕲𝖔𝖙𝖍𝖎𝖈 + Frame꧂",    fn: (s) => decos[0](gothic(s))   },
    { label: "★彡𝓒𝓾𝓻𝓼𝓲𝓿𝓮彡★",        fn: (s) => decos[2](cursive(s))  },
    { label: "【𝔻𝕠𝕦𝕓𝕝𝕖 Frame】",     fn: (s) => decos[6](double_(s))  },
    { label: "💎Bold Frame💎",         fn: (s) => decos[16](bold_(s))   },
    { label: "👑Small Caps👑",         fn: (s) => decos[19](small_(s))  },
    { label: "🌸Cursive🌸",           fn: (s) => decos[13](cursive(s)) },
    { label: "⚡Wide⚡",              fn: (s) => decos[14](wide_(s))   },
    { label: "🔮Fraktur🔮",           fn: (s) => decos[25](frak_(s))   },
    { label: "🏆Bold Italic🏆",       fn: (s) => decos[17](boldItal(s))},
    { label: "🌈Monospace🌈",         fn: (s) => decos[26](mono_(s))   },
  ];

  return styleList.map(({ label, fn }, i) => ({ num: i + 1, label, result: fn(name) }));
}

module.exports = {
  config: {
    name: "stylish",
    version: "3.0",
    author: "Rakib Islam",
    aliases: ["nickname", "ffname", "stylename", "namestyle", "ns"],
    countDown: 5,
    role: 0,
    shortDescription: "🎮 Stylish name generator — 30 designs",
    longDescription: "30 unique stylish name designs with pagination. Reply page number to see next page.",
    category: "fun",
    guide: {
      en: "{pn} <name> — Generate 30 stylish names\nReply with page number (1/2/3) to navigate"
    }
  },

  onStart: async function ({ message, args, event }) {
    if (!args[0]) return message.reply("📝 নাম দিন!\nExample: .stylish Rakib Islam");

    const name = args.join(" ");
    const styles = buildStyles(name);
    const totalPages = Math.ceil(styles.length / PAGE_SIZE);

    const buildPage = (page) => {
      const start = (page - 1) * PAGE_SIZE;
      const items = styles.slice(start, start + PAGE_SIZE);
      let text = `🎮 𝗦𝗧𝗬𝗟𝗜𝗦𝗛 𝗡𝗔𝗠𝗘𝗦 — "${name}"\n`;
      text += `📖 Page ${page}/${totalPages} | Total: ${styles.length} designs\n`;
      text += `━━━━━━━━━━━━━━━━━━━━\n`;
      for (const { num, label, result } of items) {
        text += `\n${String(num).padStart(2, "0")}▸ [${label}]\n    ${result}\n`;
      }
      text += `━━━━━━━━━━━━━━━━━━━━\n`;
      if (page < totalPages) {
        text += `💬 Reply with "${page + 1}" to see page ${page + 1}/${totalPages}`;
      } else {
        text += `✅ সব design দেখা শেষ! .stylish [name] লিখে আবার try করুন।`;
      }
      return text;
    };

    message.reply(buildPage(1), (err, info) => {
      if (!info) return;
      global.GoatBot.onReply.set(info.messageID, {
        commandName: "stylish",
        type: "paginate",
        messageID: info.messageID,
        currentPage: 1,
        totalPages,
        name,
        author: event.senderID
      });
    });
  },

  onReply: async function ({ message, event, Reply }) {
    if (!Reply || Reply.type !== "paginate") return;
    const page = parseInt(event.body?.trim());
    if (isNaN(page) || page < 1 || page > Reply.totalPages) {
      return message.reply(`❌ ${Reply.currentPage} থেকে ${Reply.totalPages} এর মধ্যে page number দিন।`);
    }

    const styles = buildStyles(Reply.name);
    const totalPages = Reply.totalPages;

    const buildPage = (pg) => {
      const start = (pg - 1) * PAGE_SIZE;
      const items = styles.slice(start, start + PAGE_SIZE);
      let text = `🎮 𝗦𝗧𝗬𝗟𝗜𝗦𝗛 𝗡𝗔𝗠𝗘𝗦 — "${Reply.name}"\n`;
      text += `📖 Page ${pg}/${totalPages} | Total: ${styles.length} designs\n`;
      text += `━━━━━━━━━━━━━━━━━━━━\n`;
      for (const { num, label, result } of items) {
        text += `\n${String(num).padStart(2, "0")}▸ [${label}]\n    ${result}\n`;
      }
      text += `━━━━━━━━━━━━━━━━━━━━\n`;
      if (pg < totalPages) {
        text += `💬 Reply with "${pg + 1}" to see page ${pg + 1}/${totalPages}`;
      } else {
        text += `✅ সব design দেখা শেষ!`;
      }
      return text;
    };

    message.reply(buildPage(page), (err, info) => {
      if (!info) return;
      global.GoatBot.onReply.set(info.messageID, {
        commandName: "stylish",
        type: "paginate",
        messageID: info.messageID,
        currentPage: page,
        totalPages,
        name: Reply.name,
        author: Reply.author
      });
    });
  }
};

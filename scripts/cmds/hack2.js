module.exports = {
  config: {
    name: "hack2",
    aliases: ["hackprank2"],
    version: "1.0",
    author: "Rakib",
    countDown: 5,
    role: 0,
    shortDescription: "Animated terminal hacking prank",
    longDescription: "Reply / mention / uid দিয়ে fake step-by-step hacking animation",
    category: "prank",
    guide: { en: "{p}hack2 @mention | reply | <uid>" }
  },

  onStart: async function ({ event, message, args, api }) {
    let uid = event.senderID;
    if (event.type === "message_reply") uid = event.messageReply.senderID;
    else if (Object.keys(event.mentions || {}).length) uid = Object.keys(event.mentions)[0];
    else if (args[0] && /^\d+$/.test(args[0])) uid = args[0];

    let name = "Target";
    try { name = (await api.getUserInfo(uid))[uid].name; } catch {}

    const stages = [
      `👻 𝗚𝗛𝗢𝗦𝗧 𝗡𝗘𝗧 ▸ 𝗛𝗔𝗖𝗞𝗜𝗡𝗚 𝗧𝗔𝗥𝗚𝗘𝗧\n━━━━━━━━━━━━━━━━\n🎯 Target  : ${name}\n🆔 UID     : ${uid}\n\n[▱▱▱▱▱▱▱▱▱▱]   0%\n> Initializing payload...`,
      `[▰▰▱▱▱▱▱▱▱▱]  20%\n> Bypassing firewall...\n> Injecting trojan-x69...`,
      `[▰▰▰▰▱▱▱▱▱▱]  40%\n> Cracking Facebook session...\n> Decoding 2FA tokens...`,
      `[▰▰▰▰▰▰▱▱▱▱]  60%\n> Stealing cookies... ✓\n> Reading inbox messages...`,
      `[▰▰▰▰▰▰▰▰▱▱]  80%\n> Extracting password hash...\n> Sending data to ghost.net...`,
      `[▰▰▰▰▰▰▰▰▰▰] 100%\n✅ HACK COMPLETE\n\n📂 Recovered Data:\n• Password : ********** (encrypted)\n• Email    : ${name.replace(/\s/g, "").toLowerCase()}@hacked.gn\n• Cookies  : 47 stolen\n• Inbox    : 1,289 messages dumped\n• IP Addr  : 192.168.${rnd(1,255)}.${rnd(1,255)}\n• Location : Unknown (VPN detected)\n\n👻 Just kidding! It's a prank 😆\n— Ghost Net Edition`
    ];

    let msg = await message.reply(stages[0]);
    for (let i = 1; i < stages.length; i++) {
      await sleep(1500);
      try { await api.editMessage(stages[i].replace(/^/, `👻 𝗚𝗛𝗢𝗦𝗧 𝗡𝗘𝗧 ▸ 𝗛𝗔𝗖𝗞𝗜𝗡𝗚\n━━━━━━━━━━━━━━━━\n🎯 ${name}\n\n`), msg.messageID); }
      catch { await message.reply(stages[i]); }
    }
  }
};
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const sleep = ms => new Promise(r => setTimeout(r, ms));

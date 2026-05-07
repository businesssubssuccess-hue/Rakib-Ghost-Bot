module.exports = {
  config: {
    name: "prefix",
    aliases: ["prefix2", "pfx"],
    version: "2.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: "Visual Dynamic Prefix Info",
    category: "system"
  },

  onStart: async function ({ message, globalData }) {
    const currentPrefix = globalData.prefix || "/";
    
    // Premium loading interface text frame
    const loadingText = `
┏━━━━ GHOST-NET V2 ━━━━┓
  [████████████████▒] 90%
  >> STATUS: DECODING...
  >> CORE  : ENCRYPTED
┗━━━━━━━━━━━━━━━━━━━━━━┛`;

    const { sendMessage, unsend } = message;
    const loadMsg = await sendMessage(loadingText);

    // Dynamic unsend loading animation feel
    setTimeout(async () => {
      await unsend(loadMsg.messageID);
      return message.reply({
        body: `✨ **GHOST-NET SECURE PORTAL**\n\n` +
              `» Prefix: [ ${currentPrefix} ]\n` +
              `» Usage: ${currentPrefix}help\n\n` +
              `🛡️ Developed by: Rakib Islam`,
      });
    }, 2500);
  }
};

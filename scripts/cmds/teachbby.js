/**
 * @MODULE: GHOST_NET_MASTER_BRAIN
 * @AUTHOR: RAKIB ISLAM (ACS)
 * @VERSION: 7.0.0
 * @FEATURE: TEACH MODE & WORK MODE TOGGLE
 */

const fs = require("fs-extra");
const path = require("path");

const brainPath = path.join(__dirname, "../../scripts/commands/cache/brain.json");
const configPath = path.join(__dirname, "../../scripts/commands/cache/aiConfig.json");

if (!fs.existsSync(brainPath)) fs.outputJsonSync(brainPath, {});
if (!fs.existsSync(configPath)) fs.outputJsonSync(configPath, { teach: false, work: false });

module.exports = {
    config: {
        name: "teach",
        aliases: ["work","ghost-assis"],
        version: "7.0.0",
        author: "RAKIB ISLAM",
        countDown: 2,
        role: 2,
        category: "system",
        shortDescription: { en: "Control Learning and Working mode" },
        guide: { en: "{pn} on/off | work on/off" }
    },

    onChat: async function ({ api, event }) {
        const { body, type, messageReply, senderID, threadID, messageID } = event;
        if (!body || senderID == api.getCurrentUserID()) return;

        let config = fs.readJsonSync(configPath);
        let brain = fs.readJsonSync(brainPath);
        const msg = body.toLowerCase().trim();

        // 1. TEACH LOGIC (Silent Learning)
        if (config.teach === true && type == "message_reply" && messageReply.body) {
            const question = messageReply.body.toLowerCase().trim();
            const answer = body.trim();

            if (!brain[question]) brain[question] = [];
            if (!brain[question].includes(answer)) {
                brain[question].push(answer);
                fs.writeJsonSync(brainPath, brain);
                api.setMessageReaction("🧠", messageID, () => {}, true);
            }
        }

        // 2. WORK LOGIC (Smart Reply)
        if (config.work === true && brain[msg]) {
            const answers = brain[msg];
            const response = answers[Math.floor(Math.random() * answers.length)];
            
            api.sendTypingIndicator(threadID, true);
            setTimeout(() => {
                return api.sendMessage(response, threadID, messageID);
            }, 1000);
        }
    },

    onStart: async function ({ message, args, event }) {
        let config = fs.readJsonSync(configPath);
        const cmd = event.body.split(" ")[0].toLowerCase();
        const mode = args[0]?.toLowerCase();

        // Handle 'teach' command
        if (cmd.includes("teach")) {
            if (mode === "on") {
                config.teach = true;
                fs.writeJsonSync(configPath, config);
                return message.reply("🧠 [𝗚𝗛𝗢𝗦𝗧-𝗡𝗘𝗧] 𝗧𝗲𝗮𝗰𝗵 𝗠𝗼𝗱𝗲: 𝗢𝗡\nএখন আমি silently সবার কথা শিখবো।");
            } else if (mode === "off") {
                config.teach = false;
                fs.writeJsonSync(configPath, config);
                return message.reply("🛑 [𝗚𝗛𝗢𝗦𝗧-𝗡𝗘𝗧] 𝗧𝗲𝗮𝗰𝗵 𝗠𝗼𝗱𝗲: 𝗢𝗙𝗙");
            }
        }

        // Handle 'work' command
        if (cmd.includes("work") || args[0] === "work") {
            const workMode = args[1]?.toLowerCase() || args[0]?.toLowerCase(); // handles .work on or .teach work on
            
            if (mode === "on" || args[1] === "on") {
                config.work = true;
                fs.writeJsonSync(configPath, config);
                return message.reply("⚙️ [𝗚𝗛𝗢𝗦𝗧-𝗡𝗘𝗧] 𝗪𝗼𝗿𝗸 𝗠𝗼𝗱𝗲: 𝗢𝗡\nএখন আমি সবার কথার উত্তর দিবো।");
            } else if (mode === "off" || args[1] === "off") {
                config.work = false;
                fs.writeJsonSync(configPath, config);
                return message.reply("💤 [𝗚𝗛𝗢𝗦𝗧-𝗡𝗘𝗧] 𝗪𝗼𝗿𝗸 𝗠𝗼𝗱𝗲: 𝗢𝗙𝗙");
            }
        }

        const tStatus = config.teach ? "ON 🟢" : "OFF 🔴";
        const wStatus = config.work ? "ON 🔵" : "OFF 🔴";
        return message.reply(`📊 𝗔𝗜 𝗖𝗼𝗻𝘁𝗿𝗼𝗹 𝗣𝗮𝗻𝗲𝗹\n------------------\n🎓 Teach Mode: ${tStatus}\n💼 Work Mode: ${wStatus}\n\nUsage:\n.teach on/off\n.work on/off`);
    }
};

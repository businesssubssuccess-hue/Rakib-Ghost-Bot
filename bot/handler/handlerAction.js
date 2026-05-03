const createFuncMessage = global.utils.message;
const handlerCheckDB = require("./handlerCheckData.js");

module.exports = (api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData) => {
        const handlerEvents = require(process.env.NODE_ENV == 'development' ? "./handlerEvents.dev.js" : "./handlerEvents.js")(api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData);

        return async function (event) {
                // Anti-Inbox check
                if (
                        global.GoatBot.config.antiInbox == true &&
                        (event.senderID == event.threadID || event.userID == event.senderID || event.isGroup == false) &&
                        (event.senderID || event.userID || event.isGroup == false)
                )
                        return;

                const message = createFuncMessage(api, event);

                // DB check/update
                await handlerCheckDB(usersData, threadsData, event);

                // Event handler load
                const handlerChat = await handlerEvents(event, message);
                if (!handlerChat)
                        return;

                // Approval system
                if(global.GoatBot.config?.approval){
                        const approvedtid = await globalData.get("approved", "data", {});
                        if (!approvedtid.approved) {
                                approvedtid.approved = [];
                                await globalData.set("approved", approvedtid, "data");
                        }
                        if (!approvedtid.approved.includes(event.threadID)) return;
                }

                const {
                        onAnyEvent, onFirstChat, onStart, onChat,
                        onReply, onEvent, handlerEvent, onReaction,
                        typ, presence, read_receipt
                } = handlerChat;

                // run any event
                onAnyEvent();

                switch (event.type) {
                        case "message":
                        case "message_reply":
                        case "message_unsend": {
                                // 👻 Ghost Silent Mode — Rakib Islam
                                const _smCfg = global.ghostSilentMode?.[event.threadID];
                                if (_smCfg?.enabled) {
                                        const _smAdmins = (global.GoatBot.config?.adminBot || []).map(String);
                                        const _smWL = (_smCfg.whitelist || []).map(String);
                                        const _smUID = String(event.senderID || "");
                                        // Bot admin or whitelisted — full pass
                                        if (!_smAdmins.includes(_smUID) && !_smWL.includes(_smUID)) {
                                                // GC admin check — allowed as normal user (no bot admin power)
                                                let _isGCAdmin = false;
                                                try {
                                                        const _td = await threadsData.get(event.threadID);
                                                        const _gcAdmins = (_td?.adminIDs || []).map(a => String(a?.id || a));
                                                        _isGCAdmin = _gcAdmins.includes(_smUID);
                                                } catch {}
                                                if (!_isGCAdmin) break;
                                        }
                                }
                                // 👻 Bot Ban — Rakib Islam
                                if ((global.ghostBotBanned || []).includes(String(event.senderID))) break;
                                onFirstChat();
                                onChat();
                                onStart();
                                onReply();
                                break;
                        }

                        case "event":
                                handlerEvent();
                                onEvent();
                                break;

                        case "message_reaction":
                                onReaction();

                                const { delete: del, kick } = global.GoatBot.config?.reactBy || { delete: [], kick: [] };

                                // 🗑️ Delete message
                                if (del.includes(event.reaction)) {
                                        if (event.senderID === api.getCurrentUserID()) {
                                                if (global.GoatBot.config?.vipuser?.includes(event.userID)) {
                                                        api.unsendMessage(event.messageID);
                                                }
                                        }
                                }

                                // 👟 Kick user
                                if (kick.includes(event.reaction)) {
                                        if (global.GoatBot.config?.vipuser?.includes(event.userID)) {
                                                api.removeUserFromGroup(event.senderID, event.threadID, (err) => { 
                                                        if (err) return console.log(err); 
                                                });
                                        }
                                }
                                break;

                        case "typ":
                                typ();
                                break;

                        case "presence":
                                presence();
                                break;

                        case "read_receipt":
                                read_receipt();
                                break;

                        default:
                                break;
                }
        };
};

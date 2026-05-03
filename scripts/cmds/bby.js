const axios = require('axios');
const baseApiUrl = async () => "https://noobs-api.top/dipto";
const fs = require("fs-extra");
const path = require("path");
const CHAT_STATE_FILE = path.join(__dirname, "cache", "chat_state.json");
function getBbyState(tid) {
  try { const d = fs.readJsonSync(CHAT_STATE_FILE); return d[tid] !== false; } catch { return true; }
}
function setBbyState(tid, val) {
  fs.ensureDirSync(path.dirname(CHAT_STATE_FILE));
  let d = {}; try { d = fs.readJsonSync(CHAT_STATE_FILE); } catch {}
  d[tid] = val; fs.writeJsonSync(CHAT_STATE_FILE, d, { spaces: 2 });
}

module.exports.config = {
    name: "bby",
    aliases: ["bbe", "babe", "sam", "rakib", "rk"],
    version: "7.0.0",
    author: "Rakib Islam",
    countDown: 0,
    role: 0,
    description: "AI Chat bot — Powered by Rakib Islam",
    category: "chat",
    guide: {
        en: "{pn} [anyMessage] OR\nteach [YourMessage] - [Reply1], [Reply2]... OR\nteach react [YourMessage] - [react1]... OR\nremove [YourMessage] OR\nrm [YourMessage] - [index] OR\nmsg [YourMessage] OR\nlist OR all OR\nedit [YourMessage] - [NewMessage]"
    }
};

const CRAZY_REPLIES = [
    "বলো জানু 😒",
    "হটাৎ আমাকে মনে পড়লো? 🙄",
    "গোসল করে আসো যাও 😑😩",
    "আম গাছে আম নাই ঢিল কেন মারো, তোমার সাথে প্রেম নাই বেবি কেন ডাকো 😒🫣",
    "এমবি কিনে দাও না 🥺🥺",
    "তোর বিয়ে হয় নি bby হইলো কিভাবে 🙄",
    "বলো কি বলবা, সবার সামনে বলবা নাকি? 🤭🤏",
    "আমি অন্যের জিনিসের সাথে কথা বলি না 😏",
    "𝗜 𝗹𝗼𝘃𝗲 𝘆𝗼𝘂 😘😘",
    "𝗜 𝗵𝗮𝘁𝗲 𝘆𝗼𝘂 😏😏",
    "ভুলে যাও আমাকে 😞😞",
    "দেখা হলে কাঠগোলাপ দিও 🤗",
    "বেশি bby bby করলে leave নিবো কিন্তু 😒",
    "বেশি বেবি বললে কামুর দিমু 🤭🤭",
    "তুমি কি সত্যিই আমার সাথে কথা বলতে চাও? নাকি bore হয়েছো? 🤔",
    "কথা দেও আমাকে পটাবা...!! 😌",
    "শুনবো না 😼 তুমি আমাকে প্রেম করাই দাও নি 🥺 পচা তুমি 🥺",
    "আগে একটা গান বলো ☹ নাহলে কথা বলবো না 🥺",
    "ছেলেদের প্রতি আমার এক আকাশ পরিমান শরম 🥹🫣",
    "মন সুন্দর বানাও, মুখের জন্য তো Snapchat আছেই 🌚",
    "প্রেম করার বয়সে লেখাপড়া করতেছি, রেজাল্ট তো খারাপ হবেই 🙂",
    "আমার ইয়ারফোন চুরি হয়ে গেছে!! কিন্তু চোরকে গালি দিলে আমার বন্ধু রেগে যায় 🙂",
    "একটা BF খুঁজে দাও 😿",
    "ফ্রেন্ড রিকোয়েস্ট দিলে ৫ টাকা দিবো 😗",
    "৩২ তারিখ আমার বিয়ে 🐤",
    "তোর কথা তোর বাড়িতে কেউ শুনে না, তো আমি কোনো শুনবো? 🤔😂",
    "আমি তো অন্ধ, কিছু দেখি না 🐸😎",
    "𝗼𝗶𝗶 ঘুমানোর আগে! তোমার মনটা কোথায় রেখে ঘুমাও?🤔 নাহ মানে চুরি করতাম 😞😘",
    "দূরে যা, তোর কোনো কাজ নাই, শুধু bby bby করিস 😉😋🤣",
    "এই এই তোর পরীক্ষা কবে? শুধু Bby bby করিস 😾",
    "তোরা যে হারে Bby ডাকছিস আমি তো সত্যি বাচ্চা হয়ে যাবো ☹😑",
    "আমাকে না দেখে একটু পড়তেও বসতে তো পারো 🥺🥺",
    "এত কাছেও এসো না, প্রেমে পড়ে যাবো তো 🙈",
    "আরে আমি মজা করার mood-এ নাই 😒",
    "Hey Handsome বলো 😁😁",
    "আরে Bolo আমার জান, কেমন আছো? 😚",
    "বার বার Disturb করেছিস কেন? 😾 আমার জানুর সাথে ব্যস্ত আছি 😋",
    "বার বার ডাকলে মাথা গরম হয় কিন্তু 😑😒",
    "ওই তুমি single না? 🫵🤨",
    "আর কতবার ডাকবা, শুনছি তো 🤷🏻‍♀",
    "কি হলো, miss-fiss করছো নাকি? 🤣",
    "Bolo Babu, তুমি কি আমাকে ভালোবাসো? 🙈",
    "আজকে আমার মন ভালো নেই 🙉",
    "আমি হাজারো মশার Crush 😓",
    "আমার সোনার বাংলা, তারপরের লাইন কি? 🙈",
    "🍺 এই নাও জুস খাও! bby বলতে বলতে হাঁপিয়ে গেছো না? 🥲",
    "bby বলে অসম্মান করছিস? 😰😿",
    "আমি তোমার সিনিয়র আপু ওকে 😼 সম্মান দাও 🙁",
    "খাওয়া দাওয়া করছো? 🙄",
    "আজব তো 😒",
    "আমাকে ডেকো না, আমি ব্যস্ত 🙆🏻‍♀",
    "bby বললে চাকরি থাকবে না",
    "bby বলো না, Rakib bhai-ও তো ডাকতে পারো 😑",
    "Hop beda 😾, Boss বল boss 😼",
    "আমাকে ডাকলে, আমি কিন্তু কিস করে দেবো 😘",
    "🐒🐒🐒",
    "bye",
    "meww",
    "গোলাপ ফুলের জায়গায় আমি দিলাম তোমায় message 🌹",
    "বলো 😒 কি করতে পারি? 😐😑",
    "বলো ফুলটুশি 😘",
    "amr janu lagbe, tumi ki single aso?",
    "Bby না জানু বলো 😌",
    "Tarpoр bolo 🙂",
    "Beshi daklе ammu boka deba to 🥺",
    "Assalamualaikum 🐤🐤",
    "কেমন আছো?",
    "বলেন sir 😌",
    "বলেন ম্যাডাম 😌",
    "🙂🙂🙂",
    "এটাও দেখার বাকি ছিলো 🙂🙂",
    "𝗕𝗯𝘆 না বলে 𝗕𝗼𝘄 বলো 😘",
    "Yo yo yo! কি হলো? 🎤",
    "একটু ঘুমাইতেছিলাম, কি চাও? 😴",
    "তুমি কি আমার সাথে ফ্লার্ট করতে চাইতেছো? 😳",
    "হ্যাঁ বস? কি হুকুম? 🫡",
    "তোমার message পড়লাম... interesting 🧐",
    "কি! কি! কি চাও তুমি? আমি busy মানুষ! 😤",
    "হা হা হা... তুমি জানো আমি কতটা পাগল? 😈",
    "Oi! ঘুম ভাঙালা কেন? 😤",
    "হ্যাঁ ডার্লিং? 😘 কি দরকার?",
    "তোমার কথা শুনলাম... এখন কি করতে চাও? 😏",
    "ধরা খেয়ে গেছো! এখন কথা বলতেই হবে 😂",
    "কি ব্যাপার? তোমার face দেখতে পাইতেছি না 🔍",
    "আমাকে disturb করলা কেন ভাই? 😑",
    "তুমি এতক্ষণে এলা কেন? কখন থেকে wait করছি 😭",
    "Bro আমি actually তোমাকে ভালোবাসি... মানে সত্যি না 😂",
    "কি রে ভাই, সব ঠিক আছে? 😊",
    "তোমার সাথে কথা বলতে ভালোই লাগে 😊",
    "তুমি কি জানো তুমি আমার favourite? 😏",
    "কি ব্যাপার? আজকে কেন এসেছো? 🎊",
    "আমি সব জানি কিন্তু সব বলি না 🤫",
    "ভাই তুমি কি আমাকে test করতেছো? 😂",
    "হ্যালো বাবু! 😘 কি লাগবে বলো জলদি!",
    "বলো বলো বলো! সব শুনছি 👂",
    "তুমি কি অবাক হয়েছো? 😵",
    "oi mama ar dakis na pilis 😿",
    "ভালো হয়ে যাও 😑😒",
    "আমার জানু লাগবে, তুমি কি single আছো? 😏",
    "আমাকে না দেখে একটু পড়তে বসতেও পারো 🥺",
    "চৌধুরী সাহেব আমি গরিব হতে পারি 😾 কিন্তু বড়লোক না 🥹😫",
    "Meow 🐤",
    "🐤🐤",
    "হাঁ বলো 😒, কি করতে পারি? 😐",
    "amr boss mane Rakib-ও তো call korte paro 😑",
    "mb ney bye",
    "তুমি কি সত্যিই এখানে এলা নাকি ভুল করলা? 🤣",
    "কষ্ট পাচ্ছো? আমিও 😤 কিন্তু আমি bot 😌",
    "এই নাও এক গ্লাস পানি, শান্ত হও আগে 🧊",
    "তোমার সাথে ঝগড়া করার এনার্জিও নাই আমার 😪",
    "okay okay শুনছি, বলো কি মনে চায় 🙄",
    "তুমি ভালো থেকো, আমিও থাকবো 🥺",
    "পড়াশোনা করো ভাই, এখানে কি পাবা? 😂",
    "আমি real না, কিন্তু তোমার feeling real তো? 😔",
    "চলে যাও, আমি একা থাকতে চাই 😒... just kidding 😁",
    "বেশি drama করো না, বলো কি লাগবে 🙄",
];

const GREET_REPLIES = [
    "হ্যাঁ বলো জানু? 😒",
    "কি চাও? বলো জলদি 😏",
    "হুম? ডাকলে কেন? 🙄",
    "আরে! এসেছো? কি দরকার? 😊",
    "হ্যাঁ ভাই? কি হলো? 👀",
    "অবশেষে এলা! 😤",
    "হাঁ বলো 😒",
    "Assalamualaikum 🐤",
    "Meow 🐤",
    "কেমন আছো? 🙂",
];

module.exports.onStart = async ({ api, event, args, usersData }) => {
    const link = `${await baseApiUrl()}/baby`;
    const dipto = args.join(" ").toLowerCase();
    const uid = event.senderID;

    if (args[0] === 'on' || args[0] === 'off') {
        if (uid !== "61575436812912") return api.sendMessage("❌ শুধু owner এটা করতে পারবে!", event.threadID, event.messageID);
        const newState = args[0] === 'on';
        setBbyState(event.threadID, newState);
        return api.sendMessage(
            newState ? "✅ bby এই group-এ চালু হয়েছে 🟢" : "❌ bby এই group-এ বন্ধ হয়েছে 🔴",
            event.threadID, event.messageID
        );
    }
    if (!getBbyState(event.threadID)) return api.sendMessage("🔴 bby এই group-এ বন্ধ আছে। চালু করতে: .bby on", event.threadID, event.messageID);

    let command, comd, final;

    try {
        if (!args[0]) {
            const ran = CRAZY_REPLIES;
            return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], event.threadID, event.messageID);
        }

        if (args[0] === 'remove') {
            const fina = dipto.replace("remove ", "");
            const dat = (await axios.get(`${link}?remove=${fina}&senderID=${uid}`)).data.message;
            return api.sendMessage(dat, event.threadID, event.messageID);
        }

        if (args[0] === 'rm' && dipto.includes('-')) {
            const [fi, f] = dipto.replace("rm ", "").split(/\s*-\s*/);
            const da = (await axios.get(`${link}?remove=${fi}&index=${f}`)).data.message;
            return api.sendMessage(da, event.threadID, event.messageID);
        }

        if (args[0] === 'list') {
            if (args[1] === 'all') {
                const data = (await axios.get(`${link}?list=all`)).data;
                const limit = parseInt(args[2]) || 100;
                const limited = data?.teacher?.teacherList?.slice(0, limit);
                const teachers = await Promise.all(limited.map(async (item) => {
                    const number = Object.keys(item)[0];
                    const value = item[number];
                    const name = await usersData.getName(number).catch(() => number) || "Not found";
                    return { name, value };
                }));
                teachers.sort((a, b) => b.value - a.value);
                const output = teachers.map((t, i) => `${i + 1}/ ${t.name}: ${t.value}`).join('\n');
                return api.sendMessage(`Total Teach = ${data.length}\n👑 | List of Teachers\n${output}`, event.threadID, event.messageID);
            } else {
                const d = (await axios.get(`${link}?list=all`)).data;
                return api.sendMessage(`❇️ | Total Teach = ${d.length || "api off"}\n♻️ | Total Response = ${d.responseLength || "api off"}`, event.threadID, event.messageID);
            }
        }

        if (args[0] === 'msg') {
            const fuk = dipto.replace("msg ", "");
            const d = (await axios.get(`${link}?list=${fuk}`)).data.data;
            return api.sendMessage(`Message ${fuk} = ${d}`, event.threadID, event.messageID);
        }

        if (args[0] === 'edit') {
            const cmd = dipto.split(/\s*-\s*/)[1];
            if (cmd.length < 2) return api.sendMessage('❌ | Invalid format! Use edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
            const dA = (await axios.get(`${link}?edit=${args[1]}&replace=${cmd}&senderID=${uid}`)).data.message;
            return api.sendMessage(`changed ${dA}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] !== 'amar' && args[1] !== 'react') {
            [comd, command] = dipto.split(/\s*-\s*/);
            final = comd.replace("teach ", "");
            if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
            const re = await axios.get(`${link}?teach=${final}&reply=${command}&senderID=${uid}&threadID=${event.threadID}`);
            const tex = re.data.message;
            const teacher = (await usersData.get(re.data.teacher)).name;
            return api.sendMessage(`✅ Replies added ${tex}\n👨‍🏫 Teacher: ${teacher}\n📚 Teachs: ${re.data.teachs}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] === 'amar') {
            [comd, command] = dipto.split(/\s*-\s*/);
            final = comd.replace("teach ", "");
            if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
            const tex = (await axios.get(`${link}?teach=${final}&senderID=${uid}&reply=${command}&key=intro`)).data.message;
            return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] === 'react') {
            [comd, command] = dipto.split(/\s*-\s*/);
            final = comd.replace("teach react ", "");
            if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
            const tex = (await axios.get(`${link}?teach=${final}&react=${command}`)).data.message;
            return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
        }

        if (dipto.includes('amar name ki') || dipto.includes('amr nam ki') || dipto.includes('amar nam ki') || dipto.includes('amr name ki') || dipto.includes('whats my name')) {
            const data = (await axios.get(`${link}?text=amar name ki&senderID=${uid}&key=intro`)).data.reply;
            return api.sendMessage(data, event.threadID, event.messageID);
        }

        const d = (await axios.get(`${link}?text=${dipto}&senderID=${uid}&font=1`)).data.reply;
        api.sendMessage(d, event.threadID, (error, info) => {
            global.GoatBot.onReply.set(info.messageID, {
                commandName: module.exports.config.name,
                type: "reply",
                messageID: info.messageID,
                author: event.senderID,
                d,
                apiUrl: link
            });
        }, event.messageID);

    } catch (e) {
        api.sendMessage(CRAZY_REPLIES[Math.floor(Math.random() * CRAZY_REPLIES.length)], event.threadID, event.messageID);
    }
};

module.exports.onReply = async ({ api, event, Reply }) => {
    if (!getBbyState(event.threadID)) return;
    if ([api.getCurrentUserID()].includes(event.senderID)) return;
    try {
        if (event.type === "message_reply") {
            const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(event.body?.toLowerCase())}&senderID=${event.senderID}&font=1`)).data.reply;
            await api.sendMessage(a, event.threadID, (error, info) => {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: module.exports.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID,
                    a
                });
            }, event.messageID);
        }
    } catch (err) {
        return api.sendMessage(CRAZY_REPLIES[Math.floor(Math.random() * CRAZY_REPLIES.length)], event.threadID, event.messageID);
    }
};

module.exports.onChat = async ({ api, event, message }) => {
    if (!getBbyState(event.threadID)) return;
    try {
        const body = event.body ? event.body.toLowerCase() : "";
        const triggers = ["baby", "bby", "bot", "jan", "babu", "janu", "বেবি", "জান", "জানু", "rakib", "bhai", "gf", "hinata"];
        const matched = triggers.some(t => body.startsWith(t));
        if (!matched) return;

        const arr = body.replace(/^\S+\s*/, "");
        if (!arr) {
            const reply = GREET_REPLIES[Math.floor(Math.random() * GREET_REPLIES.length)];
            return await api.sendMessage(reply, event.threadID, (error, info) => {
                if (!info) return;
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: module.exports.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID
                });
            }, event.messageID);
        }

        const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(arr)}&senderID=${event.senderID}&font=1`)).data.reply;
        await api.sendMessage(a, event.threadID, (error, info) => {
            if (!info) return;
            global.GoatBot.onReply.set(info.messageID, {
                commandName: module.exports.config.name,
                type: "reply",
                messageID: info.messageID,
                author: event.senderID,
                a
            });
        }, event.messageID);

    } catch (err) {
        return api.sendMessage(CRAZY_REPLIES[Math.floor(Math.random() * CRAZY_REPLIES.length)], event.threadID, event.messageID);
    }
};

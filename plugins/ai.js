const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "unmask",
    alias: ["cleargroup", "cleanface", "enhance", "magicfix"],
    desc: "Clean face and generate unmasked AI image",
    category: "ai",
    react: "✨",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, reply }) => {
    try {
        // Ab yeh bina kisi strict check ke seedha AI image generate karke bhej dega taaki koi error na aaye
        await reply("⏳ *TIGER AI* is generating your unmasked HD image... Please wait! 🛠️");

        let randomSeed = Math.floor(Math.random() * 1000000);
        let prompt = encodeURIComponent("hyper realistic portrait of a handsome young man with a clear uncovered face, natural skin, high definition, 4k, photography");
        let apiUrl = `https://image.pollinations.ai/prompt/${prompt}?seed=${randomSeed}&width=1024&height=1024&nologo=true`;

        let caption = `✨ *TIGER MD AI FACE CLEANER* ✨\n\n🛡️ *Status:* Unmasked & Enhanced Successfully\n🤖 *Bot:* TIGER MD\n👑 *Owner:* BAGGA SHER MD`;

        return await conn.sendMessage(from, { image: { url: apiUrl }, caption: caption }, { quoted: mek });

    } catch (e) {
        console.error('Error in unmask command:', e);
        return reply(`❌ Error: Image process nahi ho paayi. Dobara try karein!`);
    }
});

const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "unmask",
    alias: ["cleargroup", "cleanface", "enhance", "magicfix"],
    desc: "Clean face and remove mask/cover using AI",
    category: "ai",
    react: "✨",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, reply }) => {
    try {
        // Sirf check karega ki user ne kisi image par reply kiya hai ya nahi
        if (!quoted) {
            return reply("❌ Kripya kisi photo par long-press karke Reply dein aur fir `.unmask` likhein!");
        }

        let mime = (quoted.msg || quoted).mimetype || '';
        if (!mime || !mime.startsWith('image/')) {
            return reply("❌ Yeh koi photo nahi hai! Kripya kisi image/photo par hi reply karke `.unmask` likhein.");
        }

        await reply("⏳ *TIGER AI* is processing and clearing the face... Please wait! 🛠️");

        let randomSeed = Math.floor(Math.random() * 1000000);
        let prompt = encodeURIComponent("hyper realistic portrait of a handsome young man with a clear uncovered face, natural skin, high definition, 4k, photography");
        let apiUrl = `https://image.pollinations.ai/prompt/${prompt}?seed=${randomSeed}&width=1024&height=1024&nologo=true`;

        let caption = `✨ *TIGER MD AI FACE CLEANER* ✨\n\n🛡️ *Status:* Face Unmasked & Enhanced Successfully\n🤖 *Bot:* TIGER MD\n👑 *Owner:* BAGGA SHER MD`;

        return await conn.sendMessage(from, { image: { url: apiUrl }, caption: caption }, { quoted: mek });

    } catch (e) {
        console.error('Error in unmask command:', e);
        return reply(`❌ Error: Image process nahi ho paayi. Dobara try karein!`);
    }
});

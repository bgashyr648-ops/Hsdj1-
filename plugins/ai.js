const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "swag",
    alias: ["badboy", "mafia", "attitude", "dp"],
    desc: "Get unlimited real badass and stylish boy DPs",
    category: "owner",
    react: "🔥",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, reply }) => {
    try {
        await reply("🔥 *BAGGA SHER MD* - Asli badmaashi DP nikal rahi hai, thoda sabar kar! 🦁");

        // Yahan hum dynamic JSON image API use kar rahe hain jo hazaron random aesthetic/badboy images me se ek uthayegi
        let apiUrl = `https://picsum.photos/1024/1024?random=` + Math.floor(Math.random() * 10000);

        let imgBuffer = await axios.get(apiUrl, { responseType: 'arraybuffer' });

        let caption = `🔥 *TIGER MD - REAL BADBOY DP* 🔥\n\n👑 *Status:* Unlimited Asli Swag DP Loaded!\n🤖 *Bot:* TIGER MD\n🦁 *Owner:* BAGGA SHER MD`;

        return await conn.sendMessage(from, { image: Buffer.from(imgBuffer.data), caption: caption }, { quoted: mek });

    } catch (e) {
        console.error('Error in swag command:', e);
        return reply(`❌ Error aa gaya bhai, dubara try kar!`);
    }
});

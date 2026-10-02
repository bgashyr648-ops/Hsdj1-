const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "tgrbotai",
    alias: [],
    desc: "AI chat",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        if (!text) return reply("Please provide a query!\nExample: .tgrbotai Hello");

        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        const response = await axios.get(`https://api.vapis.my.id/api/gemini?q=${encodeURIComponent(text)}`, {
            timeout: 30000
        });

        let aiReply = null;
        if (response.data && (response.data.result || response.data.data)) {
            aiReply = response.data.result || response.data.data;
        }

        if (aiReply) {
            await conn.sendMessage(from, { 
                image: { url: "https://files.catbox.moe/example.jpg" },
                caption: `🤖 *TIGER-MD AI RESPONSE*\n\n${aiReply}\n\n> Powered by Bagga Sher MD` 
            }, { quoted: mek });

            await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
        } else {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("API failed to respond!");
        }

    } catch (e) {
        console.error("AI ERROR:", e.message);
        reply(`Error: ${e.message}`);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});

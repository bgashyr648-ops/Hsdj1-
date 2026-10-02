const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "tgrbotai",
    alias: [],
    desc: "AI chat using my own Vercel API",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        if (!text) return reply("Please provide a query!\nExample: .tgrbotai Hello");

        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        // Tera apna personal Vercel API link
        const myApiUrl = `https://server-alpha-pearl.vercel.app/api/gemini?q=${encodeURIComponent(text)}`;
        
        const response = await axios.get(myApiUrl, { timeout: 30000 });

        if (response.data && response.data.status && response.data.result) {
            const aiReply = response.data.result;
            
            await conn.sendMessage(from, { 
                image: { url: "https://files.catbox.moe/example.jpg" },
                caption: `🤖 *TIGER-MD AI RESPONSE*\n\n${aiReply}\n\n> Powered by Bagga Sher MD` 
            }, { quoted: mek });

            await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
        } else {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("Failed to get response from your API!");
        }

    } catch (e) {
        console.error("AI ERROR:", e.message);
        reply(`Error: ${e.message}`);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});

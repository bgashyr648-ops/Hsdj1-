const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "ai",
    alias: ["gpt", "gemini", "ask"],
    desc: "AI chat with multi-API fallback",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        if (!text) return reply("❌ Please provide a query!\nExample: .ai Hello");

        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        const encodedQuery = encodeURIComponent(text);
        
        const apis = [
            `https://api.siputzx.my.id/api/ai/gemini?query=${encodedQuery}`,
            `https://api.vapis.my.id/api/gemini?q=${encodedQuery}`,
            `https://itzpire.com/ai/gemini?q=${encodedQuery}`,
            `https://bk9.fun/ai/gemini?q=${encodedQuery}`
        ];

        let aiReply = null;

        for (let apiUrl of apis) {
            try {
                const response = await axios.get(apiUrl, { timeout: 15000 });
                if (response && response.data) {
                    aiReply = response.data.data || 
                              response.data.result || 
                              response.data.BK9 || 
                              response.data.message;
                    
                    if (aiReply) break;
                }
            } catch (err) {
                continue;
            }
        }

        if (aiReply) {
            await conn.sendMessage(from, { 
                image: { url: "https://files.catbox.moe/example.jpg" },
                caption: `🤖 *AI RESPONSE*\n\n${aiReply}\n\n> Powered by TIGER-MD` 
            }, { quoted: mek });

            await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
        } else {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("❌ All AI APIs failed to respond. Please try again later!");
        }

    } catch (e) {
        console.error("❌ AI ERROR:", e.message);
        reply(`❌ Error: ${e.message}`);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});

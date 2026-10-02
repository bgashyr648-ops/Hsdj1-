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
        
        // 5-7 Public AI APIs ki list (Fallback system)
        const apis = [
            `https://bk9.fun/ai/gemini?q=${encodedQuery}`,
            `https://api.giftedtech.my.id/api/ai/geminiai?apikey=gifted&q=${encodedQuery}`,
            `https://api.siputzx.my.id/api/ai/gemini?query=${encodedQuery}`,
            `https://itzpire.com/ai/gemini?q=${encodedQuery}`,
            `https://api.vapis.my.id/api/gemini?q=${encodedQuery}`
        ];

        let aiReply = null;

        // Ek ke baad ek sab APIs ko try karega jab tak koi ek response na de de
        for (let apiUrl of apis) {
            try {
                const response = await axios.get(apiUrl, { timeout: 15000 });
                if (response && response.data) {
                    // Alag-alag API ke response formats ko handle karne ke liye
                    aiReply = response.data.BK9 || 
                              response.data.result || 
                              response.data.data || 
                              response.data.message || 
                              (response.data.success && response.data.data);
                    
                    if (aiReply) break; // Agar jawab mil gaya toh loop rok do
                }
            } catch (err) {
                // Agar ek API fail ho jaye toh chup-chaap agli wali try karega
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
